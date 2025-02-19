// pages/StadiumDashboard.jsx
import { useSelector } from "react-redux";

const StadiumDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="dashboard-container">
      <h1>Welcome, {user ? `${user.first_name} ${user.last_name}` : "Stadium Admin"}!</h1>
      <p>View and manage your stadium’s bookings here.</p>
    </div>
  );
};

export default StadiumDashboard;
