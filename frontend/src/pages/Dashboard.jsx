

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

