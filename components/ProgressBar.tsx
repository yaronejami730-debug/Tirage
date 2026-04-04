"use client";

interface ProgressBarProps {
  total: number;
  sold: number;
  showLabel?: boolean;
}

export default function ProgressBar({
  total,
  sold,
  showLabel = true,
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.min((sold / total) * 100, 100) : 0;
  const remaining = total - sold;

  const getColor = () => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-orange-500";
    return "bg-primary-600";
  };

  return (
    <div className="w-full">
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center mt-1.5">
          <span className="text-xs text-gray-500">
            {sold} ticket{sold > 1 ? "s" : ""} vendu{sold > 1 ? "s" : ""}
          </span>
          <span
            className={`text-xs font-medium ${
              remaining === 0
                ? "text-red-600"
                : remaining <= 5
                ? "text-orange-600"
                : "text-gray-600"
            }`}
          >
            {remaining > 0
              ? `${remaining} restant${remaining > 1 ? "s" : ""}`
              : "Complet"}
          </span>
        </div>
      )}
    </div>
  );
}
