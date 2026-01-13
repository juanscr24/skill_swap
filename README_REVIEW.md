# 📊 Revisión Técnica de Arquitectura y Calidad de Código
## Skill Swap - Next.js App Router Project

**Fecha de Revisión:** 11 de Enero, 2026  
**Stack Tecnológico:** Next.js 16, Prisma, NextAuth, Supabase, React Query, Zustand, Tailwind CSS

---

## 🎯 Resumen Ejecutivo

Este proyecto muestra una **arquitectura sólida basada en features/dominio** con buena separación de responsabilidades. Sin embargo, presenta varias oportunidades de mejora en términos de:

- **Código duplicado** en lógica de fetching y manejo de errores
- **Componentes excesivamente grandes** que mezclan UI y lógica de negocio
- **Inconsistencias** en el uso de React Query vs fetch directo
- **Estado global infrautilizado** (Zustand solo para UI, no para datos de negocio)
- **Patrones de API inconsistentes** entre diferentes features

### Calificación General

| Aspecto | Calificación | Nota |
|---------|--------------|------|
| Arquitectura | ⭐⭐⭐⭐☆ | Muy buena separación por features |
| Código Limpio | ⭐⭐⭐☆☆ | Código duplicado y componentes grandes |
| Performance | ⭐⭐⭐⭐☆ | Buen uso de React Query y caching |
| Mantenibilidad | ⭐⭐⭐☆☆ | Necesita consolidación de patrones |
| Seguridad | ⭐⭐⭐⭐☆ | Buena validación de autenticación |

---

## 🔴 Problemas Críticos Detectados

### 1. ❌ Fetch Duplicado en Múltiples Lugares

**Problema:** Se encontraron **47+ instancias** de `fetch()` manual en hooks y componentes, cuando ya existe un sistema de `useApiQuery` y `useApiMutation`.

**Archivos Afectados:**
- `src/features/chat/hooks/useRealtimeMessages.ts` (6 fetch calls)
- `src/features/chat/hooks/useConversations.ts` (4 fetch calls)
- `src/features/request/components/RequestsView.tsx` (2 fetch calls inline)
- `src/features/session/components/ScheduleSessionView.tsx` (fetch inline)
- `src/features/profile/components/EditProfileView.tsx` (fetch inline con reload)

**Impacto:**
- ❌ Código repetitivo de manejo de errores
- ❌ No se aprovecha el caching de React Query
- ❌ Falta consistencia en manejo de loading/error states
- ❌ Dificulta testing y debugging

### 2. ⚠️ Componentes God Component

**Archivos Problemáticos:**

| Archivo | Líneas | Problema Principal |
|---------|---------|-------------------|
| `src/features/chat/components/ChatPage.tsx` | ~200 | Mezcla lógica de Realtime, presencia, y UI completa |
| `src/features/profile/components/ProfileView.tsx` | ~150 | Demasiadas responsabilidades (skills, languages, reviews) |
| `src/features/session/components/ScheduleSessionView.tsx` | ~292 | Lógica de formulario + validación + fetch manual |
| `src/features/request/components/RequestsView.tsx` | ~250+ | Tabs + filtros + fetch inline + navegación |

**Consecuencias:**
- 🐛 Difícil de testear unitariamente
- 🐌 Re-renders innecesarios
- 🔧 Difícil de mantener y extender
- 📦 Archivos demasiado grandes para entender rápidamente

### 3. 🔄 Recargas de Página Innecesarias

**Ubicación:** `src/features/profile/components/EditProfileView.tsx`

```typescript
// ❌ ANTI-PATRÓN
window.location.reload() // Línea 42
```

**Problema:** Después de actualizar el perfil, se recarga toda la página en lugar de invalidar queries de React Query.

### 4. 📝 Inconsistencia en Patrones de API

**Problema:** Algunas features usan hooks personalizados (`useApiQuery`/`useApiMutation`) mientras otras hacen fetch directo.

**Ejemplos:**

```typescript
// ✅ CORRECTO - src/features/profile/hooks/useProfile.ts
useApiQuery<UserProfile>('profile', '/api/users/profile')

// ❌ INCORRECTO - src/features/request/components/RequestsView.tsx
const response = await fetch('/api/conversations', { method: 'POST', ... })
```

---

## 🔁 Código Repetitivo

### Patrón de Fetch Manual Repetido

**Instancias:** ~40+ veces en el proyecto

