### ⚠️ Problemas Críticos Detectados

| Problema | Severidad | Impacto | Archivos Afectados |
|----------|-----------|---------|-------------------|
| **Código duplicado masivo** | 🔴 CRÍTICO | ~800 líneas duplicadas | 20+ archivos |
| **Archivo ChatView.tsx sin uso** | 🔴 CRÍTICO | Confusión, mantenimiento innecesario | 1 archivo (203 líneas) |
| **Hooks con lógica idéntica** | 🔴 ALTO | Mantenibilidad, bugs duplicados | 15+ hooks |
| **Componentes muy grandes** | 🟡 MEDIO | Difícil mantenimiento | 8 componentes (200-430 líneas) |
| **Falta de abstracción en fetching** | 🟡 MEDIO | Código repetitivo | Todos los hooks |
| **Sin manejo centralizado de errores** | 🟡 MEDIO | UX inconsistente | Todo el proyecto |

---

## 🔴 Problemas Principales Detectados

#### B. **useSkills.ts y useProfile.ts - Duplicación 100%**

**Problema grave:**
- `useProfile.ts` exporta: `addSkill`, `updateSkill`, `deleteSkill`, `addLanguage`, `updateLanguage`, `deleteLanguage`
- `useSkills.ts` exporta: las **MISMAS 6 funciones** con código idéntico

```typescript
// ❌ DUPLICACIÓN COMPLETA (~80 líneas)
// Archivo 1: src/hooks/useProfile.ts líneas 150-230
export function useProfile() {
  const addSkill = async (data) => { /* ... */ }
  const updateSkill = async (id, data) => { /* ... */ }
  const deleteSkill = async (id) => { /* ... */ }
  // ...
}

// Archivo 2: src/hooks/useSkills.ts líneas 80-160
export function useSkills() {
  const addSkill = async (data) => { /* ... MISMO CÓDIGO */ }
  const updateSkill = async (id, data) => { /* ... MISMO CÓDIGO */ }
  const deleteSkill = async (id) => { /* ... MISMO CÓDIGO */ }
  // ...
}
```

**Acción:** Eliminar las funciones de `useSkills.ts` y usar solo `useProfile.ts`

---

#### C. **ChatView vs ChatViewRealtime - 70% Duplicación**

**Archivos:**
- `ChatView.tsx` (203 líneas) ❌ **NO USADO**
- `ChatViewRealtime.tsx` (421 líneas) ✅ **EN USO**

**Código duplicado:**
- Lista de conversaciones (líneas 169-262 vs 69-118)
- Header del chat (líneas 287-320 vs 136-147)
- Renderizado de mensajes (líneas 333-396 vs 150-181)
- Input de mensajes (líneas 399-430 vs 184-199)

**Impacto:** ~150 líneas duplicadas

**Acción:** 
1. **Eliminar `ChatView.tsx` inmediatamente**
2. **Extraer componentes reutilizables** de `ChatViewRealtime.tsx`

---

### 3. **Componentes Excesivamente Grandes** (8 archivos)

| Archivo | Líneas | Problema | Recomendación |
|---------|--------|----------|---------------|
| `LanguagesSection.tsx` | 430 | God Component, mezcla UI + lógica | Dividir en 3-4 componentes |
| `ChatViewRealtime.tsx` | 421 | Múltiples responsabilidades | Extraer 6 componentes |
| `MentorFiltersPanel.tsx` | 369 | Lógica de filtros inline | Mover lógica a hook |
| `SkillsSection.tsx` | 360 | Similar a LanguagesSection | Compartir estructura |
| `ScheduleSessionView.tsx` | 297 | Vista monolítica | Dividir en secciones |
| `ActivityView.tsx` | 266 | Mezcla filtrado + renderizado | Extraer FilterBar |
| `RequestsView.tsx` | 250 | Tabs + filtros inline | Componentes separados |
| `EditSkillsSection.tsx` | 242 | Form gigante | Extraer SkillForm |

---

### 4. **Falta de Abstracción en Data Fetching**

**Problema:**
Cada hook reimplementa:
- ✅ Estado de loading/error/data
- ✅ useEffect para fetch
- ✅ Manejo de autenticación
- ✅ Manejo de errores
- ✅ Refresh manual

**Impacto:**
- 🐛 Bugs diferentes en cada implementación
- 🔄 Difícil cambiar comportamiento global
- 📦 Más líneas de código = más mantenimiento

---

### 5. **Sin Manejo Centralizado de Errores**

**Problema actual:**
```typescript
// ❌ Cada componente maneja errores diferente
catch (err) {
  console.error(err)  // Algunos solo loggean
  setError(err.message)  // Otros guardan en estado
  toast.error(err.message)  // Otros usan toast
  // Algunos no hacen nada
}
```

**Impacto:**
- UX inconsistente
- Errores silenciosos
- Difícil debugging en producción

---

## 📂 Organización de Carpetas Recomendada

### Estructura Actual vs Propuesta

