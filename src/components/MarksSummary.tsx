import { Unit } from "../types";
import { cn } from "../utils/cn";

export default function MarksSummary({ unitsData }: { unitsData: Unit[] }) {
  const getColorClass = (percentage: number) => {
    if (percentage < 50) return "bg-red-500";
    if (percentage < 60) return "bg-yellow-500";
    if (percentage < 80) return "bg-green-500";
    return "bg-blue-500";
  };

  return (
    <>
      <h2 className="mb-6 mt-4 text-2xl font-bold">Marks Overview</h2>
      <div className="space-y-8">
        {unitsData.map((unit, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                {unit.unitCode} - {unit.unitName}
              </h3>
              <div className="text-lg font-bold text-primary-blue">
                Overall: {unit.overall}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {unit.assessments.map((assessment, idx) => {
                const percentage =
                  ((assessment.mark ?? 0) / assessment.maxMark) * 100;
                const colorClass = getColorClass(percentage);

                return (
                  <div
                    key={idx}
                    className={cn("space-y-1", {
                      "opacity-50": assessment.mark === undefined
                    })}
                  >
                    <div className="flex justify-between">
                      <div className="font-medium">{assessment.name}</div>
                      <div className="font-semibold">
                        {assessment.mark}/{assessment.maxMark}
                      </div>
                    </div>
                    <div className="relative h-3 rounded bg-gray-300">
                      <div
                        className={`absolute left-0 top-0 h-full rounded ${colorClass}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {assessment.mark === undefined
                        ? "Not released"
                        : percentage.toFixed(0) + "%"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
