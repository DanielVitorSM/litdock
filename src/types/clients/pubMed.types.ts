export interface PubMedResponse {
  header: {
    type: string
    version: string
  }
  result: PubMedResult
}

export interface PubMedResult {
  uids: string[]
  [pmid: string]: PubMedSummary | string[]
}

export interface PubMedAuthor {
  name: string
  authtype: string
  clusterid?: string
}

export interface PubMedSummary {
  uid: string
  error?: string
  title: string
  pubdate: string
  epubdate?: string
  source?: string
  fulljournalname: string
  sortpubdate?: string
  authors: PubMedAuthor[]
  volume?: string
  issue?: string
  pages?: string
  elocationid?: string
  lang?: string[]
  pubtype?: string[]
  articleids?: {
    idtype: string
    idtypen?: number
    value: string
  }[]
}
