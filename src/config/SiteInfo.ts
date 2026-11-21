export interface SiteStats {
  homesSolarized: number;
  mwInstalled: number;
  subsidyDeliveredCr: number;
  homesOnNationalPortal: number;
  googleRating: number;
  googleReviews: number;
  citiesCovered: number;
}

export interface SiteAddress {
  line1: string;
  line2: string;
  city: string;
  pincode: string;
  country: string;
  full: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  twitter: string;
}

export interface SiteInfo {
  name: string;
  legalName: string;
  tagline: string;
  shortDescription: string;
  logo: string;
  logoWhite: string;
  favicon: string;
  primaryColor: string;
  accentColor: string;
  email: string;
  supportEmail: string;
  phone: string;
  phoneRaw: string;
  whatsapp: string;
  whatsappRaw: string;
  workingHours: string;
  address: SiteAddress;
  social: SocialLinks;
  serviceAreas: string[];
  stats: SiteStats;
  certifications: string[];
  gstin: string;
  cin: string;
  foundedYear: number;
}

export interface NavLink {
  label: string;
  to: string;
}

export interface ContactCta {
  label: string;
  to: string;
}

export const SITE_INFO: SiteInfo = {
  name: "Arihant Electricals",
  legalName: "Arihant Electricals Pvt. Ltd.",
  tagline: "Bharat ki #1 Home Rooftop Solar Company",
  shortDescription:
    "Guaranteed savings. End-to-end care. Complete peace of mind with rooftop solar from Arihant Electricals.",

  logo: "/assets/arihant-logo.png",
  logoWhite: "/assets/arihant-logo-white.png",
  favicon: "/favicon.ico",
  primaryColor: "#0B6B3A",
  accentColor: "#F5A623",

  email: "kumbharsuraj108@gmail.com",
  supportEmail: "arihantelectricals159@gmail.com",
  phone: "+917774855501",
  phoneRaw: "917774855501",
  whatsapp: "+917774855501",
  whatsappRaw: "917774855501",
  workingHours: "Mon–Sat, 9:00 AM – 7:00 PM IST",

  address: {
    line1: "Arihant Electricals Pvt. Ltd.",
    line2: "Plot No. 24, Industrial Area Phase II",
    city: "Pune",
    pincode: "411026",
    country: "India",
    full: "Plot No. 24, Industrial Area Phase II, Pune 411026, India",
  },

  social: {
    facebook: "https://facebook.com/arihantelectricals",
    instagram: "https://instagram.com/arihantelectricals",
    youtube: "https://youtube.com/@arihantelectricals",
    linkedin: "https://linkedin.com/company/arihantelectricals",
    twitter: "https://twitter.com/arihant_elec",
  },

  serviceAreas: [
    "Pune",
    "Mumbai",
    "Nashik",
    "Nagpur",
    "Thane",
    "Aurangabad",
    "Kolhapur",
    "Solapur",
    "Amravati",
    "Navi Mumbai",
  ],

  stats: {
    homesSolarized: 25000,
    mwInstalled: 90,
    subsidyDeliveredCr: 120,
    homesOnNationalPortal: 25000,
    googleRating: 4.8,
    googleReviews: 15000,
    citiesCovered: 31,
  },

  certifications: [
    "UL Certified",
    "IIT Bombay Tested (WindPro Mount™)",
    "MNRE Empanelled",
    "ISO 9001:2015",
  ],

  gstin: "27ABCDE1234F1Z5",
  cin: "U40106MH2015PTC000000",

  foundedYear: 2015,
};

export const NAV_LINKS: NavLink[] = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Media", to: "/media" },
  { label: "Contact", to: "/contact" },
];

export const CONTACT_CTA: ContactCta = {
  label: "Get Free Quote",
  to: "/contact",
};