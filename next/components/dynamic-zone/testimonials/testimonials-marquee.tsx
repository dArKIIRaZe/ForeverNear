"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import Marquee from "react-fast-marquee";
import { strapiImage } from "@/lib/strapi/strapiImage";

export const TestimonialsMarquee = ({ testimonials }: { testimonials: any }) => {
  const levelOne = testimonials.slice(0, 8);
  const levelTwo = testimonials.slice(8, 16);
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex h-full relative">
        <div className="h-full absolute w-20 left-0 inset-y-0 z-30 bg-gradient-to-r from-primary to-transparent" />
        <div className="h-full absolute w-20 right-0 inset-y-0 z-30 bg-gradient-to-l from-primary to-transparent" />
        <Marquee>
          {levelOne.map((testimonial: any, index: any) => (
            <Card
              key={`testimonial-${testimonial.id}-${index}`}
              className="max-w-xl h-60 mx-4"
            >
              <Quote>{testimonial?.text}</Quote>
              <div className="flex gap-2 items-center mt-8">
                <Image
                  src={strapiImage(testimonial?.user?.image?.url)}
                  alt={`${testimonial.user.firstname} ${testimonial.user.lastname}`}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex flex-col">
                  <QuoteDescription className="text-primary">
                    {`${testimonial.user.firstname} ${testimonial.user.lastname}`}
                  </QuoteDescription>
                  <QuoteDescription className="text-primary-light">
                    {testimonial.user.job}
                  </QuoteDescription>
                </div>
              </div>
            </Card>
          ))}
        </Marquee>
      </div>
      <div className="flex h-full relative mt-8">
        <div className="h-full absolute w-20 left-0 inset-y-0 z-30 bg-gradient-to-r from-primary to-transparent" />
        <div className="h-full absolute w-20 right-0 inset-y-0 z-30 bg-gradient-to-l from-primary to-transparent" />
        <Marquee direction="right" speed={20}>
          {levelTwo.map((testimonial: any, index: any) => (
            <Card
              key={`testimonial-${testimonial.id}-${index}`}
              className="max-w-xl h-60 mx-4"
            >
              <Quote>{testimonial.text}</Quote>
              <div className="flex gap-2 items-center mt-8">
                <Image
                  src={strapiImage(testimonial?.user?.image?.url)}
                  alt={`${testimonial.user.firstname} ${testimonial.user.lastname}`}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex flex-col">
                  <QuoteDescription className="text-primary">
                    {`${testimonial.user.firstname} ${testimonial.user.lastname}`}
                  </QuoteDescription>
                  <QuoteDescription className="text-primary-light">
                    {testimonial.user.job}
                  </QuoteDescription>
                </div>
              </div>
            </Card>
          ))}
        </Marquee>
      </div>
    </div>
  );
};
export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "p-8 rounded-xl border border-accent-light bg-accent/30 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group",
        className
      )}
    >
      {children}
    </div>
  );
};

export const Quote = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3 className={cn("text-base font-semibold text-primary py-2", className)}>
      {children}
    </h3>
  );
};

export const QuoteDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={cn("text-sm font-normal text-primary-light max-w-sm", className)}
    >
      {children}
    </p>
  );
};
