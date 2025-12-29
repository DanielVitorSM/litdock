import { getFromStorage, saveToStorage, StorageKeys } from '@/lib/storage'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(true)

  function initTheme() {
    const storedTheme = getFromStorage(StorageKeys.Theme, "dark")

    if (storedTheme) {
      isDark.value = storedTheme === 'dark'
    } else {
      isDark.value = true
    }

    applyTheme()
  }

  function toggleTheme() {
    isDark.value = !isDark.value

    saveToStorage(StorageKeys.Theme, isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  function applyTheme() {
    const root = document.documentElement
    if (isDark.value) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  return {
    isDark,
    initTheme,
    toggleTheme
  }
})