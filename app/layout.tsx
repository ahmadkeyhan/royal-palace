import type { Metadata } from "next";
import localFont from "next/font/local"
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { LanguageProvider } from "@/contexts/LanguageContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { LayoutWrapper } from "@/components/layout-wrapper"

const doran = localFont({
  src: [
    {
      path: "../public/fonts/doran/Doran-Thin.otf",
      weight: '100',
      style: 'normal'
    },
    {
      path: "../public/fonts/doran/Doran-Regular.otf",
      weight: '200',
      style: 'normal'
    },
    {
      path: "../public/fonts/doran/Doran-Light.otf",
      weight: '300',
      style: 'normal'
    },
    {
      path: "../public/fonts/doran/Doran-Medium.otf",
      weight: '400',
      style: 'normal'
    },
    {
      path: "../public/fonts/doran/Doran-Bold.otf",
      weight: '500',
      style: 'normal'
    },
    {
      path: "../public/fonts/doran/Doran-ExtraBold.otf",
      weight: '600',
      style: 'normal'
    },
    {
      path: "../public/fonts/doran/Doran-Black.otf",
      weight: '700',
      style: 'normal'
    },
    {
      path: "../public/fonts/doran/Doran-ExtraBlack.otf",
      weight: '800',
      style: 'normal'
    },
  ],
  variable: "--font-doran",
  display: 'swap'
})

const miracle = localFont({
  src: [
    {
      path: "../public/fonts/Miracle400.otf",
      weight: '400',
      style: 'normal'
    }
  ],
  variable: "--font-miracle",
  display: 'swap'
})

const ravi = localFont({
  src: [
    {
      path: "../public/fonts/ravi/Ravi-Regular.otf",
      weight: '200',
      style: 'normal'
    }
  ],
  variable: "--font-ravi",
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
      <body className={`${doran.variable} ${miracle.variable} ${ravi.variable}`}>
        <StoreProvider>
            <LanguageProvider>
              <AuthProvider>
                <LayoutWrapper>
                  {children}
                </LayoutWrapper>
              </AuthProvider>
            </LanguageProvider>
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
