import { fetchByDOI } from '@/lib/clients/crossref'
import { fetchByArxiv } from '@/lib/clients/arxiv'
import { fetchByPMID } from '@/lib/clients/pubmed'
import { fetchByISBN } from '@/lib/clients/openLibrary'
import type { ReferenceFetcher, ReferenceIdType } from "@/types/services.types"
import type { Reference } from '@/types/reference.types'

export { ReferenceNotFoundError, ReferenceValidationError } from "@/lib/clients/errors"

const DOI_PATTERN = /\b(10\.\d{4,9}\/[-._;()/:A-Z0-9]+)\b/i
const ARXIV_PATTERN = /((?:\d{4}\.\d{4,5}|[a-z\-]+(?:\.[A-Z]{2})?\/\d{7})(?:v\d+)?)/i
const PMID_PATTERN = /^[1-9]\d{0,7}$/
const URL_PATTERN = /^https?:\/\//i

export const referenceFetchers: Record<ReferenceIdType, ReferenceFetcher> = {
  DOI: fetchByDOI,
  ARXIV: fetchByArxiv,
  PMID: fetchByPMID,
  ISBN: fetchByISBN,
  URL: async (url: string): Promise<Reference> => {
    return {
      type: 'webpage',
      title: url,
      url: url,
      creators: [],
      bibliography: []
    }
  }
}

export function detectIdType(input: string): ReferenceIdType {
  const trimmed = input.trim()

  if (trimmed.includes('arxiv.org/') || trimmed.includes('ar5iv.org/')) return 'ARXIV'
  if (trimmed.includes('doi.org/')) return 'DOI'
  if (trimmed.includes('pubmed.ncbi.nlm.nih.gov/')) return 'PMID'
  if (trimmed.includes('openlibrary.org/')) return 'ISBN'

  if (ARXIV_PATTERN.test(trimmed)) return 'ARXIV'
  if (DOI_PATTERN.test(trimmed)) return 'DOI'

  const cleanIsbn = trimmed.replace(/[- ]/g, '')
  if ((cleanIsbn.length === 10 || cleanIsbn.length === 13) && !isNaN(Number(cleanIsbn.slice(0, -1)))) {
    return 'ISBN'
  }

  if (PMID_PATTERN.test(trimmed)) return 'PMID'

  if (URL_PATTERN.test(trimmed)) return 'URL'

  throw new Error(`Formato de identificador não reconhecido: ${input}`)
}

export async function fetchReference(
  input: string,
  forceType?: ReferenceIdType
): Promise<Reference> {
  const rawInput = input.trim()
  const type = forceType || detectIdType(rawInput)

  const fetcher = referenceFetchers[type]
  if (!fetcher) {
    throw new Error(`Fetcher não implementado para ${type}`)
  }

  let cleanId = rawInput

  if (type === 'DOI') {
    const match = rawInput.match(DOI_PATTERN)
    if (match) cleanId = match[1]!
  }

  else if (type === 'ISBN') {
    cleanId = rawInput.replace(/[- ]/g, '')
  }

  else if (type === 'PMID') {
    const urlMatch = rawInput.match(/pubmed\/(\d+)/)
    if (urlMatch) cleanId = urlMatch[1]!
  }

  return fetcher(cleanId)
}