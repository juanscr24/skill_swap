export interface TextareaProps {
    id?: string
    label?: string
    placeholder?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    rows?: number
    className?: string
    error?: string
}

export const Textarea = ({
    id,
    label,
    placeholder,
    value,
    onChange,
    rows = 4,
    className = '',
    error
}: TextareaProps) => {
    return (
        <div className="w-full">
            {label && (
                <label className="font-semibold text-(--text-1) mb-2 max-sm:mb-1 max-sm:text-sm block" htmlFor={id}>
                    {label}
                </label>
            )}
            <textarea
                id={id}
                className={`bg-(--bg-2) border border-(--border-1) placeholder:text-(--text-2) w-full outline-none px-4 max-sm:px-3 py-3 max-sm:py-2 max-sm:text-sm rounded-md resize-none focus:border-(--button-1) transition-colors
                    ${error ? 'border-red-500' : ''}
                    ${className}`}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                rows={rows}
            />
            {error && <p className="text-red-500 text-sm max-sm:text-xs mt-1">{error}</p>}
        </div>
    )
}
