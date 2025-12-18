'use client'
import { ButtonMode } from "@/components/ui/ButtonMode"
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useTranslations } from "next-intl";


const Auth = () => {
    const t = useTranslations('common');
    return (
        <div>
            <h1 className="bg-(--background)">
                {t('welcome')}
            </h1>
            <ButtonMode />
            <LanguageSwitcher />
        </div>
    )
}

export default Auth