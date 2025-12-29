<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue"
import VuePdfEmbed from "vue-pdf-embed"
import {
  X,
  ZoomIn,
  ZoomOut,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Download,
  FileText,
  ScrollText,
  Scan,
  Loader2,
  Link,
} from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { storageService } from "@/services/storageService"
import { storeToRefs } from "pinia"
import { toast } from "vue-sonner"
import { useReferenceUiStore } from "@/stores/referenceUi"
import { useThemeStore } from "@/stores/theme"

const uiStore = useReferenceUiStore()
const themeStore = useThemeStore()
const { isPdfReaderOpen, selectedReference } = storeToRefs(uiStore)

const src = ref<string | null>(null)
const isLoading = ref(true)
const isFailedLoading = ref(false)

const scale = ref(1.0)
const rotation = ref(0)
const isDarkMode = ref(themeStore.isDark)
const viewMode = ref<"scroll" | "paginated">("paginated")

const currentPage = ref(1)
const pageCount = ref(0)

const containerRef = ref<HTMLDivElement | null>(null)
const containerWidth = ref(800)

const pdfWidth = computed(() => {
  const padding = window.innerWidth < 640 ? 16 : 48
  return Math.floor(containerWidth.value * scale.value) - padding
})

const isExternalPdf = computed(() => {
  const path = selectedReference.value?.pdfPath
  return path ? path.startsWith("http://") || path.startsWith("https://") : false
})

const pdfFilterClass = computed(() =>
  isDarkMode.value ? "filter invert contrast-90 hue-rotate-180 brightness-90" : "",
)

watch(isPdfReaderOpen, async (isOpen) => {
  if (isOpen) {
    const path = selectedReference.value?.pdfPath

    if (path) {
      isLoading.value = true
      currentPage.value = 1

      viewMode.value = "paginated"

      await nextTick()
      updateContainerWidth()

      const IDEAL_READING_WIDTH = 860
      if (window.innerWidth > 1024 && containerWidth.value > IDEAL_READING_WIDTH) {
        scale.value = Number((IDEAL_READING_WIDTH / containerWidth.value).toFixed(2))
      } else {
        scale.value = 1.0
      }

      setTimeout(async () => {
        try {
          if (path.startsWith("http")) {
            src.value = path
          } else {
            src.value = await storageService.getFileUrl(path)
          }
        } catch (error: unknown) {
          console.error(error)
          toast.error("Erro ao carregar arquivo")
        }
      }, 350)
    }
  } else {
    src.value = null
  }
})

let resizeTimeout: number | undefined
const handleResize = () => {
  clearTimeout(resizeTimeout)
  resizeTimeout = window.setTimeout(updateContainerWidth, 200)
}

const updateContainerWidth = () => {
  if (containerRef.value) {
    containerWidth.value = containerRef.value.clientWidth
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown)
  window.addEventListener("resize", handleResize)
})

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown)
  window.removeEventListener("resize", handleResize)
})

const handleZoom = (delta: number) => {
  const newScale = scale.value + delta
  if (newScale >= 0.3 && newScale <= 3.0) scale.value = Number(newScale.toFixed(2))
}

const setFitWidth = () => {
  scale.value = 1.0
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === "scroll" ? "paginated" : "scroll"

  if (viewMode.value === "paginated" && window.innerWidth < 768) {
    scale.value = 1.0
  }

  currentPage.value = 1
}

const handlePageChange = (delta: number) => {
  const next = currentPage.value + delta
  if (next >= 1 && next <= pageCount.value) {
    currentPage.value = next
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!isPdfReaderOpen.value) return
  if (e.key === "Escape") uiStore.closePdfReader()

  if (viewMode.value === "paginated") {
    if (e.key === "ArrowRight") handlePageChange(1)
    if (e.key === "ArrowLeft") handlePageChange(-1)
  }

  if ((e.ctrlKey || e.metaKey) && (e.key === "=" || e.key === "+")) {
    e.preventDefault()
    handleZoom(0.1)
  }
  if ((e.ctrlKey || e.metaKey) && e.key === "-") {
    e.preventDefault()
    handleZoom(-0.1)
  }
}

const onPdfLoaded = (pdf: { numPages: number }) => {
  pageCount.value = pdf.numPages
  isLoading.value = false
}

