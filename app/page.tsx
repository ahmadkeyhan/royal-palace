"use client";
import React from "react";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import HeroHeader from "@/components/home/heroHeader/HeroHeader";
import HeroImage from "@/components/home/heroImage/HeroImage";
import About_us from "@/components/home/home_about_us/About_us";
import FadeIn from "@/components/animation/FadeIn";
import SmoothScroll from "@/components/animation/SmoothScroll";
import Guide from "@/components/home/guide";
import Comments from "@/components/home/comments";
import LoginForm from "@/components/auth/login-form";

export default function Home() {
  return (
    <SmoothScroll>
      <FadeIn>
        <Navbar />
        <div className="bg-regal_green min-h-screen">
          <HeroHeader />
          <HeroImage />
        </div>
        <Guide />
        <LoginForm />
        <Comments />
        <About_us />
        <Footer />
      </FadeIn>
    </SmoothScroll>
  );
}
