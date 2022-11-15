import { H3Event } from 'h3'

export const addPrerenderPath = (event: H3Event) => {
  event.res.setHeader(
    'x-nitro-prerender',
    [
      event.res.getHeader('x-nitro-prerender'),
      event.req.url
    ].filter(Boolean).join(',')
  )
}
