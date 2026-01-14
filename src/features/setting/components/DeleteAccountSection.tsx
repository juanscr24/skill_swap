'use client'

import { useState } from 'react'
import { useTranslations } from "next-intl"
import { FiAlertTriangle } from "react-icons/fi"
import { Button } from "../../../shared/components/ui/Button"
import { signOut } from 'next-auth/react'

export const DeleteAccountSection = () => {
    const t = useTranslations('settings.danger')
    const [isDeleting, setIsDeleting] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleDelete = async () => {
        if (!password) {
            setError('Por favor ingresa tu contraseña para confirmar')
            return
        }

        setIsDeleting(true)
        setError('')

        try {
            const response = await fetch('/api/settings/delete-account', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ confirmPassword: password })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al eliminar la cuenta')
            }

            // Cerrar sesión y redirigir
            alert('Tu cuenta ha sido eliminada correctamente')
            await signOut({ callbackUrl: '/login' })
        } catch (err: any) {
            setError(err.message || 'Error al eliminar la cuenta')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <section className="bg-red-500/5 rounded-xl border border-red-500/20 overflow-hidden">
            <div className="p-6 max-sm:p-4 border-b border-red-500/20">
                <div className="flex items-center gap-3">
                    <FiAlertTriangle className="w-5 h-5 text-red-500" />
                    <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">{t('title')}</h2>
                </div>
            </div>
            <div className="p-6 max-sm:p-4 space-y-4">
                <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-4">
                    <div>
                        <h3 className="text-sm font-medium text-(--text-1)">{t('deleteAccount')}</h3>
                        <p className="text-xs text-(--text-2)">{t('deleteDescription')}</p>
                    </div>
                    <Button
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="max-sm:w-full bg-red-500 hover:bg-red-600 text-white"
                    >
                        {showConfirm ? 'Cancelar' : t('deleteButton')}
                    </Button>
                </div>

                {showConfirm && (
                    <div className="mt-4 p-4 bg-(--bg-1) rounded-lg space-y-3 border border-red-500/20">
                        <p className="text-sm text-(--text-1) font-semibold">
                            ⚠️ Esta acción es permanente y no se puede deshacer
                        </p>
                        <p className="text-xs text-(--text-2)">
                            Se eliminarán todos tus datos, mensajes, sesiones y actividad
                        </p>
                        <input
                            type="password"
                            placeholder="Ingresa tu contraseña para confirmar"
                            className="w-full px-3 py-2 bg-(--bg-2) border border-(--border-1) rounded-lg text-(--text-1) text-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && <p className="text-xs text-red-500">{error}</p>}
                        <Button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="w-full bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                        >
                            {isDeleting ? 'Eliminando...' : 'Confirmar eliminación de cuenta'}
                        </Button>
                    </div>
                )}
            </div>
        </section>
    )
}