```
📁 ACTUAL (Mezclado)                    📁 PROPUESTA (Por Feature)
├── src/                                ├── src/
│   ├── app/                            │   ├── app/
│   ├── components/                     │   ├── features/              ⭐ NUEVO
│   │   ├── features/                   │   │   ├── auth/
│   │   ├── layout/                     │   │   │   ├── components/
│   │   ├── providers/                  │   │   │   ├── hooks/
│   │   ├── ui/                         │   │   │   ├── services/
│   ├── hooks/         ❌ TODO JUNTO    │   │   │   ├── types/
│   ├── services/      ❌ TODO JUNTO    │   │   │   └── validations/
│   ├── types/         ❌ TODO JUNTO    │   │   ├── chat/
│   ├── views/         ❌ TODO JUNTO    │   │   │   ├── components/
│   └── ...                             │   │   │   ├── hooks/
                                        │   │   │   ├── services/
                                        │   │   │   └── ...
                                        │   │   ├── profile/
                                        │   │   ├── sessions/
                                        │   │   ├── matches/
                                        │   │   └── ...
                                        │   ├── shared/              ⭐ NUEVO
                                        │   │   ├── components/
                                        │   │   ├── hooks/
                                        │   │   ├── types/
                                        │   │   └── utils/
                                        │   └── core/                ⭐ NUEVO
                                        │       ├── api/
                                        │       ├── auth/
                                        │       └── db/
```

### Ejemplo de Feature "Chat"

```
📁 src/features/chat/
├── components/
│   ├── ConversationList.tsx
│   ├── ChatHeader.tsx
│   ├── MessageList.tsx
│   ├── MessageInput.tsx
│   ├── MessageStatusIndicator.tsx
│   └── PresenceIndicator.tsx
├── hooks/
│   ├── useConversations.ts
│   ├── useMessages.ts
│   ├── useRealtimeMessages.ts
│   └── useUserPresence.ts
├── services/
│   ├── conversationService.ts
│   └── messagesService.ts
├── types/
│   ├── chat.ts
│   └── presence.ts
├── views/
│   └── ChatView.tsx
└── index.ts  // Public API del feature
```

---

## 🔧 Código Repetitivo - Análisis Detallado

### Patrón 1: Data Fetching (⚠️ 15+ archivos)

**Consolidación propuesta:**

```typescript
// ✅ src/shared/hooks/useApiQuery.ts
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

export function useApiQuery<T>(
  key: string | string[],
  endpoint: string | null,
  options?: {
    requireAuth?: boolean
    enabled?: boolean
    refetchInterval?: number
  }
) {
  const { data: session, status } = useSession()
  
  const query = useQuery<T>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      if (!endpoint) throw new Error('No endpoint')
      const response = await fetch(endpoint)
      if (!response.ok) throw new Error(`Error: ${response.statusText}`)
      return response.json()
    },
    enabled: options?.enabled ?? (
      options?.requireAuth ? status === 'authenticated' : true
    ),
    refetchInterval: options?.refetchInterval,
  })

  return query
}

// 🎯 USO: Convierte ~50 líneas en ~5 líneas
export function useProfile() {
  return useApiQuery<UserProfile>(
    ['profile'],
    '/api/profile',
    { requireAuth: true }
  )
}
```

**Beneficio:** 
- 🚀 Elimina ~300 líneas de código duplicado
- ✅ Caching automático con React Query
- ✅ Manejo consistente de loading/error
- ✅ Más fácil agregar features (offline, retry, etc.)

---

### Patrón 2: Mutaciones (⚠️ 10+ archivos)

```typescript
// ✅ src/shared/hooks/useApiMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useApiMutation<TData, TVariables>(
  options: {
    mutationFn: (variables: TVariables) => Promise<TData>
    onSuccess?: (data: TData) => void
    invalidateKeys?: string[]
  }
) {
  const queryClient = useQueryClient()
  
  return useMutation<TData, Error, TVariables>({
    mutationFn: options.mutationFn,
    onSuccess: (data) => {
      options.onSuccess?.(data)
      options.invalidateKeys?.forEach(key => {
        queryClient.invalidateQueries({ queryKey: [key] })
      })
    },
  })
}

// 🎯 USO:
export function useRequests() {
  const acceptRequest = useApiMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/requests/${id}/accept`, { method: 'POST' })
      return res.json()
    },
    invalidateKeys: ['requests', 'sessions']
  })
  
  return { acceptRequest }
}
```

---

### Patrón 3: Formateo de Fechas (⚠️ 5+ archivos)

**Duplicado en:**
- `ChatViewRealtime.tsx` (líneas 130-160)
- `ScheduleSessionView.tsx` (línea 36-40)
- `SessionCard.tsx`
- `ActivityView.tsx`
- Varios componentes más

```typescript
// ✅ src/shared/utils/dateFormatters.ts
export const formatMessageTime = (date: Date | string): string => {
  const d = new Date(date)
  const now = new Date()
  const diffHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60)
  
  if (diffHours < 24) {
    return d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString('es', { day: '2-digit', month: 'short' })
}

