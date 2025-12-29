import { defineStore } from 'pinia'
import { ref } from 'vue'
import { tagService } from '@/services/tagService'
import type { Tag } from '@/types/reference.types'
import { toast } from 'vue-sonner'

export const useTagStore = defineStore('tag', () => {
  const tags = ref<Tag[]>([])
  const loading = ref(false)

  async function fetchAllTags() {
    loading.value = true
    try {
      tags.value = await tagService.getAll()
    } catch (error) {
      toast.error('Erro ao carregar tags')
      console.error('Erro ao buscar tags:', error)
    } finally {
      loading.value = false
    }
  }

  async function createTag(name: string, color: string): Promise<Tag> {
    try {
      const newTag = await tagService.create(name, color)
      tags.value.push(newTag)
      return newTag
    } catch (error) {
      toast.error('Erro ao criar tag')
      throw error
    }
  }

  async function deleteTag(tagId: string) {
    try {
      await tagService.delete(tagId)
      tags.value = tags.value.filter(t => t.id !== tagId)
    } catch (error) {
      toast.error('Erro ao deletar tag')
      throw error
    }
  }

  return {
    tags,
    loading,
    fetchAllTags,
    createTag,
    deleteTag
  }
})