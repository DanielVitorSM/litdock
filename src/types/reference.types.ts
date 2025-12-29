import type { ReferenceType } from "@/lib/reference/types"

export interface Creator {
  firstName: string
  lastName: string
  role: 'author' | 'editor' | 'translator' | 'contributor' | 'advisor' | 'director'
}

export interface Tag {
  id: string
  name: string
  color?: string
}

export interface Collection {
  id: string
  title: string
  parentId?: string | null
  icon?: string
}

export interface Citation {
  key?: string
  doi?: string
  title?: string
  author?: string
  year?: string
  unstructured?: string
}

export type ReferenceStatus = 'unread' | 'reading' | 'finished' | 'archived'

export interface Reference {
  id?: string
  userId?: string
  type: ReferenceType

  title: string
  shortTitle?: string
  subtitle?: string
  language?: string
  abstract?: string

  creators: Creator[]
  bibliography?: Citation[]
  tags?: Tag[]
  collection?: Collection
  collectionId?: string | null

  // Datas (string ISO ou Date object)
  date?: string
  accessDate?: string
  eventDate?: string

  // Detalhes da Publicação
  publicationTitle?: string
  journalAbbreviation?: string
  publisher?: string
  place?: string
  series?: string
  seriesNumber?: string
  edition?: string
  volume?: string
  issue?: string
  pages?: string
  section?: string

  // Identificadores
  doi?: string
  isbn?: string
  issn?: string
  pmid?: string
  arxivId?: string
  callNumber?: string
  reportNumber?: string
  patentNumber?: string
  standardNumber?: string

  // Acadêmico / Legal
  institution?: string
  university?: string
  faculty?: string
  department?: string
  advisor?: string
  degree?: string
  conferenceName?: string
  meetingPlace?: string

  // Jurídico
  court?: string
  jurisdiction?: string
  authority?: string
  caseNumber?: string
  statuteCode?: string
  publicLawNumber?: string
  session?: string

  // Mídia
  medium?: string
  format?: string
  duration?: string
  runningTime?: string
  network?: string
  studio?: string
  audioFileType?: string
  videoFileType?: string

  // Arquivos e Web
  url?: string
  archive?: string
  archiveLocation?: string
  repository?: string
  platform?: string

  // Meta
  notes?: string
  extra?: string

  // Controle de sistema
  createdAt?: string
  updatedAt?: string
  isFavorite?: boolean
  coverImage?: string
  pdfPath?: string
  status?: ReferenceStatus
}