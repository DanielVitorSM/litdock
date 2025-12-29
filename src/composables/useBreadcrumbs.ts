import { useCollectionStore } from "@/stores/collection"
import { useTagStore } from "@/stores/tag"
import { computed } from "vue"
import { useRoute } from "vue-router"

export function useBreadcrumbs() {
  const route = useRoute()
  const tagStore = useTagStore()
  const collectionStore = useCollectionStore()

  const getLabel = (breadcrumb: string) => {
    if (breadcrumb === 'tag') {
      const tagId = route.params.tagId as string
      const tag = tagStore.tags.find((t) => t.id === tagId)
      return tag ? `Tag: ${tag.name}` : "Tag"
    }

    if (breadcrumb === 'collection') {
      const collectionId = route.params.collectionId as string
      const collection = collectionStore.collections.find((c) => c.id === collectionId)
      return collection ? `Coleção: ${collection.title}` : "Coleção"
    }

    return breadcrumb
  }

  const breadcrumbs = computed(() =>
    route.matched
      .filter((r) => r.meta?.breadcrumb)
      .map((r) => ({
        label: getLabel(String(r.meta.breadcrumb)),
        to: r.path,
      }))
  )

  return { breadcrumbs }
}
