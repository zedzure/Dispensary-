import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Inter, Belleza } from 'next/font/google';
import { Providers } from "./providers";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const belleza = Belleza({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-cursive',
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
    <html lang="en" className={`${inter.variable} ${belleza.variable}`}>
      <body className="font-sans antialiased">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
