import { supabase } from '@/lib/supabase'
import type { Collection } from '@/types/reference.types'

export const collectionService = {
  async getAll(): Promise<Collection[]> {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('title')

    if (error) throw error
    return data || []
  },

  async create(data: Pick<Collection, 'title' | 'icon' | 'parentId'>): Promise<Collection> {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) throw new Error("Usuário não autenticado")

    const { data: newCollection, error } = await supabase
      .from('collections')
      .insert({
        title: data.title,
        icon: data.icon || 'Folder',
        parent_id: data.parentId,
        user_id: user.id
      })
      .select()
      .single()

    if (error) throw error
    return newCollection
  },

  async update(id: string, updates: Partial<Collection>): Promise<Collection> {
    const { data, error } = await supabase
      .from('collections')
      .update({
        title: updates.title,
        icon: updates.icon,
        parent_id: updates.parentId
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}