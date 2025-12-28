import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
    notifications: {
        email: boolean
        push: boolean
        news: boolean
        security: boolean
        mentors: boolean
        messages: boolean
    }
    privacy: {
        visibility: string
        messagesPrivacy: string
    }
    setNotification: (key: keyof SettingsState['notifications'], value: boolean) => void
    setPrivacy: (key: keyof SettingsState['privacy'], value: string) => void
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            notifications: {
                email: true,
                push: true,
                news: false,
                security: true,
                mentors: true,
                messages: true
            },
            privacy: {
                visibility: 'public',
                messagesPrivacy: 'everyone'
            },
            setNotification: (key, value) =>
                set((state) => ({
                    notifications: {
                        ...state.notifications,
                        [key]: value
                    }
                })),
            setPrivacy: (key, value) =>
                set((state) => ({
                    privacy: {
                        ...state.privacy,
                        [key]: value
                    }
                }))
        }),
        {
            name: 'settings-storage',
            partialize: (state) => ({
                notifications: state.notifications,
                privacy: state.privacy
            }),
        }
    )
)
