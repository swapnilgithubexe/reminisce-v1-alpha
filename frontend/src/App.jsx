import { Routes, Route, Navigate } from "react-router";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import NotificationPage from "./pages/NotificationPage";
import CallPage from "./pages/CallPage";
import ChatPage from "./pages/ChatPage";
import OnBoardingPage from "./pages/OnBoardingPage";
import PageLoader from "./components/PageLoader";
import useAuthUser from "./hooks/useAuthUser";

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnBoard;

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-screen" data-theme="forest">
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <HomePage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <SignUpPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/notifications"
          element={
            isAuthenticated ? <NotificationPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/call"
          element={isAuthenticated ? <CallPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/chat"
          element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/onboarding"
          element={
            //! if auth is true, isOnBoarded will be checked, if not filled will thake user to on boarding form page else, home and if auth is false, try to login/register
            isAuthenticated ? (
              !isOnboarded ? (
                <OnBoardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
