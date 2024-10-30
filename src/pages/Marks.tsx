import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel
} from "@headlessui/react";
import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import AssessmentHistogram from "../components/AssessmentHistogram";
import MarksSummary from "../components/MarksSummary";

import {
  fetchUserAssessmentsForUnit,
  fetchUserEnrolledUnits
} from "../database/data";
import { useAuth } from "../hooks/auth";
import { Assessment } from "../types";

interface UnitWithAssessments {
  unitCode: string;
  unitName: string;
  overall: string;
  assessments: Assessment[];
}

export default function MarksPage() {
  const { user } = useAuth();
  const [unitsData, setUnitsData] = useState<UnitWithAssessments[]>([]);

  useEffect(() => {
    if (!user) return;

    const loadUserData = async () => {
      try {
        // Fetch units the user is enrolled in
        const enrolledUnits = await fetchUserEnrolledUnits(user.id);

        // Fetch assessments for each enrolled unit
        const unitsWithAssessments = await Promise.all(
          enrolledUnits.map(async (unit) => {
            const assessments = await fetchUserAssessmentsForUnit(
              user.id,
              unit.unitId
            );
            return {
              unitCode: unit.unitId,
              unitName: unit.name,
              overall: "Not released",
              assessments
            };
          })
        );

        setUnitsData(unitsWithAssessments);
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    loadUserData();
  }, [user]);

  if (!user) return <></>;

  return (
    <div>
      <h2 className="text-3xl font-bold">
        Marks recorded for {user.lastName}, {user.firstName} in 2024
      </h2>
      <a
        href={`mailto:${user.id}@student.uwa.edu.au`}
        className="text-primary-blue"
      >
        {user.id}@student.uwa.edu.au
      </a>

      <h2 className="mt-4 text-2xl font-bold">
        Histograms, scatterplots, and any feedback for each unit
      </h2>

      <div className="mt-4">
        {unitsData.map((unit, unitIndex) => (
          <Disclosure key={unitIndex}>
            <DisclosureButton className="mb-2 flex items-center rounded-md px-2 py-4 text-xl font-bold transition-colors hover:bg-gray-100">
              {unit.unitCode} - {unit.unitName} (Overall: {unit.overall})
              <FaChevronDown className="ml-4" />
            </DisclosureButton>
            <DisclosurePanel
              transition
              className="origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
            >
              <div className="flex flex-wrap justify-center gap-4">
                {unit.assessments.map((assessment, assessmentIndex) => (
                  <AssessmentHistogram
                    key={assessmentIndex}
                    assessment={assessment}
                  />
                ))}
              </div>
            </DisclosurePanel>
          </Disclosure>
        ))}
        <MarksSummary unitsData={unitsData} />
      </div>
    </div>
  );
}
