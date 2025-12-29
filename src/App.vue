<script lang="ts" setup>
import { onMounted } from "vue"
import { Toaster } from "vue-sonner"
import { useThemeStore } from "@/stores/theme"
import "vue-sonner/style.css"

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initTheme()
})
</script>

<template>
  <RouterView />
  <Toaster />
</template>
