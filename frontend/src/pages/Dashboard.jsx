import React, { useState, useEffect } from 'react';
import '../App.css';

const FacilityBookings = () => {
  const [bookings, setBookings] = useState([]);

  const groupMapping = {
    GAID: 'Govt Aided Educational Institution',
    EDINST: 'Educational Institutions',
    AGSCF: 'Association/Govt/Sports events/Clubs/Federations',
    OVNR: 'Other village clubs which are not registered to SAG',
    PSEV: 'Private Sporting events/Tariff for others',
    HP: 'Hourly Pass',
    STUD: 'Students',
    NSTUD: 'Non Students',
    CA: 'Recognized state Sports Association for conduct of Zonal Championship/Federation Cup/ National Championship/ International Championship or Government / Government aided primary/Secondary / Higher Secondary Schools for Sports Day',
    CB: 'SAG Registered Sports Club/State Sports Association - League Clubs/ NGOs having annual turnover of less than 3 Lakhs/ Other Educational Institutions for the conduct of any other sporting event (excluding those covered in Cat (A)',
    CC: 'Sporting event by private party/Organisations/other NGOs (not covered in cat B) or Educational events/Discours/Lectures for/by institutions registered under societies Registrations',
  };

  const typeMapping = {
    D: 'DAILY',
    M: 'MONTHLY',
    HP: 'HOURLY PASS',
    Q: 'QUARTERLY',
    Y: 'ANNUALLY',
    OR: 'ONE REGISTRATION',
    MEM: 'MEMBERSHIP RENEWAL',
  };

  // Fetch data with async/await
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:8000/facility_booking/charges/');
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
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.uid}</td>
                <td>{booking.sports_complex_name}</td>
                <td>{booking.facility_type}</td>
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
import React, { useState, useEffect } from 'react';
import '../App.css';

