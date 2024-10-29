import { IoMdMenu } from "react-icons/io";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/auth";

const baseURL = "https://secure.csse.uwa.edu.au";

const navLinks = [
  { label: "chapter0", href: `${baseURL}/run/chapter0` },
  { label: "unitinfo", href: `${baseURL}/run/unitinfo` },
  { label: "research projects", href: `${baseURL}/run/resprojects` },
  { label: "csforum", href: `${baseURL}/run/csforum` },
  { label: "csse-feedback", href: `${baseURL}/run/csse-feedback` },
  { label: "csbreakdown", href: `${baseURL}/run/csbreakdown` },
  { label: "cssubmit", href: `${baseURL}/run/cssubmit` },
  { label: "csmarks", href: `/` }
  // { label: "help forums", href: "/run/csmarks" }
];

const helpForums = [
  { label: "Algebra", href: `${baseURL}/run/helpmath1014` },
  { label: "Advanced Algorithms", href: `${baseURL}/run/help3001` },
  { label: "Cloud Computing", href: `${baseURL}/run/help5503` },
  { label: "High Performance Computing", href: `${baseURL}/run/help5507` },
  { label: "Intelligent Agents", href: `${baseURL}/run/help3011` },
  { label: "Professional Computing", href: `${baseURL}/run/help3200` },
  {
    label: "Relational Database Management Systems",
    href: `${baseURL}/run/help1402`
  },
  { label: "Systems Programming", href: `${baseURL}/run/help2002` }
];

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="w-full bg-primary-blue">
      <div className="h-18 flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <a href="https://www.uwa.edu.au">
            <img
              src="https://secure.csse.uwa.edu.au/csm/images/uwacrest.png"
              alt="UWA Crest"
              className="h-12"
            />
          </a>
          <div className="relative inline-block">
            <Link to="/" className="text-xl text-white">
              csmarks
            </Link>
          </div>
        </div>

        <div className="group relative flex cursor-pointer items-center text-white">
          <div className="mr-3 text-right text-xl">
            {user ? user.id : "Login"}
          </div>
          <IoMdMenu size={35} className="ml-2" />

          <div className="absolute right-0 top-full z-10 mt-2 w-48 rounded-md border bg-white text-black opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                {link.label}
              </a>
            ))}
            {user && (
              <div
                onClick={logout}
                className="block cursor-pointer px-4 py-2 text-red-500 hover:bg-gray-100"
              >
                Log Out
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
