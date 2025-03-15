"use client";

import Greeting from "@/components/Greeting";
import Grid from "@/components/Grid";
import Hero from "@/components/Hero";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { navItems } from "@/data";
import { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <Greeting />
      ) : (
        <main className="relative dark:bg-slate-950 flex justify-center items-center flex-col mx-auto overflow-hidden px-5">
          <div className="w-full max-w-7xl">
            <FloatingNav
              navItems={navItems}
            />
              <Hero />
              <Grid />
          </div>
        </main>
      )}
    </>
  );
}