const FacilityBookings = () => {
  const [bookings, setBookings] = useState([]);


 const groupMapping ={
  GAID : 'Govt Aided Educational Institution',
  EDINST : 'Educational Institutions',
  AGSCF : 'Association/Govt/Sports events/Clubs/Federations',
  OVNR : 'Other village clubs which are not registered to SAG',
  PSEV : 'Private Sporting events/Tariff for others',
  HP : 'Hourly Pass',
  STUD : 'Students',
  NSTUD : 'Non Students',
  CA : 'Recognized state Sports Association for conduct of Zonal Championship/Federation Cup/ National Championship/ International Championship or Government / Government aided primary/Secondary / Higher Secondary Schools for Sports Day',
  CB : 'SAG Registered Sports Club/State Sports Association - League Clubs/ NGOs having annual turnover of less than 3 Lakhs/ Other Educational Institutions for the conduct of any other sporting event (excluding those covered in Cat (A)',
  CC : 'Sporting event by private party/Organisations/other NGOs (not covered in cat B) or Educational events/Discours/Lectures for/by institutions registered under societies Registrations'

 };

 const typeMapping = {
    D : 'DAILY', 
    M : 'MONTHLY', 
    HP : 'HOURLY PASS', 
    Q : 'QUARTERLY', 
    Y : 'ANNUALLY', 
    OR : 'ONE REGISTRATION', 
    MEM : 'MEMBERSHIP RENEWAL', 
};
  // Fetch data with async/await
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:8000/facility_booking/charges/');
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
      <div className='title-container'><h2 className='title'>Facility List</h2></div>
      
      {bookings.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <table className='facility-table'>
          <thead>
            <tr>
              <th>Sports Complex</th>
              <th>Group</th>
              <th>Type</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.sports_complex}</td>
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


/*import React, { useState, useEffect } from 'react';
import '../App.css'; 

const FacilityBookings = () => {
  const [bookings, setBookings] = useState([]);

  // Fetch data with async/await
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:8000/facility_booking/charges/');
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
    <div className='table-containter'>
      <h2>Facility Bookings</h2>
      {bookings.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Sports Complex</th>
              <th>Group</th>
              <th>Type</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={`${booking.sports_complex}-${booking.group}-${booking.type}-${booking.rate}-${index}`}>
                <td>{booking.sports_complex}</td>
                <td>{booking.group}</td>
                <td>{booking.type}</td>
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

/*import React, { useState, useEffect } from 'react';

const FacilityBookings = () => {
  const [bookings, setBookings] = useState([]);

  // Fetch data with async/await
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:8000/facility_booking/charges/');
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
    <div>
      <h2>Facility Bookings</h2>
      <table>
        <thead>
          <tr>
            <th>Sports Complex</th>
            <th>Group</th>
            <th>Type</th>
            <th>Rate</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={`${booking.sports_complex}-${booking.group}-${booking.type}-${booking.rate}-${index}`}>
              <td>{booking.sports_complex}</td>
              <td>{booking.group}</td>
              <td>{booking.type}</td>
              <td>{booking.rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FacilityBookings;
*/
/*import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FacilityBookings = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/facility_booking/charges/')
            .then(response => {
                setBookings(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the data!", error);
            });
    }, []);

    return (
        <div>
            <h2>Facility Bookings</h2>
            <table>
                <thead>
                    <tr>
                        <th>Sports Complex</th>
                        <th>Group</th>
                        <th>Type</th>
                        <th>Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => (
                        <tr>
                            <td>{booking.sports_complex}</td>
                            <td>{booking.group}</td>
                            <td>{booking.type}</td>
                            <td>{booking.rate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FacilityBookings;
*/

/*import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]); // Dynamic slots
  const [showCalendar, setShowCalendar] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  // Fetch available slots from the backend
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/facility_booking/charges/');
        if (!response.ok) {
          throw new Error('Failed to fetch slots');
        }
        const data = await response.json();
        setAvailableSlots(data); // Update state with slots
      } catch (error) {
        console.error('Error fetching slots:', error);
      }
    };

    fetchAvailableSlots();
  }, []);

  const handleSlotChange = (e) => {
    setSelectedSlot(e.target.value);
    setShowCalendar(true);
  };

  const handleBookSlot = () => {
    if (selectedDate) {
      setShowPayment(true);
    }
  };

  const handlePayment = () => {
    const bookedSlot = availableSlots.find(slot => slot.id === parseInt(selectedSlot));
    const newBooking = {
      ...bookedSlot,
      date: selectedDate.toLocaleDateString(),
    };
    setBookedSlots([...bookedSlots, newBooking]);
    setSelectedSlot('');
    setSelectedDate(null);
    setShowCalendar(false);
    setShowPayment(false);
    console.log(`Booked slot: ${bookedSlot.time} on ${newBooking.date}`);

  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome, {userInfo?.first_name || 'User'}</h1>

      <div className="intro-section">
        <p>Welcome to our sports facility! Select a time slot to book your session, then choose a date to finalize your booking.</p>
      </div>

      <div className="booking-section">
        <h2>Book a Time Slot</h2>
        <select value={selectedSlot} onChange={handleSlotChange} className="slot-select">
          <option value="">Select a slot</option>
          {availableSlots.map((slot) => (
            <option key={slot.id} value={slot.id}>
              {slot.time} - ${slot.price}
            </option>
          ))}
        </select>
      </div>

      {showCalendar && (
        <div className="calendar-section">
          <h2>Select a Date</h2>
          <Calendar onChange={setSelectedDate} value={selectedDate} />
        </div>
      )}

      {selectedDate && (
        <div className="confirm-section">
          <h2>Confirm Booking</h2>
          <div className="booking-summary">
            <p>Selected Slot: {availableSlots.find(slot => slot.id === parseInt(selectedSlot))?.time}</p>
            <p>Selected Date: {selectedDate.toLocaleDateString()}</p>
          </div>
          <button onClick={handleBookSlot} className="btn btn-primary">Confirm Slot</button>
        </div>
      )}

      {showPayment && (
        <div className="payment-section">
          <h2>Make Payment</h2>
          <p>
            Time Slot: {availableSlots.find(slot => slot.id === parseInt(selectedSlot)).time} <br />
            Date: {selectedDate.toLocaleDateString()} <br />
            Price: ${availableSlots.find(slot => slot.id === parseInt(selectedSlot)).price}
          </p>
          <button onClick={handlePayment} className="btn btn-primary">Pay Now</button>
        </div>
      )}

      <div className="booked-slots">
        <h2>Your Booked Slots</h2>
        {bookedSlots.length > 0 ? (
          <ul>
            {bookedSlots.map((slot, index) => (
              <li key={index}>
                {slot.date} - {slot.time} - ${slot.price}
              </li>
            ))}
          </ul>
        ) : (
          <p>No bookings yet. Select a time slot and date to get started!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;  
*/

/*
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import calendar styles

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const availableSlots = [
    { id: 1, time: '9:00 AM', price: 50 },
    { id: 2, time: '10:00 AM', price: 50 },
    { id: 3, time: '11:00 AM', price: 50 },
    { id: 4, time: '2:00 PM', price: 50 },
    { id: 5, time: '3:00 PM', price: 50 },
  ];

  const handleSlotChange = (e) => {
    setSelectedSlot(e.target.value);
    setShowCalendar(true);
  };

  const handleBookSlot = () => {
    if (selectedDate) {
      setShowPayment(true);
    }
  };

  const handlePayment = () => {
    const bookedSlot = availableSlots.find(slot => slot.id === parseInt(selectedSlot));
    const newBooking = {
      ...bookedSlot,
      date: selectedDate.toLocaleDateString(),
    };
    setBookedSlots([...bookedSlots, newBooking]);
    setSelectedSlot('');
    setSelectedDate(null);
    setShowCalendar(false);
    setShowPayment(false);
    console.log(`Booked slot: ${bookedSlot.time} on ${newBooking.date}`);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome, {userInfo?.first_name || 'User'}</h1>

      <div className="intro-section">
        <p>Welcome to our sports facility! Select a time slot to book your session, then choose a date to finalize your booking.</p>
      </div>

      <div className="booking-section">
        <h2>Book a Time Slot</h2>
        <select value={selectedSlot} onChange={handleSlotChange} className="slot-select">
          <option value="">Select a slot</option>
          {availableSlots.map((slot) => (
            <option key={slot.id} value={slot.id}>
              {slot.time} - ${slot.price}
            </option>
          ))}
        </select>
      </div>

      {showCalendar && (
        <div className="calendar-section">
          <h2>Select a Date    </h2>
          <Calendar onChange={setSelectedDate} value={selectedDate} />
        </div>
      )}

      {selectedDate && (
        <div className="confirm-section">
          <h2>Confirm Booking</h2>
          <div className="booking-summary">
            <p>Selected Slot: {availableSlots.find(slot => slot.id === parseInt(selectedSlot))?.time}</p>
            <p>Selected Date: {selectedDate.toLocaleDateString()}</p>
          </div>
          <button onClick={handleBookSlot} className="btn btn-primary">Confirm Slot</button>
        </div>
      )}

      {showPayment && (
        <div className="payment-section">
          <h2>Make Payment</h2>
          <p>
            Time Slot: {availableSlots.find(slot => slot.id === parseInt(selectedSlot)).time} <br />
            Date: {selectedDate.toLocaleDateString()} <br />
            Price: ${availableSlots.find(slot => slot.id === parseInt(selectedSlot)).price}
          </p>
          <button onClick={handlePayment} className="btn btn-primary">Pay Now</button>
        </div>
      )}

      <div className="booked-slots">
        <h2>Your Booked Slots</h2>
        {bookedSlots.length > 0 ? (
          <ul>
            {bookedSlots.map((slot, index) => (
              <li key={index}>
                {slot.date} - {slot.time} - ${slot.price}
              </li>
            ))}
          </ul>
        ) : (
          <p>No bookings yet. Select a time slot and date to get started!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
*/




/*To integrate this with your backend:

Replace the availableSlots array with data fetched from your backend API.
In the handleBookSlot function, make an API call to your backend to actually book the slot.
Fetch the user's booked slots from your backend when the component mounts and update the bookedSlots state.
You might want to use useEffect to fetch data when the component mounts:
import React, { useState, useEffect } from 'react';
// ... other imports

const Dashboard = () => {
  // ... other state and constants

  useEffect(() => {
    // Fetch available slots
    // Fetch user's booked slots
    // Update state with fetched data
  }, []);

  // ... rest of the component
};*/

