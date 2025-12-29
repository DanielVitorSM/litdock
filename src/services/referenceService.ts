import { supabase } from '@/lib/supabase'
import type { Reference, ReferenceStatus, Tag } from '@/types/reference.types'
import { useAuthStore } from '@/stores/auth'
import { packReference, unpackReference } from '@/lib/itemConverter'
import { storageService } from './storageService'

export interface FetchParams {
  page: number
  limit: number
  search?: string
  sortBy: 'created_at' | 'title' | 'date'
  sortOrder: 'asc' | 'desc'
  tagId?: string | null
  isFavorite?: boolean | null
  status?: ReferenceStatus | null
  collectionId?: string | null
}

export type SupabaseReference = Record<string, unknown> & { item_tags?: { tags: Tag }[] }

export const referenceService = {
  async getAll({
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    tagId,
    collectionId,
    status,
    isFavorite
  }: FetchParams): Promise<{ items: Reference[]; total: number }> {
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('items')
      .select(`*, item_tags${tagId ? '!inner' : ''}(tags(*))`, { count: 'exact' })
      .range(from, to)
      .order(sortBy, { ascending: sortOrder === 'asc' })

    if (search) {
      query = query.ilike('title', `%${search}%`)
    }

    if (isFavorite !== undefined && isFavorite !== null) {
      query = query.eq('is_favorite', isFavorite)
    }

    if (status) {
      query = query.eq('status', status)
    } else {
      query = query.not('status', 'eq', 'archived')
    }

    if (collectionId) {
      query = query.eq('collection_id', collectionId)
    }

    if (tagId) {
      query = query.eq('item_tags.tag_id', tagId)
    }

    const { data, error, count } = await query

    if (error) throw error

    const items = (data || []).map(unpackReference)

    return { items, total: count || 0 }
  },

  async create(formData: Partial<Reference>) {
    const { core, metadata, tags } = packReference(formData)

    const userId = (await supabase.auth.getUser()).data.user?.id

    const dbPayload = {
      ...core,
      metadata,
      user_id: userId
    }

    const { data: insertedItem, error } = await supabase
      .from('items')
      .insert(dbPayload)
      .select()
      .single()

    if (error) throw error

    if (tags && tags.length > 0) {
      await this.syncItemTags(insertedItem.id, tags)
    }

    const unpacked = unpackReference(insertedItem)
    return { ...unpacked, tags: tags || [] }
  },

  async toggleIsFavorite(itemId: string, isFavorite: boolean) {
    const { error } = await supabase
      .from('items')
      .update({ is_favorite: isFavorite })
      .eq('id', itemId)

    if (error) throw error
  },

  async updateCollection(itemId: string, collectionId: string | null) {
    const { error } = await supabase
      .from('items')
      .update({ collection_id: collectionId ?? null })
      .eq('id', itemId)

    if (error) throw error
  },

  async updateNotes(itemId: string, notes: string | null) {
    const { error } = await supabase
      .from('items')
      .update({ notes })
      .eq('id', itemId)

    if (error) throw error
  },

  async syncItemTags(itemId: string, tags: Tag[]) {
    const authStore = useAuthStore()
    const user = authStore.user
    if (!user) throw new Error("Usuário não autenticado")

    const tagsWithId = tags.filter(t => t.id)

    const newTagsData = tags.filter(t => !t.id)

    let finalTagIds = tagsWithId.map(t => t.id)

    if (newTagsData.length > 0) {
      const { data: createdTags, error: createError } = await supabase
        .from('tags')
        .upsert(
          newTagsData.map(tag => ({
            name: tag.name,
            color: tag.color || 'slate',
            user_id: user.id
          })),
          { onConflict: 'name, user_id' }
        )
        .select('id')

      if (createError) throw createError

      if (createdTags) {
        finalTagIds = [...finalTagIds, ...createdTags.map(t => t.id)]
      }
    }

    if (finalTagIds.length > 0) {
      await supabase
        .from('item_tags')
        .delete()
        .eq('item_id', itemId)
        .not('tag_id', 'in', `(${finalTagIds.join(',')})`)
    } else {
      await supabase
        .from('item_tags')
        .delete()
        .eq('item_id', itemId)
    }

    if (finalTagIds.length > 0) {
      const pivotData = finalTagIds.map(tagId => ({
        item_id: itemId,
        tag_id: tagId
      }))
      const { error: linkError } = await supabase
        .from('item_tags')
        .upsert(pivotData, { onConflict: 'item_id, tag_id', ignoreDuplicates: true })
      if (linkError) throw linkError
    }

    return finalTagIds
  },

  async updateStatus(itemId: string, status: ReferenceStatus) {
    const { error } = await supabase
      .from('items')
      .update({ status: status })
      .eq('id', itemId)

    if (error) throw error
  },

  async remove(id: string) {
    const { data: item, error: fetchError } = await supabase
      .from('items')
      .select('pdf_path, metadata')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    const filePath = item.metadata?.pdf_path

    if (filePath) {
      try {
        await storageService.removePaper(filePath)
      } catch (e) {
        console.warn('Erro ao tentar excluir arquivo físico, prosseguindo com exclusão do registro:', e)
      }
    }

    const { error: deleteError } = await supabase
      .from('items')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError
  }
};