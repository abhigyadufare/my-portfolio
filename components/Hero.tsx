"use client";
import React from "react";
import { Spotlight } from "./ui/spotlight";

const Hero = () => {
  return (
    <div className="pb-20 pt-36">
      <div>
        <Spotlight />
        <h1 className="text-white text-4xl font-bold text-center md:text-7xl outline-hidden">
          Hello World
        </h1>
      </div>
      <div className="container-2xl heading default-primary h-20 bg-amber-300 text-primary">yoohoo</div>
    </div>
  );
};

export default Hero;
