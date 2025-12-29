<script setup lang="ts">
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
import { storeToRefs } from "pinia"
import ReferenceDetailForm from "@/components/forms/ReferenceDetailForm.vue"
import ReferenceStatusGroup from "@/components/ui/ReferenceStatusGroup.vue"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { BookOpen, Trash2, Users, X } from "lucide-vue-next"
import { concatenateCreators } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { ref } from "vue"
import { Spinner } from "@/components/ui/spinner"
import { useReferenceUiStore } from "@/stores/referenceUi"

defineProps<{ hideClose?: boolean }>()
const referenceStore = useReferenceUiStore()
const { selectedReference } = storeToRefs(referenceStore)
const { clearSelection, deleteReference } = referenceStore
const isDeleting = ref(false)
const isAlertOpen = ref(false)

const handleDelete = async () => {
  if (!selectedReference.value) return

  isDeleting.value = true
  try {
    await deleteReference()
  } finally {
    isDeleting.value = false
    isAlertOpen.value = false
  }
}
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex flex-row items-center justify-between pt-4 px-4">
      <h2 class="text-sm text-muted-foreground">Detalhes</h2>
      <Button v-if="!hideClose" @click="clearSelection" variant="ghost" size="icon-sm">
        <X class="w-4 h-4" />
      </Button>
    </div>

    <div v-if="selectedReference" class="p-4 pb-0 space-y-2">
      <div class="text-lg font-bold">
        <h2 class="line-clamp-4 leading-tight">
          {{ selectedReference.title }}
        </h2>
      </div>
      <div class="flex items-start gap-2 text-muted-foreground">
        <Users class="w-4 h-4 mt-1 shrink-0" />
        <p class="text-sm">
          {{ concatenateCreators(selectedReference.creators) }}
        </p>
      </div>
      <div class="flex justify-end items-center space-x-2">
        <Separator />
        <ReferenceStatusGroup />
      </div>
    </div>

    <div class="flex-grow w-full overflow-hidden">
      <ScrollArea v-if="selectedReference" class="h-full p-2 pt-2">
        <div class="p-2">
          <ReferenceDetailForm v-model="selectedReference" />

          <Button
            variant="destructive"
            @click="isAlertOpen = true"
            :disabled="isDeleting"
            class="mt-2 w-full"
          >
            <Spinner v-if="isDeleting" />
            <Trash2 v-else class="w-4 h-4" />
            {{ isDeleting ? "Excluindo..." : "Excluir referência" }}
          </Button>
        </div>
      </ScrollArea>
    </div>

    <div class="px-4 pb-4 flex flex-col gap-2">
      <Button
        class="flex-grow"
        v-if="selectedReference?.pdfPath"
        @click="referenceStore.openPdfReader"
      >
        <BookOpen class="w-5 h-5 mr-2" />
        Abrir PDF
      </Button>
      <Button variant="outline" class="w-full" @click="clearSelection"> Voltar </Button>
    </div>

    <AlertDialog v-model:open="isAlertOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir referência?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente a referência
            <b>{{ selectedReference?.title }}</b> e removerá quaisquer arquivos PDF associados do
            armazenamento.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel :disabled="isDeleting">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            @click.prevent="handleDelete"
            class="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            :disabled="isDeleting"
          >
            <span v-if="isDeleting">Excluindo...</span>
            <span v-else>Sim, excluir</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
