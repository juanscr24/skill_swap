export const acceptRequest = async (requestId: string) => {
    const response = await fetch(`/api/matches/${requestId}/accept`, {
        method: 'POST',
    })
    if (!response.ok) throw new Error('Error al aceptar solicitud')
    return response.json()
}

export const rejectRequest = async (requestId: string) => {
    const response = await fetch(`/api/matches/${requestId}/reject`, {
        method: 'POST',
    })
    if (!response.ok) throw new Error('Error al rechazar solicitud')
    return response.json()
}

export const cancelRequest = async (requestId: string) => {
    const response = await fetch(`/api/matches/${requestId}/cancel`, {
        method: 'DELETE',
    })
    if (!response.ok) throw new Error('Error al cancelar solicitud')
    return response.json()
}
