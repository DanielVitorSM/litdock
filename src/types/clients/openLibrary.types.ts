export type OpenLibraryResponse = {
  description: {
    type: string
    value: string
  },
  notes: {
    type: string
    value: string
  },
  identifiers: {
    librarything: string[]
    goodreads: string[]
  },
  title: string
  authors: Array<{
    key: string
  }>
  publish_date: string
  publishers: string[]
  ia_box_id: string[]
  subtitle?: string
  isbn_10: string[]
  covers: number[]
  ia_loaded_id: string[]
  lc_classifications: string[]
  ocaid: string
  publish_places: string[]
  contributions: string[]
  languages: Array<{
    key: string
  }>
  pagination: string
  source_records: string[]
  lccn: string[]
  edition_name: string
  dewey_decimal_class: string[]
  subjects: string[]
  publish_country: string
  by_statement: string
  type: {
    key: string
  },
  oclc_numbers: string[]
  key: string
  number_of_pages: number
  works: Array<{
    key: string
  }>
  latest_revision: number
  revision: number
  created: {
    type: string
    value: string
  },
  last_modified: {
    type: string
    value: string
  }
}

export type OpenLibraryAuthorResponse = {
  remote_ids: {
    viaf: string,
    isni: string,
    wikidata: string,
    bookbrainz: string
    goodreads: string,
    lc_naf: string,
    opac_sbn: string
  },
  birth_date: string
  name: string,
  alternate_names: string[],
  key: string,
  type: {
    key: string
  },
  personal_name: string,
  photos: number[],
  source_records: string[]
  latest_revision: number,
  revision: number,
  created: {
    type: string,
    value: string
  },
  last_modified: {
    type: string,
    value: string
  }
}

export interface OpenLibraryErrorResponse {
  error: string
}