**Patrón típico:**
```typescript
// Se repite en múltiples archivos
const response = await fetch('/api/...', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
})
if (!response.ok) throw new Error('...')
return response.json()
```

**Ubicaciones:**
- `src/features/chat/hooks/*.ts` (múltiples archivos)
- `src/features/session/hooks/*.ts`
- `src/features/request/hooks/*.ts`
- `src/features/review/hooks/*.ts`
- Componentes: `RequestsView.tsx`, `ScheduleSessionView.tsx`, `EditProfileView.tsx`

### Lógica de Validación de Sesión Duplicada

**Archivos API con el mismo patrón:**

```typescript
// Se repite en ~47 archivos de API routes
const session = await getServerSession(authOptions)
if (!session?.user?.id) {
  return NextResponse.json({ message: 'No autenticado' }, { status: 401 })
}
```

**Recomendación:** Crear middleware o helper `withAuth()` para encapsular esta lógica.

### Manejo de Errores Genérico Repetido

**Patrón repetido en API routes:**

```typescript
catch (error: any) {
  console.error('Error ...:', error)
  return NextResponse.json(
    { message: error.message || 'Error ...' },
    { status: 500 }
  )
}
```

---

## 🗑️ Componentes y Archivos No Utilizados

### Análisis de Uso de Componentes

**Potencialmente Sin Uso (requiere verificación):**

1. **`public/index.ts`** - Archivo de barril en public, posiblemente innecesario
2. **`src/shared/components/ui/CardGuide.tsx`** - No se encontraron referencias de importación
3. **`src/shared/components/ui/MoreMentorsCard.tsx`** - Uso limitado, posible refactor
4. **`src/features/activity/hooks/useAllActivity.ts`** vs **`useRecentActivity.ts`** - Funcionalidad superpuesta

### Archivos de Configuración Duplicados

- `src/lib/auth/index.ts` y `src/lib/auth/auth.config.ts` - Posible consolidación
- Múltiples archivos `index.ts` de barril que podrían simplificarse

---

## 📏 Archivos Grandes y Complejos

### Top 10 Archivos que Necesitan Refactorización

| Prioridad | Archivo | Líneas | Problema | Refactorización Sugerida |
|-----------|---------|---------|----------|--------------------------|
| 🔴 Alta | `src/features/chat/components/ChatPage.tsx` | ~200 | God component, mezcla múltiples responsabilidades | Separar en: `ChatContainer`, `ConversationPanel`, `MessagePanel` |
| 🔴 Alta | `src/features/session/components/ScheduleSessionView.tsx` | ~292 | Lógica de formulario compleja + validaciones inline | Extraer a hook `useScheduleForm` + componentes pequeños |
| 🔴 Alta | `src/features/request/components/RequestsView.tsx` | ~250+ | Tabs + lógica compleja + fetching inline | Separar tabs en componentes, usar hooks |
| 🟡 Media | `src/features/profile/components/ProfileView.tsx` | ~150 | Demasiadas secciones en un componente | Dividir en sub-páginas o accordion lazy-loaded |
| 🟡 Media | `src/features/profile/components/EditProfileView.tsx` | ~100 | Fetch inline + window.reload | Usar `useApiMutation` + invalidación |
| 🟡 Media | `src/app/api/sessions/route.ts` | ~158 | 4 métodos HTTP en un archivo | Considerar separar en archivos dedicados |
| 🟢 Baja | `prisma/schema.prisma` | ~300 | Archivo grande pero bien estructurado | Mantener o dividir en múltiples schemas (Prisma 5+) |
| 🟢 Baja | `src/shared/hooks/useApiMutation.ts` | ~206 | Funciones helper adicionales | Considerar separar helpers de mutación |

### Ejemplo de Refactorización: ChatPage.tsx

**Antes (❌):**
```typescript
// src/features/chat/components/ChatPage.tsx - 200 líneas
export const ChatPage = () => {
  // Estados locales (10+ líneas)
  // Hooks de datos (5+ hooks)
  // Efectos (3+ useEffect)
  // Funciones handlers (5+ funciones)
  // JSX complejo (100+ líneas)
}
```

**Después (✅):**
```typescript
// src/features/chat/components/ChatPage.tsx - 50 líneas
export const ChatPage = () => {
  return (
    <ChatLayout>
      <ConversationSidebar />
      <MessageArea />
    </ChatLayout>
  )
}

// src/features/chat/components/ConversationSidebar.tsx
// src/features/chat/components/MessageArea.tsx
// src/features/chat/hooks/useChatState.ts
```

