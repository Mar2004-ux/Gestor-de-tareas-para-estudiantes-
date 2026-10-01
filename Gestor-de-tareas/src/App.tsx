import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  if (window.location.pathname === '/login') {
    return <LoginPage />
  }

  return <StarterHome />
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

function StarterHome() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
