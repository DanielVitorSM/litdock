import axios from 'axios'
import type { OpenLibraryResponse, OpenLibraryAuthorResponse } from '@/types/clients/openLibrary.types'
import type { Reference, Creator } from '@/types/reference.types'
import { ReferenceNotFoundError } from '@/lib/clients'

async function fetchAuthorName(authorKey: string): Promise<Creator> {
  try {
    const { data } = await axios.get<OpenLibraryAuthorResponse>(
      `https://openlibrary.org${authorKey}.json`
    )

    const name = data.name || 'Autor desconhecido'
    const parts = name.trim().split(' ')

    if (parts.length === 1) return { firstName: '', lastName: parts[0]!, role: 'author' }

    const lastName = parts.pop() || ''
    const firstName = parts.join(' ')

    return { firstName, lastName, role: 'author' }
  } catch {
    return { firstName: '', lastName: 'Desconhecido', role: 'author' }
  }
}

export async function fetchByISBN(isbn: string): Promise<Reference> {
  const cleanIsbn = isbn.replace(/-/g, '').trim()

  const { data } = await axios.get<OpenLibraryResponse>(
    `https://openlibrary.org/isbn/${cleanIsbn}.json`
  )

  if (!data || !data.title) {
    throw new ReferenceNotFoundError('OPENLIBRARY', isbn)
  }

  let creators: Creator[] = []
  if (data.authors?.length) {
    creators = await Promise.all(
      data.authors.map((a) => fetchAuthorName(a.key))
    )
  }

  let dateString: string | undefined = undefined;

  if (data.publish_date) {
    const yearMatch = data.publish_date.match(/(\d{4})/);

    if (yearMatch) {
      const year = yearMatch[0];

      const dateObj = new Date(data.publish_date);

      if (!isNaN(dateObj.getTime())) {
        dateString = dateObj.toISOString().split('T')[0];
      } else {
        dateString = `${year}-01-01`;
      }
    }
  }

  return {
    type: 'book',
    title: data.title,
    subtitle: data.subtitle,

    publisher: data.publishers?.[0],
    place: data.publish_places?.[0],
    pages: data.number_of_pages?.toString(),
    edition: data.edition_name,

    date: dateString,
    isbn: cleanIsbn,

    creators: creators,

    url: `https://openlibrary.org/isbn/${cleanIsbn}`,
    coverImage: data.covers?.length ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg` : undefined
  }
}