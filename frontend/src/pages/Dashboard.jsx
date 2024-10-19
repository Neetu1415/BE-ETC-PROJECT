import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);

  // Dummy data for available slots (replace with actual data from your backend)
  const availableSlots = [
    { id: 1, time: '9:00 AM' },
    { id: 2, time: '10:00 AM' },
    { id: 3, time: '11:00 AM' },
    { id: 4, time: '2:00 PM' },
    { id: 5, time: '3:00 PM' },
  ];

  const handleSlotChange = (e) => {
    setSelectedSlot(e.target.value);
  };

  const handleBookSlot = () => {
    if (selectedSlot) {
      const bookedSlot = availableSlots.find(slot => slot.id === parseInt(selectedSlot));
      setBookedSlots([...bookedSlots, bookedSlot]);
      setSelectedSlot('');
      // Here you would typically make an API call to book the slot
      console.log(`Booked slot: ${bookedSlot.time}`);
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome, {userInfo.first_name}</h1>
      
      <div className="booking-section">
        <h2>Book a Slot</h2>
        <select value={selectedSlot} onChange={handleSlotChange}>
          <option value="">Select a slot</option>
          {availableSlots.map((slot) => (
            <option key={slot.id} value={slot.id}>
              {slot.time}
            </option>
          ))}
        </select>
        <button onClick={handleBookSlot} className="btn btn-primary">Book Slot</button>
      </div>

      <div className="booked-slots">
        <h2>Your Booked Slots</h2>
        {bookedSlots.length > 0 ? (
          <ul>
            {bookedSlots.map((slot) => (
              <li key={slot.id}>{slot.time}</li>
            ))}
          </ul>
        ) : (
          <p>You haven't booked any slots yet.</p>
        )}
      </div>
    </div>
  );
};

  /*return (
    <div>
      <h1>Welcome, {userInfo.first_name}</h1>
      
      <div>
        <h2>Book a Slot</h2>
        <select value={selectedSlot} onChange={handleSlotChange}>
          <option value="">Select a slot</option>
          {availableSlots.map((slot) => (
            <option key={slot.id} value={slot.id}>
              {slot.time}
            </option>
          ))}
        </select>
        <button onClick={handleBookSlot}>Book Slot</button>
      </div>

      <div>
        <h2>Your Booked Slots</h2>
        {bookedSlots.length > 0 ? (
          <ul>
            {bookedSlots.map((slot) => (
              <li key={slot.id}>{slot.time}</li>
            ))}
          </ul>
        ) : (
          <p>You haven't booked any slots yet.</p>
        )}
      </div>
    </div>
  );
};
*/
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

/*import React from 'react'
import { useSelector } from 'react-redux'


const Dashboard = () => {

    const { userInfo } = useSelector((state) => state.auth)


    return (
        <div>
            <h1>Welcome, {userInfo.first_name} </h1>
        </div>
    )
}

export default Dashboard*/