<script setup lang="ts">
import { computed } from "vue"
import { referenceFields } from "@/lib/reference/fields"
import VeeInput from "@/components/VeeInput.vue"
import { CreatorsInput } from "@/components/inputs"
import { ScanBarcode } from "lucide-vue-next"

const props = defineProps<{ name: string }>()

const field = computed(() => referenceFields[props.name])

const shouldRender = computed(() => !!field.value && field.value.type !== "tags")
</script>

<template>
  <div v-if="shouldRender" class="w-full">
    <CreatorsInput v-if="field!.type === 'creators'" :name="name" :label="field!.label" />

    <VeeInput
      v-else-if="field!.type === 'identifier'"
      :name="name"
      :label="field!.label"
      placeholder="ex: 10.1000/xyz123"
    >
      <template #prepend>
        <ScanBarcode class="w-4 h-4 text-muted-foreground" />
      </template>
    </VeeInput>

    <VeeInput
      v-else-if="field!.type === 'url'"
      :name="name"
      :label="field!.label"
      type="url"
      placeholder="https://..."
    />

    <VeeInput v-else :name="name" :label="field!.label" :type="field!.type" />
  </div>
</template>
