
"use client";

import { Handle, Position, NodeProps } from "reactflow";
import {
  Database,
  Zap,
  Target,
  FolderTree,
  Braces,
  Boxes,
  Wrench,
  FileCode2,
} from "lucide-react";


const nodeColors: Record<string, string> = {
  folder:    "#8b5cf6",
  api:       "#ef4444",
  service:   "#3b82f6",
  database:  "#10b981",
  component: "#f59e0b",
  route:     "#06b6d4",
  function:  "#ec4899",
  other:     "#94a3b8",
};

const nodeWidth  = 520;

interface NodeData {
  type: string;
  label: string;
  routes: string[];
  functions: { name: string; code: string }[];
  code?: string;
  sequence?: number;
  highlighted?: boolean;
  selected?: boolean;
}

export default function CustomNode({ data, selected: isSelectedReactFlow }: NodeProps<NodeData>) {
  const { type, label, sequence, highlighted, selected: isSelectedCustom } = data;
  const isSelected = isSelectedReactFlow || isSelectedCustom;
  const color = nodeColors[type] || nodeColors.other;
  
  const neonClass =
    type === "api"
      ? "neon-red"
      : type === "database"
        ? "neon-emerald"
        : "neon-indigo";

  const TypeIcon = (() => {
    if (type === "api") return Target;
    if (type === "route") return Target;
    if (type === "database") return Database;
    if (type === "folder") return FolderTree;
    if (type === "function") return Braces;
    if (type === "component") return Boxes;
    if (type === "service") return Wrench;
    if (type === "other") return FileCode2;
    return Zap;
  })();

  return (
    <div
      className={`relative p-5 rounded-[2rem] border-2 transition-all duration-500 group cursor-pointer ${
        isSelected
          ? `ring-4 ring-primary/20 scale-[1.03] border-primary/50 bg-accent/10`
          : `border-border/60 hover:scale-[1.03] hover:border-foreground/30 hover:shadow-2xl bg-card`
      } ${
        highlighted === false ? "opacity-30 blur-[2px]" : "opacity-100 shadow-xl shadow-black/10 dark:shadow-white/[0.02]"
      } text-card-foreground`}
      style={{ minWidth: `${nodeWidth}px` }}
    >
      {/* Sub-layer: Glassmorphism Inner Shadow */}
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/[0.03] via-transparent to-black/[0.1] dark:from-white/[0.05] dark:to-transparent pointer-events-none" />

      {/* Persistent Type Glow */}
      <div
        className={`absolute -inset-[2px] rounded-[2rem] blur-[8px] opacity-10 dark:opacity-[0.15] pointer-events-none transition-opacity duration-700 ${isSelected ? 'opacity-30 dark:opacity-40' : 'group-hover:opacity-20'}`}
        style={{ backgroundColor: color }}
      />

      {/* Sequence badge */}
      {sequence && (
        <div className="absolute -top-3 -left-3 w-13 h-13 rounded-full bg-foreground text-background flex items-center justify-center font-black text-[25px] border-4 border-card shadow-xl z-50 transition-transform group-hover:scale-110">
          {sequence}
        </div>
      )}

      {/* Entry Point Label */}
      {sequence === 1 && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-4 py-1 bg-purple-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] z-50 flex items-center gap-2 animate-bounce border-2 border-white/20">
          <Zap size={10} fill="currentColor" className="animate-pulse" />
          Entry Point
        </div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        style={{
          width: 8,
          height: 8,
          background: "var(--node-handle)",
          borderColor: "var(--node-handle-border)",
          opacity: 0,
          transition: "opacity 0.2s",
        }}
        className="group-hover:!opacity-100"
      />

      <div className="flex flex-col  p-10">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-5 overflow-hidden">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                highlighted !== false && isSelected
                  ? " "
                  : ""
              }`}
              style={{
                background: `linear-gradient(135deg, ${color}33, ${color}11)`, // 33 ≈ 20%, 11 ≈ 7%
                color: color,
                border: `1px solid ${color}44`,
              }}
            >
              <TypeIcon size={32} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col overflow-hidden">
              <h3 className="text-[25px] font-extrabold tracking-tight truncate leading-tight text-foreground drop-shadow-sm">
                {label}
              </h3>
              <p className="text-[14px] font-bold text-muted-foreground mt-1 truncate uppercase tracking-widest">
                {type} LAYER INSTANCE
              </p>
            </div>
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          width: 8,
          height: 8,
          background: "var(--node-handle)",
          borderColor: "var(--node-handle-border)",
          opacity: 0,
          transition: "opacity 0.2s",
        }}
        className="group-hover:!opacity-100"
      />
    </div>
  );
};
