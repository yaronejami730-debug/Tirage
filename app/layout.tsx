import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tirage - Participez à nos tirages au sort",
  description:
    "Achetez vos tickets et participez à nos tirages au sort exclusifs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="bg-gray-50 min-h-screen">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <a href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-900">Tirage</span>
              </a>
              <nav className="flex items-center gap-4">
                <a
                  href="/"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Lots
                </a>
                <a
                  href="/admin"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Admin
                </a>
              </nav>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-white border-t border-gray-100 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Tirage. Tous droits réservés.
              </p>
              <p className="text-xs text-gray-400">
                Le tirage sera effectué par un organisme externe indépendant.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
