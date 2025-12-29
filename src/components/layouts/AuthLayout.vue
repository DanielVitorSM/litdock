<script setup lang="ts">
import GuestFooter from "@/components/GuestFooter.vue"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth"

const authStore = useAuthStore()
</script>

<template>
  <main class="min-h-[100dvh] w-full bg-background">
    <nav
      class="fixed top-0 left-0 right-0 z-50 bg-card/50 backdrop-blur-xl border border-border/50"
    >
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex h-16 items-center justify-between">
          <router-link :to="{ name: 'landing' }">
            <div class="flex items-center gap-4">
              <img src="/assets/logo.svg" class="h-8 w-8" alt="Logo" />
              <img src="/assets/logo_name_light.svg" class="h-4 hidden md:block" alt="Logo Name" />
            </div>
          </router-link>

          <slot name="nav"></slot>

          <div class="" v-if="authStore.isAuthenticated">
            <router-link :to="{ name: 'home' }">
              <Button class="bg-primary text-primary-foreground hover:bg-primary/90">
                Acessar dashboard
              </Button>
            </router-link>
          </div>
          <div class="flex items-center gap-3" v-else>
            <router-link :to="{ name: 'login' }">
              <Button variant="ghost" class="text-muted-foreground"> Entrar </Button>
            </router-link>

            <router-link :to="{ name: 'register' }">
              <Button class="bg-primary text-primary-foreground hover:bg-primary/90">
                Criar conta
              </Button>
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <slot>
      <router-view />
    </slot>

    <GuestFooter />
  </main>
</template>
