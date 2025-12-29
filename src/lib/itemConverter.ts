import { mapKeysToCamelCase } from '@/lib/formatters'
import type { Reference, Tag } from '@/types/reference.types'

const CORE_FIELDS = new Set([
  'id', 'user_id', 'collection_id', 'type', 'title', 'short_title',
  'abstract', 'creators', 'date', 'access_date', 'status',
  'is_favorite', 'cover_image', 'notes', 'pdf_path', 'created_at', 'updated_at', 'bibliography'
])

interface DbItem {
  [key: string]: unknown
  metadata?: Record<string, unknown>
  item_tags?: Array<{ tags: Tag }>
}

export function unpackReference(dbItem: DbItem): Reference {
  const { metadata, item_tags, ...core } = dbItem

  const camelCore = mapKeysToCamelCase(core)

  const camelMeta = metadata ? mapKeysToCamelCase(metadata as Record<string, unknown>) : {}

  const tags = item_tags?.map((it) => it.tags) || []

  return {
    ...camelCore,
    ...camelMeta,
    tags
  } as Reference
}

export function packReference(formData: Partial<Reference>) {
  const { tags, ...rest } = formData

  const core: Record<string, unknown> = {}
  const metadata: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(rest)) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)

    if (CORE_FIELDS.has(snakeKey)) {
      core[snakeKey] = value
    } else {
      if (value !== null && value !== undefined && value !== '') {
        metadata[snakeKey] = value
      }
    }
  }

  return { core, metadata, tags }
}