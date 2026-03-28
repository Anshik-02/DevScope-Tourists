import {
  BaseEdge,
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
} from "reactflow";


export const HierarchyEdge = (props: EdgeProps) => {
  const {
    sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition,
    markerEnd, data, label
  } = props;

  const isHighlighted = (data as { highlighted?: boolean })?.highlighted;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: isHighlighted
            ? "var(--edge-highlight, #a855f7)"
            : "var(--edge-default, #94a3b8)",
        strokeWidth: isHighlighted ? 6 : 3,
        opacity: isHighlighted ? 1 : 0.9,
        strokeDasharray: "12 12",
        animation: isHighlighted ? "edgeFlow 2s linear infinite" : "edgeFlow 0.4s ease-in-out infinite",
        /* FIX: use color-mix for the drop-shadow so it tracks the CSS var */
        filter: isHighlighted
          ? "drop-shadow(0 0 20px color-mix(in srgb, var(--edge-highlight, #a855f7) 80%, transparent))"
          : "none",
        transition: "stroke 0.5s ease, stroke-width 0.5s ease, opacity 0.5s ease",
      }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className={`nodrag nopan bg-background/90 backdrop-blur-md px-3 py-1 rounded-full border border-border text-[9px] font-black uppercase tracking-widest shadow-sm transition-all duration-500 ${isHighlighted ? "text-purple-500 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)] scale-110 z-50" : "text-muted-foreground opacity-60 z-10"}`}
        >
          {(data as any)?.label || label || (data as any)?.type || "Connection"}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};