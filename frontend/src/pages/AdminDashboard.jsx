import React, { useState, useEffect } from 'react';
import { complexMapping, facilityMapping, groupMapping, typeMapping } from './Mapping.jsx';
import '../App.css';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error('No access token found');
        
        const response = await fetch('http://localhost:8000/facility_booking/bookings/list/', {
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
        console.log('Fetched All Bookings:', data);
        setBookings(data.bookings || []); // Adjust based on your API's structure
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p>Error: {error}</p>;

  // Group bookings by stadium id
  const groupedBookings = bookings.reduce((groups, booking) => {
    const stadiumId = booking.sports_complex;
    if (!groups[stadiumId]) {
      groups[stadiumId] = [];
    }
    groups[stadiumId].push(booking);
    return groups;
  }, {});

  return (
    <div className="dashboard-container">
      <h1>Overall Admin Dashboard</h1>
      {Object.keys(groupedBookings).length > 0 ? (
        Object.entries(groupedBookings).map(([stadiumId, stadiumBookings]) => (
          <div key={stadiumId} className="stadium-group">
            <h2>Stadium: {complexMapping[stadiumId] || stadiumId}</h2>
            {/* You may want to replace stadiumId with a proper display name by mapping it using complexMapping */}
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>USER EMAIL</th>
                  <th>BOOKING DATE</th>
                  <th>BOOKING TIME</th>
                  <th>FACILITY TYPE</th>
                </tr>
              </thead>
              <tbody>
                {stadiumBookings.map((slot, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{slot.user_email}</td>
                    <td>{slot.booking_date}</td>
                    <td>{slot.booking_time}</td>
                    <td>{facilityMapping[slot.facility_type] || slot.facility_typ}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p>No bookings available.</p>
      )}
    </div>
  );
};

export default AdminDashboard;
