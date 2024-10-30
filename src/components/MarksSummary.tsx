import { Link } from "react-router-dom";
import { Unit } from "../types";
import { cn } from "../utils/cn";
import PercentageBar from "./PercentageBar";

export default function MarksSummary({ unitsData }: { unitsData: Unit[] }) {
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
              <Link
                to={`/marks/${unit.unitCode}`}
                className="text-xl font-semibold hover:underline"
              >
                {unit.unitCode} - {unit.unitName}
              </Link>
              <div className="text-lg font-bold text-primary-blue">
                Overall: {unit.overall}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {unit.assessments.map((assessment, idx) => {
                const percentage =
                  ((assessment.mark ?? 0) / assessment.maxMark) * 100;

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
                    <PercentageBar percentage={percentage} />

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
