<script setup lang="ts">
import { ref, type HTMLAttributes } from "vue"
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field"
import { InputGroupPassword } from "@/components/ui/input-group"
import { toast } from "vue-sonner"
import VeeInput from "@/components/VeeInput.vue"
import { Spinner } from "@/components/ui/spinner"
import { useAuthStore } from "@/stores/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "vue-router"

const authStore = useAuthStore()
const router = useRouter()
const props = defineProps<{ class?: HTMLAttributes["class"] }>()
const loading = ref(false)

const registerSchema = toTypedSchema(
  z.object({
    name: z.string().min(3, "Insira um nome válido.").max(32, "Insira um nome válido."),
    email: z.string().email("Insira um email válido."),
    password: z
      .string()
      .min(6, "A senha precisa ter pelo menos 6 caracteres.")
      .max(48, "A senha deve ter no máximo 48 caracteres."),
  }),
)

const { handleSubmit } = useForm({
  validationSchema: registerSchema,
  initialValues: { name: "", email: "", password: "" },
})

const onSubmit = handleSubmit((data) => {
  loading.value = true
  authStore
    .register(data.name, data.email, data.password)
    .then(() => {
      toast.success("Conta criada com sucesso!")
      router.push({ name: "home" })
    })
    .catch(() => {
      loading.value = false
      toast.error("Falha ao criar conta. Tente novamente mais tarde.")
    })
})
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card>
      <CardHeader>
        <CardTitle>Criar uma nova conta</CardTitle>
        <CardDescription> Insira seu email abaixo para criar sua conta </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="register-form" novalidate @submit="onSubmit">
          <FieldGroup class="gap-3">
            <VeeInput
              autofocus
              :disabled="loading"
              label="Nome"
              name="name"
              placeholder="Seu nome"
            />
            <VeeInput :disabled="loading" label="Email" name="email" placeholder="m@exemplo.com" />
            <VeeInput label="Senha" name="password" v-slot="{ field, errors }">
              <InputGroupPassword
                :disabled="loading"
                v-bind="field"
                :aria-invalid="!!errors.length"
                id="password"
                name="password"
              />
            </VeeInput>
            <Alert v-if="authStore.error" variant="destructive">
              <AlertDescription>
                <p>{{ authStore.error }}</p>
              </AlertDescription>
            </Alert>
            <Field>
              <Button type="submit" :disabled="loading">
                <Spinner v-if="loading" />
                Criar conta
              </Button>
              <!-- <Button variant="outline" type="button"> Entrar com Google </Button> -->
              <FieldDescription class="text-center">
                Já possui uma conta?
                <router-link :to="{ name: 'login' }"> Entrar </router-link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
