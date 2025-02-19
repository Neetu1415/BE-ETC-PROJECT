import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const StadiumDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract the stadium id from the logged-in user's data
  const stadiumId = user && user.stadium ? user.stadium.id : null;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error('No access token found');
        if (!stadiumId) throw new Error('Stadium admin has no assigned stadium');

        // Adjust the endpoint if your API supports filtering by stadium id.
        // If not, we fetch all and then filter.
        const response = await fetch(`http://localhost:8000/facility_booking/bookings/list/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch bookings. Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched Bookings:', data);
        setBookings(data.bookings || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [stadiumId]);

  // Debug: log stadiumId and each booking's sports_complex value
  useEffect(() => {
    console.log("Admin's stadium ID:", stadiumId);
    bookings.forEach(booking => {
      console.log("Booking:", booking, "sports_complex type:", typeof booking.sports_complex);
    });
  }, [stadiumId, bookings]);

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p>Error: {error}</p>;

  // Filter bookings using a combined approach:
  const filteredBookings = stadiumId
    ? bookings.filter(booking => {
        if (booking.sports_complex && typeof booking.sports_complex === "object") {
          return Number(booking.sports_complex.id) === Number(stadiumId);
        }
        return Number(booking.sports_complex) === Number(stadiumId);
      })
    : [];

  return (
    <div className="dashboard-container">
      <h1>Stadium Dashboard</h1>
      <p>
        Bookings for {user && user.stadium ? (user.stadium.name_display || user.stadium.name) : "your stadium"}
      </p>
      {filteredBookings.length > 0 ? (
        <table className="bookings-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User Email</th>
              <th>Booking Date</th>
              <th>Booking Time</th>
              <th>Facility Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((slot, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{slot.user_email}</td>
                <td>{slot.booking_date}</td>
                <td>{slot.booking_time}</td>
                <td>{slot.facility_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No bookings for your stadium.</p>
      )}
    </div>
  );
};

export default StadiumDashboard;
