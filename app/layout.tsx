import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión | Tareas al día",
  description: "Organiza tus tareas y mantén tus materias al día.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}