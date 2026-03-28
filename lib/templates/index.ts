import type { ResumeData, TemplateId, SectionId } from '@/lib/types'
import { DEFAULT_SECTION_ORDER } from '@/lib/types'
import { generateMinimal } from './minimal'
import { generateDarkDev } from './darkDev'
import { generateBold } from './bold'
import { generateDeveloper } from './developer'
import { generateDesigner } from './designer'
import { generateEditorial } from './editorial'
import { generateCinematic } from './cinematic'
import { generateCorporate } from './corporate'
import { generateStudent } from './student'
import { generateFreelancer } from './freelancer'
import { generateGlass } from './glass'
import { generateNeon } from './neon'
import { generateBrutalist } from './brutalist'
import { generateMagazine } from './magazine'

export function generateHTML(
  data: ResumeData,
  templateId: TemplateId,
  accentColor: string,
  sectionOrder: SectionId[] = DEFAULT_SECTION_ORDER,
  hiddenSections: SectionId[] = []
): string {
  switch (templateId) {
    case 'minimal':
      return generateMinimal(data, accentColor, sectionOrder, hiddenSections)
    case 'dark-dev':
      return generateDarkDev(data, accentColor, sectionOrder, hiddenSections)
    case 'bold':
      return generateBold(data, accentColor, sectionOrder, hiddenSections)
    case 'developer':
      return generateDeveloper(data, accentColor, sectionOrder, hiddenSections)
    case 'designer':
      return generateDesigner(data, accentColor, sectionOrder, hiddenSections)
    case 'editorial':
      return generateEditorial(data, accentColor, sectionOrder, hiddenSections)
    case 'cinematic':
      return generateCinematic(data, accentColor, sectionOrder, hiddenSections)
    case 'corporate':
      return generateCorporate(data, accentColor, sectionOrder, hiddenSections)
    case 'student':
      return generateStudent(data, accentColor, sectionOrder, hiddenSections)
    case 'freelancer':
      return generateFreelancer(data, accentColor, sectionOrder, hiddenSections)
    case 'glass':
      return generateGlass(data, accentColor, sectionOrder, hiddenSections)
    case 'neon':
      return generateNeon(data, accentColor, sectionOrder, hiddenSections)
    case 'brutalist':
      return generateBrutalist(data, accentColor, sectionOrder, hiddenSections)
    case 'magazine':
      return generateMagazine(data, accentColor, sectionOrder, hiddenSections)
    default:
      return generateMinimal(data, accentColor, sectionOrder, hiddenSections)
  }
}
