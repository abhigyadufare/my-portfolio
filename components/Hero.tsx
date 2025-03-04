"use client";
import React from "react";
import { Spotlight } from "./ui/spotlight";

const Hero = () => {
  return (
    <div className="pb-20 pt-36">
      <div>
        <Spotlight />
        <h1 className="text-white text-4xl md:text-7xl">Hello World</h1>
      </div>
    </div>
  );
};

export default Hero;
