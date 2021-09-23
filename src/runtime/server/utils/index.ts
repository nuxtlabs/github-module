export function normalizeReleaseName(name: string) {
  // Remove "Release " prefix from release name
  name = name.replace('Release ', '')

  // Make sure release name starts with an alphabetical character
  if (!name.match(/^[a-zA-Z]/)) {
    name = `v${name}`
  }

  return name
}
