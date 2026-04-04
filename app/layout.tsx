import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tirage — Tentez votre chance !",
  description: "Achetez vos tickets et participez à nos tirages au sort exclusifs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen" style={{ background: "#f8f7ff" }}>
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <a href="/" className="flex items-center gap-3 group">
                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md shadow-primary-200 group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <span className="text-xl font-extrabold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
                  Tirage
                </span>
              </a>

              <nav className="flex items-center gap-2">
                <a href="/" className="text-sm font-medium text-gray-600 hover:text-primary-600 px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-all">
                  Lots
                </a>
                <a href="/admin" className="text-sm font-medium text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all">
                  Admin
                </a>
              </nav>
            </div>
          </div>
        </header>

        <main>{children}</main>

        {/* Footer */}
        <footer className="mt-20 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <span className="font-bold text-gray-800">Tirage</span>
              </div>
              <p className="text-xs text-gray-400 text-center">
                Le tirage est effectué par un organisme externe indépendant · &copy; {new Date().getFullYear()} Tirage
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
