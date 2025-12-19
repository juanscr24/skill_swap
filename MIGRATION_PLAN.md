# 📋 Plan de Migración: Mock Data → Base de Datos Real

## ✅ FASE 1: FUNDACIÓN - Users & Skills (COMPLETADA)

### Servicios Creados:
- ✅ `/src/services/users/user-profile.service.ts`
- ✅ `/src/services/skills/skills.service.ts`

### API Routes Creadas:
- ✅ `GET    /api/users/profile` - Obtener perfil del usuario
- ✅ `PATCH  /api/users/profile` - Actualizar perfil
- ✅ `GET    /api/users/mentors` - Listar mentores/usuarios
- ✅ `GET    /api/skills` - Listar skills del usuario
- ✅ `POST   /api/skills` - Crear nueva skill
- ✅ `PATCH  /api/skills` - Actualizar skill
- ✅ `DELETE /api/skills?id={id}` - Eliminar skill
- ✅ `GET    /api/skills/wanted` - Listar wanted skills
- ✅ `POST   /api/skills/wanted` - Crear wanted skill
- ✅ `DELETE /api/skills/wanted?id={id}` - Eliminar wanted skill

---

## 🔄 FASE 2: Sessions & Dashboard (SIGUIENTE)

### Servicios a Crear:
- [ ] `/src/services/sessions/sessions.service.ts`
  - `getUserSessions(userId)` - Obtener sesiones del usuario
  - `createSession(data)` - Crear nueva sesión
  - `updateSession(id, data)` - Actualizar sesión
  - `cancelSession(id)` - Cancelar sesión
  - `getUpcomingSessions(userId)` - Próximas sesiones

- [ ] `/src/services/dashboard/dashboard.service.ts`
  - `getDashboardStats(userId)` - Estadísticas del dashboard
  - `getClassesTaken(userId)` - Clases tomadas
  - `getClassesGiven(userId)` - Clases dadas
  - `getHoursTeaching(userId)` - Horas enseñando

### API Routes a Crear:
- [ ] `GET    /api/sessions` - Listar sesiones
- [ ] `POST   /api/sessions` - Crear sesión
- [ ] `PATCH  /api/sessions/{id}` - Actualizar sesión
- [ ] `DELETE /api/sessions/{id}` - Cancelar sesión
- [ ] `GET    /api/dashboard/stats` - Estadísticas del dashboard

### Vistas a Migrar:
- [ ] `DashboardView.tsx` - Cambiar `mockSessions` y `mockStats` por API calls
- [ ] `SessionsView.tsx` - Cambiar a datos reales

---

## 💬 FASE 3: Messages & Chat (PENDIENTE)

### Servicios a Crear:
- [ ] `/src/services/messages/messages.service.ts`
  - `getConversations(userId)` - Obtener conversaciones
  - `getMessages(conversationId)` - Obtener mensajes
  - `sendMessage(data)` - Enviar mensaje
  - `markAsRead(messageId)` - Marcar como leído

### API Routes a Crear:
- [ ] `GET  /api/messages/conversations` - Listar conversaciones
- [ ] `GET  /api/messages/{conversationId}` - Obtener mensajes
- [ ] `POST /api/messages` - Enviar mensaje
- [ ] `PATCH /api/messages/{id}/read` - Marcar como leído

### Vistas a Migrar:
- [ ] `ChatView.tsx` - Cambiar `mockMessages` y `mockConversations`

---

## 🤝 FASE 4: Matches & Requests (PENDIENTE)

### Servicios a Crear:
- [ ] `/src/services/matches/matches.service.ts`
  - `getMatches(userId)` - Obtener matches
  - `createMatch(data)` - Crear match
  - `updateMatchStatus(id, status)` - Actualizar estado
  - `getSentRequests(userId)` - Solicitudes enviadas
  - `getReceivedRequests(userId)` - Solicitudes recibidas

### API Routes a Crear:
- [ ] `GET    /api/matches` - Listar matches
- [ ] `POST   /api/matches` - Crear match
- [ ] `PATCH  /api/matches/{id}` - Actualizar estado
- [ ] `GET    /api/requests/sent` - Solicitudes enviadas
- [ ] `GET    /api/requests/received` - Solicitudes recibidas

### Vistas a Migrar:
- [ ] `MatchingView.tsx` - Cambiar `mockUsers`
- [ ] `RequestsView.tsx` - Cambiar `mockMatches`

---

## ⭐ FASE 5: Reviews (PENDIENTE)

### Servicios a Crear:
- [ ] `/src/services/reviews/reviews.service.ts`
  - `getUserReviews(userId)` - Obtener reviews de un usuario
  - `createReview(data)` - Crear review
  - `getMyReviews(userId)` - Reviews que he escrito

