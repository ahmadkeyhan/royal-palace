import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export const Menus = () => {
    const {t, isRTL} = useLanguage()
  return (
    <div className="w-full bg-regal_green h-[calc(100vh-177px)] flex flex-col">
      <Link href="/menu/cafe" className="h-full w-full text-off-white bg-teal-700 flex flex-col gap-4 grow justify-center items-center">
        <h2 className="font-bold text-5xl">{isRTL? "منوی" : "CAFE"}</h2>
        <h2 className="font-bold text-5xl">{isRTL? "کافــــه" : "MENU"}</h2>
      </Link>

      <Link href="/menu/restaurant" className="h-full w-full flex flex-col gap-4 grow justify-center items-center text-golden_yellow">
        <h2 className="font-bold text-5xl">{isRTL? "منوی" : "RESTAURANT"}</h2>
        <h2 className="font-bold text-5xl">{isRTL? "رستوران" : "MENU"}</h2>
      </Link>
    </div>
  );
};
