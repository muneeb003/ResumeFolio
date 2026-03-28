import type { ResumeData, TemplateId, SectionId } from './types'

const KEYS = {
  resumeData: 'pf_resume_data',
  templateId: 'pf_template_id',
  accentColor: 'pf_accent_color',
  sectionOrder: 'pf_section_order',
  hiddenSections: 'pf_hidden_sections',
  portfolioId: 'pf_portfolio_id',
  githubRepo: 'pf_github_repo',
} as const

export function saveResumeData(data: ResumeData): void {
  localStorage.setItem(KEYS.resumeData, JSON.stringify(data))
}

export function loadResumeData(): ResumeData | null {
  try {
    const raw = localStorage.getItem(KEYS.resumeData)
    return raw ? (JSON.parse(raw) as ResumeData) : null
  } catch {
    return null
  }
}

export function saveDesign(params: {
  templateId: TemplateId
  accentColor: string
  sectionOrder: SectionId[]
  hiddenSections: SectionId[]
}): void {
  localStorage.setItem(KEYS.templateId, params.templateId)
  localStorage.setItem(KEYS.accentColor, params.accentColor)
  localStorage.setItem(KEYS.sectionOrder, JSON.stringify(params.sectionOrder))
  localStorage.setItem(KEYS.hiddenSections, JSON.stringify(params.hiddenSections))
}

export function loadDesign() {
  return {
    templateId: (localStorage.getItem(KEYS.templateId) as TemplateId) ?? 'minimal',
    accentColor: localStorage.getItem(KEYS.accentColor) ?? '#4f46e5',
    sectionOrder: JSON.parse(localStorage.getItem(KEYS.sectionOrder) ?? '["experience","projects","skills","education","contact"]') as SectionId[],
    hiddenSections: JSON.parse(localStorage.getItem(KEYS.hiddenSections) ?? '[]') as SectionId[],
  }
}

export function savePortfolioId(id: string): void {
  localStorage.setItem(KEYS.portfolioId, id)
}

export function loadPortfolioId(): string | null {
  return localStorage.getItem(KEYS.portfolioId)
}

export function saveGithubRepo(repo: string): void {
  localStorage.setItem(KEYS.githubRepo, repo)
}

export function loadGithubRepo(): string | null {
  return localStorage.getItem(KEYS.githubRepo)
}

export function clearAll(): void {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k))
}
