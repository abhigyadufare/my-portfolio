import React from "react";
import { FlipWords } from "./ui/flip-words";

const Greeting = () => {
  const words: string[] = [
    "Hello",
    "नमस्ते",
    "Hola",
    "Bonjour",
    "Ciao",
    "こんにちは",
    "안녕하세요",
    "Hallo",
    "مرحبا",
    "你好",
  ];

  return (
    <div className="min-h-screen flex justify-center items-center px-4 dark:bg-slate-950">
      <div className="text-4xl font-bold mx-auto text-neutral-600 dark:text-neutral-400 md:text-7xl">
        <FlipWords words={words} />
      </div>
    </div>
  );
};

export default Greeting;
