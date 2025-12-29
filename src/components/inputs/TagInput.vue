<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { X, Plus, Trash2 } from "lucide-vue-next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useTagStore } from "@/stores/tag"
import type { Tag } from "@/types/reference.types"
import { TAG_COLORS, DEFAULT_TAG_COLOR, type TagColor } from "@/lib/constants"
import { toast } from "vue-sonner"
import { Spinner } from "@/components/ui/spinner"

const props = defineProps<{ itemTags: Tag[] }>()
const emit = defineEmits(["update"])

const tagStore = useTagStore()
const open = ref(false)
const confirmAlertOpen = ref(false)
const confirmAlertCallback = ref(() => {})
const searchQuery = ref("")
const isDeleting = ref<string | null>(null)

const localTags = ref<Tag[]>([...props.itemTags])

const availableTags = computed(() => {
  const currentIds = new Set(localTags.value.map((t) => t.id))
  return tagStore.tags.filter((t) => !currentIds.has(t.id))
})

const handleSelect = (tag: Tag) => {
  if (localTags.value.some((t) => t.id === tag.id)) return
  const newList = [...localTags.value, tag]
  localTags.value = newList
  emit("update", newList)
  open.value = false
  searchQuery.value = ""
}

const handleRemoveLink = (tagId?: string, tagName?: string) => {
  const newList = localTags.value.filter((t) => {
    if (tagId) return t.id !== tagId
    return t.name !== tagName
  })
  localTags.value = newList
  emit("update", newList)
}

const handleCreate = async (color: TagColor) => {
  const name = searchQuery.value.trim()
  if (!name) return

  try {
    const newTag = await tagStore.createTag(name, color)
    handleSelect(newTag)
  } catch (e) {
    console.error("Erro ao criar tag", e)
  }
}

const handleGlobalDelete = async (tagId: string) => {
  confirmAlertOpen.value = true
  confirmAlertCallback.value = async () => {
    confirmAlertOpen.value = false
    try {
      isDeleting.value = tagId
      await tagStore.deleteTag(tagId)

      if (localTags.value.some((t) => t.id === tagId)) {
        handleRemoveLink(tagId)
      }
    } catch (e) {
      console.log("Erro ao deletar tag", e)
      toast.error("Erro ao deletar tag globalmente.")
    } finally {
      isDeleting.value = null
      confirmAlertCallback.value = () => {}
    }
  }
}

const getTagClass = (color?: string) => {
  const colorKey = (color as TagColor) || DEFAULT_TAG_COLOR
  return TAG_COLORS[colorKey] || TAG_COLORS[DEFAULT_TAG_COLOR]
}
const getBgClass = (colorKey: string) => `bg-${colorKey}-500`

watch(
  () => props.itemTags,
  (newVal) => {
    localTags.value = [...newVal]
  },
  { deep: true },
)

watch(open, (isOpen) => {
  if (!isOpen) {
    searchQuery.value = ""
  }
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-wrap gap-2">
      <Badge
        v-for="(tag, index) in localTags"
        :key="tag.id || index"
        variant="outline"
        class="pl-3 pr-0 py-0 flex items-center gap-1 transition-all group border"
        :class="getTagClass(tag.color)"
      >
        {{ tag.name }}
        <Button
          variant="ghost"
          size="icon-sm"
          class="rounded-full"
          @click.stop="handleRemoveLink(tag.id, tag.name)"
          title="Remover desta referência"
        >
          <X />
        </Button>
      </Badge>

      <Popover v-model:open="open">
        <PopoverTrigger as-child>
          <Button
            variant="outline"
            :size="localTags.length ? 'icon-sm' : 'sm'"
            class="rounded-full"
          >
            <Plus />
            {{ localTags.length === 0 ? "Adicionar Tag" : "" }}
          </Button>
        </PopoverTrigger>

        <PopoverContent class="p-0 w-[260px]" align="start">
          <Command>
            <CommandInput placeholder="Buscar ou criar..." v-model="searchQuery" />

            <CommandList>
              <div v-if="searchQuery" class="p-2 border-b bg-muted/20">
                <p class="text-xs text-muted-foreground mb-2 px-1">
                  Criar "<strong>{{ searchQuery }} </strong>":
                </p>
                <div class="flex flex-wrap gap-1.5 px-1">
                  <button
                    v-for="(cls, colorKey) in TAG_COLORS"
                    :key="colorKey"
                    class="w-10 h-10 rounded-full border border-black/10 transition-transform hover:scale-110 focus:outline-none focus:ring-2 ring-offset-1 ring-primary"
                    :class="getBgClass(String(colorKey))"
                    :title="String(colorKey)"
                    @click="handleCreate(colorKey as TagColor)"
                  ></button>
                </div>
              </div>

              <CommandEmpty
                v-if="!searchQuery"
                class="py-6 text-center text-xs text-muted-foreground"
              >
                Selecione uma tag ou digite para criar.
              </CommandEmpty>

              <CommandGroup heading="Disponíveis" v-if="availableTags.length > 0">
                <CommandItem
                  v-for="tag in availableTags"
                  :key="tag.id"
                  :value="tag.name"
                  @select="handleSelect(tag)"
                  class="group flex items-center justify-between cursor-pointer"
                >
                  <div class="flex items-center">
                    <div
                      class="w-2 h-2 rounded-full mr-2"
                      :class="getBgClass(tag.color || DEFAULT_TAG_COLOR)"
                    ></div>
                    <span>{{ tag.name }}</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    class="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                    @click.stop="handleGlobalDelete(tag.id)"
                    title="Excluir tag globalmente"
                  >
                    <Spinner v-if="isDeleting === tag.id" class="w-3.5 h-3.5" />
                    <Trash2 v-else class="w-3.5 h-3.5" />
                  </Button>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>

    <AlertDialog v-model:open="confirmAlertOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação irá deletar a tag globalmente e removê-la de <b>TODAS</b> as referências.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="confirmAlertOpen = false">Cancelar</AlertDialogCancel>
          <AlertDialogAction @click="confirmAlertCallback" class="bg-red-500 hover:bg-red-800"
            >Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
