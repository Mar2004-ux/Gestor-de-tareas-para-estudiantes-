import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { confirmarCorreo } from './actions'
import { AccessLayout } from '../../acceso/access-layout'

export const metadata: Metadata = {
  title: 'Confirma tu correo · Aula',
  referrer: 'no-referrer',
  robots: { index: false },
}

export default async function ConfirmPage({ searchParams }: {
  searchParams: Promise<{ token_hash?: string | string[] }>
}) {
  const { token_hash: tokenHash } = await searchParams
  if (typeof tokenHash !== 'string' || !tokenHash) redirect('/acceso?confirmacion=error')

  return (
    <AccessLayout title="Confirma tu correo" intro="Confirma la dirección de tu cuenta para entrar a Mis tareas.">
        <form className="login-form" action={confirmarCorreo}>
          <input type="hidden" name="token_hash" value={tokenHash} />
          <button className="submit-button">Confirmar correo</button>
        </form>
    </AccessLayout>
  )
}
