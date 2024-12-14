import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import Signup from "./pages/Signup.tsx";
import Login from "./pages/Login.tsx";
import Layout from "./Layout.tsx";
import Profile from "./pages/Profile.tsx";
import ChangePassword from "./pages/ChangePassword.tsx";
import ChangeImage from "./pages/ChangeImage.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<App />} />
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path="profile">
              <Route index element={<Profile />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="change-image" element={<ChangeImage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);
