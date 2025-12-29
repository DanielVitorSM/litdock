<script setup lang="ts">
import {
  Calendar,
  Building2,
  Link as LinkIcon,
  FileText,
  BookOpen,
  ChevronsUpDown,
  ScanBarcode,
  Tag,
  Folder,
} from "lucide-vue-next"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import MetaItemCard from "../ui/MetaItemCard.vue"
import type { Reference, Tag as TagType } from "@/types/reference.types"
import dayjs from "dayjs"
import { referenceTypeDict } from "@/lib/reference/types"
import { Button } from "@/components/ui/button"
import { TagInput, CollectionInput } from "@/components/inputs"
import { Textarea } from "@/components/ui/textarea"
import { useDebounceFn } from "@vueuse/core"
import { ref } from "vue"
import { useReferenceUiStore } from "@/stores/referenceUi"

const reference = defineModel<Reference>({ required: true })
const referenceUiStore = useReferenceUiStore()
const dirtyNotes = ref(false)
const savingNotes = ref(false)
const savedNotes = ref(false)

const autoSaveNotes = useDebounceFn((newNote: string) => {
  dirtyNotes.value = false
  savingNotes.value = true

  referenceUiStore.updateNotes(newNote).finally(() => {
    savingNotes.value = false
    savedNotes.value = true

    setTimeout(() => {
      savedNotes.value = false
    }, 2000)
  })
}, 1500)

const handleInput = (e: Event) => {
  dirtyNotes.value = true
  const target = e.target as HTMLTextAreaElement
  autoSaveNotes(target.value)
}

const handleTagsUpdate = (finalTags: TagType[]) => {
  referenceUiStore.updateTags(finalTags)
}

