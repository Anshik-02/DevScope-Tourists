export default function DocsContent() {
  return (
    <div className="mx-auto max-w-3xl py-10 pb-24 text-foreground">
      <div className="mb-10">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Documentation
        </h1>
        <p className="text-xl text-muted-foreground mt-4">
          Learn how to visualize, trace, and understand your entire codebase in seconds with DevScope.
        </p>
      </div>

      <section id="introduction" className="mb-12 scroll-mt-24">
        <h2 className="mb-4 scroll-m-20 border-b border-border pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Introduction
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          DevScope is an intelligent visual analytics engine built to help developers seamlessly explore complex architectures. Instead of blindly reading through thousands of lines of text, DevScope transforms your repository into a highly interactive, narrative-driven execution map.
        </p>
      </section>

      <section id="quickstart" className="mb-12 scroll-mt-24">
        <h2 className="mb-4 scroll-m-20 border-b border-border pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Quickstart Guide
        </h2>
        <ol className="my-6 ml-6 list-decimal [&>li]:mt-2 leading-7">
          <li><strong>Copy a Repository URL:</strong> Head to GitHub and copy the URL of the repository you want to analyze.</li>
          <li><strong>Paste into DevScope:</strong> On the homepage, paste the URL into the central input field.</li>
          <li><strong>Analyze:</strong> Click the <strong className="text-primary font-semibold">Analyse</strong> button. DevScope will process the dependency tree and render a functional graph almost instantly.</li>
        </ol>
      </section>

      <section id="trace-mode" className="mb-12 scroll-mt-24">
        <h2 className="mb-4 scroll-m-20 border-b border-border pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Trace Mode
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Trace Mode allows you to step through your application's execution path cinematically. Think of it as a specialized debugger that tells a story, animating the path from entry-points down to deep utility functions.
        </p>
        <div className="mt-6 border border-border bg-accent/20 rounded-xl p-6">
          <h4 className="font-semibold mb-2">How to use Trace Mode:</h4>
          <ul className="list-disc pl-6 leading-7">
            <li>Open the Graph View for any repository.</li>
            <li>Use the top playback toolbar to step forward, backward, or auto-play.</li>
            <li>Observe as the camera automatically pans and focuses on the executing node, highlighting the connected edges in real time.</li>
          </ul>
        </div>
      </section>

      <section id="interactive-graph" className="mb-12 scroll-mt-24">
        <h2 className="mb-4 scroll-m-20 border-b border-border pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Interactive Graph Features
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          The core DevScope interface is built on a high-fidelity visual graph canvas. Nodes visually represent files, functions, or microservices, color-coded by their architectural role. Connections display the exact direction of imports and execution chains.
        </p>
      </section>

      <section id="entry-point" className="mb-12 scroll-mt-24">
        <h2 className="mb-4 scroll-m-20 border-b border-border pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Entry-Point Detection
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          When analyzing a new foreign codebase, finding where the application starts is half the battle. DevScope uses AI and dependency heuristics to instantly mark root files (like `index.ts`, `main.go`, or root layouts).
        </p>
      </section>

      <section id="how-it-works" className="mb-12 scroll-mt-24">
        <h2 className="mb-4 scroll-m-20 border-b border-border pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          How It Works (Architecture)
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          DevScope operates by generating an Abstract Syntax Tree (AST) of the target repository and mapping out import statements alongside execution triggers. This dependency tree is bundled, formatted into node/edge layouts using Dagre, and then rendered on the client utilizing React Flow.
        </p>
      </section>
    </div>
  );
}
