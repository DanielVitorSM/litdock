<script setup lang="ts">
import { FileQuestion, Home, ArrowLeft } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { useRouter } from "vue-router"
import AuthLayout from "@/components/layouts/AuthLayout.vue"

const router = useRouter()
</script>

<template>
  <AuthLayout>
    <div
      class="flex h-[100dvh] w-full flex-col items-center justify-center bg-background px-4 text-center"
    >
      <div class="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted/50">
        <FileQuestion class="h-12 w-12 text-muted-foreground" />
      </div>

      <h1 class="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">404</h1>
      <h2 class="text-xl font-semibold tracking-tight mb-4">Página não encontrada</h2>
      <p class="max-w-[500px] text-muted-foreground mb-8">
        Desculpe, não conseguimos encontrar a página que você está procurando. Ela pode ter sido
        movida ou excluída.
      </p>

      <div class="flex items-center gap-4">
        <Button variant="outline" @click="router.back()">
          <ArrowLeft class="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <router-link :to="{ name: 'landing' }">
          <Button>
            <Home class="mr-2 h-4 w-4" />
            Ir para o Início
          </Button>
        </router-link>
      </div>
    </div>
  </AuthLayout>
</template>
