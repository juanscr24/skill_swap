import { prisma } from '@/lib/prisma'
import type { CreateLanguageInput } from '@/types'

/**
 * Get all languages for a user
 */
export async function getUserLanguages(userId: string) {
  try {
    const languages = await prisma.languages.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    })

    return languages
  } catch (error) {
    console.error('Error getting user languages:', error)
    throw new Error('Failed to get languages')
  }
}

/**
 * Create a new language for a user
 */
export async function createLanguage(userId: string, data: CreateLanguageInput) {
  try {
    const language = await prisma.languages.create({
      data: {
        user_id: userId,
        name: data.name,
        level: data.level || null
      }
    })

    return language
  } catch (error) {
    console.error('Error creating language:', error)
    throw new Error('Failed to create language')
  }
}

/**
 * Delete a language
 */
export async function deleteLanguage(userId: string, languageId: string) {
  try {
    // Verify the language belongs to the user
    const language = await prisma.languages.findFirst({
      where: {
        id: languageId,
        user_id: userId
      }
    })

    if (!language) {
      throw new Error('Language not found or unauthorized')
    }

    await prisma.languages.delete({
      where: { id: languageId }
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting language:', error)
    throw new Error('Failed to delete language')
  }
}
