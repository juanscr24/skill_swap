### ⚠️ Problemas Críticos Pendientes

| **Componentes "God" Monolíticos** | 🔴 ALTO | Difícil mantenimiento y testeo | `LanguagesSection.tsx`, `ChatPage.tsx`, `SkillsSection.tsx` |
| **Falta de Abstracción en Chat** | 🟡 MEDIO | Dificultad para escalar features | `ChatPage.tsx` |
| **Sin Manejo Centralizado de Errores** | 🟡 MEDIO | UX inconsistente | Todo el proyecto |
| **Validación de Propiedad (Ownership)** | 🟡 MEDIO | Riesgo de seguridad/bugs | Varios Servicios |

---

## ✅ Mejoras Ya Implementadas (¡Bien hecho!)
Se han verificado los siguientes cambios manuales realizados con éxito:
- **Estructura por Features**: Todo el código se ha movido a `src/features/` y `src/shared/`.
- **Abstracción de Data Fetching**: Implementación de `useApiQuery` y `useApiMutation` en `src/shared/hooks/`.
- **Lógica de Formateo de Fechas**: Centralizada en `src/shared/utils/date.ts`.
- **Manejo de Errores y Validaciones**: Implementado `ErrorBoundary`, `validateOwnership` y Esquemas de Zod compartidos.
- **Limpieza de Hooks**: Consolidación de lógica en hooks dedicados (ej. `useSkillMutations`).
- **Eliminación de Código Muerto**: `ChatView.tsx` y otros archivos antiguos han sido eliminados/reemplazados.

---

## 🔴 Problemas Principales a Resolver

### 1. **Componentes Excesivamente Grandes**
Todavía existen componentes que mezclan demasiada lógica, UI y sub-componentes inline.

| Archivo | Líneas | Problema | Recomendación |
|---------|--------|----------|---------------|
| `LanguagesSection.tsx` | ✅ MODULARIZADO | Dividido en `LanguageList`, `LanguageItem` y `LanguageModal`. | Refactor completo |
| `ChatPage.tsx` | ~420 | Vista monolítica de chat | Extraer `ConversationList`, `ChatHeader`, `MessageList` y `MessageInput`. |
| `SkillsSection.tsx` | ~360 | Lógica pesada de UI inline | Extraer a sub-componentes y hook de gestión. |
| `MentorFiltersPanel.tsx` | ~370 | Lógica de filtros inline | Mover lógica a un hook o Zustand store. |

---

### 3. **Refactor de ChatPage.tsx (Prioridad Alta)**
El nuevo sistema de chat es potente pero el componente principal es difícil de leer.

## 📋 Roadmap Actualizado

### 🚀 Sprint A: Limpieza de Utilidades (1-2 días)
1. **Centralizar Formatters**: ✅ Completado (en `src/shared/utils/date.ts`).
2. **Utilidades de Auth**: Crear `validateOwnership` para simplificar servicios.
3. **Zod Shared**: Extraer validaciones comunes.

### 🔨 Sprint B: Modularización de UI (3-5 días)
1. **Refactor Chat**: Dividir `ChatPage.tsx` en los 4 sub-componentes propuestos.
2. **Refactor Perfil**: Dividir `LanguagesSection.tsx` y `SkillsSection.tsx`.
3. **Genérico**: Crear `EditableList` si se detecta más repetición en perfiles.

### 🛡️ Sprint C: Robustez (2-3 días)
1. **Error Boundaries**: Implementar en rutas principales de features.
2. **Toast System**: Asegurar que todos los hooks de mutación usen el sistema de notificaciones de forma consistente.

---

## 📈 Métricas de Salud del Código

| Métrica | Estado Actual | Objetivo |
|---------|---------------|----------|
| Líneas duplicadas (lógica) | ~300 | < 50 |
| Componentes > 400 líneas | 2 | 0 |
| Uso de shared hooks | 90% | 100% |
| Cobertura de tipos (TS) | 95% | 100% |

---

**Última actualización:** 10 de enero de 2026
**Foco actual:** Modularización de componentes gigantes y centralización de utilidades.
