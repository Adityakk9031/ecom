import { Navbar } from "./Navbar";
import { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-border/50 py-12 bg-secondary/30">
        <div className="container-custom text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Luxe Commerce. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
