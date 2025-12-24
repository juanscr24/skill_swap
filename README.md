# SkillSwap 🔄

**SkillSwap** es una plataforma profesional de intercambio de habilidades que conecta a personas que desean enseñar y aprender nuevas competencias. Funciona como un "Tinder de habilidades" donde los usuarios pueden hacer match basándose en sus intereses de aprendizaje y enseñanza.

## 🎯 Descripción del Proyecto

SkillSwap permite a los usuarios crear perfiles profesionales donde pueden:
- 📚 **Publicar habilidades que enseñan** - Comparte tu experiencia y conocimientos
- 🎓 **Indicar habilidades que quieren aprender** - Encuentra mentores para tus objetivos
- 🤝 **Enviar solicitudes de intercambio** - Conecta con usuarios compatibles
- 💬 **Chatear en tiempo real** - Comunícate directamente con tus matches
- ⭐ **Dejar reviews** - Construye tu reputación en la plataforma
- 📊 **Seguimiento de progreso** - Monitorea tu desarrollo y aprendizaje

## ✨ Características Principales

### Sistema de Matching
- Algoritmo de coincidencia basado en habilidades complementarias
- Solicitudes de intercambio personalizadas
- Estados de match (pendiente, aceptado, rechazado)

### Gestión de Perfiles
- Perfiles profesionales completos
- Biografía y ubicación
- Roles de usuario (USER, MENTOR, STUDENT, ADMIN)
- Sistema de verificación de email

### Comunicación
- Chat en tiempo real entre usuarios
- Sistema de mensajería con estado de lectura
- Notificaciones de nuevos mensajes

### Sistema de Sesiones
- Programación de sesiones de intercambio
- Estados de sesión (programada, completada, cancelada)
- Gestión de anfitrión e invitado

### Reviews y Reputación
- Sistema de calificación (rating)
- Comentarios detallados
- Historial de reviews recibidas y escritas

### Notificaciones
- Sistema de notificaciones en tiempo real
- Tipos de notificación personalizables
- Estado de lectura/no lectura

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Lucide React** - Iconos
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas

### Backend
- **Next.js API Routes** - Endpoints RESTful
- **Prisma ORM** - Gestión de base de datos
- **PostgreSQL** - Base de datos (Clever Cloud)

### Autenticación
- **NextAuth.js** - Sistema de autenticación
- Soporte para múltiples proveedores
- Sesiones seguras

## 🚀 Getting Started

### Prerequisitos

- Node.js 18+ instalado
- Cuenta en [Clever Cloud](https://console.clever-cloud.com/) para la base de datos PostgreSQL

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd skill_swap
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
# Database
DATABASE_URL="postgresql://usuario:contraseña@host:puerto/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-key-aqui"
```

4. **Configurar la base de datos**
```bash
# Sincronizar el schema con la base de datos
npx prisma db push

# Generar el cliente de Prisma
npx prisma generate
```

5. **Ejecutar el servidor de desarrollo**
```bash
npm run dev
```

6. **Abrir la aplicación**

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
skill_swap/
├── prisma/
│   └── schema.prisma          # Modelos de base de datos
├── src/
│   ├── app/                   # App Router de Next.js
│   │   ├── api/              # API Routes
│   │   ├── auth/             # Páginas de autenticación
│   │   └── ...               # Otras páginas
│   ├── components/           # Componentes React reutilizables
│   ├── lib/                  # Utilidades y configuraciones
│   └── types/                # Definiciones de TypeScript
├── public/                   # Archivos estáticos
└── ...
```

## 🗄️ Modelos de Base de Datos

- **User** - Usuarios de la plataforma
- **Account** - Cuentas de autenticación
- **AccountSession** - Sesiones de usuario
- **Skill** - Habilidades que los usuarios enseñan
- **WantedSkill** - Habilidades que los usuarios quieren aprender
- **Match** - Solicitudes de intercambio entre usuarios
- **Message** - Mensajes del chat
- **Session** - Sesiones programadas de intercambio
- **Review** - Reseñas y calificaciones
- **Notification** - Notificaciones del sistema

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Prisma con Clever Cloud

Esta guía te ayudará a configurar Prisma con una base de datos PostgreSQL alojada en Clever Cloud desde cero.

### 1. Crear la base de datos en Clever Cloud

1. Inicia sesión en [Clever Cloud](https://console.clever-cloud.com/)
2. Crea una nueva aplicación de tipo **PostgreSQL**
3. Copia la URL de conexión que se proporciona (formato: `postgresql://usuario:contraseña@host:puerto/database`)

### 2. Instalar dependencias

```bash
npm install prisma @prisma/client
npm install -D prisma dotenv
```

### 3. Inicializar Prisma

```bash
npx prisma init
```

Esto creará:
- Carpeta `prisma/` con `schema.prisma`
- Archivo `.env` (si no existe)

### 4. Configurar variables de entorno

Agrega la URL de tu base de datos en el archivo `.env`:

```env
DATABASE_URL="postgresql://usuario:contraseña@host:puerto/database"
```

### 5. Configurar el schema de Prisma

Edita `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../node_modules/.prisma/client"
}

datasource db {
  provider = "postgresql"
}

// Tus modelos aquí
model User {
  id    String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  email String @unique
  name  String?
}
```

### 6. Configurar prisma.config.ts

Crea o verifica que existe `prisma.config.ts` en la raíz del proyecto:

```typescript
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

### 7. Sincronizar el schema con la base de datos

**Importante:** Clever Cloud no permite crear bases de datos adicionales, por lo que **NO puedes usar** `prisma migrate dev`. En su lugar, usa:

```bash
npx prisma db push
```

Este comando sincroniza tu schema directamente con la base de datos sin necesidad de una "shadow database".

### 8. Generar el Prisma Client

```bash
npx prisma generate
```

### 9. Usar Prisma en tu código

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Ejemplo de uso
async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'ejemplo@email.com',
      name: 'Juan'
    }
  })
  console.log(user)
}
```

### Comandos útiles

```bash
# Sincronizar cambios del schema con la BD
npx prisma db push

# Regenerar el cliente después de cambios en el schema
npx prisma generate

# Abrir Prisma Studio (interfaz visual para ver/editar datos)
npx prisma studio

# Ver el estado de la base de datos
npx prisma db pull
```

### ⚠️ Notas importantes

- **No uses** `prisma migrate dev` con Clever Cloud (requiere permisos para crear bases de datos)
- **Usa** `prisma db push` para desarrollo
- **Usa** `prisma migrate deploy` solo si tienes archivos de migración generados localmente
- El archivo `.env` debe estar en `.gitignore` para no exponer credenciales

### Troubleshooting

**Error P3014 (permission denied to create database)**
- Solución: Usa `npx prisma db push` en lugar de `npx prisma migrate dev`

**Error "output path is required"**
- Solución: Agrega `output = "../node_modules/.prisma/client"` en el generator client del schema.prisma