---

## 🏗️ Organización de Carpetas Recomendada

### Estado Actual ✅

```
src/
  features/
    auth/
      components/
      hooks/
      services/
      types/
      validations/
    chat/
      (misma estructura)
```

**Puntos Positivos:**
- ✅ Excelente separación por dominio/feature
- ✅ Estructura consistente entre features
- ✅ Services separados de hooks (buena práctica)

### Mejoras Sugeridas 🎯

#### 1. Separar Lógica de API

```
src/
  features/
    chat/
      api/           # ← NUEVO: API utilities específicas del feature
        endpoints.ts
        queries.ts
      components/
      hooks/
      services/
      types/
      validations/
```

#### 3. Organizar Hooks por Categoría

```
features/chat/
  hooks/
    queries/       # React Query hooks (useConversations, useMessages)
    mutations/     # Mutation hooks (useSendMessage, useMarkAsRead)
    realtime/      # Supabase realtime hooks
    state/         # Estado local complejo (useChatState)
```

#### 4. Crear Carpeta de Utilidades por Feature

```
features/chat/
  utils/
    formatters.ts  # Formateo de mensajes, fechas
    validators.ts  # Validaciones específicas del chat
    constants.ts   # Constantes del feature
```

---

## 🎯 Mejores Prácticas Propuestas

### 1. React Query: Patrones Recomendados

#### ❌ **EVITAR: Fetch Manual**

```typescript
// src/features/session/components/ScheduleSessionView.tsx
const response = await fetch('/api/sessions/request', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
})
```

#### ✅ **RECOMENDADO: useApiMutation**

```typescript
// src/features/session/hooks/useScheduleSession.ts
export const useScheduleSession = () => {
  return useApiMutation({
    mutationFn: async (data: SessionRequestData) => {
      const res = await fetch('/api/sessions/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Error scheduling session')
      return res.json()
    },
    invalidateKeys: ['sessions', 'availability'],
    onSuccess: () => {
      // Feedback al usuario
    }
  })
}
```

#### Beneficios:
- ✅ Caching automático
- ✅ Invalidación centralizada
- ✅ Loading/error states manejados por React Query
- ✅ Retry automático en caso de fallos
- ✅ Optimistic updates disponibles

### 2. Zustand: Uso Recomendado

#### Estado Actual (✅ Correcto para UI)

```typescript
// src/stores/themeStore.ts
useThemeStore()      // UI state ✅
useLocaleStore()     // UI state ✅
useSettingsStore()   // Preferencias de usuario ✅
```

#### 🎯 **AMPLIAR: State de Features**

**Crear stores por feature para estado complejo:**

```typescript
// src/features/chat/stores/useChatStore.ts
interface ChatState {
  selectedConversationId: string | null
  draftMessages: Record<string, string>
  typingUsers: Set<string>
  setSelectedConversation: (id: string) => void
  saveDraft: (conversationId: string, draft: string) => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      selectedConversationId: null,
      draftMessages: {},
      typingUsers: new Set(),
      // ... actions
    }),
    { name: 'chat-storage' }
  )
)
```

**Casos de uso ideales para Zustand:**
- ✅ Estado de UI complejo (modales, sidebar abierto/cerrado)
- ✅ Preferencias de usuario (tema, idioma, notificaciones)
- ✅ Estado de formularios multi-paso
- ✅ Borradores de mensajes/posts
- ✅ Filtros y ordenamiento de listas

**NO usar Zustand para:**
- ❌ Datos del servidor (usar React Query)
- ❌ Datos que vienen de API (usar React Query)
- ❌ Estado de sesión/autenticación (usar NextAuth)

### 3. Next.js App Router + React Query

#### Patrón Recomendado: Server + Client

```typescript
// app/dashboard/page.tsx (Server Component)
import { getServerSession } from 'next-auth'
import { DashboardView } from '@/features/dashboard'

export default async function DashboardPage() {
  const session = await getServerSession()
  
  // Pre-fetch en servidor si es necesario
  // const initialData = await getInitialDashboardData()
  
  return <DashboardView />
}

// features/dashboard/components/DashboardView.tsx (Client Component)
'use client'
export const DashboardView = () => {
  const { data, isLoading } = useDashboardStats()
  // React Query maneja el fetching en cliente
}
```

