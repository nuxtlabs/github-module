<template>
  <GithubReadme v-slot="{ readme }">
    <div class="pb-4">
      <ContentRenderer v-if="readme" :value="readme" />
    </div>
  </GithubReadme>
</template>
