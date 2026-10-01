"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type FormErrors = {
  email?: string;
  password?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Escribe un correo electrónico válido.";
    }
    if (!password.trim()) {
      nextErrors.password = "Escribe tu contraseña.";
    }

    setErrors(nextErrors);
    setAuthError("");
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    window.setTimeout(() => {
      // TODO: conectar con la API real
      if (email.trim().toLowerCase() === "demo@estudiantes.com" && password === "demo1234") {
        router.push("/");
        return;
      }

      setAuthError("Correo o contraseña incorrectos");
      setIsSubmitting(false);
    }, 650);
  }

  return (
    <main className="min-h-screen bg-[#f4f5f0] text-[#172b25] lg:grid lg:grid-cols-[minmax(360px,0.9fr)_1.1fr]">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#173c32] px-12 py-10 text-[#f6f5ec] lg:flex lg:flex-col lg:justify-between xl:px-16">
        <div className="absolute -bottom-28 -left-24 h-96 w-96 rounded-full border border-[#d6f36a]/20" aria-hidden="true" />
        <div className="absolute -bottom-12 -left-8 h-64 w-64 rounded-full border border-[#d6f36a]/20" aria-hidden="true" />
        <a href="/" className="relative flex w-fit items-center gap-3 text-sm font-semibold tracking-wide">
          <span className="grid size-10 place-items-center rounded-xl bg-[#d6f36a] text-lg font-black text-[#173c32]" aria-hidden="true">t.</span>
          Tareas al día
        </a>

        <div className="relative max-w-lg pb-10">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#d6f36a]">Tu espacio de estudio</p>
          <h1 className="max-w-md font-serif text-5xl leading-[1.08] xl:text-6xl">
            Menos pendientes. Más claridad.
          </h1>
          <p className="mt-6 max-w-sm text-base leading-7 text-[#d8e1d8]">
            Gestor de tareas para estudiantes: organiza tus materias y llega a cada fecha con tiempo.
          </p>
          <div className="mt-12 flex items-center gap-3 text-sm text-[#d8e1d8]">
            <span className="flex -space-x-2" aria-hidden="true">
              <span className="size-8 rounded-full border-2 border-[#173c32] bg-[#f0a184]" />
              <span className="size-8 rounded-full border-2 border-[#173c32] bg-[#d6f36a]" />
              <span className="size-8 rounded-full border-2 border-[#173c32] bg-[#9dc9c0]" />
            </span>
            <span>Un paso a la vez, todo bajo control.</span>
          </div>
        </div>

        <p className="relative text-xs text-[#b9c9bf]">Un buen plan también deja espacio para respirar.</p>
      </section>

      <section className="flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-12 xl:px-20">
        <header className="flex items-center justify-between lg:justify-end">
          <a href="/" className="flex items-center gap-2 text-sm font-semibold lg:hidden">
            <span className="grid size-9 place-items-center rounded-xl bg-[#173c32] text-lg font-black text-[#d6f36a]" aria-hidden="true">t.</span>
            Tareas al día
          </a>
          <span className="text-sm text-[#66746d]">¿Primera vez aquí? <span className="font-semibold text-[#173c32]">Muy pronto</span></span>
        </header>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#758278]">Qué bueno verte</p>
          <h2 className="font-serif text-4xl leading-tight text-[#173c32]">Inicia sesión</h2>
          <p className="mt-3 text-[15px] leading-6 text-[#66746d]">Entra a tu espacio y retoma tus tareas donde las dejaste.</p>

          <form className="mt-9 space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold">Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setErrors((current) => ({ ...current, email: undefined }));
                  setAuthError("");
                }}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                className="min-h-12 w-full rounded-lg border border-[#cbd2c8] bg-white px-4 text-base outline-none transition placeholder:text-[#9aa49b] focus:border-[#31715d] focus:ring-2 focus:ring-[#31715d]/15 aria-[invalid=true]:border-[#b94b3d]"
                placeholder="nombre@correo.com"
              />
              {errors.email && <p id="email-error" className="mt-2 text-sm text-[#a33d32]" role="alert">{errors.email}</p>}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="password" className="text-sm font-semibold">Contraseña</label>
                <button type="button" className="text-sm font-semibold text-[#31715d] underline decoration-transparent underline-offset-4 transition hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#31715d]">
                  Olvidé mi contraseña
                </button>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setErrors((current) => ({ ...current, password: undefined }));
                  setAuthError("");
                }}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
                className="min-h-12 w-full rounded-lg border border-[#cbd2c8] bg-white px-4 text-base outline-none transition placeholder:text-[#9aa49b] focus:border-[#31715d] focus:ring-2 focus:ring-[#31715d]/15 aria-[invalid=true]:border-[#b94b3d]"
                placeholder="Tu contraseña"
              />
              {errors.password && <p id="password-error" className="mt-2 text-sm text-[#a33d32]" role="alert">{errors.password}</p>}
            </div>

            {authError && <p className="text-sm text-[#a33d32]" role="alert">{authError}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#173c32] px-5 text-sm font-semibold text-white transition hover:bg-[#245744] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#31715d] disabled:cursor-wait disabled:opacity-65"
            >
              {isSubmitting && <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs leading-5 text-[#7a867d]">Al continuar, tus tareas y fechas límite estarán siempre a mano.</p>
        </div>

        <footer className="pb-2 text-center text-xs text-[#7a867d] lg:text-left">© {new Date().getFullYear()} Tareas al día</footer>
      </section>
    </main>
  );
}