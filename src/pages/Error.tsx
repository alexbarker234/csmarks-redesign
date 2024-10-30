import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <div className="flex h-full flex-row items-center justify-center text-2xl">
          <div className="h-fit">Page not found</div>
        </div>
      );
    }
    if (error.status === 500) {
      return (
        <div className="flex h-full flex-row items-center justify-center text-2xl">
          <div className="h-fit">Internal error</div>
        </div>
      );
    }
  }

  return (
    <div className="flex h-full flex-row items-center justify-center text-2xl">
      <div className="h-fit">Internal error</div>
    </div>
  );
}
