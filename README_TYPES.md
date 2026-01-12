# TypeScript Types Reorganization Guide

## 📋 Overview

This document provides a comprehensive analysis of the current TypeScript types architecture in `src/types/` and recommends a feature-based reorganization strategy. The goal is to migrate from a centralized types directory to a distributed, feature-based architecture that improves maintainability, scalability, and code locality.

**Current State**: All types are centralized in `src/types/` (21 files)  
**Target State**: Types distributed between `features/<feature>/types/` and `shared/types/`  
**Migration Strategy**: Manual, incremental, with backward compatibility

---

## 🎯 Feature-Based Types

### 1. Auth Feature

**Location**: `features/auth/types/auth.types.ts`

**Types to Move**:
- `SessionProviderProps` (from `components-providers.ts`)

**Reasoning**: These types are exclusively used by authentication features and session management. They should live close to the auth feature logic.

---

### 2. Chat Feature

**Location**: `features/chat/types/chat.types.ts`

**Types to Move**:
- `ChatMessage` (from `chat.ts`)
- `MessageStatus` (from `chat.ts`)
- `Conversation` (from `chat.ts`)
- `ConversationParticipant` (from `chat.ts`)
- `UserPresence` (from `chat.ts`)
- `ConversationWithDetails` (from `chat.ts`)
- `RealtimeMessage` (from `chat.ts`)
- `MessageConversation` (from `messages.ts` - legacy)
- `MessageDetail` (from `messages.ts` - legacy)
- `MessageData` (from `api.ts`)
- `ConversationData` (from `api.ts`)
- `ParticipantData` (from `api.ts`)

**Reasoning**: All chat-related types including real-time messaging, conversations, and presence status are domain-specific to the chat feature. These types handle Supabase Realtime integration and should be colocated with chat services and components.

---

### 3. Profile Feature

**Location**: `features/profile/types/profile.types.ts`

**Types to Move**:
- `ProfileHeaderProps` (from `components-profile.ts`)
- `MentorProfileHeaderProps` (from `components-profile.ts`)
- `StatsCardProps` (from `components-profile.ts`)
- `MentorStatsProps` (from `components-profile.ts`)
- `SocialLinksProps` (from `components-profile.ts`)
- `SkillsSectionProps` (from `components-profile.ts`)
- `MentorSkillsSectionProps` (from `components-profile.ts`)
- `LanguagesSectionProps` (from `components-profile.ts`)
- `AvailabilityScheduleProps` (from `components-profile.ts`)
- `MentorAboutSectionProps` (from `components-profile.ts`)
- `ReviewsChartProps` (from `components-profile.ts`)
- `MentorReviewsSectionProps` (from `components-profile.ts`)
- `SimilarMentor` (from `components-profile.ts`)
- `MentorSimilarProfilesProps` (from `components-profile.ts`)
- `MentorAvailabilityProps` (from `components-profile.ts`)
- `EditAboutMeSectionProps` (from `components-edit.ts`)
- `EditSkillsSectionProps` (from `components-edit.ts`)
- `EditLanguagesSectionProps` (from `components-edit.ts`)
- `UserProfileViewProps` (from `views.ts`)
- `UpdateUserProfileData` (from `services.ts`)
- `SocialLinks` (from `services.ts`)
- `UserAvailability` (from `services.ts`)

**Reasoning**: Profile types encompass both viewing and editing user profiles, including mentor-specific profiles. These types are tightly coupled to profile components and should be grouped together for better feature cohesion.

---

### 4. Matching Feature

**Location**: `features/matching/types/matching.types.ts`

**Types to Move**:
- `MatchCardProps` (from `components-features.ts`)
- `Match` (from `models.ts`)
- `MatchData` (from `api.ts`)
- `PrismaMatch` (from `requests.ts`)
- `MatchRequest` (from `requests.ts`)
- `PotentialMatch` (from `requests.ts`)
- `MatchRequestView` (from `views.ts`)

