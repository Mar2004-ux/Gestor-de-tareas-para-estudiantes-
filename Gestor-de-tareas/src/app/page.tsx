import { redirect } from 'next/navigation'

export default async function Home({ searchParams }: {
  searchParams: Promise<{ code?: string | string[]; error_code?: string | string[] }>
}) {
  const { code, error_code } = await searchParams
  if (typeof code === 'string' && code) {
    const query = new URLSearchParams({ code })
    redirect(`/auth/callback?${query}`)
  }
  if (error_code) redirect('/acceso?confirmacion=error')
  redirect('/tareas')
}
