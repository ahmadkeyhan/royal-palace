import { useInView } from "react-intersection-observer";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatePresence, motion, Variant, Variants } from "framer-motion";

type Props = {};

interface IVariant {
  [key: string]: Variant;
}

const Guide = (props: Props) => {
  const { t, isRTL } = useLanguage();

  console.log(t("guide.description1.1"));

  const [ref, inView] = useInView();

  const textVars: IVariant = {
  initial: {
    y: "70vh",
    opacity: 0,
    transition: {
      duration: 1,
      ease: [0.76, 0, 0.24, 1],
      // ease: [0.6, -0.05, 0.01, 0.99],
      //   ease: [0.37, 0, 0.63, 1],
    },
  },
  open: {
    y: 0,
    opacity: 1,
    transition: {
      // ease: [0, 0.55, 0.45, 1],
      ease: [0.76, 0, 0.24, 1],
      duration: 1,
    },
  },
};

  return (
    <div
      id="guide"
      className="bg-off-white w-full overflow-hidden pt-[72px] h-full"
    >
      <div className="w-[95%] my-[70px] mx-auto  border-solid  ">
        <div className="relative h-[100%] flex flex-col justify-center items-center  ">
          <div ref={ref} className="relative flex flex-col w-full justify-between h-[80%]">
            <div className="flex flex-col z-10 max-[750px]:flex max-[750px]:flex-row  max-[750px]:gap-[25px]">
              <h1 className="min-[900px]:text-[80px] xl:text-[100px] sm:text-[70px] max-sm:text-3xl max-[330px]:text-[50px]  scroll-m-20  font-bold tracking-[.10em]  text-golden_yellow">
                {t("guide.title1")}
              </h1>
              <h1 className="lg:text-[100px] sm:text-[70px] max-sm:text-3xl  text-end text-text_royal_green scroll-m-20 font-bold tracking-[.10em]">
                {t("guide.title2")}
              </h1>
            </div>
            <div className="relative w-full h-full font-doran">
              <AnimatePresence>
                <motion.div
                    variants={textVars}
                    initial="initial"
                    animate={inView ? "open" : "initial"}
                    exit="exit"
                    className={`flex w-full ${
                    inView ? "max-[780px]:h-auto" : "max-[780px]:h-full"
                    }  gap-6 ${
                    inView ? "items-end" : "items-end"
                    } max-[750px]:flex-col max-[650px]:items-center`}
                >
                    <ul className="grid grid-cols-2 w-full list-disc gap-x-6 font-ravi px-4 mt-4 text-text_royal_green">
                    <li>{t("guide.description1.1")}</li>
                    <li>{t("guide.description1.2")}</li>
                    <li>{t("guide.description1.3")}</li>
                    <li>{t("guide.description1.4")}</li>
                    <li>{t("guide.description1.5")}</li>
                    <li>{t("guide.description1.6")}</li>
                    </ul>
                    <ul className="grid grid-cols-2 w-full list-disc gap-x-6 px-4 mt-4 text-text_royal_green">
                    <li className="col-span-2 mb-2 -mx-2 text-sm list-none">
                        {t("guide.description2.1")}
                    </li>
                    <li className="font-ravi">{t("guide.description2.2")}</li>
                    <li className="font-ravi">{t("guide.description2.3")}</li>
                    <li className="font-ravi">{t("guide.description2.4")}</li>
                    <li className="font-ravi">{t("guide.description2.5")}</li>
                    </ul>
                    <ul className="grid grid-cols-2 w-full list-disc gap-x-6 px-4 mt-4 text-text_royal_green">
                    <li className="col-span-2 mb-2 -mx-2 text-sm list-none">
                        {t("guide.description3.1")}
                    </li>
                    <li className="font-ravi">{t("guide.description3.2")}</li>
                    <li className="font-ravi">{t("guide.description3.3")}</li>
                    <li className="col-span-2 mt-2 text-gray-400 -mx-2 text-sm list-none">
                        {t("guide.description3.4")}
                    </li>
                    </ul>
                    <ul className="grid grid-cols-2 w-full list-disc gap-x-6 px-4 mt-4 text-text_royal_green">
                    <li className="font-ravi">{t("guide.description3.5")}</li>
                    <li className="font-ravi">{t("guide.description3.6")}</li>
                    <li className="font-ravi">{t("guide.description3.7")}</li>
                    <li className="font-ravi">{t("guide.description3.8")}</li>
                    <li className="col-span-2 mt-2 mb-4 text-gray-400 -mx-2 text-sm list-none">
                        {t("guide.description3.9")}
                    </li>
                    </ul>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className={`absolute opacity-60 top-[-20px] xl:left-[250px] lg:left-[220px] w-[100%] z-[-1px] ${isRTL? "" : "scale-x-[-1]"}`}>
              <img src="./grouped.webp" alt="img" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guide;
