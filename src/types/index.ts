export interface SiteSetting {
  id: string;
  key: string;
  value: string | null;
}

export interface SiteContent {
  id: string;
  page: string;
  section: string;
  key: string;
  value: string | null;
}

export interface Media {
  id: string;
  title: string;
  description: string | null;
  type: 'image' | 'video';
  url: string;
  thumbnail_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Service {
  id: string;
  title: string;
  short_description: string | null;
  full_description: string | null;
  icon: string | null;
  image_url: string | null;
  features: string[] | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string | null;
  rating: number;
  message: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface PricingPlan {
  id: string;
  kw: number;
  system_type: string | null;
  total_cost: number;
  subsidy_amount: number;
  final_cost: number;
  monthly_savings: number | null;
  panels_count: number | null;
  area_required: string | null;
  is_popular: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface SolarBenefit {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  stat_value: string | null;
  stat_label: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}