### API Routes a Crear:
- [ ] `GET  /api/reviews/user/{userId}` - Reviews de un usuario
- [ ] `POST /api/reviews` - Crear review
- [ ] `GET  /api/reviews/me` - Mis reviews

### Vistas a Migrar:
- [ ] `ReviewsView.tsx` - Cambiar `mockReviews`
- [ ] `MentorsView.tsx` - Usar reviews reales

---

## 🔔 FASE 6: Notifications (OPCIONAL)

### Servicios a Crear:
- [ ] `/src/services/notifications/notifications.service.ts`
  - `getNotifications(userId)` - Obtener notificaciones
  - `markAsRead(id)` - Marcar como leída
  - `createNotification(data)` - Crear notificación

### API Routes a Crear:
- [ ] `GET   /api/notifications` - Listar notificaciones
- [ ] `PATCH /api/notifications/{id}/read` - Marcar como leída

---

## 📝 GUÍA DE MIGRACIÓN POR VISTA

### 1. ProfileView.tsx
```tsx
// ANTES (Mock Data)
import { currentUser } from "@/constants/mockUsers"

// DESPUÉS (API)
const [user, setUser] = useState(null)
useEffect(() => {
  fetch('/api/users/profile')
    .then(res => res.json())
    .then(setUser)
}, [])
```

### 2. MentorsView.tsx
```tsx
// ANTES (Mock Data)
import { mockUsers } from "@/constants/mockUsers"
const mentors = mockUsers.filter(user => user.role === 'MENTOR')

// DESPUÉS (API)
const [mentors, setMentors] = useState([])
useEffect(() => {
  fetch('/api/users/mentors?role=MENTOR')
    .then(res => res.json())
    .then(setMentors)
}, [])
```

### 3. DashboardView.tsx
```tsx
// ANTES (Mock Data)
import { mockDashboardStats, mockSessions } from "@/constants"

// DESPUÉS (API)
const [stats, setStats] = useState(null)
const [sessions, setSessions] = useState([])

useEffect(() => {
  Promise.all([
    fetch('/api/dashboard/stats').then(r => r.json()),
    fetch('/api/sessions').then(r => r.json())
  ]).then(([statsData, sessionsData]) => {
    setStats(statsData)
    setSessions(sessionsData)
  })
}, [])
```

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS

1. **Migrar ProfileView y EditProfileView**
   - Usar `/api/users/profile` (GET y PATCH)
   - Usar `/api/skills` y `/api/skills/wanted`

2. **Migrar MentorsView**
   - Usar `/api/users/mentors`

3. **Crear servicios y APIs de Sessions**
   - Implementar CRUD completo de sessions

4. **Migrar DashboardView**
   - Crear `/api/dashboard/stats`
   - Usar `/api/sessions` para próximas sesiones

---

## 📊 PROGRESO GENERAL

| Módulo | Servicios | API Routes | Vistas | Estado |
|--------|-----------|------------|--------|--------|
| **Users/Profile** | ✅ | ✅ | ⏳ | 66% |
| **Skills** | ✅ | ✅ | ⏳ | 66% |
| **Sessions** | ❌ | ❌ | ❌ | 0% |
| **Dashboard** | ❌ | ❌ | ❌ | 0% |
| **Messages** | ❌ | ❌ | ❌ | 0% |
| **Matches** | ❌ | ❌ | ❌ | 0% |
| **Reviews** | ❌ | ❌ | ❌ | 0% |

---

## 🚀 VENTAJAS DE ESTA ARQUITECTURA

1. **Modular**: Cada servicio es independiente
2. **Testeable**: Puedes probar servicios sin la UI
3. **Reutilizable**: Los servicios se pueden usar en múltiples rutas API
4. **Type-Safe**: TypeScript en toda la arquitectura
5. **Seguro**: Autenticación con NextAuth en cada endpoint
6. **Escalable**: Fácil agregar nuevas funcionalidades

---

## 💡 TIPS

- **Siempre valida la sesión** en las API routes
- **Usa try/catch** en todos los servicios
- **Retorna mensajes claros** de error
- **Valida los datos** antes de guardar en BD
- **Usa transacciones** cuando sea necesario
- **Indexa bien** para optimizar consultas

---

## 🔗 ARCHIVOS IMPORTANTES

- `prisma/schema.prisma` - Esquema de la base de datos
- `src/lib/prisma.ts` - Cliente de Prisma
- `src/lib/auth/auth.config.ts` - Configuración de NextAuth
- `src/services/*` - Lógica de negocio
- `src/app/api/*` - Endpoints de la API