export const formatLastSeen = (date: Date | null): string => {
  if (!date) return 'recientemente'
  
  const now = Date.now()
  const diff = (now - date.getTime()) / 1000
  
  if (diff < 60) return 'justo ahora'
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`
  if (diff < 604800) return `hace ${Math.floor(diff / 86400)}d`
  
  return date.toLocaleDateString('es', { day: '2-digit', month: 'short' })
}

export const formatSessionDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
```

---

### Patrón 4: Validación en Servicios (⚠️ 8+ archivos)

**Duplicado en todos los servicios:**

```typescript
// ❌ REPETIDO ~20 VECES
const item = await prisma.table.findUnique({ where: { id } })
if (!item || item.user_id !== userId) {
  throw new Error('No autorizado')
}
```

**Consolidación:**

```typescript
// ✅ src/core/utils/authorization.ts
export async function validateOwnership<T extends Record<string, any>>(
  model: any,
  id: string,
  userId: string,
  options: {
    userField?: string
    include?: any
    errorMessage?: string
  } = {}
): Promise<T> {
  const item = await model.findUnique({
    where: { id },
    include: options.include
  })
  
  const userField = options.userField || 'user_id'
  
  if (!item || item[userField] !== userId) {
    throw new Error(options.errorMessage || 'No autorizado')
  }
  
  return item
}

// 🎯 USO:
const session = await validateOwnership(
  prisma.sessions,
  sessionId,
  userId,
  { userField: 'host_id', include: { participants: true } }
)
```

---

## 📝 Componentes y Archivos No Utilizados

### Archivos para ELIMINAR

| Archivo | Líneas | Razón | Acción |
|---------|--------|-------|--------|
| `src/views/ChatView.tsx` | 203 | ❌ No se usa, reemplazado por ChatViewRealtime | **ELIMINAR** |

### Componentes Posiblemente No Usados (Requiere Verificación)

Estos componentes podrían no estar siendo usados. Verificar antes de eliminar:

```bash
# Buscar usos de estos componentes
grep -r "from '@/components/ui/Modal'" src/
grep -r "CardGuide" src/
grep -r "ButtonMode" src/
```

Si no tienen referencias, considerar:
- ❌ Eliminar si definitivamente no se usan
- 📦 Mover a carpeta `archive/` si podrían usarse en futuro
- 📚 Documentar en Storybook si son parte de design system

---

## 🏗️ Archivos Demasiado Grandes / Complejos

### Top 10 Archivos Problemáticos

#### 1. **LanguagesSection.tsx** (430 líneas) 🔴 CRÍTICO

**Ubicación:** `src/components/features/profile/user/LanguagesSection.tsx`

**Problemas:**
- ❌ Mezcla UI + lógica de negocio + estado local
- ❌ Múltiples responsabilidades (mostrar, editar, agregar, validar)
- ❌ Difícil de testear y mantener

**Refactor propuesto:**

```typescript
// Dividir en 4 componentes:

// 1. LanguagesSection.tsx (100 líneas) - Contenedor
export function LanguagesSection({ languages, onUpdate }) {
  return (
    <Card>
      <LanguagesHeader />
      <LanguagesList languages={languages} onEdit={handleEdit} />
      <AddLanguageButton onClick={handleAdd} />
    </Card>
  )
}

// 2. LanguagesList.tsx (80 líneas) - Lista
export function LanguagesList({ languages, onEdit, onDelete }) {
  return languages.map(lang => (
    <LanguageItem key={lang.id} language={lang} onEdit={onEdit} />
  ))
}

// 3. LanguageItem.tsx (60 líneas) - Item individual
export function LanguageItem({ language, onEdit, onDelete }) {
  return (
    <div>
      {language.name} - {language.level}
      <EditButton onClick={() => onEdit(language)} />
    </div>
  )
}

// 4. LanguageModal.tsx (120 líneas) - Modal de edición
export function LanguageModal({ language, isOpen, onSave, onClose }) {
  // Lógica del formulario
}

// + Mover lógica a hook
// 5. useLanguagesManager.ts (70 líneas)
export function useLanguagesManager() {
  const { mutate: addLanguage } = useApiMutation(...)
  const { mutate: updateLanguage } = useApiMutation(...)
  const { mutate: deleteLanguage } = useApiMutation(...)
  
  return { addLanguage, updateLanguage, deleteLanguage }
}
```

---

#### 2. **ChatViewRealtime.tsx** (421 líneas) 🔴 CRÍTICO

**Ubicación:** `src/views/ChatViewRealtime.tsx`

**Problemas:**
- ❌ Vista monolítica con 6 responsabilidades diferentes
- ❌ Mezcla presentación + lógica de negocio + gestión de estado
- ❌ Difícil de testear partes individuales

**Refactor propuesto:**

```typescript
// Dividir en 6 componentes + 1 hook:

// 1. ChatView.tsx (80 líneas) - Layout principal
export function ChatView() {
  const {
    conversations,
    selectedId,
    messages,
    sendMessage,
  } = useChatManager()
  
  return (
    <div className="flex h-full">
      <ConversationList 
        conversations={conversations}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <ChatPanel 
        conversationId={selectedId}
        messages={messages}
        onSend={sendMessage}
      />
    </div>
  )
}

// 2. ConversationList.tsx (120 líneas)
export function ConversationList({ conversations, selectedId, onSelect }) {
  return (
    <aside className="w-80">
      <ConversationHeader />
      <ConversationSearch />
      <ConversationItems conversations={conversations} />
    </aside>
  )
}

// 3. ChatPanel.tsx (80 líneas)
export function ChatPanel({ conversationId, messages, onSend }) {
  if (!conversationId) return <EmptyState />
  
  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader conversationId={conversationId} />
      <MessageList messages={messages} />
      <MessageInput onSend={onSend} />
    </div>
  )
}

// 4. MessageList.tsx (100 líneas)
export function MessageList({ messages }) {
  return messages.map(msg => (
    <Message key={msg.id} message={msg} />
  ))
}

// 5. MessageInput.tsx (60 líneas)
export function MessageInput({ onSend }) {
  const [text, setText] = useState('')
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button type="submit">Send</button>
    </form>
  )
}

// 6. useChatManager.ts (150 líneas)
export function useChatManager() {
  const { data: conversations } = useConversations()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { messages, sendMessage } = useRealtimeMessages(selectedId)
  
  return { conversations, selectedId, setSelectedId, messages, sendMessage }
}
```

---

#### 3. **MentorFiltersPanel.tsx** (369 líneas) 🔴

**Problemas:**
- ❌ Lógica de filtros inline (debería estar en hook)
- ❌ Componente no reutilizable
- ❌ Muchos estados locales

**Refactor:**

```typescript
// Extraer a hook
export function useMentorFilters() {
  const [filters, setFilters] = useState<MentorFilters>({})
  
  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }
  
  const clearFilters = () => setFilters({})
  
  return { filters, updateFilter, clearFilters }
}

// Componente simplificado (200 líneas)
export function MentorFiltersPanel() {
  const { filters, updateFilter, clearFilters } = useMentorFilters()
  
  return (
    <aside>
      <FilterSection title="Skills">
        <SkillsFilter value={filters.skills} onChange={v => updateFilter('skills', v)} />
      </FilterSection>
      <FilterSection title="Languages">
        <LanguagesFilter value={filters.languages} onChange={v => updateFilter('languages', v)} />
      </FilterSection>
    </aside>
  )
}
```

---

#### 4. **SkillsSection.tsx** (360 líneas) 🟡

Similar a `LanguagesSection.tsx`. Mismo refactor aplicable.

**Oportunidad de reutilización:**
Ambos componentes tienen estructura casi idéntica. Crear un componente genérico:

```typescript
// src/shared/components/EditableList.tsx
export function EditableList<T>({
  items,
  renderItem,
  onAdd,
  onEdit,
  onDelete,
  addButtonText
}: EditableListProps<T>) {
  // Lógica genérica reutilizable
}

// Uso:
<EditableList
  items={skills}
  renderItem={(skill) => <SkillItem skill={skill} />}
  onAdd={handleAddSkill}
  addButtonText="Add Skill"
/>
```

---

### Hooks Demasiado Grandes

#### 1. **useRealtimeMessages.ts** (267 líneas) 🔴

**Problemas:**
- ❌ Hace demasiadas cosas: fetch inicial + subscripción realtime + mutaciones
- ❌ Mezcla lógica de UI (estados optimistas) con lógica de datos

**Refactor:**

```typescript
// Dividir en 3 hooks:

// 1. useMessages.ts - Solo fetching
export function useMessages(conversationId: string) {
  return useApiQuery(['messages', conversationId], `/api/messages/${conversationId}`)
}

// 2. useRealtimeSubscription.ts - Solo realtime
export function useRealtimeSubscription(conversationId: string, onMessage: Callback) {
  useEffect(() => {
    const channel = supabase.channel(`messages:${conversationId}`)
      .on('postgres_changes', { /* ... */ }, onMessage)
      .subscribe()
    
    return () => supabase.removeChannel(channel)
  }, [conversationId])
}

// 3. useMessageMutations.ts - Solo mutaciones
export function useMessageMutations(conversationId: string) {
  const sendMessage = useApiMutation({ /* ... */ })
  const markAsRead = useApiMutation({ /* ... */ })
  
  return { sendMessage, markAsRead }
}

// Composición en el componente:
export function ChatView() {
  const { data: messages } = useMessages(conversationId)
  const { sendMessage } = useMessageMutations(conversationId)
  useRealtimeSubscription(conversationId, handleNewMessage)
}
```

---

#### 2. **useMentorFilters.ts** (257 líneas) 🟡

**Problema:**
- ❌ Lógica de filtros compleja inline
- ❌ Mezcla estado UI con lógica de negocio

**Refactor:**

```typescript
// Separar en Zustand store

// stores/mentorFiltersStore.ts (100 líneas)
export const useMentorFiltersStore = create<MentorFiltersState>((set) => ({
  filters: defaultFilters,
  setFilter: (key, value) => set(state => ({
    filters: { ...state.filters, [key]: value }
  })),
  clearFilters: () => set({ filters: defaultFilters }),
}))

// hooks/useMentorFilters.ts (50 líneas)
export function useMentorFilters() {
  const { filters, setFilter, clearFilters } = useMentorFiltersStore()
  
  // Solo lógica de transformación
  const appliedFilters = useMemo(() => transformFilters(filters), [filters])
  
  return { filters, appliedFilters, setFilter, clearFilters }
}
```

---

#### 3. **useProfile.ts** (214 líneas) 🟡

**Problema:**
- ❌ Hace fetch + todas las mutaciones de profile, skills Y languages
- ❌ Debería ser 3 hooks separados

**Refactor:**

```typescript
// 1. useProfile.ts (60 líneas) - Solo datos del perfil
export function useProfile() {
  return useApiQuery(['profile'], '/api/profile')
}

// 2. useProfileMutations.ts (60 líneas)
export function useProfileMutations() {
  const updateProfile = useApiMutation({ /* ... */ })
  const uploadAvatar = useApiMutation({ /* ... */ })
  
  return { updateProfile, uploadAvatar }
}

// 3. Usar useSkills.ts existente para skills
// 4. Crear useLanguages.ts para languages

// Composición:
export function EditProfile() {
  const { data: profile } = useProfile()
  const { updateProfile } = useProfileMutations()
  const { addSkill, updateSkill } = useSkills()
  const { addLanguage } = useLanguages()
}
```

---

## 🎯 Mejores Prácticas Propuestas

### 1. **Data Fetching con React Query**

#### ✅ Patrón Recomendado

```typescript
// src/shared/hooks/useApiQuery.ts
export function useApiQuery<T>(
  key: string | string[],
  endpoint: string | null,
  options?: UseApiQueryOptions
) {
  const { data: session, status } = useSession()
  
  return useQuery<T>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      if (!endpoint) throw new Error('No endpoint')
      const res = await fetch(endpoint)
      if (!res.ok) throw new Error(await res.text())
      return res.json()
    },
    enabled: options?.enabled ?? (
      options?.requireAuth ? status === 'authenticated' : true
    ),
    staleTime: options?.staleTime ?? 1000 * 60 * 5, // 5 min
    gcTime: options?.gcTime ?? 1000 * 60 * 30, // 30 min (antes cacheTime)
  })
}

// Uso:
export function useProfile() {
  return useApiQuery<UserProfile>(
    ['profile'],
    '/api/profile',
    { requireAuth: true, staleTime: 1000 * 60 * 10 } // 10 min
  )
}
```

#### ❌ Anti-patrón (Actual)

```typescript
// NO hacer esto:
const [data, setData] = useState<Type | null>(null)
const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
  fetch('/api/data').then(res => setData(res.json()))
}, [])
```

---

### 2. **Mutaciones con Invalidación Automática**

```typescript
// src/shared/hooks/useApiMutation.ts
export function useApiMutation<TData, TVariables>(options: {
  mutationFn: (variables: TVariables) => Promise<TData>
  invalidateKeys?: string[]
  onSuccess?: (data: TData) => void
  optimistic?: {
    queryKey: string[]
    updateFn: (old: any, variables: TVariables) => any
  }
}) {
  const queryClient = useQueryClient()
  
  return useMutation<TData, Error, TVariables>({
    mutationFn: options.mutationFn,
    
    // Optimistic update
    onMutate: async (variables) => {
      if (options.optimistic) {
        await queryClient.cancelQueries({ queryKey: options.optimistic.queryKey })
        const previous = queryClient.getQueryData(options.optimistic.queryKey)
        queryClient.setQueryData(
          options.optimistic.queryKey,
          (old: any) => options.optimistic!.updateFn(old, variables)
        )
        return { previous }
      }
    },
    
    // En éxito, invalidar queries relacionadas
    onSuccess: (data) => {
      options.onSuccess?.(data)
      options.invalidateKeys?.forEach(key => {
        queryClient.invalidateQueries({ queryKey: [key] })
      })
    },
    
    // En error, revertir optimistic update
    onError: (err, variables, context: any) => {
      if (context?.previous && options.optimistic) {
        queryClient.setQueryData(options.optimistic.queryKey, context.previous)
      }
    },
  })
}

// Uso:
export function useSessionMutations() {
  const accept = useApiMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/sessions/${id}/accept`, { method: 'POST' })
      return res.json()
    },
    invalidateKeys: ['sessions', 'requests'],
    optimistic: {
      queryKey: ['requests'],
      updateFn: (old: Request[], id: string) =>
        old.map(req => req.id === id ? { ...req, status: 'accepted' } : req)
    }
  })
  
  return { accept }
}
```

---

### 3. **Estado Global con Zustand**

#### ✅ Patrón: Slices por Dominio

```typescript
// ❌ NO: Un mega store con todo
export const useStore = create((set) => ({
  user: null,
  theme: 'light',
  locale: 'es',
  filters: {},
  cart: [],
  // ... 50 propiedades más
}))

