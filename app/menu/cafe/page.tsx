"use client"

import MenuCategories from "@/components/menu/menuCategories";
import Navbar from "@/components/navbar/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";


export default function CafeMenu() {
  const {isRTL} = useLanguage()
  return (
    <main className="min-h-screen bg-teal-700">
      <Navbar />
      <div className="container px-4 py-6 mx-auto max-w-3xl">
        <section className="space-y-4"> 
          <div className="flex justify-center items-center text-qqteal gap-2 mb-2 py-4">
            <h1 className="text-4xl font-bold text-off-white">{isRTL? "منوی کافه" : "CAFE MENU"}</h1>
          </div>
          <MenuCategories />
          
        </section>
      </div>
    </main>
  );
}

