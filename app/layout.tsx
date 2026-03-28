import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevScope — Map Your Neural Net",
  description:
    "DevScope clarifies complex architecture into narrative driven, interactive execution maps in seconds. Powered by AI.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground font-sans">
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <header className="fixed top-20 right-8 z-[100] flex items-center gap-4">
              <Show when="signed-out">
                <div className="flex items-center gap-2 bg-card/60 backdrop-blur-xl border border-white/10 p-1.5 rounded-2xl shadow-2xl">
                  <SignInButton mode="modal">
                    <button className="px-4 py-2 hover:bg-white/5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all">Sign In</button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="px-6 py-2 bg-purple-500 text-white rounded-xl text-[10px] font-black tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)]">Sign Up</button>
                  </SignUpButton>
                </div>
              </Show>
              <Show when="signed-in">
                <div className="bg-card/60 backdrop-blur-xl border border-white/10 p-2 rounded-full shadow-2xl">
                  <UserButton />
                </div>
              </Show>
            </header>
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
