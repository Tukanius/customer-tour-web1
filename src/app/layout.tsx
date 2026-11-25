import type { Metadata, Viewport } from "next";
import { Figtree, Newsreader } from "next/font/google";
import { Suspense } from "react";
import { DestinationSheetProvider } from "@/components/DestinationSheet";
import { Footer } from "@/components/Footer";
import { GlobalContactActions } from "@/components/GlobalContactActions";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nomad Atlas — Private journeys in Mongolia",
    template: "%s · Nomad Atlas",
  },
  description:
    "Nomad Atlas plans private 4x4 expeditions, ger camps, and nomad homestays across Mongolia’s Gobi, Altai, central grasslands, and northern lakes.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-ocean focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <DestinationSheetProvider>
          <Suspense fallback={<div className="h-16 sm:h-[4.25rem]" />}>
            <Navbar />
          </Suspense>
          <div className="h-16 shrink-0 sm:h-[4.25rem]" aria-hidden="true" />
          <main id="main" className="flex-1 pb-[calc(var(--dock-h)+0.75rem)] md:pb-8">
            {children}
          </main>
          <Footer />
          <Suspense fallback={null}>
            <GlobalContactActions />
          </Suspense>
        </DestinationSheetProvider>
      </body>
    </html>
  );
}
