import { ButtonProps } from "@/types"

export const Button = ({
    title,
    type,
    children,
    className,
    onClick,
    primary,
    secondary,
    disabled
}: ButtonProps) => {
    return (
        <button
            title={title}
            disabled={disabled}
            onClick={onClick}
            className={`hover:scale-101 transition-all duration-200 p-2 max-sm:p-1.5 max-sm:text-sm cursor-pointer rounded-lg font-bold
                ${primary && 'bg-(--button-1) text-(--button-1-text)'} 
                ${secondary && 'bg-(--button-2) border border-(--border-1) text-(--text-1) hover:bg-(--button-2)/80'}
                ${className}`}
            type={type}
        >
            {children}
        </button>
    )
}
