<script setup lang="ts">
import { storeToRefs } from "pinia"
import { useMediaQuery } from "@vueuse/core"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import ReferenceDetailContent from "@/components/ReferenceDetailContent.vue"
import { useReferenceUiStore } from "@/stores/referenceUi"

const referenceStore = useReferenceUiStore()
const { isSidebarOpen } = storeToRefs(referenceStore)
const { clearSelection } = referenceStore

const isDesktop = useMediaQuery("(min-width: 1024px)")
</script>

<template>
  <Sheet v-if="!isDesktop" :open="isSidebarOpen" @update:open="(val) => !val && clearSelection()">
    <SheetContent side="right" class="w-full sm:w-[540px] p-0 border-l">
      <ReferenceDetailContent hide-close />
    </SheetContent>
  </Sheet>

  <aside
    v-else
    class="sticky top-0 h-screen bg-background transition-all duration-300 ease-in-out overflow-hidden border-l-0 shadow-xl lg:shadow-none"
    :class="[isSidebarOpen ? 'w-[35vw] border-l opacity-100' : 'w-0 opacity-0 border-l-0']"
  >
    <div class="w-[35vw] h-full">
      <ReferenceDetailContent />
    </div>
  </aside>
</template>
