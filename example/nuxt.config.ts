import { withDocus } from '@docus/app/kit'

const config = withDocus({
  rootDir: __dirname,
  buildModules: ['../src']
})

export default config
