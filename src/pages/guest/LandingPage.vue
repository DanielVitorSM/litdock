<script setup lang="ts">
import AuthLayout from "@/components/layouts/AuthLayout.vue"
import { Button } from "@/components/ui/button"
import { ArrowRight, Palette, Zap, Code2, Focus, ArrowUpRight } from "lucide-vue-next"

const features = [
  {
    icon: Palette,
    title: "Lindo por Padrão",
    description:
      "Chega de interfaces estilo Windows 95. Uma UI desenhada para tornar a leitura agradável, com modo escuro e tipografia elegante.",
    gradient: "from-teal-500 to-emerald-500",
  },
  {
    icon: Zap,
    title: "Sincronização Real-time",
    description:
      "Com o poder do Supabase, sua biblioteca é sincronizada instantaneamente em todos os dispositivos. Mudanças aparecem na hora.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Code2,
    title: "Open Source",
    description:
      "Totalmente open source. Audite, modifique ou contribua para o código no GitHub. Transparência total para pesquisadores exigentes.",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: Focus,
    title: "Livre de Distrações",
    description:
      "Um modo de foco para ler PDFs e fazer anotações sem bagunça. Apenas você, o artigo e seus pensamentos.",
    gradient: "from-amber-500 to-orange-500",
  },
]

const steps = [
  {
    number: "01",
    title: "Captura Rápida",
    description:
      "Adicione referências manualmente ou apenas cole um DOI, arXiv ID ou ISBN. O sistema busca e preenche os metadados (título, autores, ano) automaticamente para você.",
  },
  {
    number: "02",
    title: "Organização Flexível",
    description:
      "Estruture sua pesquisa com Coleções e Categorias. Use Tags personalizadas (como 'Importante', 'Metodologia') para criar conexões semânticas entre os artigos.",
  },
  {
    number: "03",
    title: "Status de Leitura",
    description:
      "Mantenha o controle do seu progresso. Marque artigos como 'Lendo', 'Lido' ou 'Favorito' e filtre sua biblioteca visualmente para saber o que priorizar.",
  },
]
</script>

<template>
  <AuthLayout>
    <template #nav>
      <div class="hidden md:flex items-center gap-8">
        <router-link
          to="#features"
          class="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Funcionalidades
        </router-link>
        <router-link
          to="#how-it-works"
          class="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Como funciona
        </router-link>
      </div>
    </template>

    <section class="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-16">
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary/20 blur-[120px] rounded-full mix-blend-screen dark:mix-blend-normal"
        ></div>
      </div>

      <div
        class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
      ></div>

      <div class="max-w-7xl relative z-10 mx-auto py-20 px-6">
        <div class="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div
            class="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary"
          >
            <span class="font-medium">v1.0 Beta</span>
          </div>

          <h1 class="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground">
            Pesquisa,
            <br />
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600 dark:from-teal-500 dark:to-cyan-300"
            >
              lindamente organizada.
            </span>
          </h1>

          <p class="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            O LitDock é um gerenciador de referências moderno, criado para pesquisadores que se
            recusam a usar interfaces ultrapassadas. <b>Rápido, elegante e livre de distrações.</b>
          </p>

          <div class="flex flex-col sm:flex-row gap-4">
            <router-link :to="{ name: 'register' }">
              <Button size="lg">
                Começar Gratuitamente
                <ArrowRight class="ml-2 h-4 w-4" />
              </Button>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section id="features" class="py-24 relative">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-20">
          <p class="text-sm font-medium text-primary mb-4">Funcionalidades</p>
          <h2 class="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
            Tudo o que você precisa,
            <br />
            <span class="text-muted-foreground">nada do que sobra.</span>
          </h2>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div
            v-for="(feature, index) in features"
            :key="feature.title"
            class="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div :class="`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6`">
              <component :is="feature.icon" class="h-6 w-6 text-white" />
            </div>

            <h3 class="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground">
              {{ feature.title }}
              <ArrowUpRight
                class="h-4 w-4 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all text-primary"
              />
            </h3>

            <p class="text-muted-foreground leading-relaxed">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section id="how-it-works" class="py-24 relative overflow-hidden">
      <div
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/10 blur-3xl pointer-events-none"
      />

      <div class="max-w-7xl relative mx-auto px-6">
        <div class="text-center mb-20">
          <p class="text-sm font-medium text-primary mb-4">Como funciona</p>
          <h2 class="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
            Comece em minutos,
            <br />
            <span class="text-muted-foreground">não em horas.</span>
          </h2>
        </div>

        <div class="max-w-3xl mx-auto">
          <div
            v-for="(step, index) in steps"
            :key="step.number"
            class="relative pl-16 pb-16 last:pb-0"
          >
            <div
              v-if="index !== steps.length - 1"
              class="absolute left-5 top-12 w-px h-full bg-border"
            />

            <div
              class="absolute left-0 top-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground shadow-sm"
            >
              {{ step.number }}
            </div>

            <div>
              <h3 class="text-xl font-semibold mb-2 text-foreground">{{ step.title }}</h3>
              <p class="text-muted-foreground leading-relaxed">
                {{ step.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24 relative">
      <div class="container mx-auto px-6">
        <div
          class="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-16 sm:px-16 sm:py-24 shadow-2xl"
        >
          <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full pointer-events-none"
          ></div>

          <div
            class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] opacity-20"
          ></div>

          <div class="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
            <h2 class="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
              Pronto para transformar <br />
              sua pesquisa?
            </h2>

            <p class="text-lg text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed">
              Deixe as planilhas e pastas bagunçadas no passado. Comece a usar o LitDock hoje e
              tenha sua biblioteca organizada em minutos.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <router-link :to="{ name: 'register' }">
                <Button size="lg">
                  Criar conta gratuita
                  <ArrowRight class="ml-2 h-4 w-4" />
                </Button>
              </router-link>
            </div>

            <p class="mt-8 text-xs text-slate-500 font-medium uppercase tracking-wider">
              Sem cartão de crédito. Sem compromisso.
            </p>
          </div>
        </div>
      </div>
    </section>
  </AuthLayout>
</template>
