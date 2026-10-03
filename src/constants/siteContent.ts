export type SiteContentPage = 'home' | 'about' | 'services' | 'pricing' | 'media' | 'contact';
export type SiteContentFieldKind = 'text' | 'multiline' | 'image';

export interface SiteContentField {
  section: string;
  key: string;
  label: string;
  kind?: SiteContentFieldKind;
}

export const SITE_CONTENT_PAGES: ReadonlyArray<{
  id: SiteContentPage;
  label: string;
}> = [
  { id: 'home', label: 'Home page' },
  { id: 'about', label: 'About page' },
  { id: 'services', label: 'Services page' },
  { id: 'pricing', label: 'Pricing page' },
  { id: 'media', label: 'Gallery page' },
  { id: 'contact', label: 'Contact page' },
];

export const SITE_CONTENT_FIELDS: Record<SiteContentPage, readonly SiteContentField[]> = {
  home: [
    { section: 'hero', key: 'kicker', label: 'Hero label' },
    { section: 'hero', key: 'title', label: 'Hero heading', kind: 'multiline' },
    { section: 'hero', key: 'subtitle', label: 'Hero description', kind: 'multiline' },
    { section: 'hero', key: 'cta', label: 'Hero button label' },
    { section: 'hero', key: 'secondary_cta', label: 'Hero secondary button label' },
    { section: 'hero', key: 'caption', label: 'Hero lower caption' },
    { section: 'stats', key: 'installation_label', label: 'Installations stat label' },
    { section: 'stats', key: 'capacity_label', label: 'Capacity stat label' },
    { section: 'stats', key: 'experience_label', label: 'Experience stat label' },
    { section: 'stats', key: 'subsidy_label', label: 'Subsidy stat label' },
    { section: 'hero', key: 'image', label: 'Hero background image', kind: 'image' },
    { section: 'intro', key: 'image_caption_title', label: 'Intro image caption title' },
    { section: 'intro', key: 'image_caption_subtitle', label: 'Intro image caption subtitle' },
    { section: 'intro', key: 'eyebrow', label: 'Intro eyebrow' },
    { section: 'intro', key: 'title', label: 'Intro heading', kind: 'multiline' },
    { section: 'intro', key: 'body', label: 'Intro description', kind: 'multiline' },
    { section: 'intro', key: 'image', label: 'Intro image', kind: 'image' },
    { section: 'services', key: 'eyebrow', label: 'Services eyebrow' },
    { section: 'services', key: 'title', label: 'Services heading' },
    { section: 'services', key: 'subtitle', label: 'Services description', kind: 'multiline' },
    { section: 'steps', key: 'eyebrow', label: 'Steps eyebrow' },
    { section: 'steps', key: 'title', label: 'Steps heading' },
    { section: 'steps', key: 'subtitle', label: 'Steps description', kind: 'multiline' },
    ...[1, 2, 3, 4].flatMap((number) => [
      { section: 'steps', key: `step${number}.title`, label: `Step ${number} title` },
      { section: 'steps', key: `step${number}.description`, label: `Step ${number} description`, kind: 'multiline' as const },
    ]),
    { section: 'pricing', key: 'eyebrow', label: 'Pricing eyebrow' },
    { section: 'pricing', key: 'title', label: 'Pricing heading' },
    { section: 'pricing', key: 'subtitle', label: 'Pricing description', kind: 'multiline' },
    { section: 'testimonials', key: 'eyebrow', label: 'Testimonials eyebrow' },
    { section: 'testimonials', key: 'title', label: 'Testimonials heading' },
    { section: 'testimonials', key: 'subtitle', label: 'Testimonials description', kind: 'multiline' },
    { section: 'cta', key: 'eyebrow', label: 'Final call-to-action eyebrow' },
    { section: 'cta', key: 'title', label: 'Final call-to-action heading', kind: 'multiline' },
    { section: 'cta', key: 'subtitle', label: 'Final call-to-action description', kind: 'multiline' },
    { section: 'cta', key: 'image', label: 'Final call-to-action image', kind: 'image' },
  ],
  about: [
    { section: 'hero', key: 'title', label: 'Page heading' },
    { section: 'hero', key: 'subtitle', label: 'Page description', kind: 'multiline' },
    { section: 'hero', key: 'image', label: 'Page banner image', kind: 'image' },
    { section: 'story', key: 'title', label: 'Story heading', kind: 'multiline' },
    { section: 'intro', key: 'body', label: 'Our story', kind: 'multiline' },
    { section: 'story', key: 'supporting_body', label: 'Supporting story', kind: 'multiline' },
    { section: 'story', key: 'image', label: 'Story image', kind: 'image' },
    { section: 'story', key: 'eyebrow', label: 'Story label' },
    { section: 'purpose', key: 'eyebrow', label: 'Purpose section label' },
    { section: 'purpose', key: 'title', label: 'Purpose section heading' },
    { section: 'purpose', key: 'subtitle', label: 'Purpose section description' },
    { section: 'mission', key: 'title', label: 'Mission heading' },
    { section: 'mission', key: 'body', label: 'Mission description', kind: 'multiline' },
    { section: 'vision', key: 'title', label: 'Vision heading' },
    { section: 'vision', key: 'body', label: 'Vision description', kind: 'multiline' },
    { section: 'why', key: 'title', label: 'Why choose us heading' },
    { section: 'why', key: 'items', label: 'Why choose us points (one per line)', kind: 'multiline' },
    { section: 'team', key: 'eyebrow', label: 'Team eyebrow' },
    { section: 'team', key: 'title', label: 'Team heading' },
    { section: 'team', key: 'subtitle', label: 'Team description', kind: 'multiline' },
    { section: 'certifications', key: 'eyebrow', label: 'Certifications eyebrow' },
    { section: 'certifications', key: 'title', label: 'Certifications heading' },
  ],
  services: [
    { section: 'hero', key: 'title', label: 'Page heading' },
    { section: 'hero', key: 'subtitle', label: 'Page description', kind: 'multiline' },
    { section: 'hero', key: 'image', label: 'Page banner image', kind: 'image' },
    { section: 'cta', key: 'title', label: 'Call-to-action heading' },
    { section: 'cta', key: 'subtitle', label: 'Call-to-action description', kind: 'multiline' },
    { section: 'cta', key: 'button', label: 'Call-to-action button label' },
  ],
  pricing: [
    { section: 'hero', key: 'title', label: 'Page heading' },
    { section: 'hero', key: 'subtitle', label: 'Page description', kind: 'multiline' },
    { section: 'hero', key: 'image', label: 'Page banner image', kind: 'image' },
    { section: 'calculator', key: 'title', label: 'Calculator heading' },
    { section: 'calculator', key: 'subtitle', label: 'Calculator description', kind: 'multiline' },
    { section: 'plans', key: 'eyebrow', label: 'Plans eyebrow' },
    { section: 'plans', key: 'title', label: 'Plans heading' },
    { section: 'plans', key: 'subtitle', label: 'Plans description', kind: 'multiline' },
    { section: 'subsidy', key: 'eyebrow', label: 'Subsidy section eyebrow' },
    { section: 'subsidy', key: 'title', label: 'Subsidy section heading' },
    { section: 'subsidy', key: 'subtitle', label: 'Subsidy section description', kind: 'multiline' },
    { section: 'cta', key: 'title', label: 'Call-to-action heading' },
    { section: 'cta', key: 'subtitle', label: 'Call-to-action description', kind: 'multiline' },
    { section: 'cta', key: 'button', label: 'Call-to-action button label' },
  ],
  media: [
    { section: 'hero', key: 'title', label: 'Page heading' },
    { section: 'hero', key: 'subtitle', label: 'Page description', kind: 'multiline' },
    { section: 'hero', key: 'image', label: 'Page banner image', kind: 'image' },
    { section: 'gallery', key: 'eyebrow', label: 'Gallery eyebrow' },
    { section: 'gallery', key: 'title', label: 'Gallery heading' },
    { section: 'gallery', key: 'subtitle', label: 'Gallery description', kind: 'multiline' },
  ],
  contact: [
    { section: 'hero', key: 'title', label: 'Page heading' },
    { section: 'hero', key: 'subtitle', label: 'Page description', kind: 'multiline' },
    { section: 'hero', key: 'image', label: 'Page banner image', kind: 'image' },
    { section: 'form', key: 'eyebrow', label: 'Form eyebrow' },
    { section: 'form', key: 'title', label: 'Form heading' },
    { section: 'form', key: 'success_message', label: 'Submission confirmation', kind: 'multiline' },
  ],
};
