'use client'
import { useRef, useState } from 'react'
import { FiSend } from 'react-icons/fi'

interface MessageInputProps {
    onSendMessage: (content: string) => Promise<void>
    isSubscribed: boolean
    placeholder?: string
}

export const MessageInput = ({
    onSendMessage,
    isSubscribed,
    placeholder = "Type a message..."
}: MessageInputProps) => {
    const [messageInput, setMessageInput] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!messageInput.trim() || !isSubscribed) return

        const content = messageInput
        setMessageInput('')
        inputRef.current?.focus()

        try {
            await onSendMessage(content)
        } catch (error) {
            console.error('Error sending message:', error)
            setMessageInput(content)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-(--border-1) bg-(--bg-2)"
        >
            <div className="flex gap-3 items-center">
                <button
                    type="button"
                    className="p-2 hover:bg-(--bg-1) rounded-lg text-(--text-2)"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>

                <input
                    ref={inputRef}
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 px-4 py-3 bg-(--bg-1) border border-(--border-1) rounded-xl focus:outline-none focus:ring-2 focus:ring-(--button-1) text-(--text-1) placeholder:text-(--text-2)"
                    disabled={!isSubscribed}
                />

                <button
                    type="button"
                    className="p-2 hover:bg-(--bg-1) rounded-lg text-(--text-2)"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                </button>

                <button
                    type="submit"
                    disabled={!messageInput.trim() || !isSubscribed}
                    className="p-3 bg-(--button-1) text-(--button-1-text) rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                    <FiSend className="w-5 h-5" />
                </button>
            </div>
        </form>
    )
}
