"use client";
import { cn } from "@/lib/utils";
import { Link } from "next-view-transitions";
import { useState, useEffect } from "react";
import { IoIosMenu } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { Button } from "@/components/elements/button";
import { Logo } from "@/components/logo";
import { useMotionValueEvent, useScroll } from "framer-motion";
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
  locale: string
};

export const MobileNavbar = ({ leftNavbarItems, rightNavbarItems, logo, locale }: Props) => {
  const [open, setOpen] = useState(false);

  const { scrollY } = useScroll();

  const [showBackground, setShowBackground] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (token) {
      setUserEmail(localStorage.getItem("userEmail"));
    } else {
      setUserEmail(null);
    }
    const handler = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
      setUserEmail(token ? localStorage.getItem("userEmail") : null);
    };
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
    <div
      className={cn(
        "flex justify-between bg-accent items-center w-full rounded-md px-2.5 py-1.5 transition duration-200 text-primary",
        showBackground &&
        " bg-accent shadow-[0px_-2px_0px_0px_var(--accent),0px_2px_0px_0px_var(--accent)]"
      )}
    >
      <Logo image={logo?.image} />

      <IoIosMenu
        className="text-primary h-6 w-6"
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="fixed inset-0 bg-primary z-50 flex flex-col items-start justify-start space-y-10 pt-5 text-xl text-accent transition duration-200 hover:text-accent">
          <div className="flex items-center justify-between w-full px-5">
            <Logo locale={locale} image={logo?.image} />
            <div className="flex items-center space-x-2">
              <LocaleSwitcher currentLocale={locale} />
              <IoIosClose
                className="h-8 w-8 text-accent"
                onClick={() => setOpen(!open)}
              />
            </div>
          </div>
          <div className="flex flex-col items-start justify-start gap-[14px] px-8">
            {leftNavbarItems.map((navItem: any, idx: number) => (
              <>
                {navItem.children && navItem.children.length > 0 ? (
                  <>
                    {navItem.children.map((childNavItem: any, idx: number) => (
                      <Link
                        key={`link=${idx}`}
                        href={`/${locale}${childNavItem.URL}`}
                        onClick={() => setOpen(false)}
                        className="relative max-w-[15rem] text-left text-2xl"
                      >
                        <span className="block text-accent">
                          {childNavItem.text}
                        </span>
                      </Link>
                    ))}
                  </>
                ) : (
                  <Link
                    key={`link=${idx}`}
                    href={`/${locale}${navItem.URL}`}
                    onClick={() => setOpen(false)}
                    className="relative"
                  >
                    <span className="block text-[26px] text-accent">
                      {navItem.text}
                    </span>
                  </Link>
                )}
              </>
            ))}
          </div>
          <div className="flex flex-row w-full items-start gap-2.5  px-8 py-4 ">
            {isLoggedIn && userEmail ? (
              <span className="text-[#F6EDDD] font-semibold px-2">{userEmail}</span>
            ) : null}
            {rightNavbarItems
              .filter(item => {
                if (
                  isLoggedIn &&
                  item.text.toLowerCase().replace(/\s/g, "") === "login"
                ) return false;
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
                        localStorage.removeItem("userEmail");
                        setIsLoggedIn(false);
                        setUserEmail(null);
                        window.location.href = "/sign-up";
                      }}
                    >
                      Logout
                    </Button>
                  );
                }
                if (
                  isLoggedIn &&
                  item.text.toLowerCase().replace(/\s/g, "") === "login"
                ) {
                  return null;
                }
                return (
                  <Button
                    key={item.text}
                    variant="simple"
                    className="bg-[#F6EDDD] text-[#1A2A36] hover:bg-[#e6ddcd] border border-[#F6EDDD] hover:border-[#e6ddcd]"
                    as={Link}
                    href={`/${locale}${item.URL}`}
                    onClick={() => setOpen(false)}
                  >
                    {item.text}
                  </Button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
