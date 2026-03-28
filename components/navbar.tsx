"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { Network, Menu, X, GitBranch } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center font-bold justify-center rounded-lg bg-primary/20 text-xl ">
            D
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            DevScope
          </span>
        </div>

        {/* Desktop Links */}
        <ul className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <li>
            <Link href="#features" className="transition-colors hover:text-foreground">
              Features
            </Link>
          </li>
          <li>
            <Link href="/docs" className="transition-colors hover:text-foreground">
              Docs
            </Link>
          </li>
          <li>
            <Link href="https://github.com/Anshik-02/DevScope" className="flex items-center gap-2 transition-colors hover:text-foreground">
              <GitBranch className="h-4 w-4" />
              GitHub
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        
          
          {/* Mobile Menu Toggle */}
          <button 
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/5 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop & Drawer */}
      <div className={`fixed inset-x-0 top-16 z-50 h-[calc(100vh-4rem)] bg-background border-t border-border transition-all duration-300 md:hidden ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}>
          <div className="flex flex-col p-8 gap-8">
              <Link href="#features" onClick={() => setIsOpen(false)} className="text-2xl font-bold hover:text-primary transition-colors">Features</Link>
              <Link href="/docs" onClick={() => setIsOpen(false)} className="text-2xl font-bold hover:text-primary transition-colors">Documentation</Link>
              <Link href="https://github.com/Anshik-02/DevScope" onClick={() => setIsOpen(false)} className="text-2xl font-bold hover:text-primary transition-colors flex items-center gap-3">
                 <GitBranch className="h-6 w-6" />
                 GitHub Repository
              </Link>
              <hr className="border-border" />
              <Button size="lg" className="w-full text-lg h-14 rounded-2xl">Get Started</Button>
          </div>
      </div>
    </nav>
  );
};

export default Navbar;
