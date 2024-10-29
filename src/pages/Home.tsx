import { Link } from "react-router-dom";

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
      <section className="flex flex-wrap">
        <InfoSection
          title="Marks"
          description="View your marks, per-unit histograms, statistics, and feedback on your marked work."
          url="/marks"
          color="blue"
        />
      </section>

      <h1 className="my-2 text-2xl">Old content</h1>
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {" "}
        <InfoSection
          title="Unit Information"
          description="Provides informal information on coursework units, the software used, and recommendations on choosing a laptop."
          url="https://secure.csse.uwa.edu.au/run/unitinfo"
          color="green"
        />
        <InfoSection
          title="CS Forum"
          description="General announcements, information about industry visitors, and presentations of interest."
          url="https://secure.csse.uwa.edu.au/run/csforum"
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
  color: string;
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
      className={`block rounded-lg border border-${color}-400 bg-${color}-100 p-4 shadow transition-colors hover:bg-${color}-200`}
    >
      <h3 className={`text-lg font-bold text-${color}-700`}>{title}</h3>
      <p className="text-gray-700">{description}</p>
    </Link>
  );
}
