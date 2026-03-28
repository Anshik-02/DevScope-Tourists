"use client";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useReactFlow, ReactFlowProvider, ReactFlow, Background } from "reactflow";
import "reactflow/dist/style.css";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import MinimalNode from "@/components/graph/MinimalNode";
import { useProgressiveGraph } from "@/hooks/useProgressiveGraph";
import { TooltipProvider } from "@/components/ui/tooltip";

// UI Components
import GraphHeader from "@/components/graph/graphHeader";
import LeftSidebar from "@/components/graph/leftSideBar";
import NodeDetailsPanel from "@/components/graph/rightSideBar";
import SearchOverlay from "@/components/graph/searchOverlay";
import CustomNode from "@/components/graph/CustomNode";
import HierarchyEdge from "@/components/graph/HierarchyEdge";

// Constants
const nodeTypes = { 
  minimal: MinimalNode,
  custom: CustomNode
};

const edgeTypes = {
  hierarchy: HierarchyEdge
};
const nodeWidth = 250;
const nodeHeight = 80;

const nodeColors: Record<string, string> = {
  folder: "#8B5CF6", // Violet
  api: "#10B981",    // Emerald
  service: "#3B82F6", // Blue
  database: "#F59E0B", // Amber
  component: "#EC4899", // Pink
  route: "#10B981",    // Emerald
  function: "#EC4899", // Pink
  other: "#94A3B8",    // Slate
};

export default function GraphPageWrapper() {
  return (
    <TooltipProvider>
      <ReactFlowProvider>
        <GraphPage />
      </ReactFlowProvider>
    </TooltipProvider>
  );
}

function GraphPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { fitView, setCenter } = useReactFlow();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTracing, setIsTracing] = useState(false);
  const [trackingNodeId, setTrackingNodeId] = useState<string | null>(null);
  const [graphView, setGraphView] = useState<"minimal" | "complex">("minimal");
  const [repoName, setRepoName] = useState("DEVSCOPE");
  const lastFocusedId = useRef<string | null>(null);

  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    initializeGraph, 
    toggleNode,
    setGraphView: setHookGraphView,
    selectedNode,
    setSelectedNode,
    aiText,
    aiLoading,
    fetchAiSummary,
    rawNodes,
    rawEdges,
    focusedNodeId,
    setFocusedNodeId,
    sequenceIndex,
    nextSequence,
    prevSequence,
    totalSequence
  } = useProgressiveGraph((id: string) => setTrackingNodeId(id));

  useEffect(() => {
    setMounted(true);
    const savedData = localStorage.getItem("graphData");
    if (!savedData) return;
    
    try {
      const name = localStorage.getItem("repoName");
      if (name) setRepoName(name.toUpperCase());
      
      const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedData);
      if (savedNodes && savedEdges) {
        initializeGraph(savedNodes, savedEdges);
        setTimeout(() => fitView({ padding: 0.3, duration: 800 }), 300);
      }
    } catch (e) {
      console.error("Failed to parse local storage graph data:", e);
    }
  }, []);

  const onNodeClick = (_: any, node: any) => {
    setSelectedNode(node);
    setTrackingNodeId(node.id); // Trigger surgical lock-on regardless of mode
    if (graphView === "complex") {
      setFocusedNodeId(node.id);
    }
  };

  const handleGraphViewChange = (view: "minimal" | "complex") => {
    setGraphView(view);
    setHookGraphView(view);
    // Give layout a moment to settle before fitting
    setTimeout(() => fitView({ padding: 0.3, duration: 1000 }), 100);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setSelectedNode(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSelectedNode]);

  const filteredNodes = useMemo(() => {
    if (!searchQuery) return [];
    return rawNodes.filter((n: any) =>
      n.data?.label?.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 8);
  }, [rawNodes, searchQuery]);

  // Dedicated Pan/Focus Effect with surgical lock-on
  useEffect(() => {
    const focusTarget = focusedNodeId || trackingNodeId;
    if (!focusTarget) {
      lastFocusedId.current = null;
      return;
    }
    
    // Allow re-focus if it's a tracking event (expansion)
    if (focusTarget === lastFocusedId.current && !trackingNodeId) return;
    
    const mainNode = nodes.find((n: any) => n.id === focusTarget);
    if (mainNode) {
        lastFocusedId.current = focusTarget;
        
        let targetNodes = [mainNode];
        if (trackingNodeId) {
            const children = edges
                .filter((e: any) => e.source === trackingNodeId)
                .map((e: any) => nodes.find((n: any) => n.id === e.target))
                .filter((n: any) => n !== undefined) as any[];
            targetNodes = [mainNode, ...children];
        }

        // --- SURGICAL LOCKDOWN: Cinematic Pan to reveal right-side expansion ---
        const timer = setTimeout(() => {
            fitView({
                nodes: targetNodes,
                duration: 1000,
                padding: 0.5, // Increased padding to reveal context to the right
                maxZoom: 1.1,
            });
        }, 50);

        if (trackingNodeId) {
            const clearTimer = setTimeout(() => setTrackingNodeId(null), 1200);
            return () => {
                clearTimeout(timer);
                clearTimeout(clearTimer);
            };
        }
        return () => clearTimeout(timer);
    }
  }, [nodes, edges, trackingNodeId, focusedNodeId, fitView]);

  // Auto-Play recursively expands the graph (Minimal) or steps through sequence (Complex)
  useEffect(() => {
    if (!isPlaying) return;

    if (graphView === "complex") {
        const timer = setTimeout(() => {
            nextSequence();
        }, 4000);
        return () => clearTimeout(timer);
    }

    const unexpanded = nodes.find((n: any) => n.data?.hasChildren && !n.data?.isExpanded);
    
    if (!unexpanded) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setTrackingNodeId(unexpanded.id);
      toggleNode(unexpanded.id);
    }, 4500);

    return () => clearTimeout(timer);
  }, [isPlaying, nodes, toggleNode, graphView, nextSequence]);

  return (
    <div className="w-full h-screen bg-background flex flex-col relative font-sans text-foreground overflow-hidden">
      
      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredNodes={filteredNodes}
        onSelectNode={(node: any) => {
          setSelectedNode(node);
          const visibleNode = nodes.find((n: any) => n.id === node.id);
          if (visibleNode) {
            setCenter(visibleNode.position.x + nodeWidth/2, visibleNode.position.y + nodeHeight/2, { zoom: 0.8, duration: 800 });
          }
        }}
      />

      <GraphHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        nodeColors={nodeColors}
        onBack={() => router.push("/")}
        theme={theme}
        setTheme={setTheme}
        mounted={mounted}
        graphView={graphView}
        setGraphView={handleGraphViewChange}
      />

      {/* Insight Bar */}
      <div className="h-10 border-b border-border bg-muted/20 backdrop-blur-md flex items-center px-6 gap-6 z-50">
        <div className="flex items-center gap-2">
          <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] font-black text-emerald-600 tracking-tighter uppercase">
            Global View
          </div>
          <span className="text-[10px] font-bold text-muted-foreground italic uppercase tracking-widest opacity-60">
            Insight:
          </span>
          <span className="text-[10px] font-black text-foreground italic uppercase tracking-widest">
            System-wide Architecture Overview
          </span>
        </div>
      </div>

      <div className="flex-grow flex overflow-hidden">
        <LeftSidebar
          nodes={rawNodes}
          edges={rawEdges}
          activeRouteLabel={selectedNode?.data?.label || ""}
          onSelectNode={(node: any) => {
            setSelectedNode(node);
            const visibleNode = nodes.find((n: any) => n.id === node.id);
            if (visibleNode) {
               setCenter(visibleNode.position.x + nodeWidth/2, visibleNode.position.y + nodeHeight / 2, { zoom: 0.8, duration: 800 });
            }
          }}
          onOpenSearch={() => setIsSearchOpen(true)}
          onResetView={() => fitView({ duration: 800 })}
          onFitView={() => fitView({ duration: 800 })}
          onClearSelection={() => setSelectedNode(null)}
          selectedNodeId={selectedNode?.id}
        />

        <main className="flex-grow flex flex-col relative bg-background border-r border-border/50">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            proOptions={{ hideAttribution: true }}
            minZoom={0.05}
            maxZoom={2}
            className="z-10 bg-transparent"
          >
            <Background color={theme === "dark" ? "#334155" : "#e2e8f0"} gap={20} size={1} />
            
            {/* Cinematic Background Title & Watermark */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden z-0">
               <h1 className="text-[140px] font-black italic uppercase text-foreground/[0.03] dark:text-foreground/[0.07] tracking-[-0.08em] leading-none mb-2">
                 {repoName.split('/').pop()}
               </h1>
               <div className="flex items-center gap-4 mt-[-10px]">
                  <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-purple-500/20" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500/30">Architecture Blueprint</span>
                  <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-purple-500/20" />
              </div>
            </div>

            {/* ATMOSPHERIC LAYER 1: MESH GRADIENT */}
            <div className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px]" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px]" />
            </div>

            {/* ATMOSPHERIC LAYER 2: CENTER GLOW */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/[0.03] dark:bg-purple-500/[0.07] blur-[150px] rounded-full pointer-events-none" />
          </ReactFlow>

          {/* TRACE NAVIGATION OVERLAY (Complex Mode Only) */}
          {graphView === "complex" && (
            <div className="absolute top-6 right-6 z-50 flex items-center gap-3 bg-card/60 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
                <button 
                  onClick={prevSequence}
                  className="px-4 py-2 hover:bg-white/5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all"
                >
                  Prev
                </button>
                <div className="h-4 w-px bg-white/10" />
                <button 
                  onClick={nextSequence}
                  className="px-4 py-2 hover:bg-white/5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all"
                >
                  Next
                </button>
                <div className="h-4 w-px bg-white/10" />
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-2
                    ${isPlaying ? "bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]" : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"}
                  `}
                >
                  {isPlaying ? "Stop Trace" : "Play Trace"}
                </button>
                <div className="h-4 w-px bg-white/10" />
                <div className="px-4 text-[11px] font-black tabular-nums tracking-tighter">
                   <span className="text-purple-500">{sequenceIndex + 1}</span>
                   <span className="opacity-30 mx-1">/</span>
                   <span className="opacity-60">{totalSequence}</span>
                </div>
            </div>
          )}

          {/* Auto-Play Control Overlay (Minimal Only) */}
          {graphView === "minimal" && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
             <button 
                onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
                className={`pointer-events-auto px-6 py-3 border rounded-2xl flex items-center gap-3 text-[11px] font-black tracking-widest uppercase transition-all shadow-xl bg-card/80 backdrop-blur-md
                  ${isPlaying 
                    ? "border-amber-500/50 text-amber-500 shadow-amber-500/10 animate-pulse" 
                    : "border-blue-500/30 text-blue-500 hover:border-blue-500 hover:bg-blue-500/10"
                  }
                `}
              >
                <div className={`w-2 h-2 rounded-full ${isPlaying ? "bg-amber-500" : "bg-blue-500"}`} />
                {isPlaying ? "Running Auto-Trace..." : "Start Auto-Trace Mode"}
              </button>
          </div>
          )}

          {graphView === "minimal" && !nodes.some((n: any) => n.data?.isExpanded) && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 py-4 bg-card/90 backdrop-blur-xl border border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.15)] rounded-3xl animate-bounce pointer-events-none text-sm font-black tracking-wider z-50 flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]" />
              Click the Root Node to unroll your architecture
            </div>
          )}
        </main>

        <NodeDetailsPanel
          selectedNode={selectedNode as any}
          edges={rawEdges}
          nodes={rawNodes}
          isTracing={isTracing}
          onClose={() => setSelectedNode(null)}
          onTrace={() => {
            setIsTracing(true);
            setTimeout(() => setIsTracing(false), 2000);
            if (selectedNode) {
              const visibleNode = nodes.find((n: any) => n.id === selectedNode.id);
              if (visibleNode) {
                setCenter(visibleNode.position.x + nodeWidth/2, visibleNode.position.y + nodeHeight/2, { zoom: 0.8, duration: 800 });
              }
            }
          }}
          onSelectNode={(node: any) => {
             setSelectedNode(node);
             const visibleNode = nodes.find((n: any) => n.id === node.id);
             if (visibleNode) {
               setCenter(visibleNode.position.x + nodeWidth/2, visibleNode.position.y + nodeHeight/2, { zoom: 0.8, duration: 800 });
             }
          }}
          onAskAI={() => {
            if (selectedNode) fetchAiSummary(selectedNode as any);
          }}
          aiText={aiText}
          aiLoading={aiLoading}
        />
      </div>
    </div>
  );
}