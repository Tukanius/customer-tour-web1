import type { AboutContent, ContactContent, SiteCopy } from "@/types/travel";

export const aboutContent: AboutContent = {
  eyebrow: "About",
  title: "A small desk in Ulaanbaatar, and a lot of empty kilometres.",
  lede:
    "Nomad Atlas is a Mongolian expedition studio. We plan private travel — not bus groups — across the Gobi, the Altai, the central steppe, and the northern lakes.",
  mission: [
    "The work is slow travel with herder families, protected-area permits, and vehicles we maintain ourselves. Groups stay small on purpose. If a route needs a second car, we send one. If the weather turns, we change the day rather than the photograph.",
    "We are based in the capital and spend the season on the road: dune camps in the south, horse country in the west, grassland rivers in the Khangai, and larch shores on Khuvsgul. The atlas is a working map, not a brochure of borrowed pictures.",
  ],
  reasonsEyebrow: "Why travel with us",
  reasonsTitle: "Local hands, a flexible line, and a clear price.",
  reasons: [
    {
      title: "Local guides and drivers",
      body: "The person at the wheel knows the washouts, the ger camps, and when to turn around. We hire in Mongolia and keep the same team on your route.",
    },
    {
      title: "Flexible custom routes",
      body: "Packages are a starting sketch. You can drop a day, add a family stay, or join the Gobi to the lakes. The itinerary follows the group, not a printed date.",
    },
    {
      title: "Nomad family and ger camp stays",
      body: "Nights are with herder families when they have space, or in simple tourist gers where the landscape needs a stove and a bed, not a hotel wing.",
    },
    {
      title: "Transparent group pricing",
      body: "Per-person rates fall as the group grows, from solo to six. Included and not-included lists sit on every tour page before you write to us.",
    },
  ],
  stepsEyebrow: "How a trip is made",
  stepsTitle: "Three steps from a month to a road.",
  steps: [
    {
      number: 1,
      title: "Choose route and places",
      body: "Pick a package, a region, or a handful of destinations. Add them to a trip request so we can see the shape of the journey.",
    },
    {
      number: 2,
      title: "Customize the itinerary",
      body: "We reply with days, camps, and a price. You change the pace, the vehicle, or the overnight. Nothing is booked until you approve the sketch.",
    },
    {
      number: 3,
      title: "Travel with support",
      body: "A driver-guide, fuel, permits, and a desk in Ulaanbaatar if the weather or a river asks for a new line.",
    },
  ],
};

export const contactContent: ContactContent = {
  eyebrow: "Contact",
  title: "Write from the road, or from your kitchen table.",
  lede:
    "A planner replies by email or WhatsApp. Use the form for a custom tour, a 4x4, or a general question.",
  channels: {
    phone: {
      label: "Phone",
      display: "+976 11 000 000",
      href: "tel:+97611000000",
    },
    email: {
      label: "Email",
      display: "hello@nomadatlas.example",
      href: "mailto:hello@nomadatlas.example",
    },
    whatsapp: {
      label: "WhatsApp",
      display: "+976 99 000 000",
      href: "https://wa.me/97699000000",
    },
  },
  office: {
    label: "Ulaanbaatar office",
    lines: ["Chinggis Avenue", "Sukhbaatar District", "Ulaanbaatar, Mongolia"],
    hours: "Monday–Friday, 09:00–18:00 (ULAT). Weekends by appointment.",
  },
  social: [
    { label: "Instagram", href: "https://www.instagram.com" },
    { label: "Facebook", href: "https://www.facebook.com" },
    { label: "Telegram", href: "https://t.me" },
  ],
  topics: [
    { id: "custom-tour", label: "Custom Tour" },
    { id: "car-rental", label: "Car Rental" },
    { id: "general", label: "General Question" },
  ],
  form: {
    nameLabel: "Full name",
    contactLabel: "Email or phone / WhatsApp",
    contactHint: "One way to reply is enough.",
    topicLabel: "Topic",
    topicPlaceholder: "Choose a topic",
    messageLabel: "Message",
    messagePlaceholder: "Dates, group size, places, or the vehicle you have in mind…",
    submitLabel: "Send inquiry",
    confirmEyebrow: "Inquiry received",
    confirmTitle: "Thank you, {name}. We will write back within a day.",
    confirmBody: "Your note reached the desk.",
    confirmPendingBody:
      "No public inquiry endpoint is on the API yet. This page validated your note; nothing was sent.",
    editLabel: "Edit inquiry",
  },
  errors: {
    name: "Please enter your full name.",
    contact: "Add an email or a phone / WhatsApp number.",
    email: "That email does not look complete.",
    topic: "Choose a topic.",
    message: "Please add a short message.",
  },
};

export const siteCopy: SiteCopy = {
  footerBlurb:
    "Private journeys across Mongolia. Destinations, tours, and vehicles come from the live operator desk.",
  footerMapLabel: "Map",
  footerDeskLabel: "Desk",
  copyright:
    "© 2026 Nomad Atlas. All rights reserved. Placeholder brand for demonstration.",
  footerLinks: [
    { href: "/destinations", label: "Destinations" },
    { href: "/tours", label: "Tours" },
    { href: "/car-rent", label: "Car Rent" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/#trip-request", label: "Plan a trip" },
  ],
  subNav: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
};
