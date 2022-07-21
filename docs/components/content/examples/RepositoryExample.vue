<template>
  <GithubRepository v-slot="{ repository }">
    <Repository v-if="repository" :value="repository" />
  </GithubRepository>
</template>
