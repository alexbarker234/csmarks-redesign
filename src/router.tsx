import { createHashRouter } from "react-router-dom";
import Error from "./pages/Error.tsx";
import HomePage from "./pages/Home.tsx";
import LoginPage from "./pages/Login.tsx";
import MarksPage from "./pages/marks.tsx";
import Root from "./pages/Root";
import ProtectedRoute from "./ProtectedRoute.tsx";

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: (
      <Root>
        <Error />
      </Root>
    ),
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "/login",
        element: <LoginPage />
      },
      {
        path: "/marks",
        element: (
          <ProtectedRoute>
            <MarksPage />
          </ProtectedRoute>
        )
      }
    ]
  }
]);

export default router;