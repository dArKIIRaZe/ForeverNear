"use client";
import React from "react";
import { Container } from "./container";
import { Logo } from "./logo";
import {
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
} from "@tabler/icons-react";
import { Button } from "./elements/button";

export const Register = () => {
  return (
    <div className="bg-[#F6EDDD]">
      <Container className="h-screen max-w-lg mx-auto flex flex-col items-center justify-center">
        <div className="w-full rounded-2xl bg-[#e6ddcd] shadow-2xl p-8 flex flex-col items-center">
          <Logo />
          <h1 className="text-xl text-[#1A2A36] md:text-4xl font-bold my-4">
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
