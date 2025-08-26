"use client"

import MenuCategories from "@/components/menu/menuCategories";
import Navbar from "@/components/navbar/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/footer/Footer";

export default function CafeMenu() {
  const {isRTL} = useLanguage()
  return (
    <main className="min-h-screen relative bg-teal-700">
      <Navbar />
      <div className="container min-h-screen px-4 py-6 mx-auto max-w-3xl">
        <section className="space-y-4"> 
          <div className="flex justify-center items-center text-qqteal gap-2 mb-2 py-4">
            <h1 className="text-4xl font-bold text-off-white">{isRTL? "منوی کافه" : "CAFE MENU"}</h1>
          </div>
          <MenuCategories menu="cafe" />
          
        </section>
      </div>
      <div className="sticky py-4 px-12 w-full text-center bottom-0 bg-teal-700/70 backdrop-blur-sm text-off-white font-ravi text-sm">{isRTL? "به مبالغ فوق ۱۰ درصد مالیات بر ارزش افزوده اضافه خواهد شد." : "10% VAT will be added to the above prices."}</div>
        <Footer />
    </main>
  );
}

