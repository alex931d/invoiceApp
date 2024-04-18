import { Routes, Route } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import LandingPage from "./utilities/routes/nonAuth/landingPage/LandingPage";
import Nav from "./compunets/Nav/Nav";
import Dashboard from "./utilities/routes/auth/dashboard/Dashboard";
import LoginPage from "./utilities/routes/nonAuth/login/LoginPage";
import { APIContext } from "./contexts/mainContext";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { User, Project } from "./models/generalModels";
import InvoiceEdit from "./utilities/routes/auth/invoiceEdit/InvoiceEdit";
import { ToastContainer } from "react-toastify";
import { useDarkMode } from "./contexts/themeContext";
import "react-toastify/dist/ReactToastify.css";
import SignupPage from "./utilities/routes/nonAuth/signup/SignupPage";
import "./index.css";
import "./App.css";
import RequireAuth from "@auth-kit/react-router/RequireAuth";

function App() {
  const contextData = useContext(APIContext);
  const { serverData, dataLoaded } = contextData;
  const isAuthenticated = useIsAuthenticated();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { darkMode } = useDarkMode();

  const toggleDrawer = (): void => {
    setIsOpen(!isOpen);
  };
  const [project, setProject] = useState<Project>(serverData.data);
  const [profile, setProfile] = useState<User>(serverData.user);
  useEffect(() => {
    const fetchDataAndSetLinks = async () => {
      const { serverData } = contextData;
      if (contextData) {
        setProfile(serverData?.user || null);
        setProject(serverData?.data || null);
      }
    };
    fetchDataAndSetLinks();
  }, [contextData, dataLoaded, isAuthenticated, serverData]);
  return (
    <>
      <div data-theme={darkMode ? "dark" : "light"}>
        <Routes>
          {/* Protected routes */}

          <Route
            path="/dashboard"
            element={
              <RequireAuth fallbackPath="/login">
                <div className="main-container">
                  <div className="main-container-inner">
                    <main>
                      <div className="main-content">
                        <Dashboard
                          isOpen={isOpen}
                          toggleDrawer={toggleDrawer}
                          user={profile}
                          data={project}
                        />
                      </div>
                    </main>
                  </div>
                </div>
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/invoice/:id"
            element={
              <RequireAuth fallbackPath="/login">
                <div className="main-container">
                  <div className="main-container-inner">
                    <main>
                      <div className="main-content">
                        <InvoiceEdit
                          isOpen={isOpen}
                          toggleDrawer={toggleDrawer}
                          user={profile}
                          data={project}
                        />
                      </div>
                    </main>
                  </div>
                </div>
              </RequireAuth>
            }
          />

          {/*public routes */}
          <Route
            path="/"
            element={
              <div className="main-container">
                <div className="main-container-inner">
                  <header>
                    <Nav />
                  </header>
                  <main>
                    <div className="main-content">
                      <LandingPage />
                    </div>
                  </main>
                </div>
              </div>
            }
          />
          <Route
            path="/signup"
            element={
              <div className="main-container">
                <div className="main-container-inner">
                  <header></header>
                  <main>
                    <div className="main-content">
                      <SignupPage />
                    </div>
                  </main>
                </div>
              </div>
            }
          />
          <Route
            path="/login"
            element={
              <div className="main-container">
                <div className="main-container-inner">
                  <header></header>
                  <main>
                    <div className="main-content">
                      <LoginPage />
                    </div>
                  </main>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
      <ToastContainer limit={5} />
    </>
  );
}

export default App;
