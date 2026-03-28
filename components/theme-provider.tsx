"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Workaround for React 19 "Encountered a script tag" warning
// This warning is a false positive for next-themes as it uses a script tag
// inherently to prevent a flash of unstyled content on SSR hydration.
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const orig = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag")
    ) {
      return;
    }
    orig.apply(console, args);
  };
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
