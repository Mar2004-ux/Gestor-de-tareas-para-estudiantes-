# Aula · Gestor de tareas

Aplicación Next.js para registrar materias y tareas académicas. Usa Supabase Auth para las cuentas y Postgres para guardar los datos. Las políticas de la base limitan cada materia y tarea a su propietario. Los plazos se clasifican con la fecha de Bogotá.

## Preparar Supabase

1. Crea un proyecto Supabase. En **SQL Editor**, ejecuta una vez el contenido de [la migración inicial](supabase/migrations/20261125000000_academic_tasks.sql). Si ya tienes tablas con esos nombres, revisa el esquema existente antes de aplicar esta migración.
2. Copia la **Project URL** y la **Publishable key** del proyecto. Los nombres de las variables están en [`.env.example`](.env.example). La aplicación usa la clave publicable y nunca necesita una clave de servicio.
3. En **Authentication → Providers**, habilita el proveedor de correo y el registro de usuarios. Mantén la confirmación de correo y configura un servidor SMTP propio para que puedan recibir correos estudiantes ajenos al equipo de Supabase.
4. En **Authentication → URL Configuration**, configura **Site URL** con el dominio público de producción. Para desarrollo, usa un proyecto de Supabase de pruebas con `http://localhost:3000` como **Site URL**.
5. En **Authentication → Email Templates → Confirm signup**, usa este enlace en la plantilla para que la confirmación cree la sesión y abra el panel.

   ```html
   <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}">Confirmar correo</a>
   ```

   Si mantienes la plantilla predeterminada de Supabase, el usuario confirma allí y regresa a Aula para iniciar sesión con su contraseña.

## Desarrollo

Requiere Node.js 24. Copia `.env.example` a `.env.local` y completa las dos variables con los valores de tu proyecto de pruebas.

```sh
npm ci
npm run dev
npm run lint
npm test
npm run build
```

El servidor de desarrollo usa el puerto 3000. Abre la página de acceso, elige **Crea una cuenta** y confirma tu correo. En **Mis tareas**, registra una materia y úsala al guardar la primera tarea.

## Vercel

Selecciona `Gestor-de-tareas` como directorio raíz, **Next.js** como preset y **Node.js 24.x**. Si el proyecto antes desplegaba el prototipo de Vite, elimina las opciones de compilación o salida que apuntan a Vite o a `dist`.

En **Settings → Environment Variables** agrega `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` para **Production**. Despliega de nuevo cuando cambien estas variables. Para pruebas en **Preview**, usa un proyecto de Supabase de pruebas para que esas cuentas y tareas queden fuera de producción.

En el despliegue, crea dos cuentas. Con la primera, registra una materia y una tarea y confirma que siguen allí después de cerrar sesión y volver a entrar. La segunda cuenta debe ver únicamente sus propios datos.
