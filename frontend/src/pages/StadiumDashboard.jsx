import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { complexMapping, facilityMapping, groupMapping, typeMapping } from './Mapping.jsx';
import '../App.css';

const StadiumDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract the stadium code from the logged-in user's stadium data.
  const stadiumCode = user && user.stadium ? user.stadium.code : null;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error('No access token found');
        if (!stadiumCode) throw new Error('Stadium admin has no assigned stadium');

        // Filter bookings by stadiumCode on the backend.
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

  // Function to generate CSV from bookings and trigger download
  const generateCSV = () => {
    // Define headers for CSV
    const headers = ['User Email', 'Booking Date', 'Booking Time', 'Facility Type'];
    // Map each booking slot into an array of values
    const rows = bookings.map(slot => [
      slot.user_email,
      slot.booking_date,
      slot.booking_time,
      facilityMapping[slot.facility_type] || slot.facility_type
    ]);
    
    // Combine headers and rows into a CSV string
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    
    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link to trigger the download
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "stadium_bookings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="dashboard-container">
      <h1>Stadium Dashboard</h1>
      <p>
        Bookings for {user && user.stadium ? user.stadium.name_display || user.stadium.name : "your stadium"}
      </p>
      {bookings.length > 0 ? (
        <>
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
              {bookings.map((slot, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{slot.user_email}</td>
                  <td>{slot.booking_date}</td>
                  <td>{slot.booking_time}</td>
                  <td>{facilityMapping[slot.facility_type] || slot.facility_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="generate-log-button" onClick={generateCSV}>
            Generate Log
          </button>
        </>
      ) : (
        <p>No bookings for your stadium.</p>
      )}
    </div>
  );
};

export default StadiumDashboard;
