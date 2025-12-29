import { defineStore } from 'pinia'
import { ref, computed, reactive, watch } from 'vue'
import { referenceService, type FetchParams } from '@/services/referenceService'
import type { Reference } from '@/types/reference.types'
import { useDebounceFn } from '@vueuse/core'
import { toast } from 'vue-sonner'

export const useReferenceStore = defineStore('reference', () => {
  // Lista de referências
  const references = ref<Reference[]>([])
  const total = ref(0)

  // Controle
  const filters = reactive<FetchParams & { hasMore: boolean }>({
    page: 1,
    limit: 24,
    search: '',
    sortBy: 'created_at' as 'created_at' | 'title' | 'date',
    sortOrder: 'desc' as 'asc' | 'desc',
    hasMore: true,
    tagId: null as string | null,
    collectionId: null as string | null
  })
  const loading = ref(false)

  const debouncedSearch = useDebounceFn(resetAndFetch, 500)

  watch(() => filters.search, debouncedSearch)

  watch(() => [filters.sortBy, filters.sortOrder], resetAndFetch)

  const count = computed(() => references.value.length)

  const getById = computed(() => (id: string) => references.value.find(ref => ref.id === id))

  async function fetchReferences(isLoadMore = false) {
    if (loading.value) return
    loading.value = true

    try {
      const { items, total: totalCount } = await referenceService.getAll(filters)

      total.value = totalCount

      if (isLoadMore) {
        references.value.push(...items)
      } else {
        references.value = items
      }

      filters.hasMore = items.length === filters.limit
    } catch (err: unknown) {
      console.error('Erro ao carregar referências:', err)
      toast.error('Erro ao carregar referências')

      if (!isLoadMore) {
        references.value = []
      }

      filters.hasMore = false
    } finally {
      loading.value = false
    }
  }

  async function resetAndFetch() {
    filters.page = 1
    filters.hasMore = true
    return fetchReferences(false)
  }

  async function loadMore() {
    if (!filters.hasMore || loading.value) return
    filters.page++
    return fetchReferences(true)
  }

  async function addReference(formData: Partial<Reference>) {
    loading.value = true

    try {
      const newReference = await referenceService.create(formData)

      references.value.unshift(newReference)

      return newReference
    } catch (err: unknown) {
      console.error('Erro ao salvar referência:', err)
      toast.error('Erro ao salvar referência. Tente novamente.')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function toggleIsFavorite(itemId: string, isFavorite: boolean) {
    references.value = references.value.map(ref => (ref.id === itemId ? { ...ref, isFavorite } : ref))

    try {
      await referenceService.toggleIsFavorite(itemId, isFavorite)
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error)
      references.value = references.value.map(ref => (ref.id === itemId ? { ...ref, isFavorite: !isFavorite } : ref))
    }
  }

  function syncItemInList(id: string, updates: Partial<Reference>) {
    const index = references.value.findIndex(r => r.id === id)

    if (index !== -1) {
      references.value[index] = { ...references.value[index], ...updates } as Reference
    }
  }

  return {
    references,
    loading,
    total,
    count,
    filters,
    getById,
    loadMore,
    fetchReferences,
    addReference,
    resetAndFetch,
    toggleIsFavorite,
    syncItemInList
  }
})