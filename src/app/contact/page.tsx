import type { Metadata } from "next";
import { ContactSection } from "@/components/ContactSection";
import { uiCopy } from "@/data/uiCopy";

export const metadata: Metadata = {
  title: uiCopy.contact.title,
  description: uiCopy.contact.lede,
};

export default function ContactPage() {
  return <ContactSection />;
}
