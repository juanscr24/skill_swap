import { ReactNode } from "react"
import { UseFormRegisterReturn } from "react-hook-form"

export interface InputProps {
    type: "text" | "email" | "password" | "number"  | "date" | "time";
    placeholder?: string;
    label?: string;
    icon?: ReactNode;
    id?: string;
    error?: string;
    register?: UseFormRegisterReturn;
    errorMessage?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}