export const BRAND = {
  name: 'FlowPilot',
  fullName: 'FlowPilot Automation',
  description:
    'Thoughtful websites, practical AI automation, and connected business systems. More room for what comes next.',
} as const;
export const CONTACT_LIMITS = {
  name: 100,
  email: 254,
  description: 4000,
  minDescription: 20,
  requestBytes: 16384,
  timeoutMs: 10000,
} as const;
export const SERVICES = [
  {
    id: 'websites',
    number: '01',
    title: 'Websites & landing pages',
    short: 'Websites',
    description: 'A better first impression. A clearer next step.',
    detail:
      'Fast, considered websites that explain what you do and make it easy for the right people to get in touch.',
    tags: ['Next.js websites', 'Landing pages', 'Responsive design'],
  },
  {
    id: 'automation',
    number: '02',
    title: 'AI workflow automation',
    short: 'AI Automation',
    description: 'Less repetition. More momentum.',
    detail:
      'Practical n8n workflows and AI APIs that help with enquiries, follow-ups, and the everyday work behind your business.',
    tags: ['n8n workflows', 'AI assistants', 'Lead routing'],
  },
  {
    id: 'integrations',
    number: '03',
    title: 'Business integrations',
    short: 'Integrations',
    description: 'Your tools, finally working together.',
    detail:
      'Connect your forms, inbox, CRM, and spreadsheets so information moves without the copy-and-paste routine.',
    tags: ['CRM connections', 'Email & forms', 'API integrations'],
  },
] as const;
export const SERVICE_OPTIONS = [
  ...SERVICES.map(({ id, short }) => ({ id, label: short })),
  { id: 'unsure', label: 'Not sure yet' },
];
export function getPublicContact() {
  const number = process.env.WHATSAPP_NUMBER?.trim() ?? '';
  const email = process.env.CONTACT_EMAIL?.trim() ?? '';
  const linkedin = process.env.LINKEDIN_URL?.trim() ?? '';
  return {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '',
    whatsapp: /^\d{7,15}$/.test(number)
      ? `https://wa.me/${number}?text=${encodeURIComponent('Hi FlowPilot, I would like to discuss a project.')}`
      : '',
    linkedin: /^https:\/\/(www\.)?linkedin\.com\//.test(linkedin)
      ? linkedin
      : '',
  };
}
