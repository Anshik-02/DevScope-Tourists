import React from "react";
import { ArrowRight, Rocket } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background orb */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.05) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
        {/* Icon badge */}
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/15 text-primary">
          <Rocket size={26} />
        </div>

        <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Ready to map your{" "}
          <span className="text-gradient-classy">codebase?</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Paste a GitHub URL and let DevScope do the heavy lifting. Start
          visualizing your architecture in seconds — completely free.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#repo-input"
            id="cta-analyze-button"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/80 hover:shadow-primary/30 active:scale-95"
          >
            Analyse a Repo
            <ArrowRight size={18} />
          </a>
          <a
            href="https://github.com"
            id="cta-github-button"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-accent/20 px-7 py-3.5 text-base font-semibold text-foreground backdrop-blur transition-all hover:border-border hover:bg-accent/40"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
