import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { confirmarCorreo } from './actions'
import '../../acceso/acceso.css'

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
    <main className="login-main confirm-main">
      <div className="login-form-wrap">
        <h2>Confirma tu correo</h2>
        <p className="form-intro">Confirma la dirección de tu cuenta para entrar a Mis tareas.</p>
        <form className="login-form" action={confirmarCorreo}>
          <input type="hidden" name="token_hash" value={tokenHash} />
          <button className="submit-button">Confirmar correo</button>
        </form>
      </div>
    </main>
  )
}
