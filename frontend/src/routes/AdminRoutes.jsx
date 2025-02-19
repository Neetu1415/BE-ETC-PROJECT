// routes/AdminRoutes.jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import AdminDashboard from "../pages/AdminDashboard";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={['overall_admin']} />}>
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
