import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AssessmentHistogram from "../components/AssessmentHistogram";
import PercentageBar from "../components/PercentageBar";
import {
  fetchUserAssessmentsForUnit,
  fetchUserEnrolledUnits
} from "../database/data";
import { useAuth } from "../hooks/auth";
import { Unit } from "../types";

export default function MarkDetailsPage() {
  const { unitId } = useParams<{ unitId: string }>();
  const { user } = useAuth();

  const [unit, setUnitData] = useState<Unit | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !unitId) return;

    const loadSingleUnitData = async () => {
      try {
        // Fetch the specific unit the user is enrolled in
        const enrolledUnits = await fetchUserEnrolledUnits(user.id);
        const unit = enrolledUnits.find((u) => u.unitId === unitId);

        if (unit) {
          // Fetch assessments for the specified unit
          const assessments = await fetchUserAssessmentsForUnit(
            user.id,
            unit.unitId
          );

          setUnitData({
            unitCode: unit.unitId,
            unitName: unit.name,
            overall: "Not released",
            assessments
          });
        } else {
          console.warn(`User is not enrolled in unit with ID: ${unitId}`);
          setUnitData(null);
        }
      } catch (error) {
        console.error("Failed to load unit data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSingleUnitData();
  }, [user, unitId]);

  if (isLoading) return <p>Loading...</p>;
  if (!unit) return <p>Unit not found</p>;

  return (
    <div className="">
      <h2 className="mb-6 text-2xl font-bold">
        Marks Overview for {unit.unitCode} - {unit.unitName}
      </h2>

      <div className="text-lg font-bold text-primary-blue">
        Overall: {unit.overall}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {unit.assessments.map((assessment, assessmentIndex) => {
          const percentage =
            ((assessment.mark ?? 0) / assessment.maxMark) * 100;

          return (
            <div
              key={assessmentIndex}
              className="space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm"
            >
              <div className="flex-col">
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
                </p>{" "}
              </div>

              <AssessmentHistogram
                assessment={assessment}
                className="mx-auto"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