**Reasoning**: All matching/request types are specific to the skill-matching feature, which connects users based on complementary skills. These types handle the lifecycle from match discovery to match acceptance/rejection.

---

### 5. Session Feature

**Location**: `features/session/types/session.types.ts`

**Types to Move**:
- `Session` (from `models.ts`)
- `SessionData` (from `api.ts`)
- `SessionRequest` (from `models.ts`)
- `SessionUser` (from `sessions.ts`)
- `SessionViewData` (from `sessions.ts`)
- `SessionCardProps` (from `sessions.ts`)
- `SessionDataView` (from `views.ts`)
- `AvailabilityManagerProps` (from `components-features.ts`)
- `AvailabilityDisplayProps` (from `components-availability.ts`)
- `BookSessionModalProps` (from `components-availability.ts`)
- `MentorAvailability` (from `models.ts`)
- `MentorAvailabilityData` (from `sessions.ts`)
- `MentorsAvailabilityCalendarProps` (from `sessions.ts`)
- `AvailabilitySlot` (from `models.ts`)

**Reasoning**: Session types manage the booking, scheduling, and execution of mentoring/learning sessions. They include availability management, which is tightly coupled to session creation. All these types form the core of the session booking workflow.

---

### 6. Calendar Feature

**Location**: `features/calendar/types/calendar.types.ts`

**Types to Move**:
- `CalendarEvent` (from `calendar.ts`)
- `PrismaMentorAvailability` (from `calendar.ts`)
- `PrismaSession` (from `calendar.ts`)
- `CalendarFilters` (from `calendar.ts`)
- `CalendarViewMode` (from `calendar.ts`)
- `CalendarDayData` (from `calendar.ts`)

**Reasoning**: Calendar types are specific to the calendar view feature that displays both availability and sessions in a unified calendar interface. These types handle the transformation and display of time-based data.

---

### 7. Review Feature

**Location**: `features/review/types/review.types.ts`

**Types to Move**:
- `Review` (from `models.ts`)
- `ReviewData` (from `api.ts`)
- `ServiceReview` (from `reviews.ts`)

**Reasoning**: Review types handle the rating and feedback system between users. These types are specific to the review feature and should be colocated with review services and components.

---

### 8. Dashboard Feature

**Location**: `features/dashboard/types/dashboard.types.ts`

**Types to Move**:
- `DashboardStats` (from `dashboard.ts`)
- `StatCardConfig` (from `dashboard.ts`)
- `UpcomingSession` (from `dashboard.ts`)
- `UserImpact` (from `dashboard.ts`)
- `QuickAction` (from `dashboard.ts`)
- `DashboardSectionProps` (from `dashboard.ts`)

**Reasoning**: Dashboard types are specific to the main dashboard view that shows user statistics, upcoming sessions, and quick actions. These types aggregate data from multiple features but are only used within the dashboard context.

---

### 9. Mentor Feature

**Location**: `features/mentor/types/mentor.types.ts`

**Types to Move**:
- `MentorFilters` (from `filters.ts`)
- `AvailabilityFilter` (from `filters.ts`)
- `INITIAL_MENTOR_FILTERS` (from `filters.ts`)
- `FilterOption` (from `filters.ts`)
- `RatingOption` (from `filters.ts`)
- `ActiveFilterChip` (from `filters.ts`)
- `MentorQueryParams` (from `filters.ts`)
- `UseMentorFiltersReturn` (from `filters.ts`)
- `UserFilters` (from `services.ts`)
- `UserWhereClause` (from `services.ts`)
- `RatingReview` (from `services.ts`)
- `UserWithReviews` (from `services.ts`)
- `MentorWithRating` (from `services.ts`)

**Reasoning**: These types specifically support the mentor discovery and filtering feature. They handle complex filtering logic, query building, and mentor-specific data structures.

---

### 10. Settings Feature

