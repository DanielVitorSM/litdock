<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next"
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

        <h1 class="text-4xl font-bold tracking-tight text-foreground mb-4">Termos de Uso</h1>
        <p class="text-muted-foreground">Última atualização: 24 de dezembro de 2025</p>
      </div>

      <div class="space-y-12 text-foreground/90 leading-relaxed">
        <section>
          <h2 class="text-xl font-semibold text-foreground mb-4">1. Aceitação dos Termos</h2>
          <p class="text-muted-foreground">
            Ao acessar e usar o LitDock ("o Serviço"), você concorda em cumprir estes Termos de Uso.
            Se você não concordar com algum destes termos, você não deve usar o serviço. Este é um
            projeto pessoal em desenvolvimento ("Beta") e fornecido "como está".
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-foreground mb-4">2. Descrição do Serviço</h2>
          <p class="text-muted-foreground mb-4">
            O LitDock é uma ferramenta de gerenciamento de referências bibliográficas projetada para
            ajudar pesquisadores a organizar, ler e citar trabalhos acadêmicos.
          </p>
          <p class="text-muted-foreground">
            Reservamo-nos o direito de modificar, suspender ou descontinuar qualquer aspecto do
            serviço a qualquer momento, incluindo a disponibilidade de funcionalidades, banco de
            dados ou conteúdo.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-foreground mb-4">3. Contas e Segurança</h2>
          <ul class="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>Você é responsável por manter a confidencialidade da sua conta e senha.</li>
            <li>
              Você concorda em notificar-nos imediatamente sobre qualquer uso não autorizado da sua
              conta.
            </li>
            <li>
              Não nos responsabilizamos por perdas decorrentes do uso não autorizado da sua conta.
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-foreground mb-4">4. Uso Aceitável</h2>
          <p class="text-muted-foreground mb-4">Você concorda em não:</p>
          <ul class="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>Usar o serviço para fins ilegais ou não autorizados.</li>
            <li>Tentar realizar engenharia reversa ou violar a segurança do software.</li>
            <li>Sobrecarregar nossa infraestrutura com requisições excessivas (DDoS).</li>
            <li>Carregar vírus, malware ou qualquer código destrutivo.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-foreground mb-4">5. Propriedade Intelectual</h2>
          <p class="text-muted-foreground mb-4">
            <strong>Seus Dados:</strong> Você mantém todos os direitos sobre os PDFs, anotações e
            metadados que envia para o LitDock. Nós não reivindicamos propriedade sobre sua
            pesquisa.
          </p>
          <p class="text-muted-foreground">
            <strong>O Software:</strong> A interface, logotipos, código e design do LitDock são
            propriedade exclusiva do desenvolvedor e estão protegidos por leis de direitos autorais.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-foreground mb-4">
            6. Limitação de Responsabilidade
          </h2>
          <div class="p-4 bg-muted/50 rounded-lg border border-border">
            <p class="text-sm text-muted-foreground italic">
              O LitDock é fornecido "como está" e "conforme disponível". Não garantimos que o
              serviço será ininterrupto, livre de erros ou completamente seguro. Em nenhuma
              circunstância seremos responsáveis por perda de dados (incluindo referências ou
              anotações) ou interrupção de pesquisas. Recomendamos manter backups de seus arquivos
              importantes.
            </p>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-foreground mb-4">7. Contato</h2>
          <p class="text-muted-foreground">
            Se você tiver dúvidas sobre estes termos, entre em contato através do e-mail:
            <a href="mailto:contato.danielsmoreira@gmail.com" class="text-primary hover:underline">
              contato.danielsmoreira@gmail.com
            </a>
          </p>
        </section>
      </div>

      <div class="mt-20 pt-8 border-t border-border">
        <p class="text-sm text-center text-muted-foreground">
          © {{ new Date().getFullYear() }} LitDock. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </div>
</template>
