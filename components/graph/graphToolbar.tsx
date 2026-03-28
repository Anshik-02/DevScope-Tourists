"use client";

import { Layout, ChevronDown, Plus, Play, Square, SkipBack, SkipForward } from "lucide-react";
import { Node } from "reactflow";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  activeRouteLabel: string;
  selectedNode: Node | null;
  isPlaying: boolean;
  canGoPrev: boolean;
  canGoNext: boolean;
  traceProgressLabel: string;

  onNew: () => void;
  onReset: () => void;
  onPlayAll: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function GraphToolbar({
  activeRouteLabel,
  selectedNode,
  isPlaying,
  canGoPrev,
  canGoNext,
  traceProgressLabel,
  onNew,
  onReset,
  onPlayAll,
  onPrev,
  onNext,
}: Props) {
  return (
    <div className="h-14 bg-card/60 backdrop-blur-2xl border-b border-border flex items-center justify-between px-8 absolute top-0 inset-x-0 z-40">

      {/* LEFT */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          {selectedNode ? (
            <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-tighter text-amber-600">Trace Mode</span>
            </div>
          ) : (
            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-black uppercase tracking-tighter text-emerald-600">Global View</span>
            </div>
          )}
        </div>

        <div className="h-4 w-[1px] bg-border" />

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Insight:</span>
          <span className="text-[12px] font-bold text-foreground">
            {activeRouteLabel ? (
              <span className="flex items-center gap-2">
                Tracing <strong className="italic text-purple-600 underline decoration-purple-300 underline-offset-4">{activeRouteLabel}</strong>
              </span>
            ) : (
              "System-wide Architecture Overview"
            )}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onPrev}
              disabled={!canGoPrev || isPlaying}
              className="px-3 py-2 rounded-[12px] text-[10px] font-black flex items-center gap-2 border border-border bg-card disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <SkipBack size={12} />
              Prev
            </button>
          </TooltipTrigger>
          <TooltipContent>Go to previous node in sequence</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onNext}
              disabled={!canGoNext || isPlaying}
              className="px-3 py-2 rounded-[12px] text-[10px] font-black flex items-center gap-2 border border-border bg-card disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <SkipForward size={12} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Go to next node in sequence</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onPlayAll}
              className={`px-4 py-2 rounded-[12px] text-[10px] font-black flex items-center gap-2 border ${
                isPlaying
                  ? "bg-amber-500/15 text-amber-700 border-amber-500/40"
                  : "bg-indigo-600 text-white border-indigo-600"
              }`}
            >
              {isPlaying ? <Square size={12} /> : <Play size={12} />}
              {isPlaying ? "Tracing..." : "Play Trace"}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            {isPlaying ? "Stop automated tracing" : "Start automated execution trace"}
          </TooltipContent>
        </Tooltip>

        <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wide text-muted-foreground border border-border rounded-[12px] bg-muted/30">
          {traceProgressLabel}
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onNew}
              className="px-4 py-2 bg-card hover:bg-foreground hover:text-background border border-border rounded-[12px] text-[10px] font-black flex items-center gap-2"
            >
              <Plus size={12} /> New Analysis
            </button>
          </TooltipTrigger>
          <TooltipContent>Analyze a different codebase</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onReset}
              className="px-5 py-2 bg-purple-600 text-white rounded-[12px] text-[10px] font-black flex items-center gap-2"
            >
              <Layout size={12} />
              {selectedNode
                ? `Node: ${selectedNode.data?.label?.split("/").pop() || "Untitled"}`
                : "Global View"}
             
            </button>
          </TooltipTrigger>
          <TooltipContent>Reset view to global hierarchy</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}