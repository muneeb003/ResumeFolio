import { getDb } from './client'
import type { PortfolioRecord, ResumeData, TemplateId, SectionId } from '@/lib/types'

export async function getPortfoliosByUser(userId: string): Promise<PortfolioRecord[]> {
  const sql = getDb()
  const rows = await sql`
    SELECT * FROM portfolios
    WHERE user_id = ${userId}
    ORDER BY updated_at DESC
  `
  return rows as unknown as PortfolioRecord[]
}

export async function getPortfolioPublic(id: string): Promise<PortfolioRecord | null> {
  const sql = getDb()
  const rows = await sql`
    SELECT * FROM portfolios
    WHERE id = ${id}
    LIMIT 1
  `
  return (rows[0] as unknown as PortfolioRecord) ?? null
}

export async function getPortfolioById(id: string, userId: string): Promise<PortfolioRecord | null> {
  const sql = getDb()
  const rows = await sql`
    SELECT * FROM portfolios
    WHERE id = ${id} AND user_id = ${userId}
    LIMIT 1
  `
  return (rows[0] as unknown as PortfolioRecord) ?? null
}

export async function createPortfolio(params: {
  userId: string
  name: string
  resumeData: ResumeData
  templateId: TemplateId
  accentColor: string
  sectionOrder: SectionId[]
  hiddenSections: SectionId[]
}): Promise<PortfolioRecord> {
  const sql = getDb()
  const rows = await sql`
    INSERT INTO portfolios (user_id, name, resume_data, template_id, accent_color, section_order, hidden_sections)
    VALUES (
      ${params.userId},
      ${params.name},
      ${JSON.stringify(params.resumeData)},
      ${params.templateId},
      ${params.accentColor},
      ${params.sectionOrder},
      ${params.hiddenSections}
    )
    RETURNING *
  `
  return rows[0] as unknown as PortfolioRecord
}

export async function updatePortfolio(
  id: string,
  userId: string,
  updates: Partial<{
    name: string
    resumeData: ResumeData
    templateId: TemplateId
    accentColor: string
    sectionOrder: SectionId[]
    hiddenSections: SectionId[]
    githubRepo: string
    deploymentUrl: string
    lastDeployedAt: string
  }>
): Promise<PortfolioRecord> {
  const sql = getDb()
  const now = new Date().toISOString()

  const rows = await sql`
    UPDATE portfolios SET
      name             = COALESCE(${updates.name ?? null}, name),
      resume_data      = COALESCE(${updates.resumeData ? JSON.stringify(updates.resumeData) : null}::jsonb, resume_data),
      template_id      = COALESCE(${updates.templateId ?? null}, template_id),
      accent_color     = COALESCE(${updates.accentColor ?? null}, accent_color),
      section_order    = COALESCE(${updates.sectionOrder ?? null}, section_order),
      hidden_sections  = COALESCE(${updates.hiddenSections ?? null}, hidden_sections),
      github_repo      = COALESCE(${updates.githubRepo ?? null}, github_repo),
      deployment_url   = COALESCE(${updates.deploymentUrl ?? null}, deployment_url),
      last_deployed_at = COALESCE(${updates.lastDeployedAt ?? null}::timestamptz, last_deployed_at),
      updated_at       = ${now}::timestamptz
    WHERE id = ${id} AND user_id = ${userId}
    RETURNING *
  `
  return rows[0] as unknown as PortfolioRecord
}

export async function deletePortfolio(id: string, userId: string): Promise<void> {
  const sql = getDb()
  await sql`
    DELETE FROM portfolios
    WHERE id = ${id} AND user_id = ${userId}
  `
}
