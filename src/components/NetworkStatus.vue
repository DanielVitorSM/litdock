<script setup lang="ts">
import { useOnline } from "@vueuse/core"
import { WifiOff, Wifi } from "lucide-vue-next"
import { watch } from "vue"
import { toast } from "vue-sonner"

const isOnline = useOnline()

watch(isOnline, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    toast.success("Conexão restabelecida!", { icon: Wifi })
  }
})
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="-translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="-translate-y-full opacity-0"
  >
    <div
      v-if="!isOnline"
      class="fixed top-0 left-0 right-0 z-[100] bg-destructive text-destructive-foreground px-4 py-3 shadow-lg flex items-center justify-center gap-2 text-sm font-normal"
    >
      <WifiOff class="w-4 h-4 animate-pulse" />
      <span>Você está offline. Algumas funcionalidades podem estar indisponíveis.</span>
    </div>
  </Transition>
</template>
