'use client'

import type { PasswordRequirement, PasswordStrengthProps } from '@/types'

const requirements: PasswordRequirement[] = [
  { label: 'Al menos 8 caracteres', regex: /.{8,}/ },
  { label: 'Una letra minúscula', regex: /[a-z]/ },
  { label: 'Una letra mayúscula', regex: /[A-Z]/ },
  { label: 'Un número', regex: /\d/ },
  { label: 'Un carácter especial (@$!%*?&.#)', regex: /[@$!%*?&.#]/ },
]

export function PasswordStrength({ password, show = true }: PasswordStrengthProps) {
  if (!show) return null

  const getStrength = () => {
    const passedRequirements = requirements.filter(req => req.regex.test(password))
    return passedRequirements.length
  }

  const strength = getStrength()
  const percentage = (strength / requirements.length) * 100

  const getStrengthColor = () => {
    if (strength <= 2) return 'bg-red-500'
    if (strength <= 3) return 'bg-yellow-500'
    if (strength <= 4) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getStrengthText = () => {
    if (strength === 0) return ''
    if (strength <= 2) return 'Débil'
    if (strength <= 3) return 'Media'
    if (strength <= 4) return 'Buena'
    return 'Excelente'
  }

  return (
    <div className="mt-3 space-y-3">
      {/* Barra de progreso */}
      {password && (
        <div className="space-y-1">
          <div className="w-full bg-(--bg-1) rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getStrengthColor()}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className={`text-xs font-medium ${
            strength <= 2 ? 'text-red-500' :
            strength <= 3 ? 'text-yellow-500' :
            strength <= 4 ? 'text-blue-500' :
            'text-green-500'
          }`}>
            {getStrengthText()}
          </p>
        </div>
      )}

      {/* Requisitos */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-(--text-2)">Requisitos de contraseña:</p>
        <ul className="space-y-1">
          {requirements.map((req, index) => {
            const isPassed = req.regex.test(password)
            return (
              <li
                key={index}
                className={`text-xs flex items-center gap-2 transition-colors ${
                  password === '' 
                    ? 'text-(--text-2)' 
                    : isPassed 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                }`}
              >
                <span className="text-base">
                  {password === '' ? '○' : isPassed ? '✓' : '✗'}
                </span>
                {req.label}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
