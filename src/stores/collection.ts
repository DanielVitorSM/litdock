import { defineStore } from 'pinia'
import { ref } from 'vue'
import { collectionService } from '@/services/collectionService' // Importe o service
import type { Collection } from '@/types/reference.types'
import { toast } from 'vue-sonner'

export const useCollectionStore = defineStore('collection', () => {
  const collections = ref<Collection[]>([])
  const loading = ref(false)

  async function fetchAllCollections() {
    loading.value = true
    try {
      collections.value = await collectionService.getAll()
    } catch (error) {
      console.error('Erro ao carregar coleções:', error)
      toast.error('Erro ao carregar coleções')
    } finally {
      loading.value = false
    }
  }

  async function createCollection(payload: Pick<Collection, 'title' | 'icon' | 'parentId'>): Promise<Collection> {
    try {
      const newCol = await collectionService.create(payload)

      collections.value.push(newCol)
      collections.value.sort((a, b) => a.title.localeCompare(b.title))

      return newCol
    } catch (error) {
      toast.error('Erro ao criar coleção')
      throw error
    }
  }

  async function deleteCollection(id: string) {
    try {
      await collectionService.delete(id)

      collections.value = collections.value.filter(c => c.id !== id)
    } catch (error) {
      toast.error('Erro ao remover coleção')
      throw error
    }
  }

  async function updateCollection(id: string, updates: Partial<Collection>) {
    try {
      const updated = await collectionService.update(id, updates)
      const index = collections.value.findIndex(c => c.id === id)
      if (index !== -1) collections.value[index] = updated
    } catch (error: unknown) {
      toast.error('Erro ao atualizar coleção')
      throw error
    }
  }

  return {
    collections,
    loading,
    fetchAllCollections,
    createCollection,
    deleteCollection,
    updateCollection
  }
})