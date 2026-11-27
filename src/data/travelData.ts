import type { AboutContent, ContactContent, SiteCopy } from "@/types/travel";

export const aboutContent: AboutContent = {
  eyebrow: "About Us",
  title: "About Us",
  lede:
    "Nomad Atlas is a Mongolian expedition studio. We plan private travel — not bus groups — across the Gobi, the Altai, the central steppe, and the northern lakes.",
  mission: [
    "The work is slow travel with herder families, protected-area permits, and vehicles we maintain ourselves. Groups stay small on purpose. If a route needs a second car, we send one. If the weather turns, we change the day rather than the photograph.",
    "We are based in the capital and spend the season on the road: dune camps in the south, horse country in the west, grassland rivers in the Khangai, and larch shores on Khuvsgul. The atlas is a working map, not a brochure of borrowed pictures.",
  ],
  reasonsEyebrow: "Why travel with us",
  reasonsTitle: "Why travel with us",
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
  stepsTitle: "How a trip is made",
  steps: [
    {
      number: 1,
      title: "Choose route and places",
      body: "Pick a published tour, a region, or a handful of destinations, then write to the desk from Plan My Trip.",
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
  eyebrow: "Contact Us",
  title: "Contact Us",
  lede: "Contact us for tour inquiries, car rentals, or general questions.",
  channels: {
    email: {
      label: "Email",
      display: "hello@nomadatlas.example",
      href: "mailto:hello@nomadatlas.example",
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
    submitLabel: "Send",
    confirmEyebrow: "Message sent",
    confirmTitle: "Thank you, {name}. We will write back within a day.",
    confirmBody: "We received your message.",
    confirmPendingBody:
      "Your message could not be sent. Please try WhatsApp or email.",
    editLabel: "Edit message",
  },
  errors: {
    name: "Please enter your full name.",
    contact: "Add an email or phone number.",
    email: "Please enter a valid email.",
    topic: "Please choose a topic.",
    message: "Please add a short message.",
  },
};

export const siteCopy: SiteCopy = {
  footerBlurb: "Tours, destinations, and car rental in Mongolia.",
  footerMapLabel: "Links",
  footerDeskLabel: "Contact",
  copyright: "© 2026 Nomad Atlas. All rights reserved.",
  footerLinks: [
    { href: "/", label: "Home" },
    { href: "/tours", label: "Tours" },
    { href: "/destinations", label: "Destinations" },
    { href: "/car-rent", label: "Car Rental" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
  ],
};
