"use client";
import { Logo } from "@/components/logo";
import { Button } from "@/components/elements/button";
import { NavbarItem } from "./navbar-item";
import {
  useMotionValueEvent,
  useScroll,
  motion,
  AnimatePresence,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Link } from "next-view-transitions";
import { LocaleSwitcher } from "../locale-switcher";

type Props = {
  leftNavbarItems: {
    URL: string;
    text: string;
    target?: string;
  }[];
  rightNavbarItems: {
    URL: string;
    text: string;
    target?: string;
  }[];
  logo: any;
  locale: string;
};

export const DesktopNavbar = ({ leftNavbarItems, rightNavbarItems, logo, locale }: Props) => {
  const { scrollY } = useScroll();

  const [showBackground, setShowBackground] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    const handler = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  useMotionValueEvent(scrollY, "change", (value) => {
    if (value > 100) {
      setShowBackground(true);
    } else {
      setShowBackground(false);
    }
  });
  return (
    <motion.div
      className={cn(
        "w-full flex relative justify-between px-4 py-3 rounded-full transition duration-200 bg-accent mx-auto text-primary"
      )}
      animate={{
        width: showBackground ? "80%" : "100%",
        background: showBackground ? "#1A2A36" : "#1A2A36",
      }}
      transition={{
        duration: 0.4,
      }}
    >
      <AnimatePresence>
        {showBackground && (
          <motion.div
            key={String(showBackground)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1,
            }}
            className="absolute inset-0 h-full w-full bg-primary/20 pointer-events-none [mask-image:linear-gradient(to_bottom,white,transparent,white)] rounded-full"
          />
        )}
      </AnimatePresence>
      <div className="flex flex-row gap-2 items-center">
        <Logo locale={locale} image={logo?.image} />
        <div className="flex items-center gap-1.5">
          {leftNavbarItems.map((item) => (
            <NavbarItem href={`/${locale}${item.URL}` as never} key={item.text} target={item.target}>
              {item.text}
            </NavbarItem>
          ))}
        </div>
      </div>
      <div className="flex space-x-2 items-center">
        <LocaleSwitcher currentLocale={locale} />

        {rightNavbarItems
          .filter(item => {
            if (isLoggedIn && item.text.toLowerCase() === "login") return false;
            return true;
          })
          .map(item => {
            if (isLoggedIn && item.text.toLowerCase() === "sign up") {
              return (
                <Button
                  key="logout"
                  variant="simple"
                  className="bg-[#F6EDDD] text-[#1A2A36] hover:bg-[#e6ddcd] border border-[#F6EDDD] hover:border-[#e6ddcd]"
                  onClick={() => {
                    localStorage.removeItem("token");
                    setIsLoggedIn(false);
                    window.location.href = "/sign-up";
                  }}
                >
                  Logout
                </Button>
              );
            }
            return (
              <Button
                key={item.text}
                variant="simple"
                className="bg-[#F6EDDD] text-[#1A2A36] hover:bg-[#e6ddcd] border border-[#F6EDDD] hover:border-[#e6ddcd]"
                as={Link}
                href={`/${locale}${item.URL}`}
              >
                {item.text}
              </Button>
            );
          })}
      </div>
    </motion.div>
  );
};