// ✅ SÍ: Stores separados por dominio
// stores/themeStore.ts
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'theme-storage' }
  )
)

// stores/mentorFiltersStore.ts
export const useMentorFiltersStore = create<MentorFiltersState>((set) => ({
  filters: defaultFilters,
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value }
  })),
  clearFilters: () => set({ filters: defaultFilters }),
}))

// stores/sessionStore.ts
export const useSessionStore = create<SessionState>((set) => ({
  activeSession: null,
  setActiveSession: (session) => set({ activeSession: session }),
}))
```

#### Cuándo usar Zustand vs React Query

| Tipo de Estado | Usar | Razón |
|----------------|------|-------|
| Datos del servidor (fetch) | React Query | Caching, sincronización automática |
| UI preferences (theme, locale) | Zustand | Persiste entre sesiones |
| Filtros complejos | Zustand | Compartido entre componentes |
| Estado de formularios | React Hook Form | Validación, performance |
| Estado local de componente | useState | Simple, no se comparte |

---

### 4. **Prisma - Mejores Prácticas**

#### ✅ Separar Queries Complejas

```typescript
// ❌ NO: Queries inline en el handler
export async function GET(req: Request) {
  const sessions = await prisma.sessions.findMany({
    where: { host_id: userId, status: 'active' },
    include: {
      participants: {
        include: { user: { select: { name: true, email: true } } }
      },
      reviews: { where: { rating: { gte: 4 } } }
    },
    orderBy: { scheduled_at: 'desc' }
  })
}

