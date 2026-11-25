export function getSupabaseConfig() {
  const endpoint = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()
  if (!endpoint || !key) return null

  try {
    const url = new URL(endpoint)
    if (url.protocol === 'https:' || (url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) {
      return { url: url.origin, key }
    }
  } catch {
    return null
  }

  return null
}
