import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel
} from "@headlessui/react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from "chart.js";
import { FaChevronDown } from "react-icons/fa";
import { useAuth } from "../hooks/auth";
import { Unit } from "../types";
import AssessmentHistogram from "./AssessmentHistogram";
import MarksSummary from "./MarksSummary";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);
const unitsData: Unit[] = [
  {
    unitCode: "CITS2006-1",
    unitName: "Defensive Cybersecurity",
    overall: "HD 84",
    assessments: [
      { name: "Lab Quiz 1", score: 71, total: 100 },
      { name: "Lab Quiz 2", score: 98, total: 100 },
      { name: "Midterm Exam", score: 74, total: 100 },
      { name: "Final Exam", score: 90, total: 100 }
    ]
  },
  {
    unitCode: "CITS3006-2",
    unitName: "Penetration Testing",
    overall: "Not released",
    assessments: [
      { name: "Lab Quiz 1", score: 81, total: 100 },
      { name: "Midterm Exam", score: 78, total: 100 },
      { name: "Lab Quiz 2", score: undefined, total: 100 },
      { name: "Final Project", score: undefined, total: 100 }
    ]
  },
  {
    unitCode: "CITS3200-2",
    unitName: "Professional Computing",
    overall: "D 35",
    assessments: [
      { name: "Group Project 1", score: 6, total: 10 },
      { name: "Reflections", score: 3, total: 10 },
      { name: "Sprint 1", score: 22, total: 22 },
      { name: "Sprint 2", score: 12, total: 20 },
      { name: "Final Report", score: 18, total: 20 },
      { name: "Presentation", score: 4, total: 5 }
    ]
  }
];

export default function Marks() {
  const { user } = useAuth();

  if (!user) return <></>;

  return (
    <div>
      <h2 className="text-3xl font-bold">
        Marks recorded for {user?.lastName}, {user?.firstName} in 2024
      </h2>
      <a
        href="mailto:{user?.userId}@student.uwa.edu.au"
        className="text-primary-blue"
      >
        {user?.id}@student.uwa.edu.au
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
                {unit.assessments.map((assessment) => (
                  <AssessmentHistogram assessment={assessment} />
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