### 4. Prisma: Mejores Prácticas

#### ✅ **ACTUAL (Correcto):**

```typescript
// src/lib/prisma.ts - Singleton global correcto
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
```

#### 🎯 **MEJORAR: Queries Complejas en Services**

**Crear servicios dedicados para queries complejas:**

```typescript
// src/features/profile/services/user-profile.service.ts
export async function getUserProfile(userId: string) {
  return prisma.users.findUnique({
    where: { id: userId },
    include: {
      skills: true,
      wanted_skills: true,
      languages: true,
      reviews_reviews_target_idTousers: {
        include: {
          users_reviews_author_idTousers: {
            select: { id: true, name: true, image: true }
          }
        }
      }
    }
  })
}
```

**Beneficios:**
- ✅ Queries reutilizables
- ✅ Tipos inferidos correctamente
- ✅ Fácil de testear
- ✅ No contamina rutas de API

### 5. Manejo de Errores Centralizado

#### ❌ **ACTUAL (Repetitivo):**

```typescript
// Se repite en ~50 archivos
catch (error: any) {
  console.error('Error:', error)
  return NextResponse.json({ message: error.message }, { status: 500 })
}
```

#### ✅ **RECOMENDADO: Error Handler Centralizado**

```typescript
// src/lib/api/error-handler.ts
export function handleApiError(error: unknown) {
  console.error('API Error:', error)
  
  if (error instanceof ApiError) {
    return NextResponse.json(
      { message: error.message },
      { status: error.statusCode }
    )
  }
  
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(error)
  }
  
  return NextResponse.json(
    { message: 'Internal server error' },
    { status: 500 }
  )
}

// Uso en API routes
export async function GET() {
  try {
    // ... lógica
  } catch (error) {
    return handleApiError(error)
  }
}
```

### 6. Validación con Zod

#### 🎯 **CREAR: Schemas Centralizados**

```typescript
// src/features/session/validations/session.schema.ts
import { z } from 'zod'

export const scheduleSessionSchema = z.object({
  mentor_id: z.string().uuid(),
  title: z.string().min(3).max(100),
  description: z.string().optional(),
  availability_id: z.string().uuid(),
  duration_minutes: z.number().min(30).max(240).multipleOf(10),
})

export type ScheduleSessionInput = z.infer<typeof scheduleSessionSchema>
```

**Usar en API routes:**

```typescript
export async function POST(request: NextRequest) {
  const body = await request.json()
  
  // Validar con Zod
  const result = scheduleSessionSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { message: 'Invalid data', errors: result.error.errors },
      { status: 400 }
    )
  }
  
  // Usar datos validados
  const data = result.data
}
```

---

## 📋 Lista Priorizada de Tareas de Refactor

### 🔴 **Prioridad CRÍTICA (Semana 1-2)**

#### 1. Consolidar Fetching con React Query

**Tarea:** Eliminar todos los `fetch()` manuales y usar `useApiQuery`/`useApiMutation`

**Archivos a Refactorizar:**

- [ ] `src/features/profile/components/EditProfileView.tsx` - Remover `window.location.reload()`
- [ ] `src/features/chat/hooks/useRealtimeMessages.ts` - Consolidar fetching

**Impacto:** 🚀 Mejora de performance, consistencia, y experiencia de usuario

**Estimación:** 8-12 horas

#### 2. Crear Error Handler Centralizado

**Tarea:** Implementar sistema de manejo de errores global

**Pasos:**
- [x] Crear `src/shared/utils/api-handler.ts` (Implementado `withErrorHandler`)
- [x] Crear custom error classes (`ApiError`)
- [/] Refactorizar API routes para usar el handler (En progreso)
- [ ] Agregar logging estructurado

**Impacto:** 🛡️ Mejor debugging, mensajes de error consistentes

**Estimación:** 6-8 horas

- [x] Refactorizar ChatPage.tsx (Dividido en componentes y hooks menores)

**Impacto:** 📦 Mejor mantenibilidad y testing

**Estimación:** 4-6 horas

---

### 🟡 **Prioridad ALTA (Semana 3-4)**

#### 4. Implementar Validación con Zod en API Routes

**Tarea:** Agregar validación de entrada en todas las API routes con Zod

