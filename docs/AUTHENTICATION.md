# 🔐 Sistema de Autenticación - SkillSwap

## Estructura del Proyecto

```
src/
├── app/
│   └── api/
│       └── auth/
│           ├── [...nextauth]/
│           │   └── route.ts          # Endpoint principal de NextAuth
│           └── register/
│               └── route.ts          # API para registro de usuarios
├── components/
│   └── providers/
│       └── SessionProvider.tsx       # Provider de sesión para la app
├── hooks/
│   └── useAuth.ts                    # Hook personalizado para autenticación
├── lib/
│   ├── prisma.ts                     # Cliente singleton de Prisma
│   └── auth/
│       ├── auth.config.ts            # Configuración de NextAuth
│       └── index.ts                  # Exportaciones públicas
├── services/
│   └── auth/
│       ├── user.service.ts           # Servicios de usuarios
│       └── index.ts                  # Exportaciones públicas
├── types/
│   └── next-auth.d.ts                # Tipos extendidos de NextAuth
├── validations/
│   └── auth.ts                       # Schemas de validación con Zod
├── views/
│   ├── LoginView.tsx                 # Vista de inicio de sesión
│   └── RegisterView.tsx              # Vista de registro
└── middleware.ts                      # Middleware de protección de rutas
```

## 🚀 Características

- ✅ Autenticación con email y contraseña
- ✅ Registro de usuarios con validación
- ✅ Hash seguro de contraseñas con bcrypt
- ✅ Sesiones JWT con NextAuth
- ✅ Protección de rutas con middleware
- ✅ Manejo de errores robusto
- ✅ Validación con Zod
- ✅ TypeScript totalmente tipado
- ✅ Arquitectura modular y escalable
- 🔄 Autenticación con Google (opcional)
- 🔄 Autenticación con GitHub (opcional)

## 📋 Requisitos

1. Base de datos PostgreSQL configurada
2. Variables de entorno en `.env`:
   ```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="tu_secreto_generado"
   NEXTAUTH_URL="http://localhost:3000"
   ```

## 🔧 Configuración

### 1. Variables de Entorno

Copia `.env.example` a `.env` y configura:

```bash
cp .env.example .env
```

Genera un secreto seguro para NextAuth:

```bash
openssl rand -base64 32
```

### 2. Base de Datos

El schema ya incluye el campo `password` en el modelo `User`. Si no has aplicado las migraciones:

```bash
npx prisma db push
npx prisma generate
```

## 📚 Uso

### En componentes de cliente

```typescript
'use client'
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()

  // Verificar si el usuario está autenticado
  if (isAuthenticated) {
    return <div>Hola {user?.name}</div>
  }

  return <LoginForm />
}
```

### En componentes de servidor

```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

async function MyServerComponent() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <div>No autenticado</div>
  }

  return <div>Hola {session.user.name}</div>
}
```

### Hook `useAuth`

```typescript
const {
  // Estado
  user,              // Usuario actual
  isAuthenticated,   // ¿Está autenticado?
  isLoading,         // ¿Está cargando?
  error,             // Error si existe

  // Acciones
  login,             // Login con credenciales
  register,          // Registrar nuevo usuario
  loginWithGoogle,   // Login con Google
  loginWithGithub,   // Login con GitHub
  logout,            // Cerrar sesión
  setError,          // Setear error manualmente
} = useAuth()
```

## 🔒 Rutas Protegidas

El middleware protege automáticamente estas rutas:
- `/dashboard/*`
- `/profile/*`
- `/chats/*`
- `/sessions/*`
- `/matching/*`
- `/requests/*`
- `/mentors/*`
- `/reviews/*`

Para agregar más rutas protegidas, edita `src/middleware.ts`:

```typescript
export const config = {
  matcher: [
    '/mi-nueva-ruta/:path*',
    // ... otras rutas
  ],
}
```

## 🛡️ Servicios de Autenticación

### `user.service.ts`

Funciones disponibles:

