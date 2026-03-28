import { z } from 'zod'

export const experienceSchema = z.object({
  company: z.string(),
  role: z.string(),
  period: z.string(),
  location: z.string(),
  bullets: z.array(z.string()),
  tags: z.array(z.string()),
})

export const projectSchema = z.object({
  name: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  liveUrl: z.string(),
  repoUrl: z.string(),
})

export const skillGroupSchema = z.object({
  category: z.string(),
  items: z.array(z.string()),
})

export const educationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  period: z.string(),
  note: z.string(),
})

export const resumeDataSchema = z.object({
  name: z.string(),
  title: z.string(),
  bio: z.string(),
  photo: z.string().optional(),
  contact: z.object({
    email: z.string(),
    github: z.string(),
    linkedin: z.string(),
  }),
  experience: z.array(experienceSchema),
  projects: z.array(projectSchema),
  skills: z.array(skillGroupSchema),
  education: z.array(educationSchema),
})
