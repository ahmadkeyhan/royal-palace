import SplitText from "@/components/animation/SplitText";
import Image from "next/image";
import React, { ReactNode, useRef } from "react";
import { GiGooeyEyedSun } from "react-icons/gi";
import { TbNorthStar } from "react-icons/tb";
import { motion, Variant } from "framer-motion";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Variants {
  [key: string]: Variant;
}

const HeroHeader = () => {
  const { t, isRTL } = useLanguage();
  const translate: Variants = {
    initial: {
      y: "100%",
      opacity: 0,
      // transition: {
      //   duration: 0.5,
      //   ease: [0.76, 0, 0.24, 1],
      // },
    },
    enter: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.6,
        ease: [0.76, 0, 0.24, 1],
        delay: i[0]*2,
      },
    }),
    exit: (i) => ({
      y: "100%",
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: [0.76, 0, 0.24, 1],
        delay: i[0],
      },
    }),
  };

  const heroHeader = ["ROYAL", "PALACE"];

  // Check if text contains Persian/Arabic characters
  const isPersianText = (text: string): boolean => {
    const persianRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/
    return persianRegex.test(text)
  }

  // Split Persian text into words to preserve character connections
  const splitPersianText = (text: string): string[] => {
    return text.split(/(\s+)/).filter((part) => part.length > 0)
  }

  // Split English text into individual characters
  const splitEnglishText = (text: string): string[] => {
    return text.split("")
  }
  const getChars: (title: string) => ReactNode = (title: string) => {
    const isPersian = isPersianText(title)
    const parts = isPersian ? splitPersianText(title) : splitEnglishText(title)
    let chars: ReactNode[] = [];
    parts.forEach((char: string, index: number) => {
      chars.push(
        <motion.span
          key={index}
          variants={translate}
          initial="initial"
          animate="enter"
          exit="exit"
          custom={[index * 0.02, (title.length - index) * 0.01]}
        >
          {char}
        </motion.span>
      );
    });
    return chars;
  };

  const getCharsAdvanced = (title: string): ReactNode => {
    const isPersian = isPersianText(title)

    if (!isPersian) {
      // Use character-by-character for English
      return getChars(title)
    }

    // For Persian, split by syllables/morphemes for better animation
    const words = title.split(/(\s+)/)
    const chars: ReactNode[] = []
    let globalIndex = 0

    words.forEach((word) => {
      if (/\s/.test(word)) {
        // Handle whitespace
        chars.push(
          <motion.span
            key={globalIndex}
            variants={translate}
            initial="initial"
            animate="enter"
            exit="exit"
            custom={[globalIndex * 0.02, (words.length - globalIndex) * 0.01]}
            style={{ whiteSpace: "pre" }}
          >
            {word}
          </motion.span>,
        )
        globalIndex++
      } else {
        // Split Persian words into smaller chunks (2-3 characters) to maintain connections
        const chunks: string[] = []
        for (let i = 0; i < word.length; i += 2) {
          chunks.push(word.slice(i, i + 2))
        }

        chunks.forEach((chunk) => {
          chars.push(
            <motion.span
              key={globalIndex}
              variants={translate}
              initial="initial"
              animate="enter"
              exit="exit"
              custom={[globalIndex * 0.2, (chunks.length - globalIndex) * 0.1]}
              style={{ display: "inline-block" }}
            >
              {chunk}
            </motion.span>,
          )
          globalIndex++
        })
      }
    })

    return chars
  }

  return (
    <div className="w-full bg-regal_green pt-8">
      <div className="flex justify-around gap-4 w-full m-auto text-white max-[900px]:items-center max-[760px]:flex-col">
        <div className="flex h-20 sm:h-32 pt-4 justify-center gap-1 overflow-hidden">
          {t('banner.title').split(' ').map((bank: string, index) => {
            return (
              <h1
                className={
                  `${bank}` == "PALACE" || `${bank}` == "پالاس" 
                    ? " flex items-center scroll-m-20 text-golden_yellow -tracking-tight  border-solid lg:text-8xl sm:text-7xl max-[330px]:text-[50px] max-[760px]:justify-center text-5xl"
                    : " flex items-center scroll-m-20 text-white -tracking-tight  border-solid lg:text-8xl sm:text-7xl max-[330px]:text-[50px] max-[760px]:justify-center text-5xl"
                }
                key={index}
              >
                {" "}
                {getCharsAdvanced(bank)}{" "}
              </h1>
            );
          })}
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex justify-center text-center">
            <p className="px-12 -mt-2 w-[28ch] leading-loose">
              {t('banner.subtitle')}
            </p>
          </div>
          <div className="flex justify-center font-ravi items-center gap-6 mb-8">
            <Link href="/menu">
              <Button variant="default">
                {t("banner.cta_primary")}
              </Button>
            </Link>
            <AnchorLink href="#guide">
              <Button variant="outline">
                {t("banner.cta_secondary")}
              </Button>
            </AnchorLink>
          </div>
        </div>
        {/* <div className="flex gap-[0px] w-full justify-between min-[900px]:flex-col min-[900px]:gap-2">
          <div className="flex items-center justify-between mb-[80px] w-full  max-[900px]:w-fit max-[800px]:flex-start ">
            <button className="flex items-center justify-around gap-[10px] rounded-[30px] py-2 xl:px-[35px] md:px-[30px] max-[900px]:hidden border-[1px] border-gray-400">
              <span className="text-[#FCD043] text-[25px] min-lg:text-[25px] min-[100px]:text-[18px] min-[650px]:text-[20px] ">
                {<TbNorthStar />}{" "}
              </span>
              <span className="">1973 </span>
            </button>
            <div className="cursor-pointer min-[100px]:w-[30px] min-[650px]:w-[40px] min-[1200px]:w-[50px] max-[800px]:hidden">
              <AnchorLink href="#things">
                <img src="/wavy.webp" alt="img" />
              </AnchorLink>
            </div>
          </div>

          
        </div> */}
      </div>
    </div>
  );
};

export default HeroHeader;
