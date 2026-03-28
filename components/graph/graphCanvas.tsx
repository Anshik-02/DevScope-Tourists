"use client";

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
} from "reactflow";
import { Search } from "lucide-react";

const nodeColors: Record<string, string> = {
  folder: "#8b5cf6",
  api: "#ef4444",
  service: "#3b82f6",
  database: "#10b981",
  component: "#f59e0b",
  route: "#06b6d4",
  function: "#ec4899",
  other: "#94a3b8",
};

interface Props {
  graph: any;
  nodeTypes: any;
  edgeTypes: any;
  flowColorMode?: "light" | "dark";
  dotColor: string;
  setCenter: any;
  router: any;
  repoName?: string;
}

export default function GraphCanvas({
  graph,
  nodeTypes,
  edgeTypes,
  flowColorMode,
  dotColor,
  setCenter,
  router,
  repoName,
}: Props) {
  return (
    <div className="w-full h-full flex-grow relative bg-background overflow-hidden">
      {/* REPO NAME WATERMARK */}
      {repoName && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 pointer-events-none z-0 flex flex-col items-center select-none">
          <h2 className="text-[140px] font-black uppercase tracking-[-0.08em] leading-none text-foreground/[0.03] dark:text-foreground/[0.07] whitespace-nowrap italic">
            {repoName.split("/").pop()}
          </h2>
          <div className="flex items-center gap-4 mt-[-10px]">
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-purple-500/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500/30">Architecture Blueprint</span>
            <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-purple-500/20" />
          </div>
        </div>
      )}

      {/* ATMOSPHERIC LAYER 1: MESH GRADIENT */}
      <div className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px]" />
      </div>

      {/* ATMOSPHERIC LAYER 2: CENTER GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/[0.03] dark:bg-purple-500/[0.07] blur-[150px] rounded-full pointer-events-none" />

      {/* EMPTY STATE */}
      {graph.nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 blur-3xl animate-pulse rounded-full" />
              <Search size={64} className="relative z-10" />
            </div>

            <p className="text-[12px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">
              Synchronizing Blueprint Core...
            </p>

            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-card border border-border rounded-full text-[10px] font-black text-purple-600 hover:bg-muted"
            >
              Return to Command Center
            </button>
          </div>
        </div>
      )}

      {/* GRAPH */}
      <div className="absolute inset-0 z-10">
      <ReactFlow
   
        nodes={graph.getStyledNodes()}
        edges={graph.getStyledEdges()}
        onNodesChange={graph.onNodesChange}
        onEdgesChange={graph.onEdgesChange}
        onNodeClick={(_, node) => graph.onNodeClick(node, setCenter)}
        onPaneClick={() => graph.setSelectedNode(null)}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.05}
        maxZoom={2}
        className="bg-transparent"
      >
        <Background
          variant={BackgroundVariant.Dots}
          color={dotColor}
          gap={20}
          size={1}
          style={{ opacity: 1 }}
        />
        <Controls className="!shadow-none !bg-card/80 !backdrop-blur-xl !border-border !rounded-xl overflow-hidden" />
        <MiniMap
          className="!bg-card/80 !backdrop-blur-xl !border-border !rounded-2xl !shadow-2xl"
          nodeColor={(node) => nodeColors[(node.data as any)?.type] || nodeColors.other}
          maskColor="rgba(168, 85, 247, 0.05)"
          ariaLabel="Architecture Overview Map"
        />
      </ReactFlow>
      </div>
    </div>
  );
}