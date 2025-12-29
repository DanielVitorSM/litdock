<script setup lang="ts">
import { computed } from "vue"
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Star, Calendar } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Reference } from "@/types/reference.types"
import { concatenateCreators } from "@/lib/utils"
import dayjs from "dayjs"
import { referenceTypeColorDict, referenceTypeIconDict } from "@/lib/reference/types"
import { useReferenceStore } from "@/stores/reference"
import { DEFAULT_TAG_COLOR, ICON_COLOR_MAP, TAG_BACKGROUND_COLORS } from "@/lib/constants"
import { useReferenceUiStore } from "@/stores/referenceUi"

const props = defineProps<{ reference: Reference }>()

const referenceStore = useReferenceStore()
const referenceUiStore = useReferenceUiStore()

const itemIcon = computed(() => referenceTypeIconDict[props.reference.type] || "FileText")
const itemColorClass = computed(() => {
  const typeKey = referenceTypeColorDict[props.reference.type] || "academic"
  return ICON_COLOR_MAP[typeKey]
})

const handleSelect = () => {
  referenceUiStore.selectReference(props.reference)
}

const handleFavorite = async () => {
  await referenceStore.toggleIsFavorite(props.reference.id!, !props.reference.isFavorite)
}

const getClassForTag = (tagColor: string | null | undefined) => {
  return TAG_BACKGROUND_COLORS[tagColor || DEFAULT_TAG_COLOR]
}
</script>

<template>
  <Item
    variant="outline"
    as-child
    role="listitem"
    class="group relative overflow-hidden transition-all duration-200 hover:border-primary/50 hover:shadow-sm bg-card"
    :class="{
      'ring-1 ring-primary border-primary': referenceUiStore.selectedReference?.id === reference.id,
    }"
  >
    <a @click="handleSelect" class="cursor-pointer flex items-start p-4 gap-4">
      <ItemMedia
        class="hidden md:flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-transparent transition-colors"
        :class="itemColorClass"
      >
        <component :is="itemIcon" class="h-6 w-6" />
      </ItemMedia>

      <ItemContent class="min-w-0 flex-1 flex flex-col gap-1">
        <div class="flex justify-between items-start gap-2">
          <ItemTitle class="text-base font-semibold text-foreground leading-tight line-clamp-3">
            {{ reference.title }}
          </ItemTitle>

          <Button
            @click.prevent.stop="handleFavorite"
            size="icon"
            variant="ghost"
            class="h-6 w-6 shrink-0 -mt-1 -mr-1 rounded-full hover:bg-transparent hover:scale-110 transition-all"
            :title="reference.isFavorite ? 'Remover favorito' : 'Favoritar'"
          >
            <Star
              class="h-4 w-4 transition-all"
              :class="
                reference.isFavorite
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-muted-foreground/30 group-hover:text-muted-foreground'
              "
            />
          </Button>
        </div>

        <ItemDescription class="text-sm text-muted-foreground line-clamp-1">
          {{ concatenateCreators(reference.creators) || "Autor desconhecido" }}
        </ItemDescription>

        <div class="mt-2 flex items-center gap-2 flex-wrap">
          <div
            v-if="reference.date"
            class="flex items-center text-xs text-muted-foreground bg-muted/50 h-5 px-2 py-0.5 rounded-md"
          >
            <Calendar class="mr-1 h-3 w-3" />
            {{ dayjs(reference.date).format("YYYY") }}
          </div>

          <div v-if="reference.tags?.length" class="flex items-center gap-1">
            <Badge
              v-for="tag in reference.tags.slice(0, 2)"
              :key="tag.id"
              variant="secondary"
              class="h-5 px-1.5 font-normal"
              :class="getClassForTag(tag.color)"
            >
              {{ tag.name }}
            </Badge>
            <span v-if="reference.tags.length > 2" class="text-[10px] text-muted-foreground">
              +{{ reference.tags.length - 2 }}
            </span>
          </div>

          <div
            v-if="reference.status && reference.status !== 'unread'"
            class="ml-auto flex items-center gap-1.5"
          >
            <span class="relative flex h-2 w-2">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-primary"
                v-if="reference.status === 'reading'"
              ></span>
              <span
                class="relative inline-flex rounded-full h-2 w-2"
                :class="{
                  'bg-blue-500': reference.status === 'reading',
                  'bg-green-500': reference.status === 'finished',
                  'bg-orange-500': reference.status === 'archived',
                }"
              ></span>
            </span>
          </div>
        </div>
      </ItemContent>
    </a>
  </Item>
</template>
