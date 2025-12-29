<script setup lang="ts">
import { ref, type HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field"
import { InputGroupPassword } from "@/components/ui/input-group"
import VeeInput from "@/components/VeeInput.vue"
import z from "zod"
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { useAuthStore } from "@/stores/auth"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "vue-router"

const authStore = useAuthStore()
const router = useRouter()
const props = defineProps<{ class?: HTMLAttributes["class"] }>()
const loading = ref(false)

const loginSchema = toTypedSchema(
  z.object({
    email: z.string().min(6, "O email é obrigatório"),
    password: z.string().min(6, "A senha é obrigatória"),
  }),
)

const { handleSubmit, setErrors } = useForm({
  validationSchema: loginSchema,
  initialValues: { email: "", password: "" },
})

const onSubmit = handleSubmit((data) => {
  loading.value = true

  authStore
    .login(data.email, data.password)
    .then(() => router.push({ name: "home" }))
    .catch(() => {
      setErrors({ email: "Email ou senha inválidos" })
      loading.value = false
    })
})
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card>
      <CardHeader>
        <CardTitle>Entre em sua conta</CardTitle>
        <CardDescription> Insira suas credenciais para entrar na sua conta </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" novalidate @submit="onSubmit">
          <FieldGroup class="gap-3">
            <VeeInput
              :disabled="loading"
              label="Email"
              name="email"
              autofocus
              tabindex="1"
              placeholder="Seu email"
            />
            <VeeInput label="Senha" name="password">
              <!-- <template v-slot:label>
                <a
                  href="#"
                  class="text-foreground ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Esqueceu sua senha?
                </a>
              </template> -->
              <template v-slot="{ field, errors }">
                <InputGroupPassword
                  :disabled="loading"
                  v-bind="field"
                  :aria-invalid="!!errors.length"
                  id="password"
                  name="password"
                />
              </template>
            </VeeInput>
            <Field>
              <Button :disabled="loading" type="submit">
                <Spinner v-if="loading" />
                Entrar
              </Button>
              <!-- <Button variant="outline" type="button"> Entrar com Google </Button> -->
              <FieldDescription class="text-center">
                Não tem uma conta?
                <router-link :to="{ name: 'register' }"> Cadastre-se </router-link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