**Location**: `features/setting/types/settings.types.ts`

**Types to Move**:
- `SettingsSectionProps` (from `components-settings.ts`)

**Reasoning**: Settings types are specific to the user settings/configuration feature. While currently minimal, this feature may grow with notification preferences, privacy settings, etc.

---

### 11. Language Feature

**Location**: `features/language/types/language.types.ts`

**Types to Move**:
- `Language` (from `models.ts`)
- `LanguageData` (from `api.ts`)
- `CreateLanguageInput` (from `languages.ts`)

**Reasoning**: Language types manage user language proficiency and preferences. This feature is independent enough to warrant its own type definitions, especially if it grows to include language-based filtering or recommendations.

---

### 12. Activity Feature

**Location**: `features/activity/types/activity.types.ts`

**Types to Move**:
- Currently no specific types in `src/types/`, but this feature may have types scattered in components or services.

**Reasoning**: Activity/notification types should be consolidated here when found. This feature tracks user actions and notifications.

---

## 🌍 Shared Types (Global/Reusable)

### Location: `shared/types/`

These types are used across multiple features and should remain globally accessible.

---

### `shared/types/models.types.ts`

**Types to Keep Shared**:
- `User` (from `models.ts`)
- `Skill` (from `models.ts`)
- `WantedSkill` (from `models.ts`)
- `Notification` (from `models.ts`)
- `ChatConversation` (from `models.ts` - if used outside chat feature)

**Reasoning**: Core domain models like `User` and `Skill` are referenced throughout the application. They represent fundamental entities that multiple features depend on. These should remain in shared types for easy access.

---

### `shared/types/api.types.ts`

**Types to Keep Shared**:
- `ApiResponse<T>` (from `api.ts`)
- `ApiError` (from `api.ts`)
- `PaginatedResponse<T>` (from `api.ts`)
- `UserWithRelations` (from `api.ts`)
- `SkillData` (from `api.ts`)
- `WantedSkillData` (from `api.ts`)

**Reasoning**: Generic API response wrappers and error types are used by all API routes and services. These are infrastructure types that provide consistency across the entire application. `UserWithRelations` is a common data shape used by many features.

---

### `shared/types/components.types.ts`

**Types to Keep Shared**:
- `LocaleProviderProps` (from `components-providers.ts`)
- `DynamicIntlProviderProps` (from `components-providers.ts`)

**Reasoning**: Internationalization providers are used at the application root level and affect all features. These are global infrastructure components.

---

### `shared/types/auth.types.ts`

**Types to Keep Shared**:
- NextAuth type declarations from `next-auth.d.ts` (entire file)

**Reasoning**: NextAuth type augmentations are global TypeScript declarations that extend third-party library types. These must remain accessible throughout the application and follow NextAuth's recommended patterns.

---

## 📊 Migration Summary

### By File

| Current File | Lines | Feature Destination | Shared Destination |
|-------------|-------|--------------------|--------------------|
| `api.ts` | ~110 | Chat (3 types) | ✅ Keep 6 types shared |
| `calendar.ts` | ~80 | ✅ Calendar | - |
| `chat.ts` | ~60 | ✅ Chat | - |
| `components-availability.ts` | ~15 | ✅ Session | - |
| `components-edit.ts` | ~30 | ✅ Profile | - |
| `components-features.ts` | ~20 | Matching (1), Session (1) | - |
| `components-profile.ts` | ~120 | ✅ Profile | - |
| `components-providers.ts` | ~10 | Auth (1) | ✅ Keep 2 shared |
| `components-settings.ts` | ~8 | ✅ Settings | - |
| `dashboard.ts` | ~60 | ✅ Dashboard | - |
| `filters.ts` | ~100 | ✅ Mentor | - |
| `languages.ts` | ~6 | ✅ Language | - |
| `messages.ts` | ~25 | ✅ Chat (legacy) | - |
| `models.ts` | ~120 | Multiple features | ✅ Keep 5 types shared |
| `next-auth.d.ts` | ~30 | - | ✅ Keep all shared |
| `requests.ts` | ~60 | ✅ Matching | - |
| `reviews.ts` | ~20 | ✅ Review | - |
| `services.ts` | ~110 | Profile (3), Mentor (5) | ✅ Keep 0 shared |
| `sessions.ts` | ~60 | ✅ Session | - |
| `views.ts` | ~35 | Profile (1), Matching (1), Session (1) | - |
| `index.ts` | ~40 | Re-export barrel file | ✅ Update to re-export from new locations |

