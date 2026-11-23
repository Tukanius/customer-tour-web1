import type { Metadata } from "next";
import { Figtree, Newsreader } from "next/font/google";
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
  title: "Azure Skyland — Private journeys in Mongolia",
  description:
    "Azure Skyland plans private 4x4 expeditions, ger camps, and nomad homestays across Mongolia’s Gobi, Altai, central grasslands, and northern lakes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <a
          href="#destinations"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-azure focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to destinations
        </a>
        <TripProvider>{children}</TripProvider>
      </body>
    </html>
  );
}
