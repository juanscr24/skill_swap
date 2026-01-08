import { useState } from "react"

export interface RatingProps {
    value?: number
    onChange?: (value: number) => void
    readonly?: boolean
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
}

export const Rating = ({ value = 0, onChange, readonly = false, size = 'md', className = '' }: RatingProps) => {
    const [hover, setHover] = useState(0)
    const sizeClass = sizes[size]

    return (
        <div className={`flex gap-1 ${className}`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => !readonly && onChange?.(star)}
                    onMouseEnter={() => !readonly && setHover(star)}
                    onMouseLeave={() => !readonly && setHover(0)}
                    className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
                >
                    <svg
                        className={`${sizeClass} ${
                            star <= (hover || value)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-none text-(--text-2)'
                        }`}
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                    </svg>
                </button>
            ))}
        </div>
    )
}
