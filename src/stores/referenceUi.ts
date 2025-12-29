import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Reference, Tag, ReferenceStatus } from '@/types/reference.types'
import { referenceService } from '@/services/referenceService'
import { useReferenceStore } from '@/stores/reference'
import { toast } from 'vue-sonner'
import { useMediaQuery } from '@vueuse/core'

export const useReferenceUiStore = defineStore('reference-ui', () => {
  const selectedReference = ref<Reference | null>(null)
  const isSidebarOpen = ref(false)
  const isPdfReaderOpen = ref(false)

  const listStore = useReferenceStore()

  const hasSelection = computed(() => !!selectedReference.value)

  function selectReference(reference: Reference) {
    selectedReference.value = reference
    isSidebarOpen.value = true
  }

  function clearSelection() {
    isSidebarOpen.value = false
    setTimeout(() => { selectedReference.value = null }, 300)
  }

  async function deleteReference() {
    if (!selectedReference.value) return

    try {
      await referenceService.remove(selectedReference.value.id!)

      listStore.references = listStore.references.filter((r: Reference) => r.id !== selectedReference.value!.id)
      listStore.total--

      clearSelection()

      toast.success("Referência excluída com sucesso.")

    } catch (err: unknown) {
      console.error('Erro ao excluir:', err)
      toast.error("Não foi possível excluir a referência.")
    }
  }

  function openPdfReader() {
    if (selectedReference.value?.pdfPath) {
      const isDesktop = useMediaQuery("(min-width: 1024px)")

      if (!isDesktop.value) {
        isSidebarOpen.value = false
      }

      isPdfReaderOpen.value = true
    } else {
      toast.error("Nenhum arquivo associado.")
    }
  }

  function closePdfReader() {
    isPdfReaderOpen.value = false
    setTimeout(() => { isSidebarOpen.value = true }, 150)
  }

  async function updateTags(newTags: Tag[]) {
    if (!selectedReference.value) return
    const oldTags = [...(selectedReference.value.tags || [])]

    selectedReference.value.tags = newTags

    listStore.syncItemInList(selectedReference.value.id!, { tags: newTags })

    try {
      await referenceService.syncItemTags(selectedReference.value.id!, newTags)
    } catch (error) {
      console.error(error)
      selectedReference.value.tags = oldTags
      listStore.syncItemInList(selectedReference.value.id!, { tags: oldTags })
      toast.error("Erro ao salvar tags")
    }
  }

  async function updateCollection(collectionId: string | null) {
    if (!selectedReference.value) return
    const oldId = selectedReference.value.collectionId

    selectedReference.value.collectionId = collectionId
    listStore.syncItemInList(selectedReference.value.id!, { collectionId })

    try {
      await referenceService.updateCollection(selectedReference.value.id!, collectionId)
    } catch (error: unknown) {
      console.error(error)
      selectedReference.value.collectionId = oldId
      listStore.syncItemInList(selectedReference.value.id!, { collectionId: oldId })
      toast.error("Erro ao salvar coleção")
    }
  }

  async function updateStatus(status: ReferenceStatus) {
    if (!selectedReference.value) return

    const oldStatus = selectedReference.value.status

    selectedReference.value.status = status
    listStore.syncItemInList(selectedReference.value.id!, { status })

    try {
      await referenceService.updateStatus(selectedReference.value.id!, status)
    } catch (error: unknown) {
      console.error(error)
      selectedReference.value.status = oldStatus
      listStore.syncItemInList(selectedReference.value.id!, { status: oldStatus })
      toast.error("Erro ao atualizar status")
    }
  }

  async function updateNotes(notes: string | null) {
    if (!selectedReference.value) return

    try {
      selectedReference.value.notes = notes || undefined
      await referenceService.updateNotes(selectedReference.value.id!, notes)
    } catch (error: unknown) {
      console.error(error)
      toast.error("Erro ao salvar notas")
    }
  }

  return {
    selectedReference,
    isSidebarOpen,
    isPdfReaderOpen,
    hasSelection,
    selectReference,
    clearSelection,
    openPdfReader,
    closePdfReader,
    updateTags,
    updateCollection,
    updateStatus,
    updateNotes,
    deleteReference
  }
})