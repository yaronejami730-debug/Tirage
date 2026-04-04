import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl font-extrabold text-primary-200 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Page introuvable
        </h1>
        <p className="text-gray-500 mb-8">
          La page que vous recherchez n&apos;existe pas.
        </p>
        <Link href="/" className="btn-primary inline-block">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
