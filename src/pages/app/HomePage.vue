<script setup lang="ts">
import AddSimpleReferenceDrawer from "@/components/dialogs/AddSimpleReferenceDrawer.vue"
import ReferenceItem from "@/components/ui/ReferenceItem.vue"
import { Skeleton } from "@/components/ui/skeleton"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { ItemGroup } from "@/components/ui/item"
import { useReferenceStore } from "@/stores/reference"
import { ArrowUpDown, Grid2X2, List, SearchIcon, X } from "lucide-vue-next"
import { storeToRefs } from "pinia"
import { onMounted, ref, watch } from "vue"
import { Button } from "@/components/ui/button"
import { getFromStorage, StorageKeys, saveToStorage } from "@/lib/storage"
import { useInfiniteScroll } from "@vueuse/core"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRoute } from "vue-router"
import type { ReferenceStatus } from "@/types/reference.types"
import { useOnline } from "@vueuse/core"

type ReferenceShowType = "grid" | "list"

const sortOptions: Record<string, string> = {
  "created_at-desc": "Adicionado Recentemente",
  "created_at-asc": "Mais Antigos",
  "title-asc": "Título (A-Z)",
  "date-desc": "Data de Publicação (Recente)",
}
const route = useRoute()
const isOnline = useOnline()
const referenceStore = useReferenceStore()
const isAddReferenceDrawerOpen = ref(false)
const showType = ref<ReferenceShowType>("list")
const { references, loading, total, filters } = storeToRefs(referenceStore)
const { resetAndFetch, loadMore } = referenceStore

const scrollTrigger = ref<HTMLElement | null>(null)
const routeStatuses = ["unread", "reading", "archived", "finished"] as ReferenceStatus[]

useInfiniteScroll(
  scrollTrigger,
  () => {
    if (!loading.value && filters.value.hasMore) {
      loadMore()
    }
  },
  { distance: 10 }, // Distância em px do fundo para disparar
)

const changeShowType = (type: ReferenceShowType) => {
  showType.value = type
  saveToStorage(StorageKeys.HomePageShowType, type)
}

const handleSortChange = (val: string) => {
  const [field, order] = val.split("-")
  filters.value.sortBy = field as "created_at" | "title" | "date"
  filters.value.sortOrder = order as "asc" | "desc"
}

const syncFiltersWithRoute = () => {
  const isFavorite = route.name === "favorites" ? true : null
  const status = routeStatuses.includes(route.name as ReferenceStatus)
    ? (route.name as ReferenceStatus)
    : null
  const tagId = route.params.tagId as string
  const collectionId = route.params.collectionId as string

  referenceStore.filters.isFavorite = isFavorite
  referenceStore.filters.tagId = tagId || null
  referenceStore.filters.tagId = tagId || null
  referenceStore.filters.status = status
  referenceStore.filters.collectionId = collectionId || null

  resetAndFetch()
}

watch(
  () => [route.params.tagId, route.params.collectionId],
  () => {
    const syncRoutes = ["home", "tag", "collection", "favorites", ...routeStatuses]
    if (syncRoutes.includes(route.name as string)) {
      syncFiltersWithRoute()
    }
  },
  { deep: true },
)

onMounted(() => {
  syncFiltersWithRoute()

  const storedShowType = getFromStorage<ReferenceShowType>(StorageKeys.HomePageShowType, "list")
  showType.value = storedShowType
})
</script>

<template>
  <nav class="flex gap-4">
    <InputGroup class="flex-grow">
      <InputGroupInput
        v-model="filters.search"
        placeholder="Buscar por título, autor ou tag..."
        class="transition-all focus:ring-2 ring-primary/20"
      />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupAddon v-if="filters.search" align="inline-end">
        <InputGroupButton @click="filters.search = ''" variant="ghost" aria-label="More" size="sm">
          Limpar
          <X />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>

    <div class="flex gap-1">
      <Button
        :variant="showType === 'list' ? 'secondary' : 'ghost'"
        size="icon"
        title="Exibir em lista"
        @click="changeShowType('list')"
      >
        <List />
      </Button>

      <Button
        :variant="showType === 'grid' ? 'secondary' : 'ghost'"
        size="icon"
        title="Exibir em grade"
        @click="changeShowType('grid')"
      >
        <Grid2X2 />
      </Button>
    </div>
  </nav>

  <div class="flex items-center justify-between" v-if="total > 0 && !loading">
    <span class="text-sm text-neutral-400">
      {{ total == 1 ? "1 referência" : total + " referências" }}
    </span>
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" size="sm" class="h-8 gap-1 text-primary hover:text-primary/80">
          <ArrowUpDown class="w-3.5 h-3.5" />
          <span class="text-xs">
            {{ sortOptions[`${filters.sortBy}-${filters.sortOrder}`] || "Ordenar" }}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="w-56">
        <DropdownMenuRadioGroup
          :model-value="`${filters.sortBy}-${filters.sortOrder}`"
          @update:model-value="handleSortChange"
        >
          <DropdownMenuRadioItem
            v-for="value in Object.keys(sortOptions)"
            :key="value"
            :value="value"
          >
            {{ sortOptions[value] }}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>

  <ScrollArea class="flex-1">
    <div class="p-0.5">
      <ItemGroup
        class="grid auto-rows-min gap-4"
        :class="{ 'xl:grid-cols-2 2xl:grid-cols-3': showType === 'grid' }"
      >
        <template v-if="loading">
          <div class="flex items-center justify-between">
            <Skeleton class="h-[32px] w-[90px] rounded-md" />
            <Skeleton class="h-[32px] w-[190px] rounded-md" />
          </div>
          <Skeleton class="h-[120px] w-full rounded-md" v-for="n in 3" :key="n" />
        </template>

        <template v-else-if="references.length === 0">
          <div class="py-10 space-y-10">
            <p class="text-sm text-muted-foreground col-span-full text-center">
              {{
                isOnline
                  ? "Nenhuma referência encontrada. Tente ajustar seus filtros ou adicionar novas referências."
                  : "Você está offline. Conecte-se à internet para carregar suas referências."
              }}
            </p>

            <div v-if="isOnline" class="flex justify-center items-center">
              <Button @click="isAddReferenceDrawerOpen = true"> Adicionar referência </Button>
            </div>
          </div>
        </template>

        <template v-else>
          <ReferenceItem
            v-for="reference in references"
            :key="reference.id"
            :reference="reference"
          />
        </template>
      </ItemGroup>

      <div ref="scrollTrigger" class="h-4 w-full flex items-center justify-center py-4">
        <Spinner
          v-if="loading && filters.page > 1 && references.length > 0"
          class="text-muted-foreground"
        />
      </div>
    </div>
  </ScrollArea>

  <AddSimpleReferenceDrawer v-model:open="isAddReferenceDrawerOpen" />
</template>
