import { Link } from "react-router-dom";
import { cn } from "../utils/cn";

export default function HomePage() {
  return (
    <>
      <section className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-bold">Welcome to Chapter0</h2>
        <p className="mb-4 text-gray-700">
          Many famous Computer Science textbooks begin at Chapter 0, so we will
          too. From here, you may find information about events in our
          department and links to frequently accessed tools.
        </p>
      </section>

      <h1 className="my-2 text-2xl">New Pages</h1>
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <InfoSection
          title="Marks"
          description="View your marks, per-unit histograms, statistics, and feedback on your marked work."
          url="/marks"
          color="blue"
        />{" "}
        <InfoSection
          title="Forums"
          description="View unit help forums, announcements and more."
          url="/forums"
          color="green"
        />
      </section>

      <h1 className="my-2 text-2xl">Old content</h1>
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <InfoSection
          title="Unit Information"
          description="Provides informal information on coursework units, the software used, and recommendations on choosing a laptop."
          url="https://secure.csse.uwa.edu.au/run/unitinfo"
          color="green"
        />

        <InfoSection
          title="CSSE Feedback"
          description="Discuss and offer feedback about teaching and resources, and participate in Student/Staff Liaison meetings."
          url="https://secure.csse.uwa.edu.au/run/csse-feedback"
          color="red"
        />
        <InfoSection
          title="CS Breakdown"
          description="View today's enrolments, enrolment retention, and its change across years."
          url="https://secure.csse.uwa.edu.au/run/csbreakdown"
          color="blue"
        />
        <InfoSection
          title="CS Submit"
          description="View assessment deadlines, submit assignments, and view feedback on marked work."
          url="https://secure.csse.uwa.edu.au/run/cssubmit"
          color="blue"
        />
        <InfoSection
          title="LMS"
          description="LMS enables staff to publish lecture notes, manage interactive modules, and set up assignments and quizzes."
          url="https://lms.uwa.edu.au/ultra/institution-page"
          color="yellow"
        />
      </section>
    </>
  );
}

interface InfoSectionProps {
  title: string;
  description: string;
  url: string;
  color: "red" | "yellow" | "blue" | "green";
}

export function InfoSection({
  title,
  description,
  url,
  color
}: InfoSectionProps) {
  return (
    <Link
      to={url}
      className={cn(`block rounded-lg border p-4 shadow transition-colors`, {
        "border-green-400 bg-green-100 hover:bg-green-200": color === "green",
        "border-blue-400 bg-blue-100 hover:bg-blue-200": color === "blue",
        "border-yellow-400 bg-yellow-100 hover:bg-yellow-200":
          color === "yellow",
        "border-red-400 bg-red-100 hover:bg-red-200": color === "red"
      })}
    >
      <h3 className={`text-lg font-bold text-${color}-700`}>{title}</h3>
      <p className="text-gray-700">{description}</p>
    </Link>
  );
}
