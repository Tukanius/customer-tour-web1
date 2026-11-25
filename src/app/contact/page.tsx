import type { Metadata } from "next";
import { ContactSection } from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Write to Nomad Atlas for a custom tour, a 4x4 rental, or a general question. Ulaanbaatar office with phone, email, and WhatsApp.",
};

export default function ContactPage() {
  return <ContactSection />;
}
