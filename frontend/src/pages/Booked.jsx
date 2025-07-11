// src/pages/Booked.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { facilityMapping, complexMapping } from './Mapping';

const Booked = () => {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get detailed user info from Redux (which should include email)
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('Access token not found. Please log in.');
        }

        // Pass the user email as a query parameter
        const response = await fetch(`http://localhost:8000/api/v1/facility_booking/bookings/list/?user_email=${encodeURIComponent(userInfo.email)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, 
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch booked slots. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched Booked Slots:', data);
        setBookedSlots(data.bookings || []);
      } catch (error) {
        console.error('Error fetching booked slots:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo && userInfo.email) {
      fetchBookedSlots();
    }
  }, [userInfo]);

  if (loading) return <p>Loading booked slots...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="booked-slots-container">
      <h2>Your Booked Slots</h2>
      {bookedSlots.length > 0 ? (
        <table className="booked-slots-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User Email</th>
              <th>Booking Date</th>
              <th>Booking Time</th>
              <th>Sports Complex</th>
              <th>Facility Type</th>
            </tr>
          </thead>
          <tbody>
            {bookedSlots.map((slot, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{slot.user_email}</td>
                <td>{slot.booking_date}</td>
                <td>{slot.booking_time}</td>
                <td>{complexMapping[slot.sports_complex] || 'Unknown Complex'}</td>
                <td>{facilityMapping[slot.facility_type] || 'Unknown Facility'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No booked slots available for your account.</p>
      )}
    </div>
  );
};

export default Booked;
