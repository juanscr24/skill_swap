import { ReactNode, InputHTMLAttributes } from "react"

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    type?: "text" | "email" | "password" | "number" | "date" | "time";
    placeholder?: string;
    label?: string;
    icon?: ReactNode;
    id?: string;
    error?: string;
    errorMessage?: string;
}