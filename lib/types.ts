export interface ExperienceEntry {
  company: string
  role: string
  period: string
  location: string
  bullets: string[]
  tags: string[]
}

export interface ProjectEntry {
  name: string
  description: string
  tags: string[]
  liveUrl: string
  repoUrl: string
}

export interface SkillGroup {
  category: string
  items: string[]
}

export interface EducationEntry {
  institution: string
  degree: string
  period: string
  note: string
}

export interface ResumeData {
  name: string
  title: string
  bio: string
  photo?: string          // base64 data URL, e.g. "data:image/jpeg;base64,..."
  contact: {
    email: string
    github: string
    linkedin: string
  }
  experience: ExperienceEntry[]
  projects: ProjectEntry[]
  skills: SkillGroup[]
  education: EducationEntry[]
}

export type TemplateId = 'minimal' | 'dark-dev' | 'bold' | 'developer' | 'designer' | 'editorial' | 'cinematic' | 'corporate' | 'student' | 'freelancer' | 'glass' | 'neon' | 'brutalist' | 'magazine'

export type SectionId = 'experience' | 'projects' | 'skills' | 'education' | 'contact'

export const DEFAULT_SECTION_ORDER: SectionId[] = [
  'experience',
  'projects',
  'skills',
  'education',
  'contact',
]

export interface PortfolioRecord {
  id: string
  user_id: string
  name: string
  resume_data: ResumeData
  template_id: TemplateId
  accent_color: string
  section_order: SectionId[]
  hidden_sections: SectionId[]
  github_repo: string | null
  deployment_url: string | null
  last_deployed_at: string | null
  view_count: number
  created_at: string
  updated_at: string
}

export interface AtsScore {
  score: number
  missing_keywords: string[]
  suggestions: string[]
}

export const TEMPLATE_COLORS: Record<TemplateId, { label: string; value: string }[]> = {
  minimal: [
    { label: 'Indigo', value: '#4f46e5' },
    { label: 'Emerald', value: '#059669' },
    { label: 'Rose', value: '#e11d48' },
    { label: 'Amber', value: '#d97706' },
    { label: 'Slate', value: '#475569' },
  ],
  'dark-dev': [
    { label: 'Green', value: '#22c55e' },
    { label: 'Cyan', value: '#06b6d4' },
    { label: 'Orange', value: '#f97316' },
    { label: 'Purple', value: '#a855f7' },
    { label: 'Pink', value: '#ec4899' },
  ],
  bold: [
    { label: 'Purple', value: '#7c3aed' },
    { label: 'Blue', value: '#2563eb' },
    { label: 'Red', value: '#dc2626' },
    { label: 'Teal', value: '#0d9488' },
    { label: 'Gold', value: '#ca8a04' },
  ],
  developer: [
    { label: 'Green', value: '#22c55e' },
    { label: 'Cyan', value: '#06b6d4' },
    { label: 'Purple', value: '#a855f7' },
    { label: 'Orange', value: '#f97316' },
    { label: 'Pink', value: '#ec4899' },
  ],
  designer: [
    { label: 'Indigo', value: '#4f46e5' },
    { label: 'Rose', value: '#e11d48' },
    { label: 'Amber', value: '#d97706' },
    { label: 'Teal', value: '#0d9488' },
    { label: 'Violet', value: '#7c3aed' },
  ],
  editorial: [
    { label: 'Ink', value: '#111827' },
    { label: 'Indigo', value: '#4f46e5' },
    { label: 'Crimson', value: '#b91c1c' },
    { label: 'Forest', value: '#166534' },
    { label: 'Slate', value: '#334155' },
  ],
  cinematic: [
    { label: 'Electric Blue', value: '#3b82f6' },
    { label: 'Amber', value: '#f59e0b' },
    { label: 'Violet', value: '#8b5cf6' },
    { label: 'Emerald', value: '#10b981' },
    { label: 'Rose', value: '#f43f5e' },
  ],
  corporate: [
    { label: 'Indigo', value: '#4f46e5' },
    { label: 'Blue', value: '#2563eb' },
    { label: 'Teal', value: '#0d9488' },
    { label: 'Slate', value: '#475569' },
    { label: 'Emerald', value: '#059669' },
  ],
  student: [
    { label: 'Violet', value: '#7c3aed' },
    { label: 'Rose', value: '#e11d48' },
    { label: 'Sky', value: '#0284c7' },
    { label: 'Emerald', value: '#059669' },
    { label: 'Orange', value: '#ea580c' },
  ],
  freelancer: [
    { label: 'Amber', value: '#d97706' },
    { label: 'Indigo', value: '#4f46e5' },
    { label: 'Emerald', value: '#059669' },
    { label: 'Rose', value: '#e11d48' },
    { label: 'Cyan', value: '#0891b2' },
  ],
  glass: [
    { label: 'Violet', value: '#8b5cf6' },
    { label: 'Cyan', value: '#06b6d4' },
    { label: 'Rose', value: '#f43f5e' },
    { label: 'Emerald', value: '#10b981' },
    { label: 'Amber', value: '#f59e0b' },
  ],
  neon: [
    { label: 'Cyan', value: '#00e5ff' },
    { label: 'Green', value: '#00ff88' },
    { label: 'Purple', value: '#bf00ff' },
    { label: 'Pink', value: '#ff00aa' },
    { label: 'Orange', value: '#ff6600' },
  ],
  brutalist: [
    { label: 'Yellow', value: '#f5c400' },
    { label: 'Red', value: '#e3001b' },
    { label: 'Cyan', value: '#00b8d9' },
    { label: 'Lime', value: '#8be04e' },
    { label: 'Orange', value: '#ff5c00' },
  ],
  magazine: [
    { label: 'Crimson', value: '#b91c1c' },
    { label: 'Indigo', value: '#4f46e5' },
    { label: 'Forest', value: '#166534' },
    { label: 'Slate', value: '#334155' },
    { label: 'Amber', value: '#92400e' },
  ],
}

export const TEMPLATE_LABELS: Record<TemplateId, string> = {
  minimal: 'Minimal',
  'dark-dev': 'Dark Dev',
  bold: 'Bold',
  developer: 'Developer',
  designer: 'Designer',
  editorial: 'Editorial',
  cinematic: 'Cinematic',
  corporate: 'Corporate',
  student: 'Student',
  freelancer: 'Freelancer',
  glass: 'Glass',
  neon: 'Neon',
  brutalist: 'Brutalist',
  magazine: 'Magazine',
}