// ✅ SÍ: Extraer a servicio
// services/sessions/sessions.service.ts
export class SessionsService {
  async findUserActiveSessions(userId: string) {
    return prisma.sessions.findMany({
      where: { host_id: userId, status: 'active' },
      include: this.getDefaultIncludes(),
      orderBy: { scheduled_at: 'desc' }
    })
  }
  
  private getDefaultIncludes() {
    return {
      participants: {
        include: { user: { select: { name: true, email: true } } }
      },
      reviews: { where: { rating: { gte: 4 } } }
    }
  }
}

// app/api/sessions/route.ts
export async function GET(req: Request) {
  const sessionsService = new SessionsService()
  const sessions = await sessionsService.findUserActiveSessions(userId)
  return Response.json(sessions)
}
```

---

#### ✅ Cliente de Prisma Singleton

```typescript
// ✅ YA BIEN HECHO: lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

---

### 5. **Manejo de Errores Centralizado**

#### ✅ Error Boundary + Toast System

```typescript
// src/shared/components/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log a servicio de monitoreo (Sentry, etc.)
    console.error('Error caught by boundary:', error, info)
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }
    return this.props.children
  }
}

// src/shared/utils/errorHandler.ts
export function handleApiError(error: unknown): string {
  if (error instanceof Response) {
    switch (error.status) {
      case 401: return 'No autorizado. Por favor inicia sesión.'
      case 403: return 'No tienes permisos para esta acción.'
      case 404: return 'Recurso no encontrado.'
      case 500: return 'Error del servidor. Intenta más tarde.'
      default: return 'Ocurrió un error inesperado.'
    }
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return 'Error desconocido'
}

// Uso en hooks:
export function useApiMutation<T, V>(options: MutationOptions<T, V>) {
  const { toast } = useToast()
  
  return useMutation({
    ...options,
    onError: (error) => {
      const message = handleApiError(error)
      toast.error(message)
      options.onError?.(error)
    }
  })
}
```

