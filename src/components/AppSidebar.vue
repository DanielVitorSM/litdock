<script setup lang="ts">
import type { SidebarProps } from "@/components/ui/sidebar"

import { Files, Sparkles, Tags } from "lucide-vue-next"
import NavMain from "@/components/NavMain.vue"
import NavUser from "@/components/NavUser.vue"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { computed } from "vue"
import { useTagStore } from "@/stores/tag"
import { DEFAULT_TAG_COLOR } from "@/lib/constants"
import router from "@/router"
import { useCollectionStore } from "@/stores/collection"

const props = withDefaults(defineProps<SidebarProps>(), { collapsible: "offcanvas" })

const tagStore = useTagStore()
const collectionStore = useCollectionStore()
const { isMobile, setOpenMobile } = useSidebar()

router.afterEach(() => {
  if (isMobile.value) {
    setOpenMobile(false)
  }
})

const data = computed(() => {
  const tags = tagStore.tags.map((tag) => ({
    title: tag.name,
    url: router.resolve({ name: "tag", params: { tagId: tag.id } }).href,
    color: tag.color || DEFAULT_TAG_COLOR,
  }))

  const collections = collectionStore.collections.map((collection) => ({
    title: collection.title,
    url: router.resolve({ name: "collection", params: { collectionId: collection.id } }).href,
  }))

  return {
    user: { name: "shadcn", email: "m@example.com", avatar: "/avatars/shadcn.jpg" },
    navMain: [
      {
        title: "Coleções",
        url: "#",
        icon: Files,
        isActive: true,
        items: [
          { title: "Todas as referências", url: router.resolve({ name: "home" }).href },
          ...collections,
        ],
      },
      {
        title: "Atalhos",
        url: "#",
        icon: Sparkles,
        items: [
          { title: "Favoritos", url: router.resolve({ name: "favorites" }).href, color: "yellow" },
          { title: "Lendo", url: router.resolve({ name: "reading" }).href, color: "blue" },
          { title: "Não lidos", url: router.resolve({ name: "unread" }).href, color: "orange" },
          { title: "Lidos", url: router.resolve({ name: "finished" }).href, color: "green" },
          { title: "Arquivados", url: router.resolve({ name: "archived" }).href, color: "slate" },
        ],
      },
      { title: "Tags", url: "#", icon: Tags, items: tags },
    ],
  }
})
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton as-child class="data-[slot=sidebar-menu-button]:!p-1.5">
            <router-link :to="{ name: 'home' }">
              <img src="/assets/logo_name.svg" alt="arxivist" class="h-5 w-auto" />
            </router-link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
