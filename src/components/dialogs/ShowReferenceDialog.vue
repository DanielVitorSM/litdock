<script setup lang="ts">
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Users, SaveAll, FileText } from "lucide-vue-next"
import type { Reference } from "@/types/reference.types"
import { toast } from "vue-sonner"
import { Spinner } from "@/components/ui/spinner"
import { concatenateCreators } from "@/lib/utils"
import { useReferenceStore } from "@/stores/reference"
import { storeToRefs } from "pinia"
import ReferenceDetailForm from "@/components/forms/ReferenceDetailForm.vue"
import { PaperUploadInput } from "@/components/inputs"

const reference = defineModel<Reference>({ required: true })
const emit = defineEmits<{ (e: "back"): void }>()
const referenceStore = useReferenceStore()
const { loading } = storeToRefs(referenceStore)

const onSave = () => {
  if (!reference.value) return

  loading.value = true
  referenceStore
    .addReference(reference.value)
    .then(() => {
      toast.success("Referência salva com sucesso!")
      emit("back")
    })
    .catch((error) => {
      toast.error(`Erro ao salvar referência: ${error.message || error}`)
    })
}
</script>

<template>
  <Dialog>
    <DialogContent class="px-0 space-y-0">
      <DialogHeader class="px-6 py-4 border-b">
        <DialogTitle class="text-lg font-bold leading-tight">
          <p class="line-clamp-4">
            {{ reference.title }}
          </p>
        </DialogTitle>
        <DialogDescription class="flex items-start gap-2">
          <Users class="w-4 h-4 mt-1 shrink-0" />
          <p class="text-sm">
            {{ concatenateCreators(reference.creators) }}
          </p>
        </DialogDescription>
      </DialogHeader>

      <ScrollArea class="h-[55dvh] w-full px-6">
        <ReferenceDetailForm v-model="reference" />

        <div class="mt-4 w-full">
          <label
            for="pdfPath"
            class="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1"
          >
            <FileText class="w-4 h-4" />
            Arquivo PDF
          </label>
          <PaperUploadInput id="pdfPath" v-if="!reference.id" v-model="reference.pdfPath" />
        </div>
      </ScrollArea>

      <DialogFooter class="px-6 flex gap-2">
        <DialogClose as-child>
          <Button variant="outline" @click="() => emit('back')"> Voltar </Button>
        </DialogClose>
        <Button class="flex-grow" @click.prevent="onSave" :disabled="loading">
          <SaveAll class="h-4 w-4" v-if="!loading" />
          <Spinner v-else />
          Salvar
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
