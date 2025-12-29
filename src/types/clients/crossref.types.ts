export interface CrossrefResponse {
  status: string
  "message-type": string
  "message-version": string
  message: CrossrefMessage
}

export interface CrossrefAuthor {
  given: string
  family: string
  sequence: string
  affiliation: Array<{
    name: string
  }>
}

export interface CrossrefReference {
  key: string
  "doi-asserted-by"?: string
  DOI?: string
  "unstructured": string
  "first-page"?: string
  year?: string
  author?: string
  volume?: string
  "journal-title"?: string
  "article-title"?: string
  ISSN?: string
}

export interface CrossrefDateFormat {
  "date-parts": number[][]
  "date-time": string
  timestamp: number
}

export interface CrossrefMessage {
  indexed: CrossrefDateFormat
  "reference-count": number
  publisher: string
  issue: string
  license: Array<{
    start: CrossrefDateFormat
    "content-version": string
    "delay-in-days": number
    URL: string
  }>
  "content-domain": {
    domain: string[]
    "crossmark-restriction": boolean
  },
  "short-container-title": string[]
  DOI: string
  type: string
  created: CrossrefDateFormat
  page: string
  source: string
  "is-referenced-by-count": number
  title: string[]
  prefix: string
  volume: string
  abstract?: string
  author: Array<CrossrefAuthor>
  member: string
  reference: Array<CrossrefReference>
  "container-title": string[]
  "original-title": string[]
  language: string
  link: Array<{
    URL: string
    "content-type": string
    "content-version": string
    "intended-application": string
  }>
  deposited: CrossrefDateFormat
  score: number
  subtitle: string[]
  "short-title": string[]
  issued: CrossrefDateFormat
  "references-count": number
  URL: string
  ISSN: string[]
  "issn-type": Array<{
    value: string
    type: string
  }>
  subject: string[]
}