---

## 🎨 Recommended File Naming Convention

When creating new type files in feature directories, use this pattern:

```
features/
  <feature-name>/
    types/
      <feature-name>.types.ts          # Main types
      <feature-name>-api.types.ts      # API-specific types (if substantial)
      <feature-name>-components.types.ts # Component props (if substantial)
      index.ts                         # Barrel export
```

**Examples**:
- `features/chat/types/chat.types.ts`
- `features/profile/types/profile.types.ts`
- `features/session/types/session.types.ts`

For shared types, group by category:
```
shared/
  types/
    api.types.ts          # API response wrappers
    models.types.ts       # Core domain models
    components.types.ts   # Shared component props
    auth.types.ts        # Auth-related types
    index.ts             # Barrel export
```

---

## 🔄 Migration Strategy

### Phase 1: Preparation (No Breaking Changes)
1. Create new type files in feature directories
2. Copy (don't move) types to new locations
3. Update feature-internal imports to use new locations
4. Keep old `src/types/` files intact for backward compatibility

### Phase 2: Gradual Migration
1. Update imports in one feature at a time
2. Test thoroughly after each feature migration
3. Update `src/types/index.ts` to re-export from new locations

### Phase 3: Cleanup
1. Once all imports are updated, remove old files from `src/types/`
2. Simplify `src/types/index.ts` to only re-export from shared types
3. Update documentation and type checking

---

## ✅ Benefits of This Reorganization

1. **Feature Locality**: Types live next to the code that uses them, making features more self-contained and portable.

2. **Reduced Coupling**: Features don't need to import from a centralized types directory, reducing interdependencies.

3. **Clearer Dependencies**: It's immediately obvious which types are feature-specific vs. shared/global.

4. **Easier Testing**: Feature types can be mocked/tested in isolation without importing the entire type system.

5. **Better Scalability**: New features can define their own types without polluting a shared namespace.

6. **Improved IDE Performance**: Smaller, focused type files improve TypeScript compilation and IDE autocomplete.

7. **Clearer Ownership**: Each feature team owns their types, reducing merge conflicts.

---

## ⚠️ Important Notes

- **Do NOT move `next-auth.d.ts`**: This file contains TypeScript module augmentation and must remain at the root of `src/types/` or in a global types directory.

- **Barrel Exports**: After reorganization, maintain a barrel export in `src/types/index.ts` that re-exports from feature types for backward compatibility during migration.

- **Shared Types Evolution**: As you migrate, you may discover types that you thought were feature-specific are actually used by multiple features. In those cases, move them to `shared/types/`.

- **Component Props Pattern**: Many files like `components-*.ts` are exclusively props for components. These should move to the feature that owns those components.

- **API Types Pattern**: Types suffixed with `Data` (e.g., `MessageData`, `SessionData`) are typically API response shapes and can be feature-specific if only one feature uses them.

---

## 📝 Next Steps

1. Review this document with your team
2. Prioritize which features to migrate first (recommendation: start with `chat` or `dashboard` as they're well-isolated)
3. Create a migration checklist for each feature
4. Set up ESLint rules to enforce feature boundaries (optional but recommended)
5. Update your project documentation to reflect the new architecture

---

**Generated**: January 12, 2026  
**Status**: Ready for manual implementation  
**No code changes have been made** - this is documentation only.
