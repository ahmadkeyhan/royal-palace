import React from "react";
import { FaAngleDown } from "react-icons/fa6";
import { useInView } from "react-intersection-observer";
import { Variant } from "framer-motion";
import ImageReveal from "@/components/animation/ImageReveal";

type Props = {};

type Variants = {
  [key: string]: Variant;
};

function HeroImage({}: Props) {
  const { ref, inView, entry } = useInView({
    threshold: 0.3,
  });

  return (
    <div className="bg-regal_green">
      <div className="w-[95%] relative mx-auto">
      <ImageReveal>
        <div className="relative w-full overflow-hidden h-full flex justify-center">
          <img
            className={
            `max-w-7xl ${inView ? `transform transition duration-1000 scale-105` : ""}`
            }
            src="./heroImage.webp"
            alt="img"
          />
          {/* <div className="flex items-center absolute max-[900px]:bottom-0 min-[900px]:top-0 right-0 ">
            <Link href="/booking">
              <button className="sm:flex items-center justify-around gap-[10px] hidden sm:w-[180px] lg:w-[200px] sm:h-[70px] max-lg:h-[80px] xl:h-[90px] text-white_text  bg-hero-btn hover:bg-hover-hero-btn transition ease delay-450 backdrop-blur-[20px] opacity-[0.9]">
                {t("banner.check_in")}
                <span className="text-golden_yellow">{<FaAngleDown />} </span>{" "}
              </button>
            </Link>
            <span className="h-[30px] w-[1px] bg-white opacity-[0.4]"></span>

            <Link href="/booking">
              <button className="sm:flex items-center justify-around gap-[10px] hidden sm:w-[180px] lg:w-[200px] sm:h-[70px] max-lg:h-[80px] xl:h-[90px] text-white_text  bg-hero-btn hover:bg-hover-hero-btn transition ease delay-450 backdrop-blur-[20px] opacity-[0.9]">
                {t("banner.check_out")}
                <span className="text-golden_yellow">{<FaAngleDown />}</span>{" "}
              </button>
            </Link>
            <Link href="/booking">
              <button className="sm:flex items-center justify-around gap-[10px] hidden sm:w-[190px] lg:w-[200px] sm:h-[70px] max-lg:h-[80px] xl:h-[90px]  max-sm:text-[15px] md:text-[16px] bg-golden_yellow hover:bg-hover_golden_yellow hover:text-white backdrop-blur-[20px] transition ease delay-450 opacity-[0.9]">
                {t("banner.book")}
              </button>
            </Link>
          </div> */}
        </div>
      </ImageReveal>
      </div>
    </div>
  );
}

export default HeroImage;
