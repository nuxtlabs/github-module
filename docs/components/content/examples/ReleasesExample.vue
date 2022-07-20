<template>
  <GithubReleases v-slot="{ releases }">
    <div v-if="releases?.length">
      <div v-for="release in releases" :key="release.name" class="py-4">
        <ProseH2 :id="release.name" class="!mt-0">
          {{ release.name }}
        </ProseH2>
        <ContentRenderer :value="release" />
      </div>
    </div>
  </GithubReleases>
</template>
