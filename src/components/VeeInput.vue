<script setup lang="ts">
import { useAttrs, type HTMLAttributes } from "vue"
import { Field as VeeField } from "vee-validate"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface Props {
  class?: HTMLAttributes["class"]
  label?: string
  name: string
  type?: string
}

defineProps<Props>()

const attrs = useAttrs()
</script>

<template>
  <VeeField
    v-slot="{ field, errors }"
    :name="name"
    v-bind:validate-on-input="false"
    v-bind:validate-on-model-update="false"
    v-bind:validate-on-change="true"
    v-bind:validate-on-blur="true"
    v-bind:validate-on-mount="false"
  >
    <Field :data-invalid="!!errors.length" class="gap-1.5">
      <div class="flex items-center">
        <FieldLabel :for="name" v-if="label"> {{ label }} </FieldLabel>
        <slot name="label" v-if="$slots.label" />
      </div>

      <slot v-if="$slots.default" :field="field" :errors="errors" />

      <Textarea
        v-else-if="type === 'textarea'"
        v-bind="{ ...field, ...attrs }"
        :id="name"
        :name="name"
        :aria-invalid="!!errors.length"
      />

      <Input
        v-else
        :type="type"
        v-bind="{ ...field, ...attrs }"
        :id="name"
        :name="name"
        :aria-invalid="!!errors.length"
      />

      <FieldError v-if="errors.length" :errors="errors" />
    </Field>
  </VeeField>
</template>
