import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Assessment } from "../types";
import { convertToBins, generateBellCurveData } from "../utils/fakeData";
import { randBetween } from "../utils/random";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AssessmentHistogram({
  assessment,
  bins = 10
}: {
  assessment: Assessment;
  bins?: number;
}) {
  if (!assessment.score) {
    return (
      <div className="flex h-[321px] w-[430px] items-center rounded-md border border-gray-300 p-4 text-center">
        <div className="w-full">{assessment.name} marks not yet released</div>
      </div>
    );
  }

  const userScores = generateBellCurveData(
    randBetween(40, 60),
    randBetween(10, 16),
    199
  );
  userScores.push(assessment.score);

  const histogramData = convertToBins(userScores, bins);

  // Determine the bin for the current user's score
  const userBin = Math.floor((assessment.score / assessment.total) * bins);

  // Adjust histogram data to highlight the user's bin in blue
  const backgroundColors = histogramData.map((_, index) =>
    index === userBin ? "rgba(54, 162, 235, 0.7)" : "rgba(75, 192, 192, 0.7)"
  );
  const borderColors = histogramData.map((_, index) =>
    index === userBin ? "rgba(54, 162, 235, 1)" : "rgba(75, 192, 192, 1)"
  );

  const data = {
    labels: Array.from(
      { length: bins },
      (_, i) => `${i * 10}-${(i + 1) * 10}%`
    ),
    datasets: [
      {
        label: "Number of Students",
        data: histogramData,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const
      },
      title: {
        display: true,
        text: `${assessment.name} - Score Distribution`
      }
    },
    scales: {
      x: {},
      y: {
        title: {
          display: true,
          text: "Number of Students"
        },
        beginAtZero: true
      }
    }
  };

  return (
    <div className="h-[321px] w-[430px] rounded-md border border-gray-300 p-4">
      <Bar data={data} options={options} />
    </div>
  );
}
