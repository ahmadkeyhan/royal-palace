import React, { useState } from "react";
import { AnimatePresence, motion, Variant } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "../ui/button";
import { User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

interface INav {
  key: string;
  href: string;
}

interface IMenuState {
  menuState: boolean;
  setMenuState: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IVariants {
  [key: string]: Variant;
}

const MobileNav = React.memo((props: IMenuState) => {
  const [navLinks, setNavLinks] = useState<INav[]>([
    { key: "home", href: "/" },
    { key: "menu", href: "/menu" },
    // { key: "admin", href: "/admin" },
  ]);

  const menuLinks: IVariants = {
    initial: {
      scaleY: 0,
    },
    animate: {
      scaleY: 1,
      transition: {
        duration: 0.2,
        // ease: [0.76, 0, 0.24, 1],
        ease: [0.6, -0.05, 0.01, 0.99],
        // ease: [0.12, 0, 0.39, 0],
      },
    },
    exit: {
      scaleY: 0,
      transition: {
        duration: 0.7,
        delay: 0.5,
        // ease: [0.6, -0.05, 0.01, 0.99],
        // ease: [0.22, 1, 0.36, 1],
        // duration: 1,
        // ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  const containerVars: IVariants = {
    initial: {
      transition: {
        staggerChildren: 0.09,
        staggerDirection: -1,
      },
    },
    open: {
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.09,
        staggerDirection: 1,
      },
    },
  };

  const { t, isRTL } = useLanguage();

  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={menuLinks}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed top-[0px] left-0 z-20 h-[100%] w-[100%] origin-top bg-regal_green min-[1200px]:hidden max-[1200px]:block"
      >
        <div className="flex flex-col items-start justify-between h-full gap-[20px] pb-3 ">
          <div className="flex items-center justify-between  w-[95%] mx-auto ">
            <h1 className="text-[28px] w-full tracking-tight first:mt-2">
              {t('common.royal_palace')}
            </h1>
            <p
              onClick={() => props.setMenuState((prev: boolean) => !prev)}
              className="text-[25px] cursor-pointer min-[1200px]:hidden max-[1200px]:block "
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
            </p>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              variants={containerVars}
              initial="initial"
              animate="open"
              exit="initial"
              className="flex flex-col items-start w-[95%] mx-auto  justify-around gap-[15px] list-none [&>li]:mt-2"
            >
              {navLinks.map((nav: any, i: number) => {
                return (
                  <div className="overflow-hidden" key={i}>
                    <MobileLinks nav={nav} />
                  </div>
                );
              })}
              <div className="flex gap-2">
                <Link 
                  href={'/admin'}
                  onClick={() => props.setMenuState((prev: boolean) => !prev)}
                >
                  <Button variant="outline" size="sm" className="text-qqdarkbrown">
                      {session?.user ? session.user.name : "پنل ادمین"}
                      <User className="w-4 h-4" />
                  </Button>
                </Link>
                {session?.user && (
                  <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-qqdarkbrown"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex flex-col  w-full items-center gap-[20px]">
            <p className=" text-center [&:not(:first-child)]:mt-2 min-[1200px]:text-[30px] min-[800px]:text-[27px] min-[500px]:text-[24px] max-[500px]:text-[20px] ">
              {" "}
              +234 781 52 952{" "}
            </p>
            <p className="leading-7 text-center underline underline-offset-1  ">
              6A - ANTHONY HOROWITZ WAY, LEKKI{" "}
            </p>
            <ul className="flex items-center justify-center gap-[20px]  ">
              <li>FACEBOOK</li>
              <li>INSTAGRAM</li>
              <li>TWITTER</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

const mobileLinkVars = {
  initial: {
    y: "30vh",
    transition: {
      duration: 0.5,
      ease: [0.6, -0.05, 0.01, 0.99],
      //   ease: [0.37, 0, 0.63, 1],
    },
  },
  open: {
    y: 0,
    transition: {
      ease: [0, 0.55, 0.45, 1],
      duration: 0.7,
    },
  },
};

const MobileLinks = ({ nav }: { nav: INav }) => {
  const pathname = usePathname();
  const { t, isRTL } = useLanguage();

  return (
    <motion.ul className="flex items-center gap-[20px] mx-auto min-[1200px]:text-[30px] min-[800px]:text-[27px] min-[500px]:text-[24px] max-[500px]:text-[27px]  ">
      <motion.li
        variants={mobileLinkVars}
        initial="initial"
        animate="open"
        exit="exit"
        className="cursor-pointer group relative flex gap-2"
      >
        <Link
          className={`block relative py-2 px-4 transition-colors duration-500 ${
            pathname === nav.href
              ? "text-golden_yellow"
              : "text-off-white hover:text-golden_yellow"
          }`}
          href={nav.href}
        >
          {t(`header.navigation.${nav.key}`)}
          <span className="absolute bottom-[2px] left-0 w-full h-[2px] bg-golden_yellow scale-x-0 origin-bottom-right group-hover:scale-x-100 group-hover:origin-bottom-left transition-transform duration-500 ease-out"></span>
        </Link>
        {pathname === nav.href ? (
        <img className="w-[30px]" src="./Star.svg" alt="img" />
      ) : (
        ""
      )}
      </motion.li>
    </motion.ul>
  );
};
export default MobileNav;