---

### 6. **Validación con Zod**

#### ✅ Centralizar Schemas

```typescript
// src/shared/validations/common.ts
export const commonSchemas = {
  id: z.string().uuid(),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  url: z.string().url('URL inválida'),
  rating: z.number().min(1).max(5),
}

// src/features/auth/validations/auth.schemas.ts
export const loginSchema = z.object({
  email: commonSchemas.email,
  password: commonSchemas.password,
})

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Nombre muy corto'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

// Uso en servidor (validación de entrada)
// app/api/auth/register/route.ts
export async function POST(req: Request) {
  const body = await req.json()
  const validatedData = registerSchema.parse(body) // Lanza error si inválido
  
  // ... lógica
}

// Uso en cliente (con React Hook Form)
export function RegisterForm() {
  const form = useForm({
    resolver: zodResolver(registerSchema)
  })
}
```

---

### 7. **Next.js App Router - Mejores Prácticas**

#### Server vs Client Components

```typescript
// ✅ Server Component (por defecto)
// app/(main)/profile/page.tsx
import { getServerSession } from 'next-auth'
import { ProfileView } from '@/features/profile/views/ProfileView'

export default async function ProfilePage() {
  const session = await getServerSession() // ✅ Solo en servidor
  
  if (!session) {
    redirect('/login')
  }
  
  // ✅ Fetch inicial en servidor (más rápido)
  const profile = await fetch(`${process.env.API_URL}/profile`, {
    headers: { cookie: req.headers.get('cookie') || '' }
  }).then(res => res.json())
  
  // Pasar datos iniciales al cliente
  return <ProfileView initialData={profile} />
}

// ✅ Client Component (cuando necesario)
// components/ThemeToggle.tsx
'use client' // ⭐ Marcar explícitamente
import { useThemeStore } from '@/stores/themeStore'

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore()
  return <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
}
```