- `hashPassword(password)` - Hashea una contraseña
- `verifyPassword(password, hash)` - Verifica una contraseña
- `createUser(data)` - Crea un nuevo usuario
- `getUserByEmail(email)` - Obtiene usuario por email
- `getUserById(id)` - Obtiene usuario por ID
- `verifyUserEmail(userId)` - Marca email como verificado
- `updateUserPassword(userId, newPassword)` - Actualiza contraseña

## 📝 Validaciones

### Schemas disponibles (`validations/auth.ts`)

```typescript
import { loginSchema, registerSchema } from '@/validations/auth'

// Validar datos de login
const loginData = loginSchema.parse({ email, password })

// Validar datos de registro
const registerData = registerSchema.parse({
  name,
  email,
  password,
  confirmPassword
})
```

## 🌐 API Endpoints

### POST `/api/auth/register`

Registra un nuevo usuario.

**Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "uuid",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "USER"
  }
}
```

### POST `/api/auth/signin`

Manejado por NextAuth automáticamente.

## 🔐 Configuración OAuth (Opcional)

### Google

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto y habilita Google+ API
3. Configura OAuth 2.0 credentials
4. Agrega en `.env`:
   ```env
   GOOGLE_CLIENT_ID="tu_client_id"
   GOOGLE_CLIENT_SECRET="tu_client_secret"
   ```

### GitHub

1. Ve a GitHub Settings > Developer settings > OAuth Apps
2. Crea una nueva OAuth App
3. Agrega en `.env`:
   ```env
   GITHUB_ID="tu_github_id"
   GITHUB_SECRET="tu_github_secret"
   ```

## 🎨 Personalización

### Páginas de NextAuth

Las páginas personalizadas están configuradas en `lib/auth/auth.config.ts`:

```typescript
pages: {
  signIn: '/login',
  signOut: '/login',
  error: '/login',
  newUser: '/dashboard',
}
```

### Callbacks

Puedes modificar los callbacks en `lib/auth/auth.config.ts` para agregar lógica personalizada:

```typescript
callbacks: {
  async jwt({ token, user }) {
    // Tu lógica aquí
    return token
  },
  async session({ session, token }) {
    // Tu lógica aquí
    return session
  },
}
```

## 🧪 Testing

Para probar el sistema de autenticación:

1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Ve a `http://localhost:3000/register`

3. Registra un nuevo usuario

4. Inicia sesión en `http://localhost:3000/login`

5. Verás que serás redirigido a `/dashboard` automáticamente

## 📊 Modelos de Base de Datos

### User
```prisma
model User {
  id             String    @id @default(dbgenerated("gen_random_uuid()"))
  name           String?
  email          String    @unique
  password       String?   // Para autenticación con credenciales
  email_verified DateTime?
  image          String?
  role           Role      @default(USER)
  // ... más campos
}
```

## 🚨 Manejo de Errores

El sistema maneja automáticamente estos errores:

- Email ya registrado (409)
- Credenciales inválidas (401)
- Datos de validación incorrectos (400)
- Errores del servidor (500)

## 🔍 Debugging

Para ver logs detallados de NextAuth:

```env
# En .env
NODE_ENV=development
```

Esto habilitará el modo debug de NextAuth automáticamente.

## 📦 Dependencias

- `next-auth` - Sistema de autenticación
- `@next-auth/prisma-adapter` - Adaptador de Prisma
- `@prisma/client` - Cliente de Prisma
- `bcrypt` - Hash de contraseñas
- `zod` - Validación de schemas
- `react-hook-form` - Manejo de formularios

## 🎯 Próximos Pasos

- [ ] Implementar verificación de email
- [ ] Agregar recuperación de contraseña
- [ ] Implementar autenticación de dos factores (2FA)
- [ ] Agregar límite de intentos de login
- [ ] Implementar cierre de sesión en todos los dispositivos
- [ ] Agregar logs de actividad del usuario

## 📖 Recursos

- [NextAuth Docs](https://next-auth.js.org/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Zod Docs](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)

---

¡Sistema de autenticación listo! 🎉
