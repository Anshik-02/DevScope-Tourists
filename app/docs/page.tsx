import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import DocsSidebar from "@/components/docs/docs-sidebar";
import DocsContent from "@/components/docs/docs-content";

export const metadata = {
  title: "Documentation - DevScope",
  description: "Learn how to use DevScope to map and analyze your codebases.",
};

export default function DocsPage() {
  return (
    <div className="relative min-h-screen flex flex-col font-sans bg-background">
      <Navbar />

      <div className="flex-1 mx-auto w-full max-w-7xl px-6 lg:px-8 pt-24 md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)] gap-6 lg:gap-10">
        <DocsSidebar />
        
        <main className="relative py-6 lg:py-8 w-full min-w-0">
          <DocsContent />
        </main>
      </div>

      <Footer />
    </div>
  );
}
