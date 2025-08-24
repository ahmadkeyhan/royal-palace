
import MenuCategories from "@/components/menu/menuCategories";
import Navbar from "@/components/navbar/Navbar";
import { Loader2, Snowflake, Hand,BookOpenText } from "lucide-react";

export default async function Home() {

  return (
    <main className="min-h-screen bg-off-white">
        <Navbar />
      <div className="container px-4 py-6 mx-auto max-w-3xl">
        <section className="space-y-4"> 
          <div className="flex justify-center items-center text-qqteal gap-2 mb-2">
            <h1 className="text-3xl font-bold text-teal-600">منوی کافه</h1>
          </div>
          <MenuCategories />
          
        </section>
      </div>
    </main>
  );
}

