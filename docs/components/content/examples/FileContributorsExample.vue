<script setup lang="ts">
const file = ref('package.json')
</script>

<template>
  <GithubFileContributors v-slot="{ contributors, refresh }" :query="{ source: file }">
    <input v-model="file" disabled class="mb-4 p-2 rounded-lg text-gray-700" type="text" @input="refresh">

    <div v-if="contributors" class="flex flex-col gap-2">
      <Contributor v-for="contributor of contributors" :key="contributor.login" :contributor="contributor" />
    </div>
  </GithubFileContributors>
</template>
