"use client";

import React from "react";
import { Container } from "../container";
import { FeatureIconContainer } from "./features/feature-icon-container";
import { Heading } from "../elements/heading";
import { Subheading } from "../elements/subheading";
import { IconCheck, IconPlus, IconReceipt2 } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "../elements/button";

type Perks = {
  [key: string]: string;
}

type CTA = {
  [key: string]: string;
}

type Plan = {
  name: string;
  price: number;
  perks: Perks[];
  additional_perks: Perks[];
  description: string;
  number: string;
  featured?: boolean;
  CTA?: CTA | undefined;
};

export const Pricing = ({ heading, sub_heading, plans }: { heading: string, sub_heading: string, plans: any[] }) => {
  const onClick = (plan: Plan) => {
    console.log("click", plan);
  };
  return (
    <div className="pt-40 bg-primary">
      <Container>
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconReceipt2 className="h-6 w-6 text-accent" />
        </FeatureIconContainer>
        <Heading className="pt-4">{heading}</Heading>
        <Subheading className="max-w-3xl mx-auto">
          {sub_heading}
        </Subheading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto gap-4 py-20 lg:items-start">
          {plans.map((plan) => (
            <Card onClick={() => onClick(plan)} key={plan.name} plan={plan} />
          ))}
        </div>
      </Container>
    </div>
  );
};

const Card = ({ plan, onClick }: { plan: Plan; onClick: () => void }) => {
  return (
    <div
      className={cn(
        "p-4 md:p-4 rounded-3xl bg-primary border-2 border-accent-light",
        plan.featured && "border-accent bg-accent"
      )}
    >
      <div
        className={cn(
          "p-4 bg-accent rounded-2xl shadow-[0px_-1px_0px_0px_var(--accent-light)]",
          plan.featured && "bg-primary shadow-aceternity"
        )}
      >
        <div className="flex justify-between items-center">
          <p className={cn("font-medium text-primary", plan.featured && "text-accent")}>
            {plan.name}
          </p>
          {plan.featured && (
            <div
              className={cn(
                "font-medium text-xs px-3 py-1 rounded-full relative bg-primary"
              )}
            >
              <div className="absolute inset-x-0 bottom-0 w-3/4 mx-auto h-px bg-gradient-to-r from-transparent via-accent to-transparent"></div>
              Featured
            </div>
          )}
        </div>
        <div className="mt-8">
          {plan.price && (
            <span
              className={cn(
                "text-lg font-bold text-primary-light",
                plan.featured && "text-accent-light"
              )}
            >
              $
            </span>
          )}
          <span
            className={cn("text-4xl font-bold text-primary", plan.featured && "text-accent")}
          >
            {plan.price || plan?.CTA?.text}
          </span>
          {plan.price && (
            <span
              className={cn(
                "text-lg font-normal text-primary-light ml-2",
                plan.featured && "text-accent-light"
              )}
            >
              / launch
            </span>
          )}
        </div>
        <Button
          variant="outline"
          className={cn(
            "w-full mt-10 mb-4",
            plan.featured &&
            "bg-accent text-primary hover:bg-accent/80 hover:text-primary"
          )}
          onClick={onClick}
        >
          {plan?.CTA?.text}
        </Button>
      </div>
      <div className="mt-1 p-4">
        {plan.perks.map((feature, idx) => (
          <Step featured={plan.featured} key={idx}>
            {feature.text}
          </Step>
        ))}
      </div>
      {plan.additional_perks && plan.additional_perks.length > 0 && (
        <Divider featured={plan.featured} />
      )}
      <div className="p-4">
        {plan.additional_perks?.map((feature, idx) => (
          <Step featured={plan.featured} additional key={idx}>
            {feature.text}
          </Step>
        ))}
      </div>
    </div>
  );
};

const Step = ({
  children,
  additional,
  featured,
}: {
  children: React.ReactNode;
  additional?: boolean;
  featured?: boolean;
}) => {
  return (
    <div className="flex items-start justify-start gap-2 my-4">
      <div
        className={cn(
          "h-4 w-4 rounded-full bg-accent-light flex items-center justify-center flex-shrink-0 mt-0.5",
          additional ? "bg-accent" : "bg-accent-light"
        )}
      >
        <IconCheck className="h-3 w-3 [stroke-width:4px] text-primary" />
      </div>
      <div
        className={cn(
          "font-medium text-primary text-sm",
          featured && "text-accent"
        )}
      >
        {children}
      </div>
    </div>
  );
};

const Divider = ({ featured }: { featured?: boolean }) => {
  return (
    <div className="relative">
      <div
        className={cn("w-full h-px bg-primary", featured && "bg-accent")}
      />
      <div
        className={cn(
          "w-full h-px bg-accent",
          featured && "bg-primary"
        )}
      />
      <div
        className={cn(
          "absolute inset-0 h-5 w-5 m-auto rounded-xl bg-primary shadow-[0px_-1px_0px_0px_var(--primary)] flex items-center justify-center",
          featured && "bg-accent shadow-aceternity"
        )}
      >
        <IconPlus
          className={cn(
            "h-3 w-3 [stroke-width:4px] text-accent",
            featured && "text-primary"
          )}
        />
      </div>
    </div>
  );
};
