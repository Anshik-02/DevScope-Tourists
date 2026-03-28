import React from "react";
import { Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-48 md:pb-32">
      {/* Background Aura */}
      <div className="hero-aura absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] pointer-events-none -z-10 opacity-50" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <div className="mx-auto mb-8 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-border bg-accent/30 px-7 py-2 backdrop-blur hover:border-border/80 hover:bg-accent/50 transition-all">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold text-primary">
            Intelligence Powered Analysis Core
          </p>
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl flex flex-col items-center">
          <span className="block">MAP THE</span>
          <span className="text-gradient-classy mt-1 sm:mt-2">NEURAL NET</span>
        </h1>
        
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
          DevScope clarifies complex architecture into narrative driven, 
          <br className="hidden sm:block" />
          interactive execution maps in seconds.
        </p>
      </div>
    </section>
  );
};

export default Hero;
