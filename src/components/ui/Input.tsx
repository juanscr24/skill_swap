import { InputProps } from "@/types"

export const Input = ({ type, placeholder, label, icon, id, error, register, value, onChange }: InputProps) => {
    return (
        <div className="w-full">
            <label className="font-semibold text-(--text-1) max-sm:text-sm" htmlFor={id}>{label}</label>
            <div className="flex items-center mt-2 max-sm:mt-1 relative">
                {icon && <div className="ml-4 max-sm:ml-3 absolute">{icon}</div>}
                <input
                    id={id}
                    className={`bg-(--bg-2) border border-(--border-1) placeholder:text-(--text-2) w-full outline-none px-4 max-sm:px-3 py-4 max-sm:py-3 max-sm:text-sm rounded-md ${icon ? 'pl-12 max-sm:pl-10' : ''} ${error ? 'border-2 border-red-500' : ''}`}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    {...register}
                />
            </div>
            {error && <p className="text-red-500 text-sm max-sm:text-xs mt-1">{error}</p>}
        </div>
    )
}
