import type { Metadata } from "next";
import localFont from "next/font/local"
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { LanguageProvider } from "@/contexts/LanguageContext"
import { LayoutWrapper } from "@/components/layout-wrapper"

const doran = localFont({
  src: [
    {
      path: "../public/fonts/Doran-Medium.otf",
      weight: '400',
      style: 'normal'
    }
  ],
  variable: "--font-doran",
  display: 'swap'
})

export const metadata: Metadata = {
  title: "BankHotel",
  description: "Developed by Web Wizard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </head>
      <body className={doran.variable}>
        <StoreProvider>
            <LanguageProvider>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </LanguageProvider>
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
