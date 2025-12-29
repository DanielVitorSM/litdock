<script setup lang="ts">
import { Github } from "lucide-vue-next"

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="py-16 border-t border-border bg-background">
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex flex-col md:flex-row justify-between items-center gap-8">
        <div class="flex items-center gap-4">
          <img src="/assets/logo.svg" class="h-8 w-8" alt="Logo" />
          <img src="/assets/logo_name_light.svg" class="h-4" alt="Logo Name" />
        </div>

        <div class="flex items-center gap-8">
          <router-link
            :to="{ name: 'privacy-policy' }"
            class="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacidade
          </router-link>
          <router-link
            :to="{ name: 'terms-of-use' }"
            class="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Termos
          </router-link>
        </div>

        <div class="flex items-center gap-4">
          <a
            href="https://github.com/danielvitorsm"
            aria-label="Github"
            target="_blank"
            class="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github class="h-5 w-5" />
          </a>
        </div>
      </div>

      <div class="mt-12 pt-8 border-t border-border text-center">
        <p class="text-sm text-muted-foreground">
          © {{ currentYear }} LitDock. Feito com cuidado para a comunidade acadêmica.
        </p>
      </div>
    </div>
  </footer>
</template>
