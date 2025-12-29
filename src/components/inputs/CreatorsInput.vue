<script setup lang="ts">
import { useFieldArray } from "vee-validate"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2, Plus } from "lucide-vue-next"
import { Label } from "@/components/ui/label"

const props = defineProps<{ name: string; label: string }>()

const { fields, push, remove } = useFieldArray<{
  firstName: string
  lastName: string
  role: string
}>(props.name)

const addCreator = () => {
  push({ firstName: "", lastName: "", role: "author" })
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <Label>{{ label }}</Label>
      <Button type="button" variant="ghost" size="sm" @click="addCreator">
        <Plus class="w-3 h-3 mr-1" />
        Adicionar
      </Button>
    </div>

    <div
      v-if="fields.length === 0"
      class="text-sm text-muted-foreground italic border border-dashed rounded-md p-4 text-center"
    >
      Nenhum autor adicionado.
    </div>

    <div class="space-y-2">
      <div v-for="(field, idx) in fields" :key="field.key" class="flex gap-2 items-start">
        <div class="grid grid-cols-2 gap-2 flex-1">
          <div class="space-y-1">
            <Input
              v-model="field.value.firstName"
              placeholder="Nome"
              class="h-9"
              :name="`${name}[${idx}].firstName`"
            />
          </div>
          <div class="space-y-1">
            <Input
              v-model="field.value.lastName"
              placeholder="Sobrenome"
              class="h-9"
              :name="`${name}[${idx}].lastName`"
            />
          </div>
        </div>

        <div class="w-[110px]">
          <Select v-model="field.value.role">
            <SelectTrigger class="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="author">Autor</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="translator">Tradutor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          class="h-9 w-9 text-muted-foreground hover:text-destructive"
          @click="remove(idx)"
        >
          <Trash2 class="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