#### Loading y Error States

```typescript
// app/(main)/profile/loading.tsx
export default function Loading() {
  return <ProfileSkeleton />
}

// app/(main)/profile/error.tsx
'use client'
export default function Error({ error, reset }: ErrorProps) {
  return (
    <div>
      <h2>Algo salió mal</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Intentar de nuevo</button>
    </div>
  )
}
```

---

## 📋 Lista Priorizada de Tareas de Refactor

### 🔴 PRIORIDAD CRÍTICA (Hacer YA)

#### Sprint 1: Limpieza Inmediata

| # | Tarea | Impacto | Esfuerzo | Archivos |
|---|-------|---------|----------|----------|
| 1 | ❌ Eliminar `ChatView.tsx` sin uso | Alto | 5 min | 1 archivo |
| 2 | ✅ Consolidar skills functions (eliminar de `useSkills.ts`) | Alto | 30 min | 2 archivos |
| 3 | 🚀 Crear `useApiQuery` hook genérico | Muy Alto | 2 horas | 15+ archivos |
| 4 | 🚀 Crear `useApiMutation` hook genérico | Muy Alto | 2 horas | 10+ archivos |
| 5 | 🧹 Extraer formatters de fecha a `utils/` | Medio | 1 hora | 5+ archivos |

**Estimado:** 1 día  
**Beneficio:** -200 líneas, +consistencia, +mantenibilidad

---

### 🟡 PRIORIDAD ALTA (Primera Semana)

#### Sprint 2: Refactor de Componentes Grandes

| # | Tarea | Impacto | Esfuerzo | Archivos |
|---|-------|---------|----------|----------|
| 6 | 🔨 Dividir `LanguagesSection.tsx` | Alto | 4 horas | 5 nuevos componentes |
| 7 | 🔨 Dividir `ChatViewRealtime.tsx` | Muy Alto | 6 horas | 7 nuevos componentes |
| 8 | 🔨 Dividir `SkillsSection.tsx` | Alto | 3 horas | 4 nuevos componentes |
| 9 | 🔨 Refactor `MentorFiltersPanel.tsx` + extraer hook | Medio | 3 horas | 2 archivos |
| 10 | 📦 Crear componente genérico `EditableList` | Alto | 4 horas | 1 nuevo + refactor 2 |

**Estimado:** 1 semana (3-4 días trabajo)  
**Beneficio:** -400 líneas, +reutilización, +testabilidad

---

### 🟢 PRIORIDAD MEDIA (Segunda Semana)

#### Sprint 3: Hooks y Servicios

| # | Tarea | Impacto | Esfuerzo | Archivos |
|---|-------|---------|----------|----------|
| 11 | 🔧 Dividir `useRealtimeMessages.ts` en 3 hooks | Medio | 4 horas | 3 nuevos hooks |
| 12 | 🔧 Refactor `useProfile.ts` → separar mutaciones | Medio | 2 horas | 2 archivos |
| 13 | 🔧 Mover `useMentorFilters` a Zustand store | Medio | 3 horas | 2 archivos |
| 14 | 📦 Crear `validateOwnership` utility | Bajo | 2 horas | 1 archivo + refactor 8 |
| 15 | 📦 Centralizar validaciones Zod | Medio | 3 horas | 1 archivo + refactor 5 |

**Estimado:** 1 semana (3-4 días trabajo)  
**Beneficio:** -200 líneas, mejor arquitectura

---

### 🟢 PRIORIDAD BAJA (Tercera Semana)

#### Sprint 4: Mejoras de Arquitectura

| # | Tarea | Impacto | Esfuerzo | Archivos |
|---|-------|---------|----------|----------|
| 16 | 📁 Reestructurar a carpetas por feature | Alto | 8 horas | Todo el proyecto |
| 17 | 🧪 Agregar Error Boundary global | Medio | 2 horas | 2 archivos |
| 18 | 🎨 Crear sistema de componentes Card reutilizables | Medio | 4 horas | 4 archivos |
| 19 | 📚 Documentar patrones en README | Bajo | 2 horas | 1 archivo |
| 20 | 🧪 Setup de testing con Vitest + RTL | Medio | 4 horas | Config + ejemplos |

**Estimado:** 1 semana (4-5 días trabajo)  
**Beneficio:** Arquitectura sólida para escalar

---

## 📈 Métricas de Mejora Esperadas

### Antes del Refactor

| Métrica | Valor Actual |
|---------|--------------|
| Archivos TS/TSX | 281 |
| Líneas duplicadas estimadas | ~800 |
| Componentes >200 líneas | 8 |
| Hooks >150 líneas | 5 |
| Archivos sin uso | 1 (203 líneas) |
| Tiempo para agregar feature | ~2-3 días |
| Bugs por inconsistencias | Medio-Alto |

### Después del Refactor (Proyectado)