const onLoadingFailed = () => {
  isLoading.value = false
  isFailedLoading.value = true
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isPdfReaderOpen"
      class="fixed inset-0 z-[9999] flex flex-col bg-background h-[100dvh] w-screen overflow-hidden isolate"
    >
      <header
        class="flex items-center justify-between px-3 md:px-4 h-14 border-b bg-background shadow-sm shrink-0 z-50 select-none"
      >
        <div class="flex items-center gap-2 md:gap-3 flex-none mr-2 max-w-[40%] sm:max-w-[30%]">
          <Button variant="ghost" size="icon" @click="uiStore.closePdfReader" class="shrink-0">
            <X class="w-5 h-5" />
          </Button>

          <div class="flex-col min-w-0 hidden md:flex">
            <h2 class="text-sm font-semibold truncate">
              {{ selectedReference?.title }}
            </h2>
            <p v-if="pageCount" class="text-xs text-muted-foreground truncate">
              {{
                viewMode === "paginated"
                  ? `Pág. ${currentPage}/${pageCount}`
                  : `${pageCount} páginas`
              }}
            </p>
          </div>
        </div>

        <div class="flex items-center justify-center gap-2 flex-1 min-w-0">
          <div class="flex items-center bg-muted/50 rounded-lg p-1 shrink-0">
            <Button variant="ghost" size="icon-sm" @click="handleZoom(-0.1)">
              <ZoomOut class="w-4 h-4" />
            </Button>
            <span class="text-xs font-mono w-10 md:w-12 text-center select-none">
              {{ Math.round(scale * 100) }}%
            </span>
            <Button variant="ghost" size="icon-sm" @click="handleZoom(0.1)">
              <ZoomIn class="w-4 h-4" />
            </Button>

            <div class="hidden sm:block w-px h-4 bg-border mx-1"></div>

            <Button
              variant="ghost"
              size="icon-sm"
              @click="setFitWidth"
              title="Ajustar largura"
              class="hidden sm:inline-flex"
            >
              <Scan class="w-4 h-4" />
            </Button>
          </div>

          <div
            v-if="viewMode === 'paginated'"
            class="flex items-center bg-muted/50 rounded-lg p-1 ml-2 shrink-0"
          >
            <Button
              variant="ghost"
              size="icon-sm"
              @click="handlePageChange(-1)"
              :disabled="currentPage <= 1"
            >
              <ChevronLeft class="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              @click="handlePageChange(1)"
              :disabled="currentPage >= pageCount"
            >
              <ChevronRight class="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div
          class="flex items-center justify-end gap-1 md:gap-2 shrink-0 flex-none w-[20%] sm:w-auto"
        >
          <Button
            variant="ghost"
            size="icon"
            @click="toggleViewMode"
            :title="viewMode === 'scroll' ? 'Ver em páginas' : 'Ver em scroll'"
          >
            <FileText v-if="viewMode === 'paginated'" class="w-4 h-4" />
            <ScrollText v-else class="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            @click="rotation = (rotation + 90) % 360"
            class="hidden sm:inline-flex"
          >
            <RotateCw class="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            @click="isDarkMode = !isDarkMode"
            :class="isDarkMode ? 'text-yellow-400' : 'text-slate-600'"
          >
            <Moon v-if="isDarkMode" class="w-4 h-4" />
            <Sun v-else class="w-4 h-4" />
          </Button>

          <a :href="src || '#'" download v-if="src" target="_blank" class="hidden sm:inline-flex">
            <Button variant="outline" size="sm" class="gap-2">
              <Download class="w-3.5 h-3.5" />
            </Button>
          </a>
        </div>
      </header>

      <div
        ref="containerRef"
        class="flex-1 overflow-auto w-full relative flex justify-center p-2 sm:p-8 custom-scrollbar scroll-smooth"
        :class="isDarkMode ? 'bg-[#1a1a1a]' : 'bg-slate-100'"
        style="-webkit-overflow-scrolling: touch"
      >
        <div
          v-if="src && !isFailedLoading"
          class="transition-all duration-200 ease-out origin-top shadow-2xl h-fit"
          :style="{ width: `${pdfWidth}px`, minWidth: '300px' }"
        >
          <VuePdfEmbed
            :source="src"
            :page="viewMode === 'paginated' ? currentPage : undefined"
            :rotation="rotation"
            :width="pdfWidth"
            @loaded="onPdfLoaded"
            class="bg-white transition-[filter] duration-300 min-h-[400px] w-full h-auto block"
            :class="pdfFilterClass"
            @loading-failed="onLoadingFailed"
          />
        </div>

        <div
          v-if="isLoading"
          class="absolute inset-0 flex items-center justify-center bg-background/50 z-50 backdrop-blur-sm"
        >
          <div class="flex flex-col items-center gap-2">
            <Loader2 class="w-10 h-10 animate-spin text-primary" />
            <span class="text-sm font-medium">Carregando...</span>
          </div>
        </div>

        <div
          v-if="isFailedLoading"
          class="absolute inset-0 flex items-center justify-center bg-background/50 z-50"
        >
          <div class="flex flex-col items-center gap-2">
            <Scan class="w-10 h-10 text-muted-foreground" />
            <span v-if="isExternalPdf" class="text-sm font-medium">
              Este PDF está hospedado externamente e bloqueia visualização embutida.
            </span>
            <span v-else class="text-sm font-medium">Falha ao carregar o PDF.</span>
            <a v-if="src" :href="src" target="_blank" rel="noopener noreferrer">
              <Button variant="link" class="p-0 underline">
                <Link />
                Clique aqui para abrir
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: hsl(var(--muted-foreground) / 0.3);
  border-radius: 99px;
  border: 3px solid transparent;
  background-clip: content-box;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: hsl(var(--muted-foreground) / 0.5);
}
</style>
