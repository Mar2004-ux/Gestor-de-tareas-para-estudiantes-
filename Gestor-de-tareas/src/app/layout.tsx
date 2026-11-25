import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Aula · Gestor de tareas',
  description: 'Organiza tus materias y fechas de entrega.',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>
}
