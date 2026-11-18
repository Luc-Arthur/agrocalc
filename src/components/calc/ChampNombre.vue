<script setup lang="ts">
// Champ numérique du carnet : grande valeur à droite, unité affichée, message d'erreur dessous
defineProps<{ id: string; label: string; unite: string; aide?: string; indication?: string; erreur?: string }>()
const valeur = defineModel<string>({ required: true })
</script>

<template>
  <div>
    <label :for="id" class="mb-2 flex justify-between text-[15px] font-bold leading-5">
      <span>{{ label }}</span>
      <span v-if="aide" class="font-normal text-ink-2">{{ aide }}</span>
    </label>
    <div
      class="flex h-16 items-center rounded border-2 bg-paper focus-within:border-ink focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-pencil"
      :class="erreur ? 'border-danger' : 'border-line'"
    >
      <input
        :id="id"
        v-model="valeur"
        type="text"
        inputmode="decimal"
        autocomplete="off"
        class="mono h-full min-w-0 flex-1 bg-transparent pl-4 pr-3 text-right text-[26px] font-medium outline-none"
        :aria-invalid="erreur ? 'true' : undefined"
        :aria-describedby="erreur ? `${id}-erreur` : indication ? `${id}-indication` : undefined"
      />
      <span class="mono min-w-24 flex-none pr-4 text-[15px] font-medium text-ink-2">{{ unite }}</span>
    </div>
    <p v-if="erreur" :id="`${id}-erreur`" class="mt-1.5 text-sm font-bold text-danger">{{ erreur }}</p>
    <p v-else-if="indication" :id="`${id}-indication`" class="mt-1.5 text-sm leading-5 text-ink-2">{{ indication }}</p>
  </div>
</template>
