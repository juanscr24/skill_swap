export interface SelectProps {
    id?: string
    label?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
    options: { value: string; label: string }[]
    placeholder?: string
    className?: string
    error?: string
    required?: boolean
}

export const Select = ({
    id,
    label,
    value,
    onChange,
    options,
    placeholder,
    className = '',
    error,
    required
}: SelectProps) => {
    return (
        <div className="w-full">
            {label && (
                <label className="font-semibold text-(--text-1) mb-2 max-sm:mb-1 max-sm:text-sm block" htmlFor={id}>
                    {label}
                </label>
            )}
            <select
                id={id}
                value={value}
                onChange={onChange}
                required={required}
                className={`bg-(--bg-2) border border-(--border-1) text-(--text-1) w-full outline-none px-4 max-sm:px-3 py-3 max-sm:py-2 max-sm:text-sm rounded-md focus:border-(--button-1) transition-colors cursor-pointer
                    ${error ? 'border-red-500' : ''}
                    ${className}`}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500 text-sm max-sm:text-xs mt-1">{error}</p>}
        </div>
    )
}
