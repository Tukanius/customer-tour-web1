import type { Metadata } from "next";
import { Figtree, Newsreader } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { TripProvider } from "@/components/TripProvider";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-azure focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <TripProvider>
          <Navbar />
          <div className="h-16 shrink-0 sm:h-[4.25rem]" aria-hidden="true" />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </TripProvider>
      </body>
    </html>
  );
}
