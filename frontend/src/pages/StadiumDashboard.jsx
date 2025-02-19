import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const StadiumDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract the stadium code from the logged-in user's stadium data.
  // (Assuming that user.stadium.code is the short code that matches booking.sports_complex.)
  const stadiumCode = user && user.stadium ? user.stadium.code : null;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error('No access token found');
        if (!stadiumCode) throw new Error('Stadium admin has no assigned stadium');

        // Pass the stadiumCode as a query parameter to filter on the backend.
        const response = await fetch(`http://localhost:8000/facility_booking/bookings/list/?sports_complex=${stadiumCode}`, {
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

    if (stadiumCode) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [stadiumCode]);

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="dashboard-container">
      <h1>Stadium Dashboard</h1>
      <p>
        Bookings for {user && user.stadium ? user.stadium.name_display || user.stadium.name : "your stadium"}
      </p>
      {bookings.length > 0 ? (
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
            {bookings.map((slot, index) => (
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
