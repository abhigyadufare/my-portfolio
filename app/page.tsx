"use client";

import Greeting from "@/components/Greeting";
import Hero from "@/components/Hero";
import { useEffect, useState } from "react";

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
        <main className="relative dark:bg-slate-950 flex justify-center items-center flex-col mx-auto overflow-hidden">
          <div className="w-full max-w-7xl">
          <Hero />
           
          </div>
        </main>
      )}
    </>
  );
}
