import { getCollection } from "@/app/ai/chromadb";
import { getEmbeddings } from "@/app/ai/embed";
import { parseFile } from "@/lib/astParser";
import { NextResponse } from "next/server";

function classifyFiles(path: string) {
  const lower = path.toLowerCase();
  if (lower.includes("/api/") || lower.includes("routes")) return "api";
  if (lower.includes("components")) return "components";
  if (lower.includes("db") || lower.includes("model")) return "db";
  if (lower.endsWith(".py") || lower.endsWith(".java")) return "service";
  if (lower.includes("service")) return "service";
  if (lower.includes("hooks") || lower.includes("utils")) return "function";
  return "other";
}

function buildContainmentGraph(paths: string[]) {
  const folderNodes: any[] = [];
  const containmentEdges: any[] = [];
  const seenFolders = new Set<string>();
  const seenContainmentEdges = new Set<string>();

  for (const filePath of paths) {
    const parts = filePath.split("/").filter(Boolean);
    let parentFolderId = "__root__";

    if (!seenFolders.has(parentFolderId)) {
      seenFolders.add(parentFolderId);
      folderNodes.push({
        id: parentFolderId,
        data: { label: "root", type: "folder", routes: [], functions: [] },
      });
    }

    for (let i = 0; i < parts.length - 1; i++) {
      const folderId = parts.slice(0, i + 1).join("/");
      if (!seenFolders.has(folderId)) {
        seenFolders.add(folderId);
        folderNodes.push({
          id: folderId,
          data: { label: parts[i], type: "folder", routes: [], functions: [] },
        });
      }
      const edgeKey = `${parentFolderId}->${folderId}`;
      if (!seenContainmentEdges.has(edgeKey)) {
        seenContainmentEdges.add(edgeKey);
        containmentEdges.push({ source: parentFolderId, target: folderId, label: "contains" });
      }
      parentFolderId = folderId;
    }

    const fileEdgeKey = `${parentFolderId}->${filePath}`;
    if (!seenContainmentEdges.has(fileEdgeKey)) {
      seenContainmentEdges.add(fileEdgeKey);
      containmentEdges.push({ source: parentFolderId, target: filePath, label: "contains" });
    }
  }
  return { folderNodes, containmentEdges };
}

async function getAllfiles(url: string, files: any[] = []) {
  const res = await fetch(url, {
    headers: { Authorization: `token ${process.env.GITHUB_TOKEN}`, "User-Agent": "DevScope-App" },
  });
  const data = await res.json();
  if (!Array.isArray(data)) return files;
  for (const item of data) {
    if (item.type === "file") files.push(item);
    else if (item.type === "dir" && item._links.self) await getAllfiles(item._links.self, files);
  }
  return files;
}

