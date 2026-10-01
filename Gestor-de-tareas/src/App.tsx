import { useState } from 'react'
import './App.css'


function App() {
  return <LoginPage />
}


function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    setEmailError(validEmail ? '' : 'Ingresa un correo válido.')
    setPasswordError(password.trim() ? '' : 'La contraseña es obligatoria.')

    if (!validEmail || !password.trim()) return

    setIsSubmitting(true)
    await new Promise((resolve) => window.setTimeout(resolve, 650))

    // TODO: conectar con la API real
    if (email.trim().toLowerCase() === 'demo@gestor.com' && password === 'demo1234') {
      window.location.assign('/')
      return
    }

    setFormError('Correo o contraseña incorrectos')
    setIsSubmitting(false)
  }

  return (
    <main className="login-page">
      <section className="login-aside" aria-label="Organiza tus tareas">
        <a className="brand" href="/" aria-label="Aula, inicio">
          <span className="brand-mark" aria-hidden="true">a.</span>
          <span>Aula</span>
        </a>
        <div className="aside-copy">
          <p className="eyebrow">TU ESPACIO DE ESTUDIO</p>
          <h1>Menos pendientes.<br />Más espacio para aprender.</h1>
          <p className="aside-description">
            Todas tus materias y fechas importantes, en un solo lugar.
          </p>
        </div>
        <div className="task-preview" aria-label="Vista previa de tareas">
          <div className="preview-header">
            <span>Esta semana</span>
            <span className="preview-date">3 tareas</span>
          </div>
          <div className="preview-task">
            <span className="task-check task-check-done" aria-hidden="true">✓</span>
            <span><strong>Resumen de lectura</strong><small>Literatura · Hoy</small></span>
            <span className="task-tag tag-done">Lista</span>
          </div>
          <div className="preview-task">
            <span className="task-check" aria-hidden="true"></span>
            <span><strong>Ejercicios de álgebra</strong><small>Matemáticas · Mañana</small></span>
            <span className="task-tag tag-soon">Pronto</span>
          </div>
          <div className="preview-task">
            <span className="task-check" aria-hidden="true"></span>
            <span><strong>Proyecto de ciencias</strong><small>Biología · Viernes</small></span>
            <span className="task-tag tag-later">En curso</span>
          </div>
        </div>
        <p className="aside-footer">Un paso a la vez. Vas por buen camino.</p>
      </section>

      <section className="login-main">
        <div className="mobile-brand" aria-hidden="true">
          <span className="brand-mark">a.</span><span>Aula</span>
        </div>
        <div className="login-form-wrap">
          <p className="form-kicker">QUÉ BUENO VERTE</p>
          <h2>Inicia sesión</h2>
          <p className="form-intro">Continúa organizando tu vida académica.</p>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="field-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setEmailError('')
                  setFormError('')
                }}
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? 'email-error' : undefined}
                disabled={isSubmitting}
              />
              {emailError && <p className="field-error" id="email-error">{emailError}</p>}
            </div>

            <div className="field-group">
              <div className="password-label-row">
                <label htmlFor="password">Contraseña</label>
                <a href="#forgot-password" onClick={(event) => event.preventDefault()}>
                  Olvidé mi contraseña
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setPasswordError('')
                  setFormError('')
                }}
                aria-invalid={Boolean(passwordError)}
                aria-describedby={passwordError ? 'password-error' : undefined}
                disabled={isSubmitting}
              />
              {passwordError && <p className="field-error" id="password-error">{passwordError}</p>}
            </div>

            {formError && <p className="form-error" role="alert">{formError}</p>}

            <button className="submit-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Entrar'}
              {!isSubmitting && <span aria-hidden="true">→</span>}
            </button>
          </form>
          <p className="login-note">Tu próximo gran logro empieza con un paso.</p>
        </div>
        <footer className="login-footer">Aula <span>·</span> Tu camino, a tu ritmo.</footer>
      </section>
    </main>
  )
}



export default App
