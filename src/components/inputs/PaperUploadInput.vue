<script setup lang="ts">
import { ref, computed } from "vue"
import { Cloud, Smartphone, CloudUpload, Trash2, Eye, AlertTriangle, Globe } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "vue-sonner"
import { storageService } from "@/services/storageService"
import { useAuthStore } from "@/stores/auth"
import { Spinner } from "@/components/ui/spinner"

const props = defineProps<{ modelValue?: string | null }>()

const emit = defineEmits(["update:modelValue"])
const authStore = useAuthStore()

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const isCheckingAvailability = ref(false)

const hasFile = computed(() => !!props.modelValue)

const isLocal = computed(() => props.modelValue?.startsWith("local://"))

const isExternal = computed(
  () => props.modelValue?.startsWith("http://") || props.modelValue?.startsWith("https://"),
)

const fileName = computed(() => {
  if (!props.modelValue) return ""
  const rawName = props.modelValue.replace("local://", "")
  const parts = rawName.split(/[_/]/)
  return parts.length > 2 ? parts.slice(2).join("_") : rawName
})

const fileStatusLabel = computed(() => {
  if (isLocal.value) return "Armazenamento Local (Apenas este dispositivo)"
  if (isExternal.value) return "Arquivo Externo"
  return "Sincronizado na Nuvem (Acessível em qualquer lugar)"
})

const statusColorClass = computed(() => {
  if (isLocal.value) return "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
  if (isExternal.value)
    return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
  return "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
})

const triggerSelect = () => {
  fileInput.value?.click()
}

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  await processUpload(file)
}

const handleDrop = async (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (!file) return
  await processUpload(file)
}

const processUpload = async (file: File) => {
  if (file.type !== "application/pdf") {
    toast.error("Apenas arquivos PDF são permitidos.")
    return
  }

  const userId = authStore.user?.id
  if (!userId) {
    toast.error("Você precisa estar logado para enviar arquivos.")
    return
  }

  try {
    isUploading.value = true
    uploadProgress.value = 10

    const interval = setInterval(() => {
      if (uploadProgress.value < 90) uploadProgress.value += Math.random() * 10
    }, 300)

    const path = await storageService.uploadPaper(file, userId)

    clearInterval(interval)
    uploadProgress.value = 100

    emit("update:modelValue", path)

    if (path.startsWith("local://")) {
      toast.success("Arquivo grande salvo neste dispositivo.")
    } else {
      toast.success("PDF enviado para a nuvem.")
    }
  } catch (error: unknown) {
    console.error(error)
    toast.error(
      "Erro ao processar arquivo: " + (error instanceof Error ? error.message : String(error)),
    )
  } finally {
    setTimeout(() => {
      isUploading.value = false
      uploadProgress.value = 0
    }, 500)

    if (fileInput.value) fileInput.value.value = ""
  }
}

const handleRemove = async () => {
  if (!props.modelValue) return
  if (!confirm("Tem certeza que deseja remover este PDF?")) return

  try {
    isUploading.value = true

    if (!isExternal.value) {
      await storageService.removePaper(props.modelValue)
    }

    emit("update:modelValue", null)
    toast.success("PDF removido.")
  } catch (error: unknown) {
    console.error(error)
    toast.error("Erro ao remover PDF.")
  } finally {
    isUploading.value = false
  }
}

const handleView = async () => {
  if (!props.modelValue) return

  try {
    isCheckingAvailability.value = true

    if (isExternal.value) {
      window.open(props.modelValue!, "_blank")
      return
    }

    const url = await storageService.getFileUrl(props.modelValue)

    if (!url) {
      toast.warning("Arquivo indisponível", {
        description:
          "Este PDF foi salvo localmente em outro dispositivo e não foi sincronizado na nuvem devido ao tamanho.",
      })
      return
    }

    window.open(url, "_blank")
  } catch (error: unknown) {
    console.error(error)
    toast.error("Erro ao abrir PDF.")
  } finally {
    isCheckingAvailability.value = false
  }
}
</script>

<template>
  <div class="w-full space-y-3 font-sans">
    <input
      ref="fileInput"
      type="file"
      accept="application/pdf"
      class="hidden"
      @change="handleFileSelect"
    />

    <div
      v-if="!hasFile && !isUploading"
      class="group relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer bg-muted/20 hover:bg-muted/60"
      :class="
        isDragging ? 'border-primary bg-primary/5 scale-[0.99]' : 'border-muted-foreground/20'
      "
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerSelect"
    >
      <div
        class="p-4 bg-background rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform"
      >
        <CloudUpload class="w-8 h-8 text-primary/80" />
      </div>

      <p class="text-sm font-semibold text-foreground">Clique para enviar ou arraste</p>
      <p class="text-xs text-muted-foreground mt-2 max-w-[200px]">
        Arquivos pequenos vão para a nuvem. Arquivos grandes (>512KB) ficam no seu dispositivo.
      </p>
    </div>

    <div v-else-if="isUploading" class="border rounded-xl p-6 bg-card space-y-4">
      <div class="flex items-center gap-4">
        <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Spinner class="w-5 h-5" />
        </div>
        <div class="flex-1 space-y-1.5">
          <div class="flex justify-between text-xs font-medium">
            <span>Processando PDF...</span>
            <span>{{ Math.round(uploadProgress) }}%</span>
          </div>
          <Progress :model-value="uploadProgress" class="h-2" />
        </div>
      </div>
    </div>

    <div
      v-else
      class="relative w-full overflow-hidden border rounded-xl bg-card transition-all hover:shadow-md group"
    >
      <div class="p-4 flex items-start gap-4">
        <div
          class="h-12 w-12 shrink-0 rounded-lg flex items-center justify-center transition-colors shadow-sm"
          :class="statusColorClass"
        >
          <Smartphone v-if="isLocal" class="w-6 h-6" />
          <Globe v-else-if="isExternal" class="w-6 h-6" />
          <Cloud v-else class="w-6 h-6" />
        </div>

        <div class="flex-1 min-w-0 pt-0.5">
          <div class="flex items-center gap-2 mb-1">
            <span
              class="text-sm max-w-[250px] font-semibold truncate text-foreground"
              :title="fileName"
            >
              {{ fileName }}
            </span>
            <span class="text-[10px] font-mono border px-1 rounded text-muted-foreground">PDF</span>
          </div>

          <p
            class="text-xs flex items-center gap-1.5"
            :class="isLocal ? 'text-amber-600' : 'text-blue-300'"
          >
            <component :is="isLocal ? Smartphone : Cloud" class="w-3 h-3" />
            {{ fileStatusLabel }}
          </p>
        </div>
      </div>

      <div class="bg-muted/30 border-t p-2 flex items-center justify-between gap-2">
        <div v-if="isLocal" class="px-2 flex items-center gap-2 text-[10px] text-muted-foreground">
          <AlertTriangle class="w-3 h-3" />
          Arquivo local
        </div>
        <div v-else class="px-2"></div>
        <div class="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            class="h-8 px-2 text-xs gap-1.5 hover:bg-background hover:text-primary hover:shadow-sm"
            @click="handleView"
            :disabled="isCheckingAvailability"
          >
            <Spinner v-if="isCheckingAvailability" class="w-3.5 h-3.5" />
            <Eye v-else class="w-3.5 h-3.5" />
            Visualizar
          </Button>

          <div class="w-px h-4 bg-border mx-1"></div>

          <Button
            variant="ghost"
            size="sm"
            class="h-8 px-2 text-xs gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
            @click="handleRemove"
          >
            <Trash2 class="w-3.5 h-3.5" />
            Remover
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
