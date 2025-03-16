"use client";
import { cn } from "@/lib/utils";
import { BackgroundGradientAnimation } from "./background-gradient-animation";
import { GlobeDemo } from "./grid-globe";
import Lottie from "react-lottie";
import { useState } from "react";
import animationData from "@/data/confetti.json";
import MagicButton from "./magic-button";
import { IoCopyOutline } from "react-icons/io5";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 md:grid-row-7 gap-4 lg:gap-8 mx-auto w-full py-20",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  id,
  img,
  imgClassName,
  titleClassName,
  spareImg,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  id: number;
  img?: string;
  imgClassName?: string;
  titleClassName?: string;
  spareImg?: string;
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const handleCopy = () => {
    navigator.clipboard.writeText("abhigyadufare@gmail.com");
    setCopied(true);
  };

  return (
    <div
      className={cn(
        "row-span-1 relative overflow-hidden rounded-3xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none justify-between flex flex-col space-y-4 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-950 bg-gradient-to-r from-gray-100 to-white",
        className
      )}
    >
      <div
        className={`${
          id === 6 && "flex flex-col items-center"
        } h-full`}
      >
        <div className="w-full h-full absolute">
          {img && (
            <img
              src={img}
              alt={img}
              className={cn(imgClassName, "object-cover object-center")}
            />
          )}
        </div>
        <div
          className={`absolute right-0 -bottom-5 ${
            id === 5 && "w-full opacity-80"
          }`}
        >
          {spareImg && (
            <img
              src={spareImg}
              alt={spareImg}
              className="object-cover object-center h-full w-full"
            />
          )}
        </div>
        {id === 6 && (
          <BackgroundGradientAnimation>
            <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl"></div>
          </BackgroundGradientAnimation>
        )}
        <div
          className={cn(
            titleClassName,
            "group-hover/bento:translate-x-4 transition duration-500 md:h-full min-h-40 flex flex-col px-5 p-5 lg:p-10"
          )}
        >
          <div className="font-sans font-extralight z-10 text-[#c1c2d3] text-sm md:text-xs lg:text-base">
            {description}
          </div>
          <div className="font-sans font-bold z-10 text-lg lg:text-3xl max-w-96">
            {title}
          </div>
        </div>
        {id === 2 && <GlobeDemo />}
        {id === 3 && (
          <div className="flex gap-2 lg:gap-5 w-fit absolute -top-2 -right-3 lg:-right-2">
            <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
              <span className="py-4 px-3 bg-[#10132E] rounded-lg text-center"></span>
              {["ReactJs", "NextJs", "Tailwindcss", "Liquid"].map((skill) => (
                <span
                  className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-50  lg:opacity-100 rounded-lg text-center bg-[#10132E]"
                  key={skill}
                >
                  {skill}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
              {["MongoDB", "Express", "NodeJs", "Redux"].map((skill) => (
                <span
                  className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-50  lg:opacity-100 rounded-lg text-center bg-[#10132E]"
                  key={skill}
                >
                  {skill}
                </span>
              ))}
              <span className="py-4 px-3 bg-[#10132E] rounded-lg text-center"></span>
            </div>
          </div>
        )}
        {id === 6 && (
          <div className="mt-5 relative">
            <div className={`absolute -bottom-5 right-0`}>
              <Lottie
                options={{
                  loop: copied,
                  autoplay: copied,
                  animationData,
                  rendererSettings: {
                    preserveAspectRatio: "xMidYMid slice",
                  },
                }}
              />
            </div>
            <div className="-mt-10 mb-10 md:-mt-20">
              <MagicButton
                title={copied ? "Email is Copied" : "Copy my Email Address"}
                icon={<IoCopyOutline />}
                position="left"
                otherClasses="!bg-[#161a31]"
                handleClick={handleCopy}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
