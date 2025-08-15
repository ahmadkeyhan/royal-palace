import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { LanguageProvider } from "@/contexts/LanguageContext"
import { LayoutWrapper } from "@/components/layout-wrapper"

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
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
