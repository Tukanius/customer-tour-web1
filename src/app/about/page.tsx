import type { Metadata } from "next";
import { AboutSection } from "@/components/AboutSection";

export const metadata: Metadata = {
  title: "About",
  description:
    "Nomad Atlas is a Mongolian expedition studio. We plan private travel across the Gobi, the Altai, the central steppe, and the northern lakes.",
};

export default function AboutPage() {
  return <AboutSection />;
}