**Archivos prioritarios:**
- [x] `src/app/api/sessions/request/route.ts` (Validado con Zod)
- [ ] `src/app/api/matches/send/route.ts`
- [ ] `src/app/api/reviews/create/route.ts`
- [ ] `src/app/api/users/profile/route.ts`

**Impacto:** 🔒 Seguridad y validación de datos

**Estimación:** 6-8 horas

#### 5. Crear Stores de Zustand por Feature

**Tarea:** Implementar stores para estado complejo de UI

**Stores a crear:**
- [ ] `useChatStore` - Estado de chat (conversación seleccionada, borradores)
- [ ] `useFiltersStore` - Filtros de mentores/sesiones (persistentes)
- [ ] `useModalStore` - Estado global de modales

**Impacto:** 🎯 Mejor gestión de estado de UI

**Estimación:** 4-6 horas

#### 6. Refactorizar Componentes Grandes

**Tareas:**
- [x] `ScheduleSessionView.tsx` - Refactorizado con `useSessionRequests`
- [ ] `RequestsView.tsx` - Separar tabs en componentes independientes
- [ ] `ProfileView.tsx` - Lazy load secciones no críticas

**Impacto:** 📉 Reducción de complejidad

**Estimación:** 8-10 horas

---

### 🟢 **Prioridad MEDIA (Mes 2)**

#### 7. Optimización de Queries de Prisma

**Tarea:** Revisar y optimizar queries N+1

**Áreas a revisar:**
- [ ] Queries de profile con múltiples includes
- [ ] Listados de mentores con relaciones
- [ ] Dashboard stats (posible caching en Redis)

**Impacto:** ⚡ Performance de base de datos

**Estimación:** 6-8 horas

#### 8. Implementar Testing

**Tarea:** Agregar tests unitarios y de integración

**Prioridades:**
- [ ] Tests de utilidades y helpers
- [ ] Tests de hooks personalizados
- [ ] Tests de API routes críticas
- [ ] Tests E2E para flujos principales

**Impacto:** 🧪 Calidad y confianza en el código

**Estimación:** 16-24 horas

#### 9. Mejorar Tipado TypeScript

**Tarea:** Eliminar `any` y mejorar tipos

**Áreas:**
- [ ] Remover `error: any` en catch blocks
- [ ] Tipar correctamente eventos de formularios
- [ ] Agregar tipos estrictos en servicios de Prisma

**Impacto:** 🔍 Mejor autocompletado y detección de errores

**Estimación:** 4-6 horas

---

### 🔵 **Prioridad BAJA (Backlog)**

#### 10. Documentación de Código

**Tarea:** Agregar JSDoc a funciones y componentes principales

**Áreas:**
- [ ] Servicios de Prisma
- [ ] Hooks personalizados
- [ ] Componentes compartidos

**Impacto:** 📚 Onboarding más fácil

**Estimación:** 8-12 horas

#### 11. Análisis de Bundle Size

**Tarea:** Optimizar tamaño de bundle con Next.js

- [ ] Implementar dynamic imports para componentes grandes
- [ ] Code splitting por rutas
- [ ] Lazy loading de componentes no críticos

**Impacto:** 🚀 Mejora de performance inicial

**Estimación:** 4-6 horas

---

## 🎓 Patrones Recomendados

### Estructura de un Feature Completo

```typescript
features/
  example/
    components/
      ExampleView.tsx           # Componente principal
      ExampleList.tsx           # Sub-componente
      ExampleForm.tsx           # Formulario
    hooks/
      queries/
        useExamples.ts          # Query hook
        useExample.ts           # Query de detalle
      mutations/
        useCreateExample.ts     # Mutation hook
        useUpdateExample.ts
    services/
      example.service.ts        # Lógica de acceso a datos (Prisma)
    types/
      index.ts                  # Tipos del feature
    validations/
      example.schema.ts         # Schemas de Zod
    stores/
      useExampleStore.ts        # Estado de UI (Zustand)
    utils/
      formatters.ts             # Utilidades
      constants.ts
    index.ts                    # Exportaciones públicas
```

### Patrón de Hook de React Query

```typescript
// features/example/hooks/queries/useExamples.ts
export function useExamples(filters?: ExampleFilters) {
  const url = useMemo(() => {
    const params = new URLSearchParams()
    if (filters?.category) params.append('category', filters.category)
    return `/api/examples?${params}`
  }, [filters])

  return useApiQuery<Example[]>(
    ['examples', filters ?? {}],
    url,
    {
      requireAuth: true,
      staleTime: 1000 * 60 * 5, // 5 minutos
    }
  )
}
```

