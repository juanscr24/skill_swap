import { ChatMessage } from '@/features/chat/types'

export const markMessagesAsDelivered = async (messageIds: string[]) => {
    if (messageIds.length === 0) return
    const response = await fetch('/api/messages/delivered', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: messageIds[0] }), // API expects single messageId currently based on implementation
    })
    if (!response.ok) throw new Error('Failed to mark as delivered')
}

export const markMessagesAsRead = async (messageIds: string[]) => {
    if (messageIds.length === 0) return
    const response = await fetch('/api/messages/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageIds }),
    })
    if (!response.ok) throw new Error('Failed to mark as read')
}

export const sendMessage = async (conversationId: string, senderId: string, content: string): Promise<ChatMessage> => {
    const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            conversationId,
            content: content.trim(),
        }),
    })
    if (!response.ok) throw new Error('Failed to send message')
    return response.json()
}
