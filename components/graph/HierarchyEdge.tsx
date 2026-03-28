"use client";

import {
  BaseEdge,
  EdgeProps,
  getSmoothStepPath,
  EdgeLabelRenderer,
} from "reactflow";

export default function HierarchyEdge(props: EdgeProps) {
  const {
    sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition,
    markerEnd, data, label
  } = props;

  const isHighlighted = (data as { highlighted?: boolean })?.highlighted;

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
    borderRadius: 24,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: isHighlighted
            ? "var(--edge-highlight, #22d3ee)"
            : "var(--edge-default, #334155)",
          strokeWidth: isHighlighted ? 4 : 1,
          opacity: isHighlighted ? 1 : 0.03,
          strokeDasharray: isHighlighted ? "none" : "4 4",
          animation: isHighlighted ? "edgeFlow 2s linear infinite" : "none",
          filter: isHighlighted
            ? "drop-shadow(0 0 15px rgba(34, 211, 238, 0.4))"
            : "none",
          transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
      
      {/* Cinematic Data Pulse (Moving along the path) */}
      {isHighlighted && (
        <path
            d={edgePath}
            fill="none"
            stroke="white"
            strokeWidth={3}
            strokeLinecap="round"
            style={{
                strokeDasharray: '0.1, 40',
                strokeDashoffset: 0,
                opacity: 0.9,
                filter: 'drop-shadow(0 0 10px white)',
                animation: 'edgeFlow 2s linear infinite'
            }}
        />
      )}

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className={`nodrag nopan bg-background/95 backdrop-blur-3xl px-3 py-1 rounded-full border border-border text-[9px] font-black uppercase tracking-[0.15em] shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-700 ${isHighlighted ? "text-purple-400 border-purple-500/50 scale-110 z-[110]" : "text-muted-foreground opacity-30 z-10"}`}
        >
          {(data as any)?.label || label || (data as any)?.type || "Trace"}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