const handleCollectionUpdate = (newColId: string | null) => {
  if (reference.value.id) {
    referenceUiStore.updateCollection(newColId)
  } else {
    reference.value.collectionId = newColId
  }
}
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
    <MetaItemCard label="Coleção" :icon="Folder" class="sm:col-span-3">
      <CollectionInput :collection-id="reference.collectionId" @update="handleCollectionUpdate" />
    </MetaItemCard>

    <MetaItemCard v-if="reference.id" label="Tags" :icon="Tag" class="sm:col-span-3">
      <TagInput :item-tags="reference.tags ?? []" @update="handleTagsUpdate" />
    </MetaItemCard>

    <MetaItemCard v-if="reference.id" label="Notas" :icon="FileText" class="sm:col-span-3">
      <Textarea
        v-model="reference.notes"
        @input="handleInput"
        placeholder="Escreva suas observações, fichamentos ou ideias sobre este artigo..."
        class="min-h-[100px] resize-y bg-background"
        maxlength="2500"
      />

      <div class="text-xs text-muted-foreground text-right mt-1 h-4">
        <span v-if="dirtyNotes" class="text-yellow-500">Não salvo</span>
        <span v-if="savingNotes" class="animate-pulse">Salvando...</span>
        <span v-else-if="savedNotes" class="text-primary">Salvo</span>
      </div>
    </MetaItemCard>

    <MetaItemCard v-if="reference.type" class="sm:col-span-3" label="Tipo" :icon="FileText">
      {{ referenceTypeDict[reference.type] || reference.type }}
    </MetaItemCard>

    <MetaItemCard v-if="reference.date" label="Ano" :icon="Calendar">
      {{ dayjs(reference.date).format("YYYY") }}
    </MetaItemCard>

    <MetaItemCard v-if="reference.pages" label="Páginas" :icon="BookOpen">
      {{ reference.pages }}
    </MetaItemCard>

    <MetaItemCard v-if="reference.volume" label="Volume" :icon="BookOpen">
      {{ reference.volume }}
    </MetaItemCard>

    <MetaItemCard v-if="reference.issue" label="Edição" :icon="BookOpen">
      {{ reference.issue }}
    </MetaItemCard>

    <MetaItemCard v-if="reference.language" label="Idioma" :icon="BookOpen">
      {{ reference.language.toUpperCase() }}
    </MetaItemCard>

    <MetaItemCard
      v-if="reference.publisher"
      label="Editora / Publisher"
      :icon="Building2"
      class="sm:col-span-3"
      :url="reference.publisher"
    >
      {{ reference.publisher }}
    </MetaItemCard>

    <MetaItemCard
      v-if="reference.issn"
      label="ISSN"
      class="sm:col-span-3"
      :icon="BookOpen"
      type="code"
    >
      {{ reference.issn }}
    </MetaItemCard>

    <MetaItemCard
      v-if="reference.doi"
      label="DOI"
      :icon="BookOpen"
      class="sm:col-span-3"
      type="url"
      :url="`https://doi.org/${reference.doi}`"
    >
      {{ reference.doi }}
    </MetaItemCard>

    <MetaItemCard
      v-if="reference.url && reference.doi && !reference.url.includes(reference.doi)"
      label="URL"
      :icon="LinkIcon"
      class="sm:col-span-3"
      type="url"
      :url="reference.url"
    >
      {{ reference.url }}
    </MetaItemCard>

    <MetaItemCard
      v-if="reference.abstract"
      label="Resumo / Abstract"
      class="sm:col-span-3"
      type="card"
    >
      {{ reference.abstract }}
    </MetaItemCard>

    <Collapsible
      v-if="reference.bibliography && reference.bibliography.length > 0"
      class="flex w-full sm:col-span-3 flex-col gap-2"
    >
      <CollapsibleTrigger as-child>
        <div
          class="flex cursor-pointer bg-muted/40 border-2 items-center justify-between gap-4 py-4 px-6 rounded-lg text-sm font-medium text-muted-foreground"
        >
          <h4>Referências ({{ reference.bibliography.length }})</h4>
          <ChevronsUpDown :size="16" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent class="flex flex-col gap-1">
        <div class="flex flex-col p-2 gap-2">
          <div
            v-for="(item, index) in reference.bibliography"
            :key="item.key || item.doi || index"
            class="group relative flex flex-row gap-1 items-center rounded-md border bg-background p-3 text-sm hover:border-primary/50 hover:shadow-sm transition-all space-x-4"
          >
            <div class="flex flex-col flex-grow gap-1">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 space-y-1">
                  <p v-if="item.title" class="font-medium text-foreground leading-tight">
                    {{ item.title }}
                  </p>

                  <p
                    v-else-if="item.unstructured"
                    class="text-muted-foreground italic leading-tight break-all"
                  >
                    "{{ item.unstructured }}"
                  </p>

                  <div v-else-if="item.doi" class="flex items-center gap-2">
                    <ScanBarcode class="w-4 h-4 text-muted-foreground" />
                    <code
                      class="text-xs bg-muted px-1.5 py-0.5 rounded border font-mono text-primary"
                    >
                      {{ item.doi }}
                    </code>
                    <!-- <span class="text-xs text-muted-foreground">(Metadados indisponíveis)</span> -->
                  </div>

                  <span v-else class="text-muted-foreground italic">
                    Referência sem dados legíveis
                  </span>
                </div>
              </div>

              <div
                v-if="item.title"
                class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1"
              >
                <span v-if="item.author" class="font-medium text-foreground/80">
                  {{ item.author }}
                </span>

                <span v-if="item.author && item.year">•</span>

                <span v-if="item.year">{{ item.year }}</span>

                <span v-if="(item.author || item.year) && item.doi">•</span>

                <span v-if="item.doi" class="font-mono text-[10px]">
                  {{ item.doi }}
                </span>
              </div>
            </div>

            <!-- <div class="text-muted-foreground h-full flex items-start justify-end">
              <Button size="icon-sm" variant="ghost">
                <Search />
              </Button>
            </div> -->
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  </div>
</template>
