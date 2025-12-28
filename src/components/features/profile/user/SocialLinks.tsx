import { useState } from "react"
import { FaLinkedin, FaGithub, FaInstagram, FaFacebook, FaWhatsapp, FaGlobe } from "react-icons/fa"
import { useTranslations } from "next-intl"
import { FiPlus, FiTrash2, FiEdit2, FiX, FiCheck } from "react-icons/fi"
import { Button } from "@/components"

interface SocialLinksProps {
    links: {
        linkedin?: string
        github?: string
        website?: string
        facebook?: string
        instagram?: string
        whatsapp?: string
    } | null
    onUpdate: (data: { social_links: any }) => Promise<any>
}

const PLATFORMS = [
    { key: 'linkedin', icon: FaLinkedin, label: 'LinkedIn', color: 'bg-[#0077B5]/10 text-[#0077B5]', placeholder: 'https://linkedin.com/in/...' },
    { key: 'github', icon: FaGithub, label: 'GitHub', color: 'bg-[#24292e]/10 text-[#24292e] dark:text-white dark:bg-white/10', placeholder: 'https://github.com/...' },
    { key: 'instagram', icon: FaInstagram, label: 'Instagram', color: 'bg-[#E1306C]/10 text-[#E1306C]', placeholder: 'https://instagram.com/...' },
    { key: 'facebook', icon: FaFacebook, label: 'Facebook', color: 'bg-[#1877F2]/10 text-[#1877F2]', placeholder: 'https://facebook.com/...' },
    { key: 'whatsapp', icon: FaWhatsapp, label: 'WhatsApp', color: 'bg-[#25D366]/10 text-[#25D366]', placeholder: 'https://wa.me/...' },
    { key: 'website', icon: FaGlobe, label: 'Website', color: 'bg-[#EB4C60]/10 text-[#EB4C60]', placeholder: 'https://...' },
]

export const SocialLinks = ({ links, onUpdate }: SocialLinksProps) => {
    const t = useTranslations('profile')
    const [isEditing, setIsEditing] = useState(false)
    const [showAddForm, setShowAddForm] = useState(false)

    // Local state for adding new link
    const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0].key)
    const [urlInput, setUrlInput] = useState('')

    const handleUpdate = async (newLinks: any) => {
        await onUpdate({ social_links: newLinks })
    }

    const handleAdd = () => {
        if (!urlInput) return
        const newLinks = { ...links, [selectedPlatform]: urlInput }
        handleUpdate(newLinks)
        setUrlInput('')
        setShowAddForm(false)
    }

    const handleRemove = (key: string) => {
        const newLinks = { ...links }
        delete newLinks[key as keyof typeof newLinks]
        handleUpdate(newLinks)
    }

    const activeLinks = PLATFORMS.filter(p => links?.[p.key as keyof typeof links])
    const availablePlatforms = PLATFORMS.filter(p => !links?.[p.key as keyof typeof links])

    if (!activeLinks.length && !isEditing) {
        return (
            <div className="bg-(--bg-2) rounded-2xl p-6 border border-(--border-1) mt-6 text-center">
                <h3 className="text-lg font-bold text-(--text-1) mb-2">{t('socialLinks')}</h3>
                <Button onClick={() => setIsEditing(true)} secondary className="text-sm py-2 mt-2">
                    <div className="flex items-center">
                        <FiPlus className="mr-2" /> 
                        <span>{t('addSocialLinks')}</span>
                    </div>
                </Button>
            </div>
        )
    }

    return (
        <div className="bg-(--bg-2) rounded-2xl p-6 border border-(--border-1) mt-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-(--text-1) flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    {t('socialLinks')}
                </h3>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-(--text-2) hover:text-(--text-1) transition-colors p-2"
                >
                    {isEditing ? <FiCheck size={18} /> : <FiEdit2 size={16} />}
                </button>
            </div>

            <div className="flex flex-col gap-3">
                {activeLinks.map((item) => {
                    const url = links?.[item.key as keyof typeof links]
                    if (!url) return null

                    let displayUrl = url.replace(/^https?:\/\/(www\.)?/, '')
                    if (displayUrl.length > 25) displayUrl = displayUrl.substring(0, 25) + '...'

                    return (
                        <div key={item.key} className="flex items-center gap-3 p-3 rounded-xl bg-(--bg-1) group relative">
                            <div className={`p-2 rounded-lg ${item.color}`}>
                                <item.icon size={20} />
                            </div>

                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 text-sm font-medium text-(--text-1) truncate hover:underline"
                            >
                                {displayUrl}
                            </a>

                            {isEditing && (
                                <button
                                    onClick={() => handleRemove(item.key)}
                                    className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            )}
                        </div>
                    )
                })}

                {isEditing && (
                    <div className="mt-2">
                        {!showAddForm ? (
                            availablePlatforms.length > 0 && (
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className="w-full py-2 border border-dashed border-(--border-1) rounded-xl text-(--text-2) text-sm hover:text-(--text-1) hover:border-(--text-2) transition-colors flex items-center justify-center gap-2"
                                >
                                    <FiPlus /> Add another link
                                </button>
                            )
                        ) : (
                            <div className="p-3 bg-(--bg-1) rounded-xl animate-in fade-in slide-in-from-top-1 border border-(--border-1)">
                                <div className="flex gap-2 mb-3 overflow-x-auto pb-2 no-scrollbar">
                                    {availablePlatforms.map(p => (
                                        <button
                                            key={p.key}
                                            onClick={() => setSelectedPlatform(p.key)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors border ${selectedPlatform === p.key ? 'bg-white shadow text-black border-transparent' : 'text-(--text-2) border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`}
                                        >
                                            <p.icon /> {p.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="url"
                                        value={urlInput}
                                        onChange={(e) => setUrlInput(e.target.value)}
                                        placeholder={PLATFORMS.find(p => p.key === selectedPlatform)?.placeholder}
                                        className="flex-1 bg-transparent border border-(--border-1) rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3B82F6] placeholder:text-(--text-2) text-(--text-1)"
                                        autoFocus
                                    />
                                    <button
                                        onClick={handleAdd}
                                        disabled={!urlInput}
                                        className="bg-[#3B82F6] text-white p-2 rounded-lg disabled:opacity-50 hover:bg-[#2563EB]"
                                    >
                                        <FiCheck />
                                    </button>
                                    <button
                                        onClick={() => setShowAddForm(false)}
                                        className="bg-(--bg-2) text-(--text-1) border border-(--border-1) p-2 rounded-lg hover:bg-(--bg-1)"
                                    >
                                        <FiX />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
