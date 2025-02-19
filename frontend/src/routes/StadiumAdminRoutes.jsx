// routes/StadiumAdminRoutes.jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import StadiumDashboard from "../pages/StadiumDashboard";

const StadiumAdminRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={['stadium_admin']} />}>
        <Route path="dashboard" element={<StadiumDashboard />} />
      </Route>
    </Routes>
  );
};

export default StadiumAdminRoutes;
