import { createHashRouter } from "react-router-dom";
import Error from "./pages/Error.tsx";
import ForumPage from "./pages/Forum.tsx";
import ForumsListPage from "./pages/ForumList.tsx";
import HomePage from "./pages/Home.tsx";
import LoginPage from "./pages/Login.tsx";
import MarksPage from "./pages/Marks.tsx";
import PostPage from "./pages/Post.tsx";
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
        path: "/forums",
        element: <ForumsListPage />
      },
      {
        path: "/forum/:forumId",
        element: <ForumPage />
      },
      {
        path: "/forum/:forumId/:postId",
        element: <PostPage />
      },
      {
        path: "/marks",
        element: <ProtectedRoute children={<MarksPage />} />
      }
    ]
  }
]);

export default router;
