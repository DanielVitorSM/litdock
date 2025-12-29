<script setup lang="ts">
import { ref, computed } from "vue"
import { Plus, Check, ChevronsUpDown, Trash2, Loader2 } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
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
import { useCollectionStore } from "@/stores/collection"
import { storeToRefs } from "pinia"
import { toast } from "vue-sonner"

const props = defineProps<{ collectionId?: string | null }>()
const emit = defineEmits(["update"])

const store = useCollectionStore()
const { collections } = storeToRefs(store)

const open = ref(false)
const searchQuery = ref("")
const isDeleting = ref<string | null>(null)

const confirmAlertOpen = ref(false)
const collectionToDelete = ref<string | null>(null)

const selectedCollection = computed(() =>
  collections.value.find((c) => c.id === props.collectionId),
)

const handleSelect = (id: string | null) => {
  if (props.collectionId === id) return
  emit("update", id)
  open.value = false
  searchQuery.value = ""
}

const handleCreate = async () => {
  const title = searchQuery.value.trim()
  if (!title) return

  try {
    const newCol = await store.createCollection({ title })
    handleSelect(newCol.id)
  } catch (e) {
    console.error(e)
    toast.error("Erro ao criar coleção")
  }
}

const confirmDelete = (id: string) => {
  collectionToDelete.value = id
  confirmAlertOpen.value = true
}

const handleGlobalDelete = async () => {
  if (!collectionToDelete.value) return
  const id = collectionToDelete.value

  try {
    isDeleting.value = id
    confirmAlertOpen.value = false

    await store.deleteCollection(id)

    if (props.collectionId === id) {
      handleSelect(null)
    }

    toast.success("Coleção removida.")
  } catch (error) {
    console.log("Erro ao remover coleção:", error)
    toast.error("Erro ao remover coleção.")
  } finally {
    isDeleting.value = null
    collectionToDelete.value = null
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          role="combobox"
          :aria-expanded="open"
          class="w-full justify-between font-normal bg-background hover:bg-accent/50"
          :class="{ 'text-muted-foreground': !collectionId }"
        >
          <span class="truncate">
            {{ selectedCollection ? selectedCollection.title : "Sem coleção" }}
          </span>
          <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent class="w-[300px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Buscar ou criar coleção..."
            v-model="searchQuery"
            maxlength="25"
          />

          <CommandList>
            <div v-if="searchQuery" class="p-2 border-b bg-muted/20">
              <Button
                variant="ghost"
                size="sm"
                class="w-full justify-start h-8 text-xs"
                @click="handleCreate"
              >
                <Plus class="mr-2 h-3 w-3" />
                Criar "<strong>{{ searchQuery }}</strong
                >"
              </Button>
            </div>

            <CommandEmpty
              v-if="!searchQuery"
              class="py-6 text-center text-xs text-muted-foreground"
            >
              Nenhuma coleção encontrada.
            </CommandEmpty>

            <CommandGroup heading="Coleções" v-if="collections.length > 0">
              <CommandItem
                class="group flex items-center justify-start cursor-pointer gap-0"
                :value="'none'"
                @select="handleSelect(null)"
              >
                <div class="mr-2 flex h-4 w-4 items-center justify-center">
                  <Check v-if="!collectionId" class="h-4 w-4 text-primary" />
                </div>
                <span class="text-muted-foreground">Nenhuma</span>
              </CommandItem>

              <CommandItem
                v-for="col in collections"
                :key="col.id"
                :value="col.title"
                @select="handleSelect(col.id)"
                class="group flex items-center justify-between cursor-pointer"
              >
                <div class="flex items-center flex-1 truncate">
                  <div class="mr-2 flex h-4 w-4 items-center justify-center">
                    <Check v-if="collectionId === col.id" class="h-4 w-4 text-primary" />
                  </div>
                  <span class="truncate">{{ col.title }}</span>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  class="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all shrink-0"
                  @click.stop="confirmDelete(col.id)"
                >
                  <Loader2 v-if="isDeleting === col.id" class="w-3 h-3 animate-spin" />
                  <Trash2 v-else class="w-3.5 h-3.5" />
                </Button>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>

    <AlertDialog v-model:open="confirmAlertOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir coleção?</AlertDialogTitle>
          <AlertDialogDescription>
            Isso removerá a coleção permanentemente. As referências dentro dela <b>não</b> serão
            apagadas, apenas ficarão "Sem coleção".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="confirmAlertOpen = false">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            @click="handleGlobalDelete"
            class="bg-destructive hover:bg-destructive/90"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
