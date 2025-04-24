
import React, { useState, useEffect } from 'react';
import '../App.css';
import { groupMapping, typeMapping, facilityMapping, complexMapping } from './Mapping';



const FacilityBookings = () => {
  const [bookings, setBookings] = useState([]);


  // Fetch data with async/await
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/facility_booking/charges/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className='table-container'>
      <div className='title-container'>
        <h2 className='title'>Facility List</h2>
      </div>

      {bookings.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <table className='facility-table'>
          <thead>
            <tr>
              <th>UID</th>
              <th>Sports Complex</th>
              <th>Facility Type</th>
              <th>Group</th>
              <th>Type</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
          {bookings.map((booking, idx) => (
             <tr key={booking.id ?? idx}>
              <td>{booking.uid}</td>
              <td>{complexMapping[booking.sports_complex_name] || 'Unknown sports complex'}</td>
              <td>{facilityMapping[booking.facility_type] || 'Unknown facility'}</td>
              <td>{groupMapping[booking.group] || 'Unknown Group'}</td>
              <td>{typeMapping[booking.type] || 'Unknown Type'}</td>
              <td>{booking.rate}</td>
            </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FacilityBookings;



/*
import React from 'react'
import { useSelector } from 'react-redux'


const Dashboard = () => {

    const { userInfo } = useSelector((state) => state.auth)


    return (
        <div>
            <h1>Welcome, {userInfo.email} </h1>
        </div>
    )
}

export default Dashboard
*/










