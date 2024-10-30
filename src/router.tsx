import { createHashRouter } from "react-router-dom";
import Error from "./pages/Error.tsx";
import ForumPage from "./pages/Forums/Forum.tsx";
import ForumsListPage from "./pages/Forums/ForumList.tsx";
import PostPage from "./pages/Forums/Post.tsx";
import HomePage from "./pages/Home.tsx";
import LoginPage from "./pages/Login.tsx";
import MarkDetailsPage from "./pages/Marks/MarkDetails.tsx";
import MarksPage from "./pages/Marks/Marks.tsx";
import ProtectedRoute from "./pages/ProtectedRoute.tsx";
import Root from "./pages/Root";

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
        path: "/forums",
        element: <ForumsListPage />
      },
      {
        path: "/forums/:forumId",
        element: <ForumPage />
      },
      {
        path: "/forums/:forumId/:postId",
        element: <PostPage />
      },
      {
        path: "/marks",
        element: <ProtectedRoute children={<MarksPage />} />
      },
      {
        path: "/marks/:unitId",
        element: <ProtectedRoute children={<MarkDetailsPage />} />
      }
    ]
  }
]);

export default router;
