"use client";

import { Layout, Workflow, Layers, ScanLine } from "lucide-react";

export type ViewMode = "flow" | "layer" | "full" | "trace";

interface Props {
  mode: ViewMode;
  setMode: (v: ViewMode) => void;
}

export function GraphModeSwitcher({ mode, setMode }: Props) {
  const modes = [
    { id: "flow", label: "Flow", icon: Workflow, color: "text-purple-500", bg: "bg-purple-500/15" },
    { id: "layer", label: "Layer", icon: Layers, color: "text-blue-500", bg: "bg-blue-500/15" },
    { id: "full", label: "Full", icon: Layout, color: "text-emerald-500", bg: "bg-emerald-500/15" },
    { id: "trace", label: "Trace", icon: ScanLine, color: "text-amber-500", bg: "bg-amber-500/15" },
  ] as const;

  return (
    <div className="flex items-center bg-card border border-border rounded-xl p-1 gap-1 shadow-sm">
      {modes.map((m) => {
        const Icon = m.icon;
        const isActive = mode === m.id;
        return (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter flex items-center gap-2 transition-all ${
              isActive
                ? `${m.bg} ${m.color} shadow-sm border border-[var(--tw-gradient-from)] shadow-inner`
                : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
            }`}
          >
            <Icon size={12} strokeWidth={isActive ? 3 : 2} />
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
