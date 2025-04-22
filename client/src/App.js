import { useContext } from "react";
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";

import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import LearningPlanHome from "./pages/userLearningPlan/userlearninghome";
import MyLearningPlans from "./pages/userLearningPlan/mylearningplans";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";

import "./style.scss";
import OAuth2RedirectHandler from "./pages/oauth/OAuth2RedirectHandler";
import CreateLearningPlanPage from "./pages/learningplan/CreateLearningPlanPage";
import ViewLearningPlanPage from "./pages/learningplan/ViewLearningPlanPage";

function App() {
  const { currentUser } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);

  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div className={`theme-${darkMode ? "dark" : "light"}`}>
          <Navbar />
          <div style={{ display: "flex" }}>
            <LeftBar />
            <div style={{ flex: 6 }}>
              <Outlet />
            </div>
            <RightBar />
          </div>
        </div>
      </QueryClientProvider>
    );
  };

  // ✅ Only allow access if user is logged in (has valid token and info)
  const ProtectedRoute = ({ children }) => {
    if (!currentUser || !currentUser.token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
        {
          path: "/learning-plans",
          element: <LearningPlanHome />,
        },
        {
          path: "/mylearning-plans",
          element: <MyLearningPlans />,
        },
        {
          path: "/create-new-learning-plan",
          element: <CreateLearningPlanPage />,
        },
        {
          path: "/view-learning-plan/:id",
          element: <ViewLearningPlanPage />,
        },
      ],
    },
    {
      path: "/login",
      element: currentUser ? <Navigate to="/" replace /> : <Login />,
    },
    {
      path: "/register",
      element: currentUser ? <Navigate to="/" replace /> : <Register />,
    },
    {
      path: "/oauth2/redirect",
      element: <OAuth2RedirectHandler />,
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
