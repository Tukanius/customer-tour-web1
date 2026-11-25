export interface AboutCard {
  title: string;
  body: string;
}

export interface AboutStep {
  number: number;
  title: string;
  body: string;
}

export interface AboutContent {
  eyebrow: string;
  title: string;
  lede: string;
  mission: string[];
  reasonsEyebrow: string;
  reasonsTitle: string;
  reasons: AboutCard[];
  stepsEyebrow: string;
  stepsTitle: string;
  steps: AboutStep[];
}

export type InquiryTopicId = "custom-tour" | "car-rental" | "general";

export interface InquiryTopic {
  id: InquiryTopicId;
  label: string;
}

export interface ContactChannel {
  label: string;
  display: string;
  href: string;
}

export interface ContactOffice {
  label: string;
  lines: string[];
  hours: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface FooterLink {
  href: string;
  label: string;
}

export interface ContactContent {
  eyebrow: string;
  title: string;
  lede: string;
  channels: {
    phone: ContactChannel;
    email: ContactChannel;
    whatsapp: ContactChannel;
  };
  office: ContactOffice;
  social: SocialLink[];
  topics: InquiryTopic[];
  form: {
    nameLabel: string;
    contactLabel: string;
    contactHint: string;
    topicLabel: string;
    topicPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitLabel: string;
    confirmEyebrow: string;
    confirmTitle: string;
    confirmBody: string;
    confirmPendingBody: string;
    editLabel: string;
  };
  errors: {
    name: string;
    contact: string;
    email: string;
    topic: string;
    message: string;
  };
}

export interface SiteCopy {
  footerBlurb: string;
  footerMapLabel: string;
  footerDeskLabel: string;
  copyright: string;
  footerLinks: FooterLink[];
  subNav: FooterLink[];
}
