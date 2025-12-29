<script setup lang="ts">
import { ChevronsUpDown, LogOut, Moon, RefreshCcw, Sun } from "lucide-vue-next"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/stores/auth"
import { useRouter } from "vue-router"
import { useThemeStore } from "@/stores/theme"
import { toast } from "vue-sonner"
import { storeToRefs } from "pinia"
import { useOnline } from "@vueuse/core"

const authStore = useAuthStore()
const router = useRouter()
const isOnline = useOnline()

const { isMobile } = useSidebar()

const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)

const logout = async () => {
  if (isOnline.value === false) {
    toast.error("Você está offline. Conecte-se à internet para sair.")
    return
  }

  try {
    await authStore.logout()
    router.push({ name: "login" })
  } catch (error) {
    console.error("Erro ao sair:", error)
    toast.error("Erro ao sair da conta. Tente novamente.")
  }
}
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ authStore.userName }}</span>
              <span class="truncate text-xs">{{ authStore.userEmail }}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          align="end"
          :side-offset="4"
        >
          <DropdownMenuGroup>
            <DropdownMenuItem @click="themeStore.toggleTheme">
              <Moon
                v-if="isDark"
                class="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400"
              />
              <Sun
                v-if="!isDark"
                class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-orange-500"
              />
              {{ isDark ? "Tema escuro" : "Tema claro" }}
              <div class="flex justify-end flex-grow text-muted-foreground">
                <RefreshCcw />
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="logout">
            <LogOut />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
