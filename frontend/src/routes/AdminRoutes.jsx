// src/routes/AdminRoutes.jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import AdminDashboard from "../pages/AdminDashboard";
import Alerts from "../pages/Alerts";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={['overall_admin']} />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="alerts" element={<Alerts />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
