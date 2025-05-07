// routes/CustomerRoutes.jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import Dashboard from "../pages/Dashboard";
import Booking from "../pages/Booking";
import Booked from "../pages/Booked";
import HomePage from "../pages/HomePage";

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="booking" element={<Booking />} />
        <Route path="booked" element={<Booked />} />
        <Route path="home" element={<HomePage />} />
      </Route>
    </Routes>
  );
};

export default CustomerRoutes;
