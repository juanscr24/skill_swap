import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LocaleProvider } from "@/components/providers/LocaleProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillSwap",
  description: "SkillSwap es una plataforma de intercambio de habilidades que te permite aprender y enseñar tus habilidades de manera eficiente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Blocking script to prevent flash of wrong theme/locale */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
                            (function() {
                                try {
                                    // Set theme
                                    const themeStored = localStorage.getItem('theme-storage');
                                    if (themeStored) {
                                        const { state } = JSON.parse(themeStored);
                                        if (state && state.theme === 'dark') {
                                            document.documentElement.classList.add('dark');
                                        }
                                    }
                                    
                                    // Set locale
                                    const localeStored = localStorage.getItem('locale-storage');
                                    if (localeStored) {
                                        const { state } = JSON.parse(localeStored);
                                        if (state && state.locale) {
                                            document.documentElement.lang = state.locale;
                                        }
                                    }
                                } catch (e) {}
                            })();
                        `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-(--bg-1) flex justify-center min-h-screen`}
      >
        <LocaleProvider>
          <div className="w-full max-w-[100vw] overflow-x-hidden">
            {children}
          </div>
        </LocaleProvider>
      </body>
    </html>
  );
}
