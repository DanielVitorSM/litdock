import type { Reference } from "@/types/reference.types"

export interface ApiReference {
  id: string
  idType: ReferenceIdType
  title?: string
  authors?: string[]
  year?: number
  journal?: string
  publisher?: string
  url?: string
  raw?: unknown
}

export type ReferenceIdType = 'URL' | 'DOI' | 'ISBN' | 'PMID' | 'ARXIV'

export type ReferenceFetcher = (id: string) => Promise<Reference>