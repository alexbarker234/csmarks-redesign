export default function InfoPanel() {
  return (
    <div className="text-decoration-none mx-auto block max-w-6xl">
      <div className="flex items-start rounded-md border bg-white p-4 shadow">
        <div className="pl-4">
          <a
            className="mt-0 text-2xl font-bold"
            href="https://secure.csse.uwa.edu.au/run/csmarks?year=2024"
          >
            csmarks
          </a>
          <p>
            This program records and displays assessment marks in departments in{" "}
            <b>the School of Physics, Mathematics, and Computing</b> in{" "}
            <span className="font-bold text-red-500">2024</span>.
          </p>
          <p>
            If you find a discrepancy between any mark and what you believe to
            be the correct mark, please contact your unit coordinator.
          </p>
          <p>
            Any marks presented here are subject to modification, either upwards
            or downwards, at Department- and School-level Board of Examiners'
            meetings.
          </p>
        </div>
      </div>
    </div>
  );
}
