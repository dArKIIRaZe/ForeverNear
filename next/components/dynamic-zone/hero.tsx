"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import ShootingStars from "../decorations/shooting-star";
import StarBackground from "../decorations/star-background";
import { FullImage } from "@/components/pic";
import { Logo } from "@/components/logo";
import { FullVideo } from "@/components/video";
import { strapiImage } from "@/lib/strapi/strapiImage";

import { Heading } from "../elements/heading";
import { Subheading } from "../elements/subheading";
import { Button } from "../elements/button";
import { Cover } from "../decorations/cover";
import { motion } from "framer-motion";

export const Hero = ({ heading, sub_heading, CTAs, locale, Pic , BackgroundVideo}: { heading: string; sub_heading: string; CTAs: any[], locale: string, Pic?: any, BackgroundVideo?: any }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Video error:", e);
  };

  return (
    <div className="h-screen overflow-hidden relative flex flex-col items-center justify-center bg-primary">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onError={handleVideoError}
          className="absolute min-w-full min-h-full object-cover blur-sm"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            filter: 'brightness(0.7) blur(6px)'
          }}
        >
          <source 
            src={BackgroundVideo?.url ? strapiImage(BackgroundVideo.url) : undefined}
            type="video/mp4"
            onError={(e) => console.error("Source error:", e)}
          />
          Your browser does not support the video tag.
        </video>
        {/* Overlay to ensure content visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-white/20" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="relative z-10"
      >
        <StarBackground />
        <ShootingStars />
      </motion.div>
      <div className="flex flex-col items-center justify-center z-10 relative drop-shadow-xl">
        <div className="mb-6">
          <FullImage image={Pic} className="rounded-xl shadow-2xl" />
        </div>
        <Heading
          as="h1"
          className="text-4xl md:text-4xl lg:text-7xl font-bold max-w-4xl mx-auto text-center mt-2 text-accent drop-shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
        >
          <span className="hero-glow rounded-xl px-4 py-2 inline-block">{heading}</span>
        </Heading>
        <Subheading className="text-center mt-4 md:mt-6 text-lg md:text-2xl text-accent max-w-2xl mx-auto drop-shadow-md">
          {sub_heading}
        </Subheading>
        <div className="flex space-x-4 items-center mt-8">
          {CTAs && CTAs.map((cta) => (
            <Button
              key={cta?.id}
              as={Link}
              href={`/${locale}${cta.URL}`}
              className="bg-accent/90 backdrop-blur-sm text-primary hover:bg-accent transition-all duration-300"
              {...(cta.variant && { variant: cta.variant })}
            >
              {cta.text}
            </Button>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-80 w-full bg-gradient-to-t from-accent/80 to-transparent" />
    </div>
  );
};
