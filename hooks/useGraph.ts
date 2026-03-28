import { useCallback, useState } from "react";
import { Edge, Node, useEdgesState, useNodesState } from "reactflow";

export interface NodeData {
  type: string;
  label: string;
  code?: string;
  sequence?: number;
  highlighted?: boolean;
}


export function useGraph(){

      const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
      const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
      const [rawEdges, setRawEdges]          = useState<Edge[]>([]);
    const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);
      const [highlightedPath, setHighlightedPath] = useState<Set<string>>(new Set());
      const [activeRouteLabel, setActiveRouteLabel] = useState<string>("");
      const [aiText,    setAiText]    = useState("");
      const [aiLoading, setAiLoading] = useState(false);

  const tracePath = useCallback((startId: string, edges: Edge[]) => {
    const visited = new Set<string>([startId]);

    const dfs = (id: string) => {
      edges.forEach((e) => {
        if (e.source === id && !visited.has(e.target)) {
          visited.add(e.target);
          dfs(e.target);
        }
      });
    };

    dfs(startId);
    return visited;
  }, []);

  const focusNode = useCallback(
    (node: Node<NodeData>, setCenter?: any) => {
      if (setCenter) {
        setCenter(node.position.x + 260, node.position.y + 300, {
          zoom: 0.8,
          duration: 1200,
        });
      }
      setAiText("");
      setSelectedNode(node);
      const visited = tracePath(node.id, rawEdges);
      setHighlightedPath(visited);
      setActiveRouteLabel(node.data.label);
    },
    [rawEdges, tracePath]
  );

  const onNodeClick = useCallback(
    async (node: Node<NodeData>, setCenter?: any) => {
      focusNode(node, setCenter);
      setAiLoading(true);
      const res = await fetch("/api/summary", {
        method: "POST",
        body: JSON.stringify({ code: node.data.code }),
      });
      const data = await res.json();
      setAiText(data);
      setAiLoading(false);
    },
    [focusNode]
  );
         const getStyledNodes = () =>
    nodes.map((n) => ({
      ...n,
      data: {
        ...n.data,
        highlighted:
          highlightedPath.size === 0 || highlightedPath.has(n.id),
        selected: selectedNode?.id === n.id,
      },
    }));

  const getStyledEdges = () =>
    edges.map((e) => ({
      ...e,
      data: {
        highlighted:
          highlightedPath.has(e.source) &&
          highlightedPath.has(e.target),
      },
    }));

  return {
    nodes,
    edges,
    rawEdges,

    setNodes,
    setEdges,
    setRawEdges,

    onNodesChange,
    onEdgesChange,

    selectedNode,
    setSelectedNode,

    highlightedPath,
    setHighlightedPath,

    activeRouteLabel,
    setActiveRouteLabel,

    aiText,
    aiLoading,

    focusNode,
    onNodeClick,
    getStyledNodes,
    getStyledEdges,
  };
}