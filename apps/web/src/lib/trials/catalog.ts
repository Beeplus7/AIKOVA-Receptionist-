export type TrialCategoryId =
  | 'estate-agents'
  | 'trades'
  | 'clinics'
  | 'restaurants'
  | 'salons'

export type TrialCategory = {
  id: TrialCategoryId
  slug: TrialCategoryId
  name: string
  short: string
  icon: string
  heroMiss: string
  headline: string
  blurb: string
  pain: string[]
  languages: string
  transcript: { from: 'ai' | 'user'; text: string }[]
  features: string[]
  linkedinTag: string
  metaTitle: string
  metaDescription: string
}

export const TRIAL_CATEGORIES: TrialCategory[] = [
  {
    id: 'estate-agents',
    slug: 'estate-agents',
    name: 'UK Estate Agents',
    short: 'Estate Agents',
    icon: '🏠',
    heroMiss: 'Viewing',
    headline: 'AI Receptionist for UK Estate Agents — Never Miss a Viewing',
    blurb: 'Qualify buyers and tenants 24/7, book viewings, and send brochure links while your negotiators are on the road.',
    pain: [
      'Missed evening/weekend calls = lost applicants and sellers',
      'Branch phones ring out during accompanied viewings',
      'Same FAQs (fees, EPC, parking) burn agent time',
    ],
    languages: 'English · Polish · Portuguese',
    transcript: [
      { from: 'ai', text: 'Good afternoon — Northline Estates. AiKOVA speaking. Are you calling about a property to view or to book a valuation?' },
      { from: 'user', text: 'The 2-bed on Camberwell Road — can I view Saturday?' },
      { from: 'ai', text: 'I have Saturday 11:00 or 14:30. Shall I hold 11:00 and text the details + parking notes?' },
      { from: 'user', text: '11 works — please text me' },
      { from: 'ai', text: 'Booked. Confirmation + brochure link on WhatsApp. Anything else — chain status or service charge?' },
    ],
    features: ['Viewing booking', 'Property FAQs', 'WhatsApp brochure links', 'Multilingual applicants', 'UK GDPR'],
    linkedinTag: 'ESTATE',
    metaTitle: 'AI Receptionist for Estate Agents UK | Aikova',
    metaDescription: 'Never miss a viewing. AiKOVA answers calls and WhatsApp for UK estate agents — book viewings in 10 minutes. 14-day free trial.',
  },
  {
    id: 'trades',
    slug: 'trades',
    name: 'Trades — Plumbers / Electricians / Builders',
    short: 'Trades',
    icon: '🔧',
    heroMiss: 'Job',
    headline: 'AI Receptionist for Trades — Never Miss a Job',
    blurb: 'Capture emergency and quote calls while you are on site. Book slots, take photos via WhatsApp, send deposit links.',
    pain: [
      'Van / loft / wet hands = missed emergency call-outs',
      'Quote chasers clog the phone during paid jobs',
      'No-shows waste travel time without deposits',
    ],
    languages: 'English · Polish · Romanian',
    transcript: [
      { from: 'ai', text: 'Hello — Apex Plumbing. AiKOVA here. Is this an emergency leak or a quote booking?' },
      { from: 'user', text: 'Boiler not firing — can someone come today?' },
      { from: 'ai', text: 'I can offer today 16:00–18:00 in SE5. Call-out £85 credited if we proceed. Shall I book and send a Pay-by-link deposit?' },
      { from: 'user', text: 'Yes book it' },
      { from: 'ai', text: 'Booked 16:00. Stripe deposit link on WhatsApp. Please send a photo of the boiler error if you can.' },
    ],
    features: ['Job booking', 'Emergency triage', 'Deposit links', 'WhatsApp photo intake', 'UK GDPR'],
    linkedinTag: 'TRADES',
    metaTitle: 'AI Receptionist for Trades UK | Aikova',
    metaDescription: 'Plumbers, electricians and builders — never miss a job call. AiKOVA books call-outs and deposits. 14-day free trial.',
  },
  {
    id: 'clinics',
    slug: 'clinics',
    name: 'Clinics — Dental / GP / Private',
    short: 'Clinics',
    icon: '🏥',
    heroMiss: 'Patient',
    headline: 'AI Receptionist for Clinics — Never Miss a Patient',
    blurb: 'Triage NHS vs private, book dental/GP slots, reduce no-shows with reminders — GDPR compliant.',
    pain: [
      'Reception queues = abandoned callbacks',
      'NHS vs private confusion creates angry repeats',
      'No-shows empty chairs without deposits/reminders',
    ],
    languages: 'English · Polish · Arabic · French',
    transcript: [
      { from: 'ai', text: 'Good morning — High Street Clinic. AiKOVA speaking. Dental, GP, or pharmacy query?' },
      { from: 'user', text: 'Private dental hygiene — earliest please' },
      { from: 'ai', text: 'Thursday 09:20 with Dr Patel or Friday 15:40. Hygiene is £75. Shall I reserve Thursday and send a Stripe deposit?' },
      { from: 'user', text: 'Thursday please' },
      { from: 'ai', text: 'Confirmed Thursday 09:20. Deposit link + prep notes on WhatsApp. GDPR logged.' },
    ],
    features: ['Appointment booking', 'NHS/private triage FAQs', 'Deposit links', 'Reminders', 'UK GDPR'],
    linkedinTag: 'CLINICS',
    metaTitle: 'AI Receptionist for Clinics UK | Aikova',
    metaDescription: 'Dental, GP and private clinics — never miss a patient call. GDPR-ready AI receptionist. 14-day free trial.',
  },
  {
    id: 'restaurants',
    slug: 'restaurants',
    name: 'Restaurants / Takeaways',
    short: 'Restaurants',
    icon: '🍽️',
    heroMiss: 'Order',
    headline: 'AI Receptionist for Restaurants — Never Miss an Order',
    blurb: 'Book tables, takeaways and allergy notes through the rush. WhatsApp confirmations and deposit links for large parties.',
    pain: [
      'Friday night phones unanswered = empty tables elsewhere',
      'Takeaway orders collide with floor service',
      'Large parties ghost without deposits',
    ],
    languages: 'English · French · Spanish · Yorùbá · Pidgin',
    transcript: [
      { from: 'ai', text: 'Good evening — The Garden. AiKOVA here. Table booking or takeaway?' },
      { from: 'user', text: 'Table for 4 at 7:30 tonight' },
      { from: 'ai', text: 'I can do 19:30 indoors. Any allergies? For parties of 4+ we can send a £20 Stripe deposit link.' },
      { from: 'user', text: 'One nut allergy — send deposit' },
      { from: 'ai', text: 'Booked 19:30 · 4 guests · nut allergy noted. Deposit link on WhatsApp. See you tonight.' },
    ],
    features: ['Table booking', 'Takeaway intake', 'Allergy notes', 'Deposit links', 'Multilingual · GDPR'],
    linkedinTag: 'RESTAURANTS',
    metaTitle: 'AI Receptionist for Restaurants UK | Aikova',
    metaDescription: 'Restaurants and takeaways — never miss a booking or order. Live in 10 minutes. 14-day free trial.',
  },
  {
    id: 'salons',
    slug: 'salons',
    name: 'Salons / Barbers / Beauty',
    short: 'Salons',
    icon: '💇',
    heroMiss: 'Appointment',
    headline: 'AI Receptionist for Salons — Never Miss an Appointment',
    blurb: 'Book colour, cuts and barber slots from Instagram DMs and missed calls. Deposits cut no-shows.',
    pain: [
      'Chair time lost while answering “how much balayage?”',
      'Instagram DMs at 11pm go cold by morning',
      'No-shows after long colour blocks',
    ],
    languages: 'English · Portuguese · French · Yorùbá',
    transcript: [
      { from: 'ai', text: 'Hi — Bloom Salon. AiKOVA here. Cut, colour, or barber?' },
      { from: 'user', text: 'Balayage Saturday morning?' },
      { from: 'ai', text: 'Balayage with Maya: Saturday 10:00 (3 hrs) · from £120. £30 deposit holds the chair — shall I send Stripe on WhatsApp?' },
      { from: 'user', text: 'Yes please' },
      { from: 'ai', text: 'Booked Saturday 10:00. Deposit + patch-test note sent. See you then.' },
    ],
    features: ['Appointment booking', 'Price FAQs', 'Instagram → book path', 'Deposit links', 'Multilingual · GDPR'],
    linkedinTag: 'SALONS',
    metaTitle: 'AI Receptionist for Salons UK | Aikova',
    metaDescription: 'Salons, barbers and beauty — never miss an appointment. Deposits + WhatsApp booking. 14-day free trial.',
  },
]

export function getTrial(slug: string): TrialCategory | undefined {
  return TRIAL_CATEGORIES.find((c) => c.slug === slug)
}
