// pages/AdminDashboard.jsx
import { useSelector } from "react-redux";

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="dashboard-container">
      <h1>Welcome, {user ? `${user.first_name} ${user.last_name}` : "Overall Admin"}!</h1>
      <p>Monitor and manage system users and settings.</p>
    </div>
  );
};

export default AdminDashboard;
