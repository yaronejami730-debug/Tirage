import { notFound } from "next/navigation";
import { supabaseAdmin, Lot } from "@/lib/supabase";
import LotForm from "../../LotForm";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

async function getLot(id: string): Promise<Lot | null> {
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("lots")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function EditLotPage({ params }: Props) {
  const { id } = await params;
  const lot = await getLot(id);

  if (!lot) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/lots"
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Modifier le lot
          </h1>
          <p className="text-gray-500 text-sm mt-0.5 font-mono">
            {lot.reference_lot}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <LotForm mode="edit" lot={lot} />
      </div>
    </div>
  );
}
