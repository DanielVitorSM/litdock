<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue"
import { useBreadcrumbs } from "@/composables/useBreadcrumbs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { RouterView } from "vue-router"
import { useTagStore } from "@/stores/tag"
import { onMounted, defineAsyncComponent } from "vue"
import { useCollectionStore } from "@/stores/collection"
import NetworkStatus from "@/components/NetworkStatus.vue"

const PdfReaderDialog = defineAsyncComponent(
  () => import("@/components/dialogs/PdfReaderDialog.vue"),
)

const { breadcrumbs } = useBreadcrumbs()
const tagStore = useTagStore()
const collectionStore = useCollectionStore()

onMounted(() => {
  tagStore.fetchAllTags()
  collectionStore.fetchAllCollections()
})
</script>

<template>
  <SidebarProvider>
    <AppSidebar />

    <SidebarInset class="h-[100dvh]">
      <header
        class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
      >
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />

          <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />

          <Breadcrumb>
            <BreadcrumbList>
              <template v-for="(crumb, index) in breadcrumbs" :key="crumb.to">
                <BreadcrumbItem :class="{ 'hidden md:block': index < breadcrumbs.length - 1 }">
                  <router-link v-if="index < breadcrumbs.length - 1" :to="crumb.to">
                    <BreadcrumbLink>
                      {{ crumb.label }}
                    </BreadcrumbLink>
                  </router-link>

                  <BreadcrumbPage v-else>
                    {{ crumb.label }}
                  </BreadcrumbPage>
                </BreadcrumbItem>

                <BreadcrumbSeparator
                  v-if="index < breadcrumbs.length - 1"
                  class="hidden md:block"
                />
              </template>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div class="flex flex-grow overflow-hidden flex-col gap-4 relative">
        <router-view />
      </div>
    </SidebarInset>

    <router-view name="sidebar" />
  </SidebarProvider>

  <PdfReaderDialog />

  <NetworkStatus />
</template>
