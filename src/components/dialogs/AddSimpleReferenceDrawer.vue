<script setup lang="ts">
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import VeeInput from "@/components/VeeInput.vue"
import { Link, Plus } from "lucide-vue-next"
import { toTypedSchema } from "@vee-validate/zod"
import z from "zod"
import { useForm } from "vee-validate"
import { nextTick, ref, watch } from "vue"
import { detectIdType, fetchReference } from "@/lib/clients"
import AddReferenceDialog from "@/components/dialogs/AddReferenceDialog.vue"
import { Spinner } from "@/components/ui/spinner"
import ShowReferenceDialog from "./ShowReferenceDialog.vue"
import type { Reference } from "@/types/reference.types"
import { useOnline } from "@vueuse/core"

const simpleReferenceSchema = toTypedSchema(
  z.object({
    identifier: z.string().refine((value) => {
      try {
        return detectIdType(value) !== null
      } catch {
        return false
      }
    }, "Informe um identificador ou URL válido"),
  }),
)

const isDrawerOpen = defineModel("open", { type: Boolean, default: false })
const loading = ref(false)
const isShowReferenceDialogOpen = ref(false)
const isAddReferenceDialogOpen = ref(false)
const referenceData = ref<Reference | null>(null)
const isOnline = useOnline()
const { handleSubmit, setErrors } = useForm({
  validationSchema: simpleReferenceSchema,
  initialValues: { identifier: "" },
})

const onSubmit = handleSubmit((data) => {
  loading.value = true

  fetchReference(data.identifier)
    .then((reference) => {
      referenceData.value = reference
      isDrawerOpen.value = false
      isShowReferenceDialogOpen.value = true
    })
    .catch((error) => {
      console.error(error)
      setErrors({ identifier: "Não foi possível buscar os dados da referência." })
    })
    .finally(() => (loading.value = false))
})

const autoFocusInput = async () => {
  await nextTick()
  document.getElementById("identifier-input")?.focus()
}

const openDialogFromDrawer = () => {
  isDrawerOpen.value = false
  isAddReferenceDialogOpen.value = true
}

const comeBackToDrawer = () => {
  isShowReferenceDialogOpen.value = false
  isAddReferenceDialogOpen.value = false
  isDrawerOpen.value = true
  autoFocusInput()
}

watch(isDrawerOpen, (newVal) => {
  if (newVal) {
    autoFocusInput()
  }
})
</script>

<template>
  <AddReferenceDialog v-model:open="isAddReferenceDialogOpen" @back="comeBackToDrawer" />
  <ShowReferenceDialog
    v-if="referenceData"
    v-model="referenceData"
    v-model:open="isShowReferenceDialogOpen"
    @back="comeBackToDrawer"
  />

  <Drawer v-model:open="isDrawerOpen">
    <DrawerTrigger as-child>
      <Button
        size="icon"
        variant="default"
        title="Adicionar"
        aria
        class="absolute text-white bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 [&_svg]:h-6 [&_svg]:w-6"
      >
        <slot>
          <Plus class="icon size-8" />
        </slot>
      </Button>
    </DrawerTrigger>
    <DrawerContent>
      <form id="reference-form" novalidate @submit="onSubmit" class="mx-auto w-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Adicionar referência por identificador</DrawerTitle>
          <DrawerDescription>
            Insira um identificador ou URL para adicionar uma referência de forma simples à sua
            coleção.
          </DrawerDescription>
        </DrawerHeader>
        <div class="px-4 py-0">
          <VeeInput
            v-bind:validate-on-blur="false"
            v-bind:validate-on-change="false"
            label="Identificador ou URL"
            name="identifier"
            v-slot="{ field, errors }"
          >
            <InputGroup v-bind="field">
              <InputGroupInput
                placeholder="DOI, PMID, arXiv ID, ISBN ou URL"
                type="text"
                v-bind="field"
                name="identifier"
                id="identifier-input"
                :aria-invalid="!!errors.length"
              />
              <InputGroupAddon align="inline-start">
                <InputGroupButton size="icon-xs" type="button">
                  <Link />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </VeeInput>
        </div>
        <DrawerFooter>
          <Button
            variant="secondary"
            type="button"
            :disabled="loading || !isOnline"
            @click="openDialogFromDrawer"
          >
            Adicionar manualmente
          </Button>

          <Button type="submit" :disabled="loading || !isOnline">
            <Spinner v-if="loading" />
            Adicionar
          </Button>

          <DrawerClose as-child>
            <Button variant="outline" type="button" :disabled="loading"> Cancelar </Button>
          </DrawerClose>
        </DrawerFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>