export async function POST(req: Request) {
  try {
    const { link } = await req.json();
    if (!link || typeof link !== "string") return NextResponse.json({ error: "Invalid link" }, { status: 400 });

    const trimmed = link.trim().replace(/\.git$/, "").replace(/\/$/, "");
    let owner, repo;
    if (trimmed.includes("github.com")) {
      const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
      const pathParts = url.pathname.split("/").filter(Boolean);
      owner = pathParts[0];
      repo = pathParts[1];
    } else {
      const parts = trimmed.split("/").filter(Boolean);
      owner = parts[0];
      repo = parts[1];
    }

    if (!owner || !repo) return NextResponse.json({ error: "Could not parse owner/repo" }, { status: 400 });

    const baseURL = `https://api.github.com/repos/${owner}/${repo}/contents`;
    const allData = await getAllfiles(baseURL);
    const codeFiles = allData.filter(f => /\.(py|ts|jsx|js|java|tsx)$/.test(f.name));
    const limitedFiles = codeFiles.slice(0, 50);

    const fileContent = await Promise.all(limitedFiles.map(async (item) => {
      const res = await fetch(item.download_url, {
        headers: { Authorization: `token ${process.env.GITHUB_TOKEN}`, "User-Agent": "DevScope-App" },
      });
      return { path: item.path, code: await res.text() };
    }));

    // Embeddings Logic (CHROMA)
    try {
      const collection = await getCollection();
      await Promise.allSettled(fileContent.map(async ({ path, code }) => {
        const id = [`${path}-${code.slice(0, 10)}`];
        const embedding = await getEmbeddings(code);
        await collection?.upsert({
          ids: id,
          embeddings: [embedding],
          documents: [code],
          metadatas: [{ filePath: path, repository: `${owner}/${repo}` }]
        });
      }));
    } catch (e) {
      console.log("Embedding failed", e);
    }

    const graphRaw = fileContent.map(item => {
      const parsed = parseFile(item.code, item.path);
      return { file: item.path, type: classifyFiles(item.path), ...parsed };
    });

    const nodes: any[] = [];
    const edges: any[] = [];

    // Map functions to files for surgical linking
    const functionRegistry = new Map<string, string[]>();
    graphRaw.forEach(f => {
      f.functions.forEach((fn: any) => {
        const list = functionRegistry.get(fn.name) || [];
        list.push(f.file);
        functionRegistry.set(fn.name, list);
      });
    });

    const fileMap = new Map<string, string>();
    graphRaw.forEach(f => fileMap.set(f.file, f.file));

    function normalizeImport(path: string, current: string) {
      if (path.startsWith(".")) {
        const base = current.split("/").slice(0, -1).join("/");
        return (base + "/" + path).replace(/\/\.\//g, "/").replace(/\/[^\/]+\/\.\.\//g, "/");
      }
      return path.startsWith("@/") ? path.replace("@/", "") : null;
    }

    function findMatchingFile(target: string) {
      if (fileMap.has(target)) return target;
      const exts = [".ts", ".tsx", ".js", ".jsx"];
      for (const ext of exts) {
        if (fileMap.get(target + ext)) return target + ext;
        if (fileMap.get(target + "/index" + ext)) return target + "/index" + ext;
      }
      return null;
    }

    graphRaw.forEach(item => {
      // 1. File Node
      nodes.push({
        id: item.file,
        data: {
          label: item.file.split("/").pop()!,
          type: item.type,
          routes: item.routes,
          functions: item.functions.map((f: any) => f.name),
          code: item.functions.map((f: any) => f.code).join("\n\n")
        }
      });

      // 2. High-Level File Edges (Imports)
      item.imports.forEach(imp => {
        const normalized = normalizeImport(imp, item.file);
        if (normalized) {
          const matched = findMatchingFile(normalized);
          if (matched) edges.push({ source: item.file, target: matched, label: "imports", type: "flow" });
        }
      });

      // 3. Surgical Function/Route Nodes & Edges
      item.routes.forEach(route => {
        const routeId = `${item.file}::${route}`;
        nodes.push({ id: routeId, data: { label: route, type: "route", routes: [], functions: [] } });
        edges.push({ source: routeId, target: item.file, label: "triggers" });
      });

      item.functions.forEach((fn: any) => {
        const fnId = `${item.file}::${fn.name}`;
        nodes.push({ id: fnId, data: { label: fn.name, type: "function", routes: [], functions: [], code: fn.code } });
        edges.push({ source: item.file, target: fnId, label: "defines" });

        // 4. Surgical Function-to-Function Tracing
        fn.calls?.forEach((call: string) => {
          // Check if this call matches a function in our registry
          const filesWithFunction = functionRegistry.get(call);
          if (filesWithFunction) {
            filesWithFunction.forEach(targetFile => {
               // Only link if the target file is imported by current file (context-aware accuracy)
               const isImported = item.imports.some(imp => {
                  const norm = normalizeImport(imp, item.file);
                  return norm && findMatchingFile(norm) === targetFile;
               }) || targetFile === item.file; // OR internal call

               if (isImported) {
                  edges.push({ source: fnId, target: `${targetFile}::${call}`, label: "calls", type: "hierarchy" });
               }
            });
          }
        });
      });
    });

    const { folderNodes, containmentEdges } = buildContainmentGraph(graphRaw.map(f => f.file));
    const nodeMap = new Map();
    [...folderNodes, ...nodes].forEach(n => nodeMap.set(n.id, n));
    const edgeMap = new Map();
    [...containmentEdges, ...edges].forEach(e => edgeMap.set(`${e.source}-${e.target}-${e.label}`, e));

    return NextResponse.json({ nodes: Array.from(nodeMap.values()), edges: Array.from(edgeMap.values()) });
  } catch (e) {
    console.error("[analyse] Error:", e);
    return NextResponse.json({ error: "Failed to analyse repository." }, { status: 500 });
  }
}
