import { Suspense } from "react";
import AdminLoginContent from "./AdminLoginContent";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><p className="text-gray-500">Chargement...</p></div>}>
      <AdminLoginContent />
    </Suspense>
  );
}
