<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useField, useForm } from "vee-validate"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

import { FieldGroup } from "@/components/ui/field"

import ReferenceFieldRenderer from "@/components/ReferenceFieldRenderer.vue"

import { referenceTypeOptions, type ReferenceType } from "@/lib/reference/types"
import { fieldsByReferenceType } from "@/lib/reference/fields"
import { buildReferenceSchema } from "@/lib/reference/validation"
import { toTypedSchema } from "@vee-validate/zod"
import { PaperUploadInput } from "../inputs"

const formSchema = computed(() => toTypedSchema(buildReferenceSchema(type.value)))

const type = ref<ReferenceType>("journalArticle")
const { value: pdfPath } = useField<string | undefined>("pdfPath")

const generateInitialFields = (newType: ReferenceType) => {
  const config = fieldsByReferenceType[newType]!

  const initial: Record<string, unknown> = { pdfPath: undefined }

  for (const field of [...config.required, ...config.optional]) {
    if (field === "creators") {
      initial[field] = []
    } else {
      initial[field] = ""
    }
  }

  return initial
}

const { resetForm, handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: generateInitialFields(type.value),
  validateOnMount: false,
  name: "add-reference-form",
})

const handleFileUpdate = (path: string | null) => {
  pdfPath.value = path || undefined
}

watch(type, (newType) => {
  if (!newType) return
  resetForm({ values: generateInitialFields(newType) })
})

const visibleFields = computed(() => {
  if (!type.value) return []

  const { required, optional } = fieldsByReferenceType[type.value]!

  return [...required, ...optional]
})

defineExpose({ handleSubmit })
</script>

<template>
  <Select v-model="type">
    <SelectTrigger class="w-full mb-8">
      <SelectValue placeholder="Selecione um tipo" />
    </SelectTrigger>

    <SelectContent>
      <SelectGroup>
        <SelectLabel>Tipos de referência</SelectLabel>
        <SelectItem v-for="opt in referenceTypeOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>

  <FieldGroup v-if="type" class="gap-3 space-y-4">
    <ReferenceFieldRenderer v-for="field in visibleFields" :key="field" :name="field" />

    <div class="space-y-2 pt-4 border-t">
      <Label>Arquivo PDF / Documento</Label>

      <PaperUploadInput :model-value="pdfPath" @update:model-value="handleFileUpdate" />
    </div>
  </FieldGroup>
</template>
