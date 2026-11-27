import type { Metadata } from "next";
import { AboutSection } from "@/components/AboutSection";
import { uiCopy } from "@/data/uiCopy";

export const metadata: Metadata = {
  title: uiCopy.about.title,
  description: uiCopy.about.lede,
};

export default function AboutPage() {
  return <AboutSection />;
}
