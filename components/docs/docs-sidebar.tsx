import Link from "next/link";

const navItems = [
  {
    title: "Getting Started",
    links: [
      { href: "#introduction", label: "Introduction" },
      { href: "#quickstart", label: "Quickstart Guide" },
    ]
  },
  {
    title: "Core Features",
    links: [
      { href: "#trace-mode", label: "Trace Mode" },
      { href: "#interactive-graph", label: "Interactive Graph" },
      { href: "#entry-point", label: "Entry-Point Detection" },
    ]
  },
  {
    title: "Architecture",
    links: [
      { href: "#how-it-works", label: "How It Works" },
      { href: "#ai-analysis", label: "AI Analysis Engine" },
    ]
  }
];

export default function DocsSidebar() {
  return (
    <aside className="fixed top-16 left-0 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r border-border py-6 pr-6 md:sticky md:block lg:py-10">
      <div className="w-full">
        {navItems.map((item, index) => (
          <div key={index} className="pb-8">
            <h4 className="mb-2 rounded-md px-2 py-1 text-sm font-semibold text-foreground">
              {item.title}
            </h4>
            <div className="grid grid-flow-row auto-rows-max text-sm">
              {item.links.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="group flex w-full items-center rounded-md border border-transparent px-2 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
