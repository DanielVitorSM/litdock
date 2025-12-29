import { supabase } from '@/lib/supabase'
import type { Tag } from '@/types/reference.types'

export const tagService = {
  async getAll(): Promise<Tag[]> {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  },

  async create(name: string, color: string): Promise<Tag> {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) throw new Error("Usuário não autenticado")

    const { data, error } = await supabase
      .from('tags')
      .insert({
        name,
        color,
        user_id: user.id
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async update(id: string, updates: Partial<Tag>): Promise<Tag> {
    const { data, error } = await supabase
      .from('tags')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}