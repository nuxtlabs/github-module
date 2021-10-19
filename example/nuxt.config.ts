import { resolve } from 'path'
import { withDocus } from '@docus/app/kit'

const modulePath = resolve(__dirname, '../src/index')

const config = withDocus({
  rootDir: __dirname,
  buildModules: [modulePath]
})

export default config
