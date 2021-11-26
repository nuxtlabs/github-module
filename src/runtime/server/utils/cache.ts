import { murmurHashV3 } from 'murmurhash-es'
import type { Handle } from 'h3'
// @ts-ignore
import { storage } from '#storage'

// Extracted from nuxt/stats
// pi0: Please do not modify this file

export interface CacheEntry {
  value?: any
  expires?: number
  mtime?: number
  integrity?: string
}

export interface CachifyOptions {
  name: string
  getKey?: (...args: any[]) => string
  transform?: (entry: CacheEntry, ...args: any[]) => any
  group?: string
  integrity?: any
  ttl?: number
  swr?: boolean
  base?: string
}

export function cachify(fn: (...args: any[]) => any, opts: CachifyOptions) {
  const pending: { [key: string]: Promise<any> } = {}

  opts.base = process.env.NODE_ENV === 'development' ? '/root/node_modules/.cache/cachify' : '/cache'

  // Normalize cache params
  const group = opts.group || ''
  const name = opts.name || fn.name || '_'
  const integrity = murmurHashV3(JSON.stringify(opts.integrity || fn)) + '-' + name

  async function get(key: string, resolver: any) {
    const cacheKey = [opts.base, group, name, key].filter(Boolean).join(':')
    // @ts-ignore
    const entry: CacheEntry = (await storage.getItem(cacheKey)) || {}

    const ttl = (opts.ttl ?? opts.ttl ?? 0) * 1000
    if (ttl) {
      entry.expires = Date.now() + ttl
    }

    const expired = entry.integrity !== integrity || (ttl && Date.now() - (entry.mtime || 0) > ttl)

    const _resolve = async () => {
      if (!pending[key]) {
        pending[key] = resolver()
      }
      entry.value = await pending[key]
      entry.mtime = Date.now()
      entry.integrity = integrity
      delete pending[key]
      // eslint-disable-next-line no-console
      storage.setItem(cacheKey, entry).catch(console.error)
    }

    const _resolvePromise = expired ? _resolve() : Promise.resolve()

    if (opts.swr && entry.value) {
      // eslint-disable-next-line no-console
      _resolvePromise.catch(console.error)
      return Promise.resolve(entry)
    }

    return _resolvePromise.then(() => entry)
  }

  return async (...args: any[]) => {
    const key = (opts.getKey || getKey)(...args)
    const entry = await get(key, () => fn(...args))
    let value = entry.value
    if (opts.transform) {
      value = (await opts.transform(entry, ...args)) || value
    }
    return value
  }
}

function getKey(...args: any[]) {
  return 'args' + murmurHashV3(JSON.stringify(args))
}

export function cachifyHandle(handle: Handle, opts: Omit<CachifyOptions, 'getKey'>) {
  const _opts: CachifyOptions = {
    getKey: req => req.originalUrl || req.url,
    transform(entry, _req, res) {
      for (const header in entry.value.headers) {
        res.setHeader(header, entry.value.headers[header])
      }
      const cacheControl = []
      if (opts.swr) {
        if (opts.ttl) {
          cacheControl.push(`s-maxage=${opts.ttl / 1000}`)
        }
        cacheControl.push('stale-while-revalidate')
      } else if (opts.ttl) {
        cacheControl.push(`max-age=${opts.ttl / 1000}`)
      }
      if (cacheControl.length) {
        res.setHeader('Cache-Control', cacheControl.join(', '))
      }
      return entry.value.body
    },
    ...opts
  }

  return cachify(async (req, res) => {
    const body = await handle(req, res)
    const headers = res.getHeaders()
    return { body, headers }
  }, _opts)
}
