import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LoginForm } from "./components/auth/LoginForm";
import { Layout } from "./components/layout/Layout";
import { SidebarProvider } from "./components/ui/sidebar";
import { Toaster } from "./components/ui/toaster"; // Import Toaster langsung

// Dashboard Components
import { AdminDashboard } from "./components/dashboard/AdminDashboard";
import { DosenDashboard } from "./components/dashboard/DosenDashboard";
import { MahasiswaDashboard } from "./components/dashboard/MahasiswaDashboard";

// Management Pages
import { MahasiswaManagement } from "./components/pages/admin/MahasiswaManagement";
import { DosenManagement } from "./components/pages/admin/DosenManagement";
import { MataKuliahManagement } from "./components/pages/admin/MatakuliahManagement";
import { KelasManagement } from "./components/pages/admin/KelasManagement";
import { InputNilai } from "./components/pages/dosen/InputNilai";

import { KelasSaya } from "./components/pages/dosen/KelasSaya";
import { JadwalMengajar } from "./components/pages/dosen/JadwalMengajar";
import { ProfilDosen } from "./components/pages/dosen/ProfilDosen";

// Student Pages
import { KRSManagement } from "./components/pages/mahasiswa/KRSManagement";
import { KHS } from "./components/pages/mahasiswa/KHS";
import { Jadwal } from "./components/pages/mahasiswa/Jadwal";
import { Transkrip } from "./components/pages/mahasiswa/Transkrip";
import { Profil } from "./components/pages/mahasiswa/Profil";

// Admin Layout Component untuk nested routes
const AdminLayout: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/mahasiswa" element={<MahasiswaManagement />} />
        <Route path="/dosen" element={<DosenManagement />} />
        <Route path="/mata-kuliah" element={<MataKuliahManagement />} />
        <Route path="/kelas" element={<KelasManagement />} />
      </Routes>
    </Layout>
  );
};

// Dosen Layout Component
const DosenLayout: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DosenDashboard />} />
        <Route path="/kelas" element={<KelasSaya />} />
        <Route path="/jadwal" element={<JadwalMengajar />} />
        <Route path="/input-nilai" element={<InputNilai />} />
        <Route path="/profil" element={<ProfilDosen />} />
      </Routes>
    </Layout>
  );
};

// Mahasiswa Layout Component
const MahasiswaLayout: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<MahasiswaDashboard />} />
        <Route path="/krs" element={<KRSManagement />} />
        <Route path="/khs" element={<KHS />} />
        <Route path="/jadwal" element={<Jadwal />} />
        <Route path="/transkrip" element={<Transkrip />} />
        <Route path="/profil" element={<Profil />} />
      </Routes>
    </Layout>
  );
};

function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <SidebarProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              user ? <Navigate to={`/${user.role}`} replace /> : <LoginForm />
            }
          />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dosen/*"
            element={
              <ProtectedRoute requiredRole="dosen">
                <DosenLayout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mahasiswa/*"
            element={
              <ProtectedRoute requiredRole="mahasiswa">
                <MahasiswaLayout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to={`/${user?.role}`} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Router>
      {/* Tambahkan Toaster di root level */}
      <Toaster />
    </SidebarProvider>
  );
}

export default App;
