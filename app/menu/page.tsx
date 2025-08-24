"use client";
import FadeIn from "@/components/animation/FadeIn";
import SmoothScroll from "@/components/animation/SmoothScroll";
import Footer from "@/components/footer/Footer";
import { Menus } from "@/components/menu/menus";
import Navbar from "@/components/navbar/Navbar";

const page = () => {
  return (
    <SmoothScroll>
      <FadeIn>
        <Navbar />
        <Menus />
        <Footer />
      </FadeIn>
    </SmoothScroll>
  );
};

export default page;
