export interface ArxivAuthor {
  name: string
}

export interface ArxivLink {
  '@_href': string
  '@_rel'?: string
  '@_type'?: string
}

export interface ArxivEntry {
  id: string
  title: string
  summary: string
  published: string
  category?: { '@_term': string }[] | { '@_term': string }
  updated: string
  author: ArxivAuthor[] | ArxivAuthor
  link: ArxivLink[] | ArxivLink
}

export interface ArxivFeed {
  feed: {
    entry?: ArxivEntry | ArxivEntry[]
  }
}
