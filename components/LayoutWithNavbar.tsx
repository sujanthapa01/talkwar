"use client";

import { usePathname } from "next/navigation";

import { Navbar } from "@/components/navbar";
import { Navigation } from "@/components/main-navigation";

export function LayoutWithNavbar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative flex flex-col items-center h-screen">
      {pathname === "/d" ? <Navigation /> : <Navbar />}

      <main className="container flex-grow">{children}</main>

      <footer className="w-full flex items-center justify-center py-3">
        <a
          className="flex items-center gap-1 text-current"
          href="https://heroui.com?utm_source=next-app-template"
          rel="noopener noreferrer"
          target="_blank"
          title="heroui.com homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">HeroUI</p>
        </a>
      </footer>
    </div>
  );
}
