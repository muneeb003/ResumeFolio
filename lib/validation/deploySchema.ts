import { z } from 'zod'
import { resumeDataSchema } from './resumeSchema'

export const templateIdSchema = z.enum(['minimal', 'dark-dev', 'bold'])

export const sectionIdSchema = z.enum([
  'experience',
  'projects',
  'skills',
  'education',
  'contact',
])

export const deploySchema = z.object({
  resumeData: resumeDataSchema,
  templateId: templateIdSchema,
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color'),
  sectionOrder: z.array(sectionIdSchema),
  hiddenSections: z.array(sectionIdSchema),
  repoName: z.string().min(1).max(100),
  portfolioName: z.string().min(1).max(100),
})

export type DeployPayload = z.infer<typeof deploySchema>
