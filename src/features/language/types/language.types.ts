export interface CreateLanguageInput {
    name: string
    level: string
}

export interface LanguageData {
    id: string
    name: string
    level: string | null
}
