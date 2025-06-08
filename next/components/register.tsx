"use client";
import React, { useRef, useEffect } from "react";
import { Container } from "./container";
import { Logo } from "./logo";
import {
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
} from "@tabler/icons-react";
import { Button } from "./elements/button";

export const Register = () => {
  return (
    <div className="bg-[#deddce] relative overflow-hidden min-h-screen">
      {/* Heartbeat SVG Animation */}
      <HeartbeatLine />
      <Container className="h-screen max-w-lg mx-auto flex flex-col items-center justify-center relative z-10">
        <div className="w-full rounded-2xl bg-[#e6ddcd] shadow-2xl p-8 flex flex-col items-center">
          <Logo />
          <h1 className="text-xl text-[#1A2A36] md:text-4xl font-bold my-4 whitespace-nowrap">
            Sign up for ForeverNear
          </h1>

          <form className="w-full my-4">
            <input
              type="email"
              placeholder="Email Address"
              className="h-10 pl-4 w-full mb-4 rounded-md text-sm bg-dark-blue border border-neutral-800 text-white placeholder-neutral-500 outline-none focus:outline-none active:outline-none focus:ring-2 focus:ring-neutral-800"
            />
            <input
              type="password"
              placeholder="Password"
              className="h-10 pl-4 w-full mb-4 rounded-md text-sm bg-dark-blue border border-neutral-800 text-white placeholder-neutral-500 outline-none focus:outline-none active:outline-none focus:ring-2 focus:ring-neutral-800"
            />
            <Button variant="muted" type="submit" className="w-full py-3 bg-[#1A2A36] text-white shadow-lg hover:bg-[#16202a]">
              <span className="text-sm text-white">Sign up</span>
            </Button>
          </form>

          <Divider />

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button className="flex flex-1 justify-center space-x-2 items-center bg-[#1A2A36] px-4 py-3 rounded-md text-white hover:bg-[#16202a] transition duration-200 shadow-lg border border-[#1A2A36] hover:border-[#16202a]">
              <IconBrandGithubFilled className="h-4 w-4 text-white" />
              <span className="text-sm text-white">Login with GitHub</span>
            </button>
            <button className="flex flex-1 justify-center space-x-2 items-center bg-[#1A2A36] px-4 py-3 rounded-md text-white hover:bg-[#16202a] transition duration-200 shadow-lg border border-[#1A2A36] hover:border-[#16202a]">
              <IconBrandGoogleFilled className="h-4 w-4 text-white" />
              <span className="text-sm text-white">Login with Google</span>
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};

const Divider = () => {
  return (
    <div className="relative w-full py-8">
      <div className="w-full h-px bg-beige rounded-tr-xl rounded-tl-xl" />
      <div className="w-full h-px bg-beige/80 rounded-br-xl rounded-bl-xl" />
      <div className="absolute inset-0 h-5 w-5 m-auto rounded-md px-3 py-0.5 text-xs bg-beige shadow-[0px_-1px_0px_0px_var(--beige)] flex items-center justify-center text-[#1A2A36]">
        OR
      </div>
    </div>
  );
};

const HeartbeatLine = () => {
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      pathRef.current.style.setProperty('--heartbeat-length', `${length}`);
      pathRef.current.style.strokeDasharray = `${length}`;
      pathRef.current.style.strokeDashoffset = `${length}`;
    }
  }, []);

  return (
    <div className="absolute top-1/2 left-0 w-full h-32 -translate-y-1/2 pointer-events-none z-0">
      <svg
        ref={svgRef}
        className="heartbeat-animate"
        width="2000" height="128" viewBox="0 0 2000 128" fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ minWidth: '2000px' }}
      >
        <path
          ref={pathRef}
          d="M0 64 H200 L300 64 L350 32 L400 96 L450 64 L600 64 L650 32 L700 96 L750 64 L900 64 L950 32 L1000 96 L1050 64 L1200 64 L1250 32 L1300 96 L1350 64 L1500 64 L1550 32 L1600 96 L1650 64 L1800 64 L1850 32 L1900 96 L1950 64 H2000"
          stroke="#1A2A36"
          strokeWidth="4"
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    </div>
  );
};
