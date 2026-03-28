import React from "react";
import {
  GitGraph,
  Zap,
  Network,
  Layers,
  SearchCode,
  Activity,
} from "lucide-react";

const features = [
  {
    icon: <GitGraph size={24} />,
    title: "Interactive Graph Visualization",
    description:
      "Navigate complex codebases with a living, interactive graph. Click any node to explore its connections and drill into execution paths.",
    wide: true,
    gradient: "from-accent to-transparent",
    glow: "group-hover:shadow-[0_0_40px_var(--accent)]",
  },
  {
    icon: <Zap size={24} />,
    title: "Real-time Analysis",
    description:
      "Powered by an intelligent parser, DevScope processes your codebase in seconds — not minutes.",
    wide: false,
    gradient: "from-accent to-transparent",
    glow: "group-hover:shadow-[0_0_40px_var(--accent)]",
  },
  {
    icon: <Network size={24} />,
    title: "Dependency Mapping",
    description:
      "Automatically traces all import chains and call graphs to build a complete architectural picture.",
    wide: false,
    gradient: "from-accent to-transparent",
    glow: "group-hover:shadow-[0_0_40px_var(--accent)]",
  },
  {
    icon: <SearchCode size={24} />,
    title: "Entry-Point Detection",
    description:
      "Instantly identifies root files and entry points so you always know where execution begins.",
    wide: false,
    gradient: "from-accent to-transparent",
    glow: "group-hover:shadow-[0_0_40px_var(--accent)]",
  },
  {
    icon: <Layers size={24} />,
    title: "Multi-Language Support",
    description:
      "Understands TypeScript, JavaScript, and more. DevScope adapts to the shape of your project automatically.",
    wide: false,
    gradient: "from-accent to-transparent",
    glow: "group-hover:shadow-[0_0_40px_var(--accent)]",
  },
  {
    icon: <Activity size={24} />,
    title: "Trace Mode",
    description:
      "Step through your code's execution path cinematically — like a debugger that tells a story.",
    wide: true,
    gradient: "from-accent to-transparent",
    glow: "group-hover:shadow-[0_0_40px_var(--accent)]",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Features
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Everything you need to{" "}
            <span className="text-gradient-classy">see the full picture</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Purpose-built tools to help developers navigate, understand, and
            present complex codebases with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {features.map((feat) => (
            <div
              key={feat.title}
              className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-accent/20 p-6 transition-all duration-300 hover:border-border hover:bg-accent/40 ${feat.glow} ${
                feat.wide ? "md:col-span-2" : "md:col-span-1"
              }`}
            >
              {/* Card gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feat.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />

              {/* Content */}
              <div className="relative z-10">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-accent/30 text-primary transition-colors group-hover:bg-primary/10">
                  {feat.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feat.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
