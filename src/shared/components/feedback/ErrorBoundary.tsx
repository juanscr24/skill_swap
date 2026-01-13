'use client'

import { Component, ErrorInfo } from 'react'
import { Button } from '@/shared/components/ui'
import { ErrorBoundaryProps, ErrorBoundaryState } from '@/shared/types'

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    public state: ErrorBoundaryState = {
        hasError: false,
        error: null
    }

    public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo)
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null })
    }

    public render() {
        if (this.state.hasError) {
            return (
                this.props.fallback || (
                    <div className="flex flex-col items-center justify-center p-8 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20 text-center">
                        <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">
                            Algo salió mal
                        </h2>
                        <p className="text-red-600 dark:text-red-500 mb-4 text-sm max-w-md">
                            Ocurrió un error inesperado en esta sección. Por favor, intenta recargar o contacta a soporte si el problema persiste.
                        </p>
                        <Button primary onClick={this.handleReset}>
                            Reintentar
                        </Button>
                    </div>
                )
            )
        }

        return this.props.children
    }
}
