import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { SiteContent, SiteSetting } from '../types';

const key = (page: string) => ['content', page] as const;

const refreshedDefaultCopy: Record<string, Record<string, [string, string]>> = {
  home: {
    'hero.kicker': ['MADE FOR MAHARASHTRA', 'ROOFTOP SOLAR, MADE SIMPLE'],
    'hero.title': ['Bring the power of the sun home.', 'A brighter way to power your home.'],
    'hero.subtitle': [
      'Make your roof work harder. Arihant Electricals designs and installs solar systems that make everyday energy feel lighter.',
      'Explore rooftop solar designed around your home, with transparent guidance and a local team by your side from survey to switch-on.',
    ],
    'hero.cta': ['Get a free solar quote', 'Get a free solar consultation'],
    'hero.secondary_cta': ['Talk to our team', 'Chat with a solar expert'],
    'hero.caption': ['Thoughtful solar. Installed locally.', 'Your rooftop. Your clean energy.'],
    'intro.eyebrow': ['A SMARTER KIND OF ENERGY', 'SOLAR THAT WORKS FOR YOU'],
    'intro.title': ['More control over the energy you use.', 'Make your rooftop part of the solution.'],
    'intro.body': [
      'Good solar is more than panels on a roof. It is a system designed around your home, installed by people who know the work, and supported long after switch-on.',
      'From choosing the right system to getting it connected, our team makes the move to solar easier to understand. Get thoughtful recommendations, quality installation, and practical support at every step.',
    ],
    'services.eyebrow': ['What we do', 'OUR SOLAR SOLUTIONS'],
    'services.title': ['Everything you need to go solar.', 'Everything you need to make the switch.'],
    'services.subtitle': [
      'One local team for the details, the installation and the support that follows.',
      'From system planning and installation to paperwork and aftercare, get the support you need in one place.',
    ],
    'steps.eyebrow': ['FROM FIRST HELLO TO SWITCH-ON', 'YOUR SOLAR JOURNEY'],
    'steps.title': ['A clear path to solar.', 'From the first visit to clean power.'],
    'steps.subtitle': [
      'No guesswork, no getting passed around. We keep your project moving at every step.',
      'A straightforward process, with a dedicated team to guide you all the way.',
    ],
    'steps.step1.title': ['A quick site visit', 'Start with your roof'],
    'steps.step1.description': ['We check your roof, usage and the best direction for your panels.', 'We learn about your home, electricity use, and rooftop potential.'],
    'steps.step2.title': ['A system made for you', 'Get a clear plan'],
    'steps.step2.description': ['Get a clear design and quote, sized around your home and your bills.', 'See a system design and estimate tailored to your energy needs.'],
    'steps.step3.title': ['Installed with care', 'Installed by experts'],
    'steps.step3.description': ['Our trained crew fits quality equipment and gets your system connected.', 'Our team takes care of installation, connection, and commissioning.'],
    'steps.step4.title': ['We handle the paperwork', 'Support beyond switch-on'],
    'steps.step4.description': ['From net metering to eligible subsidy support, we guide every step.', 'Get help with documentation, net metering, and what comes next.'],
    'pricing.eyebrow': ['Simple, clear pricing', 'CLEAR PRICING'],
    'pricing.title': ['Find the right size for your home.', 'See what going solar could look like.'],
    'pricing.subtitle': [
      'Explore popular system sizes. We will confirm the right fit and final quote after a site survey.',
      'Compare popular system sizes and savings. We will help confirm the right fit for your home.',
    ],
    'testimonials.eyebrow': ['GOOD ENERGY, GOOD PEOPLE', 'FROM OUR CUSTOMERS'],
    'testimonials.title': ['A little sunshine goes a long way.', 'Good things happen when you go solar.'],
    'testimonials.subtitle': [
      'Homeowners across Maharashtra are making the switch with a team they can reach, trust and recommend.',
      'Hear from homeowners who have made clean energy part of their everyday lives.',
    ],
    'cta.eyebrow': ['YOUR ROOF IS READY WHEN YOU ARE', 'YOUR ROOFTOP CAN DO MORE'],
    'cta.title': ["Let's make your next bill a little brighter.", 'Let the sunshine work for you.'],
    'cta.subtitle': [
      'Start with a free site survey. We will help you understand your options, savings and next steps.',
      'Talk to our team about a rooftop assessment, the right system size, and your next steps.',
    ],
  },
  about: {
    'hero.title': ['About Arihant Electricals', 'Solar energy, made personal.'],
    'hero.subtitle': ['Powering Maharashtra with clean, affordable solar energy since 2015.', 'A local solar team helping homes and businesses make a confident switch to cleaner energy.'],
    'story.eyebrow': ['Our Story', 'OUR STORY'],
    'story.title': ['A Decade of Solar Excellence in Maharashtra', 'A dependable team for your move to solar.'],
    'intro.body': [
      "Arihant Electricals has been serving Maharashtra with end-to-end solar solutions — from site survey to subsidy disbursement. We've helped 500+ families and businesses switch to clean solar energy and cut their electricity bills by up to 90%.",
      'Arihant Electricals helps homes and businesses explore rooftop solar with practical advice, thoughtful system design, and hands-on installation support. We make the process easier to understand, from the first roof assessment to getting your system up and running.',
    ],
    'story.supporting_body': [
      "Our in-house documentation team makes the PM Surya Ghar subsidy process completely hassle-free — you don't need to visit any government office.",
      'Our team can also guide you through the documentation and coordination involved, so you have a clear point of contact throughout your solar journey.',
    ],
    'purpose.eyebrow': ['Our Purpose', 'WHAT GUIDES US'],
    'purpose.title': ['Mission & Vision', 'Good solar starts with good people.'],
    'purpose.subtitle': ['Why we do what we do', 'We believe clean energy should be simple to understand and dependable for the long run.'],
    'mission.body': ['Make solar energy affordable and accessible to every home and business in Maharashtra.', 'Help more households and businesses adopt rooftop solar with clear advice, dependable installation, and responsive support.'],
    'vision.body': ["Power 10,000+ rooftops with clean solar energy by 2030 and become Maharashtra's most trusted solar partner.", 'Build a future where clean rooftop energy is an easy, trusted choice for communities across Maharashtra.'],
    'why.items': [
      'End-to-end service\nIn-house documentation\nGenuine products\n5-year workmanship warranty',
      'Guidance from assessment to installation\nTransparent system recommendations\nQuality solar equipment\nSupport after your system is switched on',
    ],
    'team.title': ['The People Behind Arihant', 'The people behind your project.'],
    'team.subtitle': ['Experienced professionals committed to your solar journey', 'Real people, ready to help you make a confident switch to rooftop solar.'],
  },
  services: {
    'hero.title': ['Our Solar Services', 'Solar support, start to finish.'],
    'hero.subtitle': ['Complete solar solutions for Maharashtra — from installation to subsidy paperwork.', 'Explore the services that make planning, installing, and managing your rooftop solar system easier.'],
    'cta.title': ['Not sure which service you need?', 'Let’s find the right solar solution for you.'],
    'cta.subtitle': ["Talk to our experts — we'll guide you to the right solar solution.", 'Tell us a little about your home or business and our team will help you decide what to do next.'],
  },
  pricing: {
    'hero.title': ['Transparent Solar Pricing', 'Plan your solar investment with confidence.'],
    'hero.subtitle': ['Get government subsidy up to ₹78,000 under PM Surya Ghar Yojana. Prices shown are final cost after subsidy.', 'Explore system options, estimate your savings, and learn how eligible residential subsidies may apply.'],
    'calculator.title': ['Savings Calculator', 'Estimate your solar savings'],
    'calculator.subtitle': ['Enter your monthly electricity bill and see the recommended system.', 'Enter your usual monthly electricity bill to see an indicative system size and savings.'],
  },
  media: {
    'hero.title': ['Our Gallery', 'Rooftop solar in action.'],
    'hero.subtitle': ['Real projects, real installations — see our solar work across Maharashtra.', 'Browse solar projects, panels, and the clean-energy work happening across Maharashtra.'],
    'gallery.title': ['Installation Photos & Videos', 'A closer look at solar'],
    'gallery.subtitle': ['A visual showcase of our completed solar projects.', 'Explore installation highlights and real-world rooftop solar stories.'],
  },
  contact: {
    'hero.title': ['Get in Touch', 'Let’s talk about your solar plans.'],
    'hero.subtitle': ['Book a free site survey or ask us anything about solar.', 'Get clear answers, explore your rooftop options, or arrange a conversation with our solar team.'],
    'form.eyebrow': ['Send a Message', 'START A CONVERSATION'],
    'form.title': ['Book Free Site Survey', 'Request a solar consultation'],
  },
};

