import axios from 'axios'
import type { Reference, Creator } from '@/types/reference.types'
import type { PubMedResponse, PubMedSummary } from '@/types/clients/pubMed.types'
import { ReferenceNotFoundError } from '@/lib/clients'

function isPubMedSummary(value: unknown): value is PubMedSummary {
  return (
    typeof value === 'object' &&
    value !== null &&
    'uid' in value &&
    'title' in value
  )
}

export async function fetchByPMID(pmid: string): Promise<Reference> {
  const cleanId = pmid.trim()

  const { data } = await axios.get<PubMedResponse>(
    'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi',
    {
      params: {
        db: 'pubmed',
        id: cleanId,
        retmode: 'json'
      }
    }
  )

  if (!data?.result?.uids?.includes(cleanId)) {
    throw new ReferenceNotFoundError('PUBMED', cleanId)
  }

  const record = data.result[cleanId]

  if (!isPubMedSummary(record)) {
    throw new ReferenceNotFoundError('PUBMED', cleanId)
  }

  const creators: Creator[] = (record.authors || []).map(a => {
    const parts = a.name.trim().split(' ')
    const lastName = parts[0] || ''
    const firstName = parts.slice(1).join(' ')

    return { firstName, lastName, role: 'author' }
  })

  let dateString = undefined
  if (record.pubdate) {
    const dateObj = new Date(record.pubdate)
    if (!isNaN(dateObj.getTime())) {
      dateString = dateObj.toISOString().split('T')[0]
    } else {
      const year = record.pubdate.match(/\d{4}/)?.[0]
      if (year) dateString = year
    }
  }

  const doiEntry = record.articleids?.find(id => id.idtype === 'doi')
  const doi = doiEntry ? doiEntry.value : undefined

  return {
    type: 'journalArticle',
    title: record.title,

    publicationTitle: record.fulljournalname,
    journalAbbreviation: record.source,

    volume: record.volume,
    issue: record.issue,
    pages: record.pages,

    date: dateString,
    pmid: cleanId,
    doi: doi,

    creators: creators,
    language: record.lang?.[0],
  }
}