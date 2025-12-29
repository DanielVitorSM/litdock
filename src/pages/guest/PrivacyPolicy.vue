<script setup lang="ts">
import { ArrowLeft, EyeOff } from "lucide-vue-next"
</script>

<template>
  <div class="min-h-screen bg-background py-16 px-6 font-sans">
    <div class="max-w-3xl mx-auto">
      <div class="mb-12">
        <router-link
          to="/"
          class="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft class="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Voltar para a home
        </router-link>

        <h1 class="text-4xl font-bold tracking-tight text-foreground mb-4">
          Política de Privacidade
        </h1>
        <p class="text-muted-foreground">Última atualização: 24 de dezembro de 2025</p>
      </div>

      <div class="space-y-12 text-foreground/90 leading-relaxed">
        <section>
          <h2 class="text-xl font-semibold text-foreground mb-4">1. Introdução</h2>
          <p class="text-muted-foreground">
            No LitDock, entendemos que sua pesquisa é valiosa e muitas vezes confidencial. Esta
            Política de Privacidade descreve como coletamos, usamos e protegemos suas informações
            quando você usa nossa plataforma. Nosso princípio fundamental é:
            <strong>seus dados são seus.</strong>
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-foreground mb-4">2. Informações que Coletamos</h2>
          <ul class="list-disc pl-5 space-y-3 text-muted-foreground">
            <li>
              <strong>Informações da Conta:</strong> Seu endereço de e-mail e nome (fornecidos via
              Google Auth ou cadastro direto) para criar sua identificação única.
            </li>
            <li>
              <strong>Dados da Biblioteca:</strong> Metadados dos artigos que você salva (títulos,
              autores, DOIs, anotações e tags).
            </li>
            <li>
              <strong>Arquivos Enviados:</strong> Os arquivos PDF que você carrega para
              armazenamento.
            </li>
            <li>
              <strong>Dados de Uso:</strong> Logs técnicos básicos para fins de depuração e
              segurança (ex: endereços IP em caso de atividades suspeitas).
            </li>
          </ul>
        </section>

        <section>
          <div class="p-6 rounded-xl border border-primary/20 bg-primary/5">
            <h3 class="flex items-center text-lg font-semibold text-primary mb-3">
              <EyeOff class="w-5 h-5 mr-2" />
              Privacidade da sua pesquisa
            </h3>
            <p class="text-sm text-muted-foreground leading-relaxed">
              Nós <strong>não</strong> vendemos seus dados para terceiros. Nós
              <strong>não</strong> usamos seus PDFs ou anotações para treinar modelos de
              Inteligência Artificial públicos. Seus arquivos são armazenados de forma privada e são
              acessíveis apenas por você através da sua conta autenticada.
            </p>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-foreground mb-4">3. Como Usamos seus Dados</h2>
          <p class="text-muted-foreground mb-4">Utilizamos as informações coletadas para:</p>
          <ul class="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>Fornecer e manter o serviço (sincronização entre dispositivos).</li>
            <li>Permitir que você acesse sua biblioteca de qualquer lugar.</li>
            <li>
              Melhorar a funcionalidade da plataforma (ex: detectar se buscas por DOI estão
              falhando).
            </li>
            <li>
              Enviar comunicações essenciais sobre atualizações de segurança ou mudanças nos termos.
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-foreground mb-4">4. Armazenamento e Terceiros</h2>
          <p class="text-muted-foreground mb-4">
            O LitDock utiliza serviços de infraestrutura de terceiros confiáveis para operar:
          </p>
          <ul class="list-disc pl-5 space-y-2 text-muted-foreground">
            <li><strong>Supabase / PostgreSQL:</strong> Para banco de dados e autenticação.</li>
            <li>
              <strong>Supabase Storage:</strong> Para armazenamento seguro dos seus arquivos PDF.
            </li>
          </ul>
          <p class="text-muted-foreground mt-4">
            Embora usemos provedores de nuvem, a lógica de acesso é configurada (RLS - Row Level
            Security) para garantir que apenas o seu usuário possa ler seus dados.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-foreground mb-4">5. Seus Direitos</h2>
          <p class="text-muted-foreground mb-4">
            Você tem controle total sobre seus dados. A qualquer momento, você pode:
          </p>
          <ul class="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              <strong>Exportar:</strong> Solicitar uma cópia dos seus metadados (formato BibTeX ou
              JSON).
            </li>
            <li>
              <strong>Excluir:</strong> Deletar sua conta permanentemente. Ao fazer isso, todos os
              seus metadados e arquivos PDF são removidos irreversivelmente dos nossos servidores.
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-foreground mb-4">6. Cookies</h2>
          <p class="text-muted-foreground">
            Utilizamos apenas cookies essenciais para manter sua sessão de login ativa
            (Autenticação). Não utilizamos cookies de rastreamento publicitário.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-foreground mb-4">7. Alterações nesta Política</h2>
          <p class="text-muted-foreground">
            Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos você sobre
            quaisquer alterações publicando a nova política nesta página e atualizando a data de
            "Última atualização".
          </p>
        </section>
      </div>

      <div class="mt-20 pt-8 border-t border-border text-center">
        <p class="text-sm text-muted-foreground">
          Dúvidas sobre privacidade?
          <a href="mailto:contato.danielsmoreira@gmail.com" class="text-primary hover:underline">
            contato.danielsmoreira@gmail.com
          </a>
        </p>
      </div>
    </div>
  </div>
</template>
