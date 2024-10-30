import { BiChat, BiPencil } from "react-icons/bi";
import { FaHome } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/auth";

const baseURL = "https://secure.csse.uwa.edu.au";

const navLinks = [
  { label: "Home", href: `/`, icon: FaHome },
  { label: "Marks", href: `/marks`, icon: BiPencil },
  { label: "Forums", href: `/forums`, icon: BiChat },

  { label: "unitinfo", href: `${baseURL}/run/unitinfo` },
  { label: "research projects", href: `${baseURL}/run/resprojects` },
  { label: "csse-feedback", href: `${baseURL}/run/csse-feedback` },
  { label: "csbreakdown", href: `${baseURL}/run/csbreakdown` },
  { label: "cssubmit", href: `${baseURL}/run/cssubmit` }
  // { label: "help forums", href: "/run/csmarks" }
];

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="w-full bg-primary-blue">
      <div className="h-18 flex items-center justify-between p-2">
        <Link
          to="/"
          className="ml-8 inline-block p-2 text-xl font-bold text-white transition-colors hover:text-gray-200"
        >
          cshome
        </Link>

        <div className="group relative flex cursor-pointer items-center text-white">
          <div className="mr-3 text-right text-xl">
            {user ? `${user.firstName} ${user.lastName}` : ""}
          </div>
          <IoMdMenu size={35} className="ml-2" />
          <div className="pointer-events-none absolute right-0 top-full z-10 cursor-default pt-4 opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
            <div className="w-48 rounded-md border bg-white text-black shadow-lg">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  target={link.href.startsWith("http") ? "_blank" : ""}
                  rel={
                    link.href.startsWith("http") ? "noopener noreferrer" : ""
                  }
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                >
                  {link.icon && <link.icon size={20} />}
                  {link.label}
                </Link>
              ))}
              {user && (
                <div
                  onClick={logout}
                  className="block cursor-pointer px-4 py-2 font-semibold text-red-500 hover:bg-gray-100"
                >
                  Log Out
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
