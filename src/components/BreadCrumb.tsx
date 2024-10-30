import { RiArrowDropRightLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";

export default function BreadCrumb() {
  const location = useLocation();

  const pathSegments = location.pathname.split("/").filter(Boolean);

  let crumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    return { href, label };
  });

  crumbs = [{ href: "/", label: "Home" }, ...crumbs];

  return (
    <nav aria-label="breadcrumb" className="mb-2">
      <ol className="flex text-sm">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={index} className="flex items-center">
              {!isLast ? (
                <Link
                  to={crumb.href}
                  className="text-primary-blue hover:underline"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-400">{crumb.label}</span>
              )}
              {!isLast && (
                <span className="text-gray-400">
                  <RiArrowDropRightLine size={25} />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
