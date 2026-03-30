import { generateHTML } from '@/lib/templates/index'
import { DEFAULT_SECTION_ORDER } from '@/lib/types'
import type { ResumeData, TemplateId } from '@/lib/types'

const MOCK: ResumeData = {
  name: 'Alex Rivera',
  title: 'Senior Full-Stack Engineer',
  bio: 'I build fast, accessible products — from design systems to distributed backends. Five years shipping features at scale for millions of users.',
  contact: {
    email: 'alex@alexrivera.dev',
    github: 'https://github.com/alexrivera',
    linkedin: 'https://linkedin.com/in/alexrivera',
  },
  experience: [
    {
      company: 'Vercel',
      role: 'Senior Software Engineer',
      period: '2022 – Present',
      location: 'San Francisco, CA',
      bullets: [
        'Led the rebuild of the deployments dashboard, reducing p95 load time by 68%',
        'Shipped Edge Config from zero to 10,000+ customers in 3 months',
        'Mentored 4 engineers and ran weekly architecture reviews across 2 time zones',
      ],
      tags: ['Next.js', 'TypeScript', 'Edge Runtime', 'Go'],
    },
    {
      company: 'Stripe',
      role: 'Software Engineer II',
      period: '2020 – 2022',
      location: 'Remote',
      bullets: [
        'Built the Stripe Radar rules engine UI used by 250,000+ merchants globally',
        'Reduced fraud false-positive rate by 23% through improved ML signal features',
        'Designed the webhooks configuration system with a zero-downtime migration',
      ],
      tags: ['Ruby', 'React', 'Kafka', 'PostgreSQL'],
    },
  ],
  projects: [
    {
      name: 'OpenBoard',
      description:
        'Real-time collaborative whiteboard built on CRDTs. 2,000+ GitHub stars, featured on Hacker News front page.',
      tags: ['Rust', 'WebSockets', 'React', 'Yjs'],
      liveUrl: 'https://openboard.dev',
      repoUrl: 'https://github.com/alexrivera/openboard',
    },
    {
      name: 'Luma CLI',
      description:
        'Developer tool for managing multi-environment deployments with zero config. Adopted by 3 YC-backed companies.',
      tags: ['TypeScript', 'Node.js', 'CLI'],
      liveUrl: '',
      repoUrl: 'https://github.com/alexrivera/luma',
    },
    {
      name: 'Carta Design System',
      description:
        'Accessible component library with 60+ components. Cut design-to-code time by 40% across 3 product teams.',
      tags: ['React', 'Storybook', 'Radix UI', 'Tailwind'],
      liveUrl: 'https://carta.design',
      repoUrl: '',
    },
  ],
  skills: [
    { category: 'Languages',       items: ['TypeScript', 'Rust', 'Python', 'Go', 'Ruby'] },
    { category: 'Frontend',        items: ['React', 'Next.js', 'Tailwind CSS', 'Radix UI', 'Framer Motion'] },
    { category: 'Backend & Infra', items: ['Node.js', 'PostgreSQL', 'Redis', 'Kafka', 'Docker', 'AWS'] },
  ],
  education: [
    {
      institution: 'UC Berkeley',
      degree: 'B.S. Computer Science',
      period: '2016 – 2020',
      note: "GPA 3.9 · Dean's List · Teaching Assistant for CS61B",
    },
  ],
}

// First swatch of each template's TEMPLATE_COLORS palette
const ACCENT: Record<string, string> = {
  developer:  '#22c55e',
  minimal:    '#4f46e5',
  'dark-dev': '#22c55e',
  bold:       '#7c3aed',
  glass:      '#8b5cf6',
  neon:       '#00e5ff',
  editorial:  '#111827',
  magazine:   '#b91c1c',
  corporate:  '#2563eb',
  designer:   '#e11d48',
  cinematic:  '#3b82f6',
  student:    '#7c3aed',
  freelancer: '#d97706',
  brutalist:  '#f5c400',
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ templateId: string }> }
) {
  const { templateId } = await params
  const accent = ACCENT[templateId] ?? '#4f46e5'

  try {
    const html = generateHTML(
      MOCK,
      templateId as TemplateId,
      accent,
      DEFAULT_SECTION_ORDER,
      []
    )
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    })
  } catch {
    return new Response('<!doctype html><html><body style="font-family:sans-serif;padding:2rem;color:#888">Preview unavailable</body></html>', {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    })
  }
}
