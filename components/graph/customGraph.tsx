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

const nodeWidth  = 540; // Slightly wider for pro look

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
      className={`relative p-6 rounded-[2.5rem] border-[3px] transition-all duration-700 group cursor-pointer backdrop-blur-3xl bg-card/80 shadow-2xl hover:shadow-[0_25px_50px_rgba(0,0,0,0.25)] ${
        isSelected
          ? `ring-8 ring-primary/30 scale-[1.05] border-primary shadow-[0_0_60px_rgba(var(--primary-rgb),0.4)] bg-gradient-to-br from-primary/5 to-secondary/5`
          : `border-border/50 hover:border-gradient-primary hover:shadow-[0_20px_40px_rgba(var(--primary-rgb),0.15)] hover:scale-[1.02]`
      } ${
        highlighted === false ? "opacity-20 blur-sm" : "opacity-100"
      } text-foreground hover:shadow-neon`}
      style={{ minWidth: `${nodeWidth}px` }}
    >
      {/* Metallic Chrome Border Layer */}
      <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-r from-silver/20 via-white/10 to-silver/20 border-[1px] border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] pointer-events-none" />
      
      {/* Holographic Inner Glow */}
      <div className="absolute inset-2 rounded-[2.2rem] bg-gradient-to-br from-transparent via-[color:var(--primary)]/10 to-transparent animate-pulse pointer-events-none" />
      
      {/* Neural Synapse Ring */}
      <div className={`absolute inset-0 rounded-[2.5rem] border-4 border-transparent animate-spin-slow opacity-20 pointer-events-none ${
        isSelected ? 'border-[color:var(--primary)] opacity-40' : 'border-primary/10'
      }`} />

      {/* Supercharged Sequence Badge */}
      {sequence && (
        <div className="absolute -top-4 -left-4 w-16 h-16 rounded-3xl bg-gradient-to-br from-foreground to-primary text-background flex items-center justify-center font-black text-2xl shadow-2xl shadow-black/30 border-4 border-card/50 z-50 transition-all duration-500 group-hover:scale-125 hover:rotate-12 backdrop-blur-xl">
          <span className="relative">
            {sequence}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/50 to-secondary/50 blur-xl animate-ping" />
          </span>
        </div>
      )}

      {/* Entry Point Holo Badge */}
      {sequence === 1 && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-6 py-2.5 bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white text-[12px] font-black uppercase tracking-[0.25em] rounded-3xl shadow-[0_0_40px_rgba(168,85,247,0.6)] z-50 animate-pulse-slow border-3 border-white/30 backdrop-blur-xl flex items-center gap-3 hover:scale-105">
          <Zap size={14} fill="currentColor" className="animate-spin-fast" />
          NEURAL ENTRY
        </div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        style={{
          width: 12,
          height: 12,
          background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
          border: '2px solid white',
          opacity: 0.7,
          transition: 'all 0.3s ease',
          boxShadow: '0 0 12px var(--primary)',
        }}
        className="group-hover:scale-125 !opacity-100"
      />

      {/* Pro Node Content */}
      <div className="relative z-10 flex flex-col p-12">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-6">
            {/* Enhanced Icon Orb */}
            <div className={`relative w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 shadow-2xl border-2 border-white/20 backdrop-blur-xl ${
              isSelected ? 'shadow-[0_0_40px_var(--primary)] ring-4 ring-primary/30 animate-pulse' : 'hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]'
            }`}
              style={{
                background: `radial-gradient(circle at 30% 30%, ${color}40 0%, ${color}10 50%, transparent 70%)`,
                borderColor: `${color}60`,
                boxShadow: `0 0 30px ${color}30`
              }}
            >
              <TypeIcon size={36} strokeWidth={3} className="drop-shadow-lg" />
              {/* Icon Pulse Ring */}
              <div className="absolute inset-0 rounded-3xl border-2 border-current/30 animate-ping opacity-30" />
            </div>
            
            <div className="flex flex-col overflow-hidden min-w-0">
              <h3 className="text-3xl font-black tracking-[-0.02em] truncate leading-tight bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent drop-shadow-2xl">
                {label}
              </h3>
              <p className="text-lg font-bold uppercase tracking-[0.3em] mt-2 bg-gradient-to-r from-muted-foreground/80 to-primary/60 bg-clip-text text-transparent">
                {type.toUpperCase()} CORE
              </p>
            </div>
          </div>
        </div>

        {/* Neural Stats Grid */}
        <div className="grid grid-cols-3 gap-4 text-sm opacity-80">
          <div className="flex flex-col items-center p-3 rounded-2xl bg-primary/5 border border-primary/20 backdrop-blur-sm">
            <span className="font-black text-primary">{data.routes?.length || 0}</span>
            <span className="uppercase tracking-wider text-xs opacity-70">Routes</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-2xl bg-secondary/5 border border-secondary/20 backdrop-blur-sm">
            <span className="font-black text-secondary">{data.functions?.length || 0}</span>
            <span className="uppercase tracking-wider text-xs opacity-70">Methods</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-2xl bg-accent/5 border border-accent/20 backdrop-blur-sm">
            <span className="font-black text-accent">{data.sequence || '-'}</span>
            <span className="uppercase tracking-wider text-xs opacity-70">Priority</span>
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          width: 12,
          height: 12,
          background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
          border: '2px solid white',
          opacity: 0.7,
          transition: 'all 0.3s ease',
          boxShadow: '0 0 12px var(--primary)',
        }}
        className="group-hover:scale-125 !opacity-100"
      />
    </div>
  );
}  
/* Add to globals.css for neon effects:
@keyframes spin-slow { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(180deg); } }
@keyframes pulse-slow { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes spin-fast { 0%, 100% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.shadow-neon { box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.5); }
@layer utilities { .border-gradient-primary { border-image: linear-gradient(45deg, var(--primary), var(--secondary)) 1; } }
*/