async function fetchContent(page: string): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .eq('page', page);
  if (error) throw error;

  const map: Record<string, string> = {};
  (data as SiteContent[] | null)?.forEach((c) => {
    map[`${c.section}.${c.key}`] = c.value ?? '';
  });

  if (page === 'home') {
    const { data: settings, error: settingsError } = await supabase
      .from('site_settings')
      .select('key,value')
      .in('key', [
        'eyebrow',
        'title',
        'subtitle',
        'step1.title',
        'step1.description',
        'step2.title',
        'step2.description',
        'step3.title',
        'step3.description',
        'step4.title',
        'step4.description',
      ]);
    if (settingsError) throw settingsError;

    const legacySteps: Record<string, string> = {};
    (settings as Pick<SiteSetting, 'key' | 'value'>[] | null)?.forEach((setting) => {
      legacySteps[setting.key] = setting.value ?? '';
    });
    if (Object.keys(legacySteps).some((key) => key.startsWith('step'))) {
      for (const [key, value] of Object.entries(legacySteps)) {
        const contentKey = `steps.${key}`;
        if (map[contentKey] === undefined) map[contentKey] = value;
      }
    }
  }

  for (const [contentKey, [previousCopy, refreshedCopy]] of Object.entries(refreshedDefaultCopy[page] ?? {})) {
    if (map[contentKey] === previousCopy) map[contentKey] = refreshedCopy;
  }

  return map;
}

export function useContent(page: string) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: key(page),
    queryFn: () => fetchContent(page),
  });

  const updateContents = useMutation({
    mutationFn: async (values: Record<string, string>) => {
      const rows = Object.entries(values).map(([contentKey, value]) => {
        const sep = contentKey.indexOf('.');
        if (sep < 1 || sep === contentKey.length - 1) {
          throw new Error(`Invalid site content key: ${contentKey}`);
        }
        return {
          page,
          section: contentKey.slice(0, sep),
          key: contentKey.slice(sep + 1),
          value,
          updated_at: new Date().toISOString(),
        };
      });
      if (!rows.length) return;
      const { error } = await supabase
        .from('site_content')
        .upsert(rows, { onConflict: 'page,section,key' });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key(page) }),
  });

  const updateContent = async (section: string, k: string, value: string) => {
    await updateContents.mutateAsync({ [`${section}.${k}`]: value });
  };

  return {
    content: query.data ?? {},
    loading: query.isLoading,
    error: query.error,
    updateContent,
    updateContents: updateContents.mutateAsync,
    reload: () => qc.invalidateQueries({ queryKey: key(page) }),
  };
}