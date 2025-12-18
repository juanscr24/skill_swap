export interface SearchBarProps {
    value?: string
    onChange?: (value: string) => void
    placeholder?: string
    className?: string
}

export const SearchBar = ({ value, onChange, placeholder, className = '' }: SearchBarProps) => {
    return (
        <div className={`relative ${className}`}>
            <svg
                className="absolute left-4 max-sm:left-3 top-1/2 -translate-y-1/2 w-5 h-5 max-sm:w-4 max-sm:h-4 text-(--text-2)"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-12 max-sm:pl-10 pr-4 max-sm:pr-3 py-3 max-sm:py-2 max-sm:text-sm bg-(--bg-2) border border-(--border-1) rounded-lg text-(--text-1) placeholder:text-(--text-2) outline-none focus:border-(--button-1) transition-colors"
            />
        </div>
    )
}