| Métrica | Valor Objetivo | Mejora |
|---------|----------------|--------|
| Archivos TS/TSX | ~310 (+29) | Más modular |
| Líneas duplicadas | ~100 | **-87%** 🎯 |
| Componentes >200 líneas | 2 | **-75%** |
| Hooks >150 líneas | 1 | **-80%** |
| Archivos sin uso | 0 | **-100%** ✅ |
| Tiempo para agregar feature | ~4-6 horas | **-70%** 🚀 |
| Bugs por inconsistencias | Bajo | **-60%** 🐛 |
| Test coverage | 0% → 40% | **+40%** 🧪 |
| Performance (bundle size) | Baseline → -15% | **Mejor** ⚡ |

---

## 🚨 Problemas Críticos de Seguridad/Performance

### ⚠️ Potenciales Issues (Revisar)

#### 1. **API Routes sin Rate Limiting**

```typescript
// ❌ ACTUAL: Sin protección
// app/api/messages/send/route.ts
export async function POST(req: Request) {
  const data = await req.json()
  // ... crear mensaje
}

// ✅ AGREGAR: Middleware de rate limiting
import { ratelimit } from '@/lib/ratelimit'

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const { success } = await ratelimit.limit(ip)
  
  if (!success) {
    return new Response('Too many requests', { status: 429 })
  }
  
  // ... lógica
}
```

#### 2. **Sin Validación de Entrada en Varios Endpoints**

```typescript
// ❌ Algunos endpoints no validan entrada
export async function POST(req: Request) {
  const { rating, comment } = await req.json()
  // Directamente a DB sin validar
  await prisma.reviews.create({ data: { rating, comment } })
}

// ✅ SIEMPRE validar
import { reviewSchema } from '@/validations/reviews'

export async function POST(req: Request) {
  const body = await req.json()
  const validated = reviewSchema.parse(body) // Lanza error si inválido
  await prisma.reviews.create({ data: validated })
}
```

#### 3. **Posible N+1 Query en Algunos Servicios**

Revisar y agregar `include` apropiado en:
- `sessions.service.ts` - Puede hacer N queries para participants
- `reviews.service.ts` - Puede hacer N queries para users

```typescript
// ❌ N+1 Problem
const sessions = await prisma.sessions.findMany()
for (const session of sessions) {
  const participants = await prisma.participants.findMany({ where: { session_id: session.id } })
}

// ✅ Single Query
const sessions = await prisma.sessions.findMany({
  include: { participants: true }
})
```

---

## 🎓 Recursos y Referencias

### Documentación Recomendada

- **Next.js App Router:** https://nextjs.org/docs/app
- **React Query Best Practices:** https://tkdodo.eu/blog/practical-react-query
- **Zustand Patterns:** https://github.com/pmndrs/zustand#readme
- **Prisma Performance:** https://www.prisma.io/docs/guides/performance-and-optimization

### Librerías Recomendadas para Agregar

```json
{
  "sonner": "^1.0.0",           // Toast notifications
  "@sentry/nextjs": "^7.0.0",   // Error tracking
  "zod": "^3.22.0",              // ✅ Ya instalado
  "react-hook-form": "^7.0.0",  // ✅ Ya instalado
  "@upstash/ratelimit": "^0.4.0" // Rate limiting
}
```

---

## 📞 Siguientes Pasos

### Día 1: Quick Wins
1. ✅ Eliminar `ChatView.tsx`
2. ✅ Crear `useApiQuery` y refactorizar 3-5 hooks como prueba
3. ✅ Crear `utils/dateFormatters.ts` y centralizar

### Semana 1: Foundation
4. ✅ Completar migración de todos los hooks a `useApiQuery`/`useApiMutation`
5. ✅ Dividir componentes grandes (LanguagesSection, ChatViewRealtime)
6. ✅ Agregar Error Boundary

### Semana 2-3: Architecture
7. ✅ Reestructurar a carpetas por feature
8. ✅ Setup de testing
9. ✅ Documentar patrones

### Semana 4+: Refinamiento
10. ✅ Optimizaciones de performance
11. ✅ Agregar monitoring (Sentry)
12. ✅ Mejorar SEO y accesibilidad

---

## ✅ Checklist de Validación

Después de cada sprint, verificar:

- [ ] No hay código duplicado innecesario
- [ ] Componentes <200 líneas (excepto casos justificados)
- [ ] Hooks <150 líneas
- [ ] Todos los imports se usan
- [ ] No hay console.log en producción
- [ ] Tests pasan (cuando se agreguen)
- [ ] TypeScript sin errores
- [ ] ESLint sin warnings
- [ ] Build de Next.js exitoso

---

## 📝 Notas Finales

Este proyecto tiene una **base sólida** con buenas prácticas en general. Los problemas detectados son comunes en proyectos que crecen orgánicamente. 

**El refactor propuesto es progresivo** - no requiere reescribir todo de una vez. Puedes ir implementando los cambios sprint por sprint mientras sigues desarrollando features.

**Prioriza:** Quick wins primero (eliminar código sin uso, crear abstracciones simples), luego refactors más grandes.

**Objetivo final:** Código más mantenible, menos bugs, desarrollo más rápido de nuevas features.

---

**Revisión realizada:** 7 de enero de 2026  
**Próxima revisión recomendada:** Después del Sprint 2 (en 2 semanas)

