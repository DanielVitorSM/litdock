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
import { computed, ref } from "vue"
import ReferenceForm from "@/components/forms/ReferenceForm.vue"
import { Button } from "@/components/ui/button"
import { useReferenceStore } from "@/stores/reference"
import type { Reference } from "@/types/reference.types"
import { Spinner } from "@/components/ui/spinner"

const formRef = ref<InstanceType<typeof ReferenceForm> | null>(null)
const loading = ref(false)

const emit = defineEmits<{ (e: "back"): void }>()

const referenceStore = useReferenceStore()

const onSubmit = computed(() =>
  formRef.value?.handleSubmit((data: Partial<Reference>) => {
    loading.value = true
    referenceStore
      .addReference(data)
      .then(() => emit("back"))
      .finally(() => (loading.value = false))
  }),
)
</script>

<template>
  <Dialog>
    <DialogContent class="px-0">
      <form novalidate @submit="onSubmit" id="add-reference-form">
        <DialogHeader class="px-6">
          <DialogTitle>Nova referência</DialogTitle>
          <DialogDescription>
            Adicione uma nova referência à sua coleção preenchendo o formulário abaixo.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea class="h-[65dvh] w-full py-6">
          <div class="px-6 w-full">
            <ReferenceForm ref="formRef" />
          </div>
        </ScrollArea>

        <DialogFooter class="px-6 flex gap-2">
          <DialogClose as-child>
            <Button @click="emit('back')" variant="outline" :disabled="loading"> Cancelar </Button>
          </DialogClose>
          <Button type="submit" class="flex-grow" :disabled="loading">
            <Spinner v-if="loading" class="mr-2" />
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
