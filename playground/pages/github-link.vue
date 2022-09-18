<script setup lang="ts">
import { ref } from 'vue'

const file = ref('package.json')
</script>

<template>
  <div>
    <input v-model="file">
    <div style="margin: 2rem 0;" />
    <GithubLink v-slot="{ url }" :source="file">
      <NuxtLink :to="url" target="_blank">
        ✍️ Edit {{ file }}
      </NuxtLink>
    </GithubLink>
    <div style="margin: 2rem 0;" />
    <GithubLink v-slot="{ url }" :edit="false" :source="file">
      <NuxtLink :to="url" target="_blank">
        🔗 Open {{ file }}
      </NuxtLink>
    </GithubLink>
  </div>
</template>
