import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { ThemeProvider } from "@/components/theme-provider";
import { CartSheet } from "@/components/cart-sheet";
import { FirebaseClientProvider } from "@/firebase";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const title = "GreenLeaf Guide | Local Dispensary Finder & Cannabis Deals";
const description =
  "Explore top-rated dispensaries in your area for delivery and pickup. GreenLeaf Guide is your ultimate cannabis marketplace to find reviews, the latest info, and unbeatable deals.";
const url = "https://dispensary-13773344-54196.web.app";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "dispensary finder",
    "cannabis delivery",
    "local dispensaries",
    "cannabis reviews",
    "dispensary deals",
    "cannabis marketplace",
    "weed pickup",
    "marijuana deals",
  ],
  metadataBase: new URL(url),
  manifest: "/manifest.json",
  openGraph: {
    title,
    description,
    url,
    siteName: "GreenLeaf Guide",
    images: [
      {
        url: '/favicon.png', // Relative URL to public folder
        width: 512,
        height: 512,
        alt: "GreenLeaf Guide - Dispensary Marketplace",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ['/favicon.png'], // Relative URL to public folder
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased flex flex-col h-full">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <FirebaseClientProvider>
            <Providers>
              {children}
              <Toaster />
              <CartSheet />
            </Providers>
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
