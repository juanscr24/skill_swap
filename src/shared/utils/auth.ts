/**
 * Valida si un usuario es dueño de un recurso en la base de datos.
 */
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
        throw new Error(options.errorMessage || 'Acceso no autorizado a este recurso')
    }

    return item as T
}
