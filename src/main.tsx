import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import createStore from "react-auth-kit/createStore";
import AuthProvider from "react-auth-kit";
import { APIContextProvider } from "./contexts/mainContext.tsx";
import { DarkModeProvider } from "./contexts/themeContext.tsx";
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();
import "./index.css";
const store = createStore({
  authName: "jwt",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:",
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider store={store}>
          <APIContextProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </APIContextProvider>
        </AuthProvider>
      </QueryClientProvider>
    </DarkModeProvider>
  </React.StrictMode>
);
