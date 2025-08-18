"use client";
import React, { memo, useState } from "react";

import MobileNav from "../mobileNavbar/MobileNav";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileLanguageSwitcher } from "@/components/mobile-language-switcher";
import { RTLAwareFlex } from "@/components/rtl-aware-flex";
import Image from "next/image";

const Navbar = () => {
  const { t, isRTL } = useLanguage();
  const [menuState, setMenuState] = useState<boolean>(false);

  const pathname = usePathname();

  const navigationItems = [
    { key: "home", href: "/" },
    { key: "about", href: "/about" },
    { key: "rooms", href: "/rooms" },
    { key: "facilities", href: "/facility" },
    { key: "book a room", href: "/booking" },
    { key: "contact", href: "/contacts" },
  ]

  return (
    <nav className="bg-regal_green fixed top-0 left-0 z-30 w-full pb-1 border-[1px] border-transparent text-white">
      <RTLAwareFlex
        justify="between"
        align="center"
        className="m-[auto] py-1 w-[95%]"
      >
        <Link href="/">
          <div className="flex items-center gap-2">
            <div className="relative h-12 w-16">
              <Image src="/logo.png" alt="لوگوی هتل" fill className=" object-cover" />
            </div>
            <h1 className={`scroll-m-20 text-xl font-light tracking-tight first:mt-2`}>
              {t('common.royal_palace')}
            </h1>
          </div>
        </Link>
        <ul className="flex items-center justify-around gap-[15px] min-[1220px]-w-[50%] max-[1220px]-w-[62%] my-6 ml-6 list-none [&>li]:mt-2 min-[1200px]:flex min-[100px]:hidden">
          {/* <li className="cursor-pointer hover:text-golden_yellow transition-all">
            <Link href="/"> HOME</Link>
          </li> */}
          {navigationItems.map((item) => (
            <li key={item.key} className="cursor-pointer group relative inline-block">
              <Link
                href={item.href}
                className={`block relative py-2 px-4 transition-colors duration-500 ${
                  pathname === item.href
                    ? "text-golden_yellow"
                    : "text-off-white hover:text-golden_yellow"
                }`}
              >
                {t(`header.navigation.${item.key}`)}
                <span className="absolute bottom-[2px] left-0 w-full h-[2px] bg-golden_yellow scale-x-0 origin-bottom-right group-hover:scale-x-100 group-hover:origin-bottom-left transition-transform duration-500 ease-out"></span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="hidden min-[1200px]:flex items-center space-x-4">
          <LanguageSwitcher />
        </div>
        <p className=" [&:not(:first-child)]:mt-2 sm:hidden min-[1200px]:flex min-[100px]:hidden">
          {" "}
          +234 781 52 952{" "}
        </p>
        <div className="min-[1200px]:hidden flex items-center gap-2">
          <MobileLanguageSwitcher />
          {menuState ? (
            <span
              onClick={() => setMenuState((prev) => !prev)}
              className="text-[25px] cursor-pointer min-[1200px]:hidden max-[1200px]:block"
            >
              <svg
                height="72"
                viewBox="0 0 21 21"
                width="60"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g
                  fill="white"
                  fillRule="evenodd"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m7.5 7.5 6 6" />
                  <path d="m13.5 7.5-6 6" />
                </g>
              </svg>
            </span>
          ) : (
            <span
              onClick={() => setMenuState((prev) => !prev)}
              className="mt-[24px] cursor-pointer min-[1200px]:hidden"
            >
              <svg viewBox="0 0 100 80" width="40" height="40">
                <rect className="fill-white" width="200" height="5"></rect>
                <rect
                  className="fill-white"
                  y="25"
                  width="200"
                  height="5"
                ></rect>
              </svg>
            </span>
          )}
        </div>
      </RTLAwareFlex>

      {menuState && (
        <MobileNav menuState={menuState} setMenuState={setMenuState} />
      )}
    </nav>
  );
};

export default memo(Navbar);
