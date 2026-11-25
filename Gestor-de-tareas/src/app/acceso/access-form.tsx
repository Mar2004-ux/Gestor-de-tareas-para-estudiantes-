'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { authenticate } from './actions'

export function AccessForm({ register, configured }: { register: boolean; configured: boolean }) {
  const [state, action, pending] = useActionState(authenticate, {})
  return (
    <>
      <form className="login-form" action={action}>
        <input type="hidden" name="mode" value={register ? 'register' : 'login'} />
        <div className="field-group">
          <label htmlFor="email">Correo electrónico</label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="tu@correo.com" required />
        </div>
        <div className="field-group">
          <label htmlFor="password">Contraseña</label>
          <input id="password" name="password" type="password" required
            minLength={register ? 8 : undefined} maxLength={72}
            autoComplete={register ? 'new-password' : 'current-password'}
            placeholder={register ? 'Al menos 8 caracteres' : 'Ingresa tu contraseña'} />
        </div>
        {state.error && <p className="form-error" role="alert">{state.error}</p>}
        {state.message && <p className="form-success" role="status">{state.message}</p>}
        {!configured && <p className="form-error" role="alert">El acceso aún no está configurado en este despliegue.</p>}
        <button className="submit-button" disabled={pending || !configured}>
          {pending ? 'Procesando…' : register ? 'Crear cuenta' : 'Entrar'}
          <span aria-hidden="true">→</span>
        </button>
      </form>
      <p className="access-switch">
        {register ? '¿Ya tienes cuenta? ' : '¿Primera vez en Aula? '}
        <Link href={register ? '/acceso' : '/acceso?modo=registro'}>
          {register ? 'Inicia sesión' : 'Crea una cuenta'}
        </Link>
      </p>
    </>
  )
}
