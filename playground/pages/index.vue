<template>
  <div>
    <!-- Fetch repository from config:
    <GithubRepository v-slot="{ repository }">
      <div v-if="repository">
        <pre>{{ repository.name }}: {{ repository.description }}</pre>
      </div>
    </GithubRepository> -->

    Fetch repository from query:
    <GithubRepository v-slot="{ repository }" :query="{ owner: 'nuxt-community', repo: 'supabase-module' }">
      <div v-if="repository">
        <pre>{{ repository.name }}: {{ repository.description }}</pre>
      </div>
    </GithubRepository>
  </div>
</template>
