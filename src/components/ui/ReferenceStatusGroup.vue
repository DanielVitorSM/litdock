<script setup lang="ts">
import { computed } from "vue"
import { storeToRefs } from "pinia"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Circle, BookOpen, CheckCircle2, Archive, ChevronDown } from "lucide-vue-next"
import type { ReferenceStatus } from "@/types/reference.types"
import { useReferenceUiStore } from "@/stores/referenceUi"

const referenceUiStore = useReferenceUiStore()
const { selectedReference } = storeToRefs(referenceUiStore)

const options = {
  unread: { label: "Não lido", icon: Circle, color: "text-orange-500", bg: "bg-orange-100" },
  reading: { label: "Lendo", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-100" },
  finished: { label: "Lido", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
  archived: { label: "Arquivado", icon: Archive, color: "text-slate-600", bg: "bg-slate-100" },
}

const current = computed(() =>
  selectedReference.value?.status && options[selectedReference.value.status]
    ? options[selectedReference.value.status]
    : options.unread,
)

const handleSelect = (val: string) => {
  referenceUiStore.updateStatus(val as ReferenceStatus)
}
</script>

<template>
  <DropdownMenu v-if="selectedReference">
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        size="sm"
        class="h-7 gap-2 rounded-md border px-3 text-xs font-medium transition-all hover:bg-accent"
        :class="[current.color, 'border-transparent bg-secondary/50']"
      >
        <component :is="current.icon" class="w-3.5 h-3.5" />
        <span>{{ current.label }}</span>
        <ChevronDown class="w-3 h-3 opacity-50" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="start">
      <DropdownMenuRadioGroup
        :model-value="selectedReference.status"
        @update:model-value="handleSelect"
      >
        <DropdownMenuRadioItem
          v-for="(opt, key) in options"
          :key="key"
          :value="key"
          class="gap-2 text-xs"
        >
          <component :is="opt.icon" class="w-3.5 h-3.5" :class="opt.color" />
          {{ opt.label }}
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
