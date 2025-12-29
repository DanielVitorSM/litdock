<script lang="ts" setup>
import { Check, Copy, ExternalLink, type LucideProps } from "lucide-vue-next"
import { ref, type FunctionalComponent, type HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toast } from "vue-sonner"
import { useClipboard } from "@vueuse/core"

const props = defineProps<{
  label: string
  icon?: FunctionalComponent<LucideProps>
  class?: HTMLAttributes["class"]
  type?: "text" | "code" | "url" | "card" | "custom"
  url?: string
}>()

const codeRef = ref<HTMLElement | null>(null)
const { copy, copied, isSupported } = useClipboard({ legacy: true })

const copyToClipboard = async () => {
  const text = codeRef.value?.textContent ?? ""

  if (!text) return

  await copy(text)

  if (copied.value) {
    toast.success("Copiado!")
  } else if (!isSupported.value) {
    toast.error("Seu navegador não suporta cópia automática")
  }
}
</script>

<template>
  <div
    :class="
      cn(type == 'card' ? 'bg-muted/40 py-4 px-6 rounded-lg space-y-2' : 'space-y-1', props.class)
    "
  >
    <div class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
      <component v-if="props.icon" :is="props.icon" class="w-4 h-4" />
      {{ props.label }}
    </div>

    <p class="text-sm pl-6" v-if="!type || type === 'text'">
      <slot />
    </p>

    <p class="text-sm text-muted-foreground leading-relaxed" v-if="type === 'card'">
      <slot />
    </p>

    <div class="flex items-center gap-2 pl-6 overflow-hidden" v-if="type === 'code'">
      <code ref="codeRef" class="relative rounded font-mono text-sm">
        <slot />
      </code>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="h-6 w-6 shrink-0"
        @click="copyToClipboard"
      >
        <Check v-if="copied" class="h-3 w-3 text-green-500" />
        <Copy v-else class="h-3 w-3" />
      </Button>

      <a v-if="url" :href="url" target="_blank" class="text-muted-foreground hover:text-primary">
        <ExternalLink class="h-3 w-3" />
      </a>
    </div>

    <div class="flex items-center gap-2 pl-6 overflow-hidden" v-if="type === 'url'">
      <a
        :href="url"
        target="_blank"
        ref="codeRef"
        class="text-sm text-primary hover:underline truncate block max-w-[350px]"
      >
        <slot />
      </a>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="h-6 w-6 shrink-0"
        @click="copyToClipboard"
      >
        <Check v-if="copied" class="h-3 w-3 text-green-500" />
        <Copy v-else class="h-3 w-3" />
      </Button>
    </div>

    <div v-if="type === 'custom'" class="pl-6">
      <slot></slot>
    </div>
  </div>
</template>
