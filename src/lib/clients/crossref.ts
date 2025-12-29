import axios from 'axios'
import type { CrossrefResponse, CrossrefReference } from "@/types/clients/crossref.types"
import type { Citation, Creator, Reference, } from "@/types/reference.types"
import { ReferenceNotFoundError } from '@/lib/clients'
import type { ReferenceType } from '@/lib/reference/types'
import { fetchPdfFromUnpaywall } from '@/lib/clients/unpaywall'

const CROSSREF_TYPE_MAP: Record<string, ReferenceType> = {
  // Artigos e Periódicos
  'journal-article': 'journalArticle',
  'peer-review': 'document',
  'journal': 'document',
  'journal-issue': 'document',
  'journal-volume': 'document',

  // Livros e Capítulos
  'book': 'book',
  'edited-book': 'book',
  'reference-book': 'book',
  'book-series': 'book',
  'book-set': 'book',
  'monograph': 'monograph',

  // Partes de Livros
  'book-chapter': 'bookSection',
  'book-section': 'bookSection',
  'book-part': 'bookSection',
  'book-track': 'bookSection',
  'reference-entry': 'encyclopediaEntry',

  // Conferências
  'proceedings-article': 'conferencePaper',
  'proceedings': 'book',
  'proceedings-series': 'book',

  // Relatórios e Teses
  'report': 'report',
  'report-series': 'report',
  'report-component': 'report',
  'dissertation': 'thesis',

  // Outros
  'posted-content': 'preprint',
  'standard': 'standard',
  'dataset': 'database',
  'component': 'document',
  'other': 'document'
}

/**
 * Função auxiliar para garantir que nunca retorne undefined
 */
export function mapCrossrefType(crossrefType: string): ReferenceType {
  return CROSSREF_TYPE_MAP[crossrefType] || 'document';
}

/**
 * Função auxiliar para encontrar o link PDF em uma lista de links do Crossref
 */
function findPdfUrl(links: CrossrefResponse['message']['link']): string | undefined {
  if (!links || !Array.isArray(links)) return undefined

  const pdfLink = links.find(l =>
    l['content-type'] === 'application/pdf' ||
    l['content-type'] === 'application/pdf; version=article'
  )

  if (pdfLink) return pdfLink.URL

  const looseLink = links.find(l =>
    l.URL && l.URL.toLowerCase().endsWith('.pdf')
  )

  return looseLink?.URL
}

export async function fetchByDOI(doi: string): Promise<Reference> {
  const { data } = await axios.get<CrossrefResponse>(
    `https://api.crossref.org/works/${doi}`
  )

  if (data.status !== 'ok') {
    throw new ReferenceNotFoundError('CROSSREF', doi)
  }

  const raw = data.message
  let dateString = undefined;

  if (raw.issued?.['date-parts']?.[0]) {
    const parts = raw.issued['date-parts'][0];
    const year = parts[0]?.toString().padStart(4, '0') || '0000';
    const month = parts[1]?.toString().padStart(2, '0') || '01';
    const day = parts[2]?.toString().padStart(2, '0') || '01';

    dateString = `${year}-${month}-${day}`;
  }

  if (!raw.title || raw.title.length === 0) {
    throw new ReferenceNotFoundError('CROSSREF', doi)
  }

  const creators: Creator[] = []

  for (const author of raw.author || []) {
    creators.push({
      firstName: author.given || '',
      lastName: author.family || '',
      role: 'author'
    });
  }

  const bibliography: Citation[] = (raw.reference || []).map((ref: CrossrefReference) => ({
    key: ref.key,
    doi: ref.DOI,
    title: Object.entries(ref).find(([key, value]) => key.includes('title') && value)?.[1] as string | undefined,
    author: ref.author,
    year: ref.year,
    unstructured: ref.unstructured
  }));

  let pdfUrl = findPdfUrl(raw.link)

  if (!pdfUrl) {
    pdfUrl = await fetchPdfFromUnpaywall(doi)
  }

  return {
    type: mapCrossrefType(raw.type),
    title: raw.title![0]!,
    shortTitle: raw['short-title']?.[0],
    subtitle: raw.subtitle?.[0],

    publicationTitle: raw['container-title']?.[0],
    journalAbbreviation: raw['short-container-title']?.[0],
    publisher: raw.publisher,

    volume: raw.volume,
    issue: raw.issue,
    pages: raw.page,
    doi: raw.DOI,
    issn: raw.ISSN?.[0],
    url: raw.URL,
    language: raw.language,

    date: dateString,

    // Abstract no Crossref as vezes vem como XML (<jats:p>...</jats:p>)
    abstract: raw.abstract?.replace(/<[^>]+>/g, ''),

    pdfPath: pdfUrl,

    creators,
    bibliography
  }
}