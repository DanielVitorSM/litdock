<script setup lang="ts">
import { ref, type InputHTMLAttributes, useAttrs, computed } from "vue"
import { Eye, EyeClosed } from "lucide-vue-next"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

const visible = ref(false)
const attrs = useAttrs() as InputHTMLAttributes

const type = computed(() => (visible.value ? "text" : "password"))
const title = computed(() => (visible.value ? "Ocultar senha" : "Ver senha"))

defineOptions({ inheritAttrs: false })
</script>

<template>
  <InputGroup>
    <InputGroupInput placeholder="••••••••" :type="type" v-bind="attrs" />
    <InputGroupAddon align="inline-end">
      <InputGroupButton
        :aria-label="title"
        :title="title"
        size="icon-xs"
        type="button"
        tabindex="-1"
        @click="visible = !visible"
      >
        <Eye v-if="visible" />
        <EyeClosed v-if="!visible" />
      </InputGroupButton>
    </InputGroupAddon>
  </InputGroup>
</template>
