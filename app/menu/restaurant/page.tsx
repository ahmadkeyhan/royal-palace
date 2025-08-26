"use client"

import MenuCategories from "@/components/menu/menuCategories";
import Navbar from "@/components/navbar/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/footer/Footer";


export default function RestaurantMenu() {
  const {isRTL} = useLanguage()
  return (
    <main className="min-h-screen relative bg-regal_green">
      <Navbar />
      <div className="container min-h-screen px-4 py-6 mx-auto max-w-3xl">
        <section className="space-y-4"> 
          <div className="flex justify-center items-center gap-2 mb-2 py-4">
            <h1 className="text-4xl font-bold text-golden_yellow">{isRTL? "منوی رستوران" : "RESTAURANT MENU"}</h1>
          </div>
          <MenuCategories menu="restaurant" />
          
        </section>
      </div>
      <div className="sticky py-4 px-12 w-full text-center bottom-0 bg-regal_green/70 backdrop-blur-sm text-off-white font-ravi text-sm">{isRTL? "به مبالغ فوق ۱۰ درصد مالیات بر ارزش افزوده اضافه خواهد شد." : "10% VAT will be added to the above prices."}</div>
        <Footer />
    </main>
  );
}

