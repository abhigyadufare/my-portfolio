"use client";

import Hero from "@/components/Hero";
import LanguageLoader from "@/components/LanguageLoader";
import Image from "next/image";
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
        <LanguageLoader />
      ) : (
        <main className="relative bg-black-100 flex justify-center items-center flex-col mx-auto overflow-hidden sm:px-10 px-5">
          <div className="w-full max-w-7xl">
            <Hero />
            <Hero />
            <Hero />
          </div>
        </main>
      )}
    </>
  );
}
