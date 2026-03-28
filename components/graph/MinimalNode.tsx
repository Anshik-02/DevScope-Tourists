"use client";
import { useTheme } from "next-themes";
import { Handle, Position } from "reactflow";
import { Globe, Server, HardDrive, Puzzle, Folder } from "lucide-react";

export interface MinimalNodeData {
  label: string;
  type: string;
  isExpanded: boolean;
  hasChildren: boolean;
  code?: string;
  onToggle?: () => void;
  hideToggle?: boolean;
}

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  api: { icon: Globe, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  route: { icon: Globe, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  service: { icon: Server, color: "text-blue-500", bg: "bg-blue-500/10" },
  database: { icon: HardDrive, color: "text-amber-500", bg: "bg-amber-500/10" },
  component: { icon: Puzzle, color: "text-pink-500", bg: "bg-pink-500/10" },
  function: { icon: Puzzle, color: "text-pink-500", bg: "bg-pink-500/10" },
  folder: { icon: Folder, color: "text-violet-500", bg: "bg-violet-500/10" },
  default: { icon: Puzzle, color: "text-slate-500", bg: "bg-slate-500/10" },
};

export default function MinimalNode({ data }: { data: MinimalNodeData }) {
  const { theme } = useTheme();
  const config = typeConfig[data.type] || typeConfig.default;
  const Icon = config.icon;

  const isDark = theme === "dark";
  const glowOpacity = isDark ? "0.4" : "0.2";

  return (
    <div
      className={`relative group flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-300 min-w-[200px] hover:shadow-xl cursor-pointer ${
        data.isExpanded 
          ? `bg-background border-current ring-1 ring-current shadow-[0_0_20px_rgba(0,0,0,0.1)]` 
          : "bg-card border-border shadow-lg"
      } ${config.color}`}
      style={{
        borderColor: data.isExpanded ? "currentColor" : undefined,
        boxShadow: data.isExpanded ? `0 0 25px currentColor` : undefined,
        opacity: data.isExpanded ? 1 : (isDark ? 0.9 : 1)
      }}
    >
      <div className={`p-2 rounded-xl ${config.bg} ${config.color}`}>
        <Icon size={20} strokeWidth={2.5} />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden pr-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {data.type}
        </span>
        <span className="text-sm font-semibold truncate" title={data.label}>
          {data.label}
        </span>
      </div>

      {/* Toggle Button */}
      {data.hasChildren && !data.hideToggle && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (data.onToggle) data.onToggle();
          }}
          className={`absolute -right-3 -top-3 w-7 h-7 rounded-full bg-background border-2 flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 group/btn ${
            data.isExpanded ? "border-red-500/50 text-red-500" : "border-emerald-500/50 text-emerald-500"
          }`}
        >
          <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${
              data.isExpanded ? "bg-red-500" : "bg-emerald-500"
          }`} />
          {data.isExpanded ? (
            <span className="font-black text-xs">−</span>
          ) : (
            <span className="font-black text-xs">+</span>
          )}
        </button>
      )}

      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
}
