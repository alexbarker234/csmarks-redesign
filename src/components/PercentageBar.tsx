export default function PercentageBar({ percentage }: { percentage: number }) {
  const getColorClass = (percentage: number) => {
    if (percentage < 50) return "bg-red-500";
    if (percentage < 60) return "bg-yellow-500";
    if (percentage < 80) return "bg-green-500";
    return "bg-blue-500";
  };

  return (
    <div className="relative h-3 rounded bg-gray-300">
      <div
        className={`absolute left-0 top-0 h-full rounded ${getColorClass(
          percentage
        )}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}
