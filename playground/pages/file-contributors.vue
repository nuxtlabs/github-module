<script setup lang="ts">
const file = ref('package.json')
</script>

<template>
  <div>
    4 firsts contributors from config:
    <GithubFileContributors v-slot="{ contributors, refresh }" :query="{ source: file }">
      <input v-model="file" type="text" @input="refresh">

      <div v-for="contributor in contributors" :key="contributor.login">
        <div :id="contributor.login">
          <img style="height: 32px; width: 32px" :src="contributor.avatar_url">
          {{ contributor.login }}
        </div>
      </div>
    </GithubFileContributors>
  </div>
</template>
