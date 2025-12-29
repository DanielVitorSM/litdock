import { XMLParser } from 'fast-xml-parser'
import { normalizeArray } from '@/lib/utils'
import type { ArxivFeed, ArxivEntry } from '@/types/clients/arxiv.types'
import type { Reference, Creator } from '@/types/reference.types'
import { ReferenceNotFoundError } from '@/lib/clients'
import { supabase } from '@/lib/supabase'

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_'
})

const ARXIV_ID_PATTERN = /((?:\d{4}\.\d{4,5}|[a-z\-]+(?:\.[A-Z]{2})?\/\d{7})(?:v\d+)?)/i

function extractArxivId(input: string): string {
  const cleanInput = input.trim().replace(/\.pdf$/i, '')
  const match = cleanInput.match(ARXIV_ID_PATTERN)

  if (match && match[1]) {
    return match[1]
  }

  return cleanInput.replace(/^arXiv:/i, '')
}

export async function fetchByArxiv(
  input: string
): Promise<Reference> {
  const cleanId = extractArxivId(input)

  const { data, error } = await supabase.functions.invoke('arxiv-proxy', {
    body: { id: cleanId }
  })

  if (error) throw error

  const parsed = parser.parse(data) as ArxivFeed
  const entries = normalizeArray(parsed.feed?.entry)

  if (!entries.length) {
    throw new ReferenceNotFoundError('ARXIV', cleanId)
  }

  const entry: ArxivEntry = entries[0]!

  const dateString = entry.published ? new Date(entry.published).toISOString().split('T')[0] : undefined

  const creators: Creator[] = normalizeArray(entry.author).map((a) => {
    const name = (a.name || '').trim()
    const parts = name.split(' ')

    if (parts.length === 1) {
      return { firstName: '', lastName: parts[0]!, role: 'author' }
    }

    const lastName = parts.pop() || ''
    const firstName = parts.join(' ')

    return { firstName, lastName, role: 'author' }
  })

  const categories = normalizeArray(entry.category)
    .map((c) => c['@_term'])
    .filter(Boolean)
    .join(', ')

  return {
    type: 'preprint',
    title: entry.title?.replace(/\s+/g, ' ').trim() || 'Sem título',
    abstract: entry.summary?.replace(/\s+/g, ' ').trim(),

    date: dateString,
    creators: creators,

    arxivId: cleanId,
    url: entry.id,

    publicationTitle: 'arXiv',
    extra: categories ? `Categories: ${categories}` : undefined,

    pdfPath: `https://arxiv.org/pdf/${cleanId}.pdf`
  }
}