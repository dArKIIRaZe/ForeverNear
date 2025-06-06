"use client";
import React from "react";
import Link from "next/link";
import ShootingStars from "../decorations/shooting-star";
import StarBackground from "../decorations/star-background";
import Image from "next/image";
import { Logo } from "@/components/logo";

import { Heading } from "../elements/heading";
import { Subheading } from "../elements/subheading";
import { Button } from "../elements/button";
import { Cover } from "../decorations/cover";
import { motion } from "framer-motion";

export const Hero = ({ heading, sub_heading, CTAs, locale, image }: { heading: string; sub_heading: string; CTAs: any[], locale: string, image?: any }) => {
  return (
    <div className="h-screen overflow-hidden relative flex flex-col items-center justify-center bg-[#F6EDDD]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <StarBackground />
        <ShootingStars />
      </motion.div>
      <div className="flex flex-col items-center justify-center z-10">
      <Logo locale={locale} image={logo?.image} />
        <Heading
          as="h1"
          className="text-4xl md:text-4xl lg:text-7xl font-bold max-w-4xl mx-auto text-center mt-2 text-[#1A2A36]"
        >
          {heading}
        </Heading>
        <Subheading className="text-center mt-4 md:mt-6 text-lg md:text-2xl text-[#1A2A36] max-w-2xl mx-auto">
          {sub_heading}
        </Subheading>
        <div className="flex space-x-4 items-center mt-8">
          {CTAs && CTAs.map((cta) => (
            <Button
              key={cta?.id}
              as={Link}
              href={`/${locale}${cta.URL}`}
              className="bg-[#1A2A36] text-[#F6EDDD] hover:bg-[#24384a]"
              {...(cta.variant && { variant: cta.variant })}
            >
              {cta.text}
            </Button>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-80 w-full bg-gradient-to-t from-charcoal to-transparent" />
    </div>
  );
};
