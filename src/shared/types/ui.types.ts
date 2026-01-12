import { ReactNode, InputHTMLAttributes } from "react";

export interface AvatarProps {
    src?: string
    alt?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
}

export interface BadgeProps {
    children: ReactNode
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
    className?: string
}

export interface ButtonProps {
    type?: 'submit' | 'button';
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    primary?: boolean;
    secondary?: boolean;
    title?: string;
    disabled?: boolean;
}

export interface ButtonModeProps {
    className?: string
}

export interface CardProps {
    children: ReactNode
    className?: string
    hover?: boolean
    onClick?: () => void
}

export interface CardGuideProps {
    title?: string;
    icon?: ReactNode;
    description?: string;
}

export interface CardReviewProps {
    review?: string;
    username?: string;
    occupation?: string;
}

export interface CardSkillProps {
    icon?: ReactNode;
    skill?: string;
}

export interface FilterCheckboxProps {
    label: string
    checked: boolean
    onChange: (checked: boolean) => void
}

export interface FilterChipProps {
    label: string
    onRemove: () => void
}

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    type?: "text" | "email" | "password" | "number" | "date" | "time";
    placeholder?: string;
    label?: string;
    icon?: ReactNode;
    id?: string;
    error?: string;
    errorMessage?: string;
}

export interface LanguageSwitcherProps {
    className?: string
}

export interface MentorCardProps {
    id: string
    name: string
    image?: string | null
    city?: string | null
    bio?: string | null
    averageRating: number
    totalReviews: number
    skills: Array<{ id: string; name: string }>
}

export interface SearchBarProps {
    value?: string
    onChange?: (value: string) => void
    placeholder?: string
    className?: string
}

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

export interface SkillSelectorProps {
    onAdd: (skillName: string) => void
    placeholder?: string
}

export interface SkillSelectorPropsExtended extends SkillSelectorProps {
    recommendations?: string[]
    label?: string
}

export interface SwitchProps {
    checked: boolean
    onChange: (checked: boolean) => void
    label?: string
}

export interface SwitchPropsExtended extends SwitchProps {
    disabled?: boolean
    className?: string
}

export interface Tab {
    id: string
    label: string
    content: ReactNode
}

export interface TabsProps {
    tabs: Tab[]
    defaultTab?: string
    className?: string
}

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

