import { FiX } from 'react-icons/fi'
import { FilterChipProps } from '@/shared/types/ui'

export const FilterChip = ({ label, onRemove }: FilterChipProps) => {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-(--button-1) text-(--button-1-text) rounded-full text-sm font-medium">
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
        aria-label={`Remover filtro ${label}`}
      >
        <FiX className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
