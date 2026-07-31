const protectedSlugs = new Set([
  'admin',
  'api',
  'auth',
  'login',
  'logout',
  'preview',
  'privacy',
  'robots.txt',
  'sitemap.xml',
  'terms',
])

export type RedirectEdge = {
  sourcePath: string
  destinationPath: string
}

export type SlugChangeInput = {
  namespace: string
  currentSlug?: string
  nextSlug: string
  reservedSlugs: readonly string[]
  published?: boolean
}

export type SlugChangeResult = {
  slug: string
  redirect?: RedirectEdge
}

function stableHash(value: string): string {
  let hash = 2166136261
  for (const character of value.normalize('NFKC')) {
    hash ^= character.codePointAt(0) ?? 0
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(36)
}

export function normalizeSlug(value: string): string {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

export function createSlug(title: string): string {
  const readable = normalizeSlug(title)
  if (readable.length >= 3) {
    const hasNonAscii = /[^\x00-\x7F]/u.test(title)
    return hasNonAscii ? `${readable}-${stableHash(title).slice(0, 7)}` : readable
  }
  return `content-${stableHash(title).slice(0, 10)}`
}

function routePath(namespace: string, slug: string): string {
  return `/${normalizeSlug(namespace)}/${slug}`
}

export function validateSlugChange(input: SlugChangeInput): SlugChangeResult {
  const slug = normalizeSlug(input.nextSlug)
  if (!slug) throw new Error('Slug 不可為空白。')
  if (protectedSlugs.has(slug)) throw new Error('此網址代稱為系統保留名稱。')

  const reserved = new Set(input.reservedSlugs.map(normalizeSlug))
  const current = input.currentSlug ? normalizeSlug(input.currentSlug) : undefined
  if (reserved.has(slug) && slug !== current) {
    throw new Error('此網址代稱已被目前或歷史內容使用。')
  }

  if (!input.published || !current || current === slug) return { slug }

  const redirect = {
    sourcePath: routePath(input.namespace, current),
    destinationPath: routePath(input.namespace, slug),
  }
  if (redirect.sourcePath === redirect.destinationPath) {
    throw new Error('轉址來源與目的地不可相同。')
  }
  return { slug, redirect }
}

export function detectRedirectLoop(edges: readonly RedirectEdge[]): boolean {
  const graph = new Map(edges.map((edge) => [edge.sourcePath, edge.destinationPath]))

  for (const start of graph.keys()) {
    const visited = new Set<string>()
    let current: string | undefined = start
    while (current && graph.has(current)) {
      if (visited.has(current)) return true
      visited.add(current)
      current = graph.get(current)
    }
  }

  return false
}
