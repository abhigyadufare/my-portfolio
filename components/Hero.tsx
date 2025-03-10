"use client";
import React from "react";
import { Spotlight } from "./ui/spotlight";
import { ModeToggle } from "./ThemeToggle";

const Hero = () => {
  return (
    <div className="pb-20 pt-36">
      <div>
        <Spotlight />
        <h1 className="text-white text-4xl font-bold text-center md:text-7xl outline-hidden">
          Hello World
        </h1>
      </div>
      <div className="@container-2xl heading default-primary h-20 bg-amber-300 text-primary">
        yoohoo
      </div>
      <ModeToggle />
      <div className="h-[50rem] w-full dark:bg-transparent bg-white  dark:bg-grid-red-800/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
        {/* Radial gradient for the container to give a faded look */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-slate-950 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)]"></div>
        <p className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
          Backgrounds
        </p>
      </div>
    </div>
  );
};

export default Hero;
