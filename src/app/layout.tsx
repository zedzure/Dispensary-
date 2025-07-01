import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { PT_Sans, Belleza } from 'next/font/google';
import { Providers } from "./providers";

const ptSans = PT_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pt-sans',
  weight: ['400', '700'],
});

const belleza = Belleza({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-belleza',
  weight: '400',
});

export const metadata: Metadata = {
  title: "GreenLeaf Guide",
  description: "Your friendly guide to cannabis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ptSans.variable} ${belleza.variable}`}>
      <body className="font-sans antialiased">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
