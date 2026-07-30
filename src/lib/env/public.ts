import { parsePublicEnv, type PublicEnv } from './schema'

let cached: PublicEnv | undefined

export function publicEnv(): PublicEnv {
  cached ??= parsePublicEnv(process.env)
  return cached
}