### Patrón de Mutation

```typescript
// features/example/hooks/mutations/useCreateExample.ts
export function useCreateExample() {
  return useApiMutation<Example, CreateExampleInput>({
    mutationFn: async (data) => {
      const res = await fetch('/api/examples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create example')
      return res.json()
    },
    invalidateKeys: ['examples'],
    onSuccess: (data) => {
      toast.success('Example created successfully')
    },
  })
}
```

### Patrón de API Route con Validación

```typescript
// app/api/examples/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { createExampleSchema } from '@/features/example/validations'
import { createExample } from '@/features/example/services'
import { handleApiError } from '@/lib/api/error-handler'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const result = createExampleSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { message: 'Invalid data', errors: result.error.errors },
        { status: 400 }
      )
    }

    const example = await createExample(session.user.id, result.data)
    return NextResponse.json(example, { status: 201 })
    
  } catch (error) {
    return handleApiError(error)
  }
}
```

---

## 📊 Métricas y KPIs de Éxito

### Antes de Refactor (Estado Actual)

| Métrica | Valor Actual |
|---------|--------------|
| Líneas de código duplicado | ~15% |
| Componentes > 150 líneas | 5 archivos |
| Fetch manuales | 47+ instancias |
| Archivos de API sin validación | ~30 |
| Coverage de tests | 0% |

### Después de Refactor (Objetivo)

| Métrica | Objetivo |
|---------|----------|
| Líneas de código duplicado | < 5% |
| Componentes > 150 líneas | 0 archivos |
| Fetch manuales | 0 (todos con React Query) |
| Archivos de API con validación | 100% |
| Coverage de tests | > 60% |

---

## 🏆 Recomendaciones Finales

### DO (Hacer) ✅

1. **Usar siempre React Query** para fetching de datos del servidor
2. **Mantener componentes < 150 líneas** - dividir si es más grande
3. **Validar entrada** en API routes con Zod
4. **Centralizar manejo de errores** - no repetir lógica
5. **Usar Zustand solo para UI state** - no para datos del servidor
6. **Seguir la estructura de features** - ya está bien implementada
7. **Tipar fuertemente** - evitar `any` siempre que sea posible

### DON'T (Evitar) ❌

1. **No usar fetch directo** - siempre a través de hooks de React Query
2. **No recargar la página** (`window.location.reload()`) - invalidar queries
3. **No componentes God** - dividir responsabilidades
4. **No duplicar lógica** - extraer a servicios/hooks reutilizables
5. **No ignorar validación** - siempre validar entrada de usuario
6. **No mezclar UI y lógica** - separar en hooks personalizados
7. **No inline fetching en componentes** - mover a hooks dedicados

---

## 📞 Siguiente Pasos Inmediatos

### Esta Semana

1. [ ] Revisar este documento con el equipo
2. [ ] Priorizar las tareas críticas (🔴)
3. [ ] Crear issues/tickets en GitHub para cada tarea
4. [ ] Asignar responsables para cada refactor

### Próximas 2 Semanas

1. [ ] Implementar error handler centralizado
2. [ ] Refactorizar ChatPage y ScheduleSessionView
3. [ ] Migrar todos los fetch manuales a React Query
4. [ ] Implementar validación con Zod en APIs críticas

### Este Mes

1. [ ] Completar todas las tareas de prioridad crítica y alta
2. [ ] Agregar tests básicos para funcionalidad crítica
3. [ ] Documentar los nuevos patrones implementados
4. [ ] Code review de los cambios principales

---

## 📚 Recursos Adicionales

### Documentación Recomendada

- [React Query Best Practices](https://tanstack.com/query/latest/docs/react/guides/best-practices)
- [Zustand Patterns](https://github.com/pmndrs/zustand#readme)
- [Next.js App Router Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/query-optimization-performance)
- [Zod Validation](https://zod.dev/)

### Herramientas Útiles

- **ESLint** - Agregar reglas personalizadas para detectar patrones
- **Bundle Analyzer** - Analizar tamaño de bundle
- **React DevTools Profiler** - Detectar re-renders innecesarios
- **Prisma Studio** - Visualizar y depurar base de datos

---

**Elaborado por:** GitHub Copilot (Claude Sonnet 4.5)  
**Fecha:** 11 de Enero, 2026  
**Versión:** 1.0
