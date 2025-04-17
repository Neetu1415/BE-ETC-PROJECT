import React, { useState, useEffect } from 'react';
import { complexMapping, facilityMapping, groupMapping, typeMapping } from './Mapping.jsx';
import '../App.css';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(''); // Empty means all months

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error('No access token found');
        
        const response = await fetch('http://localhost:8000/api/v1/facility_booking/bookings/list/', {
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
        setBookings(data.bookings || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Filter bookings based on the selected month
  const filteredBookings = selectedMonth
    ? bookings.filter(slot => {
        const date = new Date(slot.booking_date);
        return date.getMonth() + 1 === parseInt(selectedMonth, 10);
      })
    : bookings;

  // Group the filtered bookings by stadium id
  const groupedBookings = filteredBookings.reduce((groups, booking) => {
    const stadiumId = booking.sports_complex;
    if (!groups[stadiumId]) {
      groups[stadiumId] = [];
    }
    groups[stadiumId].push(booking);
    return groups;
  }, {});

  // Function to generate CSV from a group of bookings
  const generateCSVForGroup = (stadiumBookings, stadiumId) => {
    const headers = ['User Email', 'Booking Date', 'Booking Time', 'Facility Type'];
    if (stadiumBookings.length === 0) {
      alert("No bookings found for the selected month.");
      return;
    }
    const rows = stadiumBookings.map(slot => [
      slot.user_email,
      slot.booking_date,
      slot.booking_time,
      facilityMapping[slot.facility_type] || slot.facility_type,
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `stadium_${stadiumId}_bookings.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="dashboard-container">
      <h1>Overall Admin Dashboard</h1>
      
      {/* Month Filter */}
      <div className="filter-container">
        <label htmlFor="month-select">Filter by Month: </label>
        <select 
          id="month-select" 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">All Months</option>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </div>
      
      {/* Display the grouped bookings */}
      {Object.keys(groupedBookings).length > 0 ? (
        Object.entries(groupedBookings).map(([stadiumId, stadiumBookings]) => (
          <div key={stadiumId} className="stadium-group">
            <h2>Stadium: {complexMapping[stadiumId] || stadiumId}</h2>
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
                    <td>{facilityMapping[slot.facility_type] || slot.facility_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button 
              className="generate-log-button"
              onClick={() => generateCSVForGroup(stadiumBookings, stadiumId)}
            >
              Generate Log
            </button>
          </div>
        ))
      ) : (
        <p>No bookings available for the selected month.</p>
      )}
    </div>
  );
};

export default AdminDashboard;



