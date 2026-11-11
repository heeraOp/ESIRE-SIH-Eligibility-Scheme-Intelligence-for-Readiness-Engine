import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landup from "./Pages/Landup";
import Auth from "./Pages/Auth";

import { LanguageProvider } from "./i18n/LanguageContext";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import DashboardLayout from "./Components/DashboardLayout";
import SchemeDashboard from "./Pages/Scheme-Dashboard";
import SchemeShow from "./Pages/SchemeShow";
import Profile from "./Components/Profile";
import Documents from "./Pages/Documents";
import MySchemes from "./Pages/MySchemes";
import Settings from "./Pages/Settings";
import Help from "./Pages/Help";

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landup />} />
            <Route path="/auth" element={<Auth />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<SchemeDashboard />} />
                <Route path="/dashboard/scheme/:id" element={<SchemeShow />} />
                <Route path="/dashboard/profile" element={<Profile />} />
                <Route path="/dashboard/documents" element={<Documents />} />
                <Route path="/dashboard/my-schemes" element={<MySchemes />} />
                <Route path="/dashboard/settings" element={<Settings />} />
                <Route path="/dashboard/help" element={<Help />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
