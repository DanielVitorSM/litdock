import { z } from 'zod'
import type { ReferenceType } from '@/lib/reference/types'
import { fieldsByReferenceType } from '@/lib/reference/fields'

export const CreatorRoleSchema = z.enum([
  'author',
  'editor',
  'translator',
  'director',
  'interviewer',
  'interviewee',
  'advisor',
  'presenter',
  'composer',
])

export const CreatorSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  name: z.string().optional(),
  role: CreatorRoleSchema,
}).refine(
  (c) => c.name || (c.firstName && c.lastName),
  { message: 'Informe nome pessoal ou institucional' }
)

const text = z.string().min(1, { message: 'Este campo não pode estar vazio' })
const optionalText = z.string().optional()

const date = z.string().min(4, { message: 'Este campo deve ser uma data válida' })
const optionalDate = z.string().optional()

const optionalUrl = z.string().url({ message: 'Este campo deve ser uma URL válida' }).optional()

export const fieldSchemas: Record<string, z.ZodTypeAny> = {
  title: text,
  shortTitle: optionalText,
  subtitle: optionalText,
  language: optionalText,
  abstract: optionalText,

  creators: z.array(CreatorSchema).min(1),

  date,
  accessDate: optionalDate,
  eventDate: optionalDate,

  publicationTitle: optionalText,
  journalAbbreviation: optionalText,
  publisher: optionalText,
  place: optionalText,
  series: optionalText,
  seriesNumber: optionalText,
  edition: optionalText,
  volume: optionalText,
  issue: optionalText,
  pages: optionalText,
  section: optionalText,

  doi: optionalText,
  isbn: optionalText,
  issn: optionalText,
  pmid: optionalText,
  arxivId: optionalText,
  callNumber: optionalText,
  reportNumber: optionalText,
  patentNumber: optionalText,
  standardNumber: optionalText,

  institution: optionalText,
  university: optionalText,
  faculty: optionalText,
  department: optionalText,
  advisor: optionalText,
  degree: optionalText,
  conferenceName: optionalText,
  meetingPlace: optionalText,

  court: optionalText,
  jurisdiction: optionalText,
  authority: optionalText,
  caseNumber: optionalText,
  statuteCode: optionalText,
  publicLawNumber: optionalText,
  session: optionalText,

  medium: optionalText,
  format: optionalText,
  duration: optionalText,
  runningTime: optionalText,
  network: optionalText,
  studio: optionalText,
  audioFileType: optionalText,
  videoFileType: optionalText,

  url: optionalUrl,
  archive: optionalText,
  archiveLocation: optionalText,
  repository: optionalText,
  platform: optionalText,

  tags: z.array(z.string()).optional(),
  notes: optionalText,
  extra: optionalText,
}

export function buildReferenceSchema(type: ReferenceType) {
  const config = fieldsByReferenceType[type]

  if (!config) {
    throw new Error(`Tipo de referência inválido: ${type}`)
  }

  const shape: Record<string, z.ZodTypeAny> = {
    pdfPath: optionalText,
  }

  for (const field of config.required) {
    const schema = fieldSchemas[field]
    if (!schema) {
      throw new Error(`Schema não definido para campo: ${field}`)
    }
    shape[field] = schema
  }

  for (const field of config.optional) {
    const schema = fieldSchemas[field]
    if (!schema) {
      throw new Error(`Schema não definido para campo: ${field}`)
    }
    shape[field] = schema.optional()
  }

  return z.preprocess(
    (val) => (val === undefined ? {} : val),
    z.object(shape),
  )
}