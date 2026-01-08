/**
 * 🎨 COMPONENTE: FilterCheckbox
 * 
 * Checkbox personalizado para filtros multi-select
 */

interface FilterCheckboxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export const FilterCheckbox = ({ label, checked, onChange }: FilterCheckboxProps) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-2 border-(--border-1) text-(--button-1) focus:ring-2 focus:ring-(--button-1) focus:ring-offset-0 cursor-pointer"
      />
      <span className="text-sm text-(--text-1) group-hover:text-(--button-1) transition-colors">
        {label}
      </span>
    </label>
  )
}
