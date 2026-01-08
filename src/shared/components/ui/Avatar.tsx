import Image from "next/image"

export interface AvatarProps {
    src?: string
    alt?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
}

const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
}

export const Avatar = ({ src, alt = 'Avatar', size = 'md', className = '' }: AvatarProps) => {
    const sizeClass = sizes[size]
    
    return (
        <div className={`${sizeClass} rounded-full overflow-hidden bg-(--button-2) flex items-center justify-center ${className}`}>
            {src ? (
                <Image
                    src={src}
                    alt={alt}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                />
            ) : (
                <span className="text-(--text-2) font-semibold text-lg">
                    {alt?.charAt(0).toUpperCase() || '?'}
                </span>
            )}
        </div>
    )
}
