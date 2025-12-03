import { Button } from "../ui/Button"

export const AboutUs = () => {
    return (
        <div className="grid grid-cols-2 py-20 gap-20">
            <div className="flex flex-col gap-8">
                <h2 className="text-5xl font-bold text-(--text-1)">Intercambia conocimiento, Potencia tu Talento</h2>
                <p className="text-lg text-(--text-2)">SkillSwap es la plataforma donde puedes compartir tus habilidades y aprender nuevas de expertos en una comunidad vibrante y colaborativa.</p>
                <Button className="w-60 py-3" primary children="Unete ahora" />
            </div>
            <div className="h-full w-full bg-(--bg-2) rounded-2xl"></div>
        </div>
    )
}
