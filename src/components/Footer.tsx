import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative mt-auto bg-gray-100 px-8 py-4 text-sm text-gray-600">
      <div className="flex flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0">
        <div className="text-center sm:text-left">
          <a
            href="https://www.uwa.edu.au"
            className="block hover:text-primary-blue"
          >
            The University of Western Australia
          </a>
          <a
            href="https://www.uwa.edu.au/schools/Physics-Mathematics-Computing/Department-of-Computer-Science-and-Software-Engineering"
            className="block hover:text-primary-blue"
          >
            Computer Science and Software Engineering
          </a>
          <a
            href="https://secure.csse.uwa.edu.au/run/chapter0?opt=Dp"
            className="text-primary-blue hover:underline"
          >
            Privacy policy
          </a>
        </div>

        <a
          href="https://github.com/alexbarker234"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-0 right-0 p-4 text-gray-600 transition-colors hover:text-black"
        >
          <FaGithub size={24} />
        </a>
      </div>
    </footer>
  );
}
