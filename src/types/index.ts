export type ContentSection =
  | "hero"
  | "stats"
  | "whyus"
  | "testimonials"
  | "faq"
  | "footer";

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
}

export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
  path: string;
}

export interface HeroContent {
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  imageUrl: string;
}

export interface StatItem {
  label: string;
  value: number;
  suffix: string;
}

export interface StatsContent {
  items: StatItem[];
}

export interface WhyUsItem {
  title: string;
  description: string;
  icon: string;
}

export interface WhyUsContent {
  heading: string;
  items: WhyUsItem[];
}

export interface TestimonialItem {
  name: string;
  location: string;
  quote: string;
  rating: number;
  avatarUrl: string;
}

export interface TestimonialsContent {
  heading: string;
  googleRating: number;
  googleReviews: number;
  items: TestimonialItem[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqContent {
  heading: string;
  items: FaqItem[];
}

export interface FooterContent {
  aboutText: string;
  quickLinks: { label: string; to: string }[];
  certifications: string[];
}

export type SectionContent =
  | HeroContent
  | StatsContent
  | WhyUsContent
  | TestimonialsContent
  | FaqContent
  | FooterContent;

export interface SiteContent {
  section: ContentSection;
  content: SectionContent;
  updatedAt: string;
}

export interface MediaAsset {
  id: number;
  url: string;
  publicId: string;
  type: "image" | "video";
  title: string;
  uploadedAt: string;
}

export interface Lead {
  id: number;
  name: string;
  phone: string;
  pincode: string;
  monthlyBill: number;
  message: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
}

export interface LeadRequest {
  name: string;
  phone: string;
  pincode: string;
  monthlyBill: number;
  message: string;
}

export interface CalculatorRequest {
  pincode: string;
  monthlyBill: number;
}

export interface CalculatorResult {
  serviceable: boolean;
  systemSizeKw: number;
  subsidy: number;
  systemCost: number;
  netCost: number;
  monthlySavings: number;
  annualSavings: number;
  paybackYears: number;
  co2OffsetTonnes: number;
}

export interface SubsidySlab {
  minKw: number;
  maxKw: number;
  amount: number;
}

export interface CalculatorSettings {
  tariffPerUnit: number;
  sunHoursPerDay: number;
  costPerKw: number;
  subsidySlabs: SubsidySlab[];
  servicePincodes: string[];
}

export interface AdminUser {
  id: number;
  username: string;
  role: "ADMIN" | "EDITOR";
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

export interface ContentUpdateRequest {
  section: ContentSection;
  content: SectionContent;
}