# Docus Github Module

> GitHub integration for Docus.

## Quick Setup

1. Add `@docus/github` dependency to your project:

```bash
# Using Yarn
yarn add --dev @docus/github
# Using NPM
npm install --save-dev @docus/github
```

2. Add `@docus/github` to the `buildModules` section of your `nuxt.config.js`

```ts
{
  buildModules: ['@docus/github']
}
```

## Usage

### Get GitHub releases using `$docus.data` util

```js
$docus.data('github-releases')
```

## Development

1. Clone this repository
2. Install dependencies using `yarn install`
3. Start dev server using `yarn dev`
