import React, { useState, useEffect } from 'react';
import '../App.css';

const FacilityBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedComplex, setSelectedComplex] = useState('');
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [uniqueFacilities, setUniqueFacilities] = useState([]);
  const [uniqueGroups, setUniqueGroups] = useState([]);
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [facilityRate, setFacilityRate] = useState(null); // To store the selected facility's rate

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

  const facilityMapping = {
    CT: 'cricket',
    OFCT: 'open field cricket',
    HT: 'hockey astro turf',
    A1: 'athletic track',
    A2: 'athletics',
    CN: 'conference hall and other rooms',
    S1: 'Swimming Pool',
    S2: 'learn to swim Classes',
    S3: 'learn to swim and life saving',
    S4: 'use of swimming pool only through booking',
    FT1: 'football play field',
    FT2: 'D.B Bandodkar Football Ground',
    GY: 'Gymnasium',
    GT: 'Gymnastics',
    IN: 'Indoor hall',
    BD: 'Badminton',
    INBD: 'indoor hall badminton',
    TT: 'Table Tennis',
    INTT: 'indoor hall table tennis',
    WT: 'weightlifting',
    INWT: 'indoor weight lifting',
    TK: 'Taekwondo',
    HB: 'handball',
    BB: 'basketball',
    CH: 'chess',
    JD: 'Judo',
    AC: 'archery',
    BX: 'boxing',
    RS: 'roller skating',
    OF: 'Open field(outdoor)',
    AA: 'all facilities',
    OO: 'open field outdoor'
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
        console.log("Fetched data:", data);  // Debug: Log fetched data
        setBookings(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchBookings();
  }, []);

  // Filter bookings based on selected sports complex and update unique values
  useEffect(() => {
    if (selectedComplex) {
      const filtered = bookings.filter(
        (booking) => booking.sports_complex_name === selectedComplex
      );
      console.log("Filtered bookings:", filtered);  // Debug: Log filtered bookings
      setFilteredBookings(filtered);

      // Get unique facilities, groups, and types
      const uniqueFacilities = [
        ...new Set(filtered.map((booking) => booking.facility_type)),
      ];
      setUniqueFacilities(uniqueFacilities);

      const uniqueGroups = [
        ...new Set(filtered.map((booking) => booking.group)),
      ];
      setUniqueGroups(uniqueGroups);

      const uniqueTypes = [
        ...new Set(filtered.map((booking) => booking.type)),
      ];
      setUniqueTypes(uniqueTypes);
    } else {
      setFilteredBookings([]);
      setUniqueFacilities([]);
      setUniqueGroups([]);
      setUniqueTypes([]);
    }
  }, [selectedComplex, bookings]);

  // Update rate when facility, group, or type is selected
  useEffect(() => {
    if (selectedFacility && selectedGroup && selectedType) {
      // Find the rate for the selected facility, group, and type combination
      const selectedBooking = filteredBookings.find(
        (booking) =>
          booking.facility_type === selectedFacility &&
          booking.group === selectedGroup &&
          booking.type === selectedType
      );
      console.log("Selected booking:", selectedBooking);  // Debug: Log selected booking
      const rate = selectedBooking ? selectedBooking.rate : null;
      setFacilityRate(rate); // Set rate for selected facility
      console.log("Facility Rate:", rate);  // Log the rate value to check if it's correct
    }
  }, [selectedFacility, selectedGroup, selectedType, filteredBookings]);
  

  return (
    <div className="dropdown-container">
      <div className="title-container">
        <h2 className="title">Facility Bookings</h2>
      </div>

      {/* Dropdown for selecting sports complex */}
      <label htmlFor="sportsComplex">Select Sports Complex:</label>
      <select
        id="sportsComplex"
        value={selectedComplex}
        onChange={(e) => setSelectedComplex(e.target.value)}
      >
        <option value="">Select a Complex</option>
        {bookings
          .map((booking) => booking.sports_complex_name)
          .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
          .map((complex, index) => (
            <option key={index} value={complex}>
              {complex}
            </option>
          ))}
      </select>

      {/* Dropdown for selecting a facility based on the selected complex */}
      {selectedComplex && (
        <div className="facilities-dropdown">
          <label htmlFor="facility">Select Facility:</label>
          <select
            id="facility"
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
          >
            <option value="">Select a Facility</option>
            {uniqueFacilities.length > 0 ? (
              uniqueFacilities.map((facility) => (
                <option key={facility} value={facility}>
                  {facilityMapping[facility] || 'Unknown Facility'}
                </option>
              ))
            ) : (
              <option>No facilities available</option>
            )}
          </select>
        </div>
      )}

      {/* Dropdown for selecting group */}
      {selectedComplex && (
        <div className="group-dropdown">
          <label htmlFor="group">Select Group:</label>
          <select
            id="group"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="">Select a Group</option>
            {uniqueGroups.length > 0 ? (
              uniqueGroups.map((group) => (
                <option key={group} value={group}>
                  {groupMapping[group] || 'Unknown Group'}
                </option>
              ))
            ) : (
              <option>No groups available</option>
            )}
          </select>
        </div>
      )}

      {/* Dropdown for selecting type */}
      {selectedComplex && (
        <div className="type-dropdown">
          <label htmlFor="type">Select Type:</label>
          <select
            id="type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Select a Type</option>
            {uniqueTypes.length > 0 ? (
              uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {typeMapping[type] || 'Unknown Type'}
                </option>
              ))
            ) : (
              <option>No types available</option>
            )}
          </select>
        </div>
      )}

      

      {/* Display the rate for the selected facility */}
      {selectedFacility && selectedGroup && selectedType && facilityRate !== null && (
        <div className="rate-display">
          <h3>
            Rate for {facilityMapping[selectedFacility]} ({groupMapping[selectedGroup]} - {typeMapping[selectedType]}):
            ₹{facilityRate}
          </h3>
        </div>
      )}
    </div>
  );
};


export default FacilityBookings;






















/*import React, { useState, useEffect } from 'react';
import '../App.css';

const FacilityBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedComplex, setSelectedComplex] = useState('');
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [uniqueFacilities, setUniqueFacilities] = useState([]);
  const [uniqueGroups, setUniqueGroups] = useState([]);
  const [uniqueTypes, setUniqueTypes] = useState([]);

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

  const facilityMapping = {
    CT: 'cricket',
    OFCT: 'open field cricket',
    HT: 'hockey astro turf',
    A1: 'athletic track',
    A2: 'athletics',
    CN: 'conference hall and other rooms',
    S1: 'Swimming Pool',
    S2: 'learn to swim Classes',
    S3: 'learn to swim and life saving',
    S4: 'use of swimming pool only through booking',
    FT1: 'football play field',
    FT2: 'D.B Bandodkar Football Ground',
    GY: 'Gymnasium',
    GT: 'Gymnastics',
    IN: 'Indoor hall',
    BD: 'Badminton',
    INBD: 'indoor hall badminton',
    TT: 'Table Tennis',
    INTT: 'indoor hall table tennis',
    WT: 'weightlifting',
    INWT: 'indoor weight lifting',
    TK: 'Taekwondo',
    HB: 'handball',
    BB: 'basketball',
    CH: 'chess',
    JD: 'Judo',
    AC: 'archery',
    BX: 'boxing',
    RS: 'roller skating',
    OF: 'Open field(outdoor)',
    AA: 'all facilities',
    OO: 'open field outdoor'
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

  // Filter bookings based on selected sports complex and update unique values
  useEffect(() => {
    if (selectedComplex) {
      const filtered = bookings.filter(
        (booking) => booking.sports_complex_name === selectedComplex
      );
      setFilteredBookings(filtered);

      // Get unique facilities based on the selected complex
      const uniqueFacilities = [
        ...new Set(filtered.map((booking) => booking.facility_type)),
      ];
      setUniqueFacilities(uniqueFacilities);

      // Get unique group values
      const uniqueGroups = [
        ...new Set(filtered.map((booking) => booking.group)),
      ];
      setUniqueGroups(uniqueGroups);

      // Get unique type values
      const uniqueTypes = [
        ...new Set(filtered.map((booking) => booking.type)),
      ];
      setUniqueTypes(uniqueTypes);
    } else {
      setFilteredBookings([]);
      setUniqueFacilities([]);
      setUniqueGroups([]);
      setUniqueTypes([]);
    }
  }, [selectedComplex, bookings]);

  return (
    <div className="dropdown-container">
      <div className="title-container">
        <h2 className="title">Facility Bookings</h2>
      </div>

     
      <label htmlFor="sportsComplex">Select Sports Complex:</label>
      <select
        id="sportsComplex"
        value={selectedComplex}
        onChange={(e) => setSelectedComplex(e.target.value)}
      >
        <option value="">Select a Complex</option>
        {bookings
          .map((booking) => booking.sports_complex_name)
          .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
          .map((complex, index) => (
            <option key={index} value={complex}>
              {complex}
            </option>
          ))}
      </select>

      
      {selectedComplex && (
        <div className="facilities-dropdown">
          <label htmlFor="facility">Select Facility:</label>
          <select id="facility">
            <option value="">Select a Facility</option>
            {uniqueFacilities.length > 0 ? (
              uniqueFacilities.map((facility) => (
                <option key={facility} value={facility}>
                  {facilityMapping[facility] || 'Unknown Facility'}
                </option>
              ))
            ) : (
              <option>No facilities available</option>
            )}
          </select>
        </div>
      )}

      {selectedComplex && (
        <div className="group-dropdown">
          <label htmlFor="group">Select Group:</label>
          <select id="group">
            <option value="">Select a Group</option>
            {uniqueGroups.length > 0 ? (
              uniqueGroups.map((group) => (
                <option key={group} value={group}>
                  {groupMapping[group] || 'Unknown Group'}
                </option>
              ))
            ) : (
              <option>No groups available</option>
            )}
          </select>
        </div>
      )}

    
      {selectedComplex && (
        <div className="type-dropdown">
          <label htmlFor="type">Select Type:</label>
          <select id="type">
            <option value="">Select a Type</option>
            {uniqueTypes.length > 0 ? (
              uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {typeMapping[type] || 'Unknown Type'}
                </option>
              ))
            ) : (
              <option>No types available</option>
            )}
          </select>
        </div>
      )}
    </div>
  );
};

export default FacilityBookings;*/














/*import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import calendar styles
import '../App.css';

const BookingPage = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [sportsComplexes, setSportsComplexes] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  const [selectedComplex, setSelectedComplex] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  const [bookedSlots, setBookedSlots] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  // Fetch Sports Complexes
  useEffect(() => {
    const fetchSportsComplexes = async () => {
      try {
        const response = await fetch('http://localhost:8000/sports_complex/');
        if (!response.ok) throw new Error('Failed to fetch sports complexes');
        const data = await response.json();
        setSportsComplexes(data);
      } catch (error) {
        console.error('Error fetching sports complexes:', error);
      }
    };

    fetchSportsComplexes();
  }, []);

  // Fetch Facilities when Sports Complex is selected
  useEffect(() => {
    if (selectedComplex) {
      const fetchFacilities = async () => {
        try {
          const response = await fetch(`http://localhost:8000/facilities/?complex_id=${selectedComplex}`);
          if (!response.ok) throw new Error('Failed to fetch facilities');
          const data = await response.json();
          setFacilities(data);
        } catch (error) {
          console.error('Error fetching facilities:', error);
        }
      };

      fetchFacilities();
    }
  }, [selectedComplex]);

  // Fetch Available Slots when Facility is selected
  useEffect(() => {
    if (selectedFacility) {
      const fetchAvailableSlots = async () => {
        try {
          const response = await fetch(`http://localhost:8000/available_slots/?facility_id=${selectedFacility}`);
          if (!response.ok) throw new Error('Failed to fetch available slots');
          const data = await response.json();
          setAvailableSlots(data);
        } catch (error) {
          console.error('Error fetching available slots:', error);
        }
      };

      fetchAvailableSlots();
    }
  }, [selectedFacility]);

  const handleSlotChange = (e) => {
    setSelectedSlot(e.target.value);
    setShowCalendar(true);
  };

  const handleCheckAvailability = async () => {
    try {
      const response = await fetch('http://localhost:8000/check_availability/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          time: selectedSlot,
          facility: selectedFacility,
        }),
      });
      const result = await response.json();
      if (result.available) {
        setShowPayment(true);
      } else {
        alert('Slot is unavailable');
      }
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  };

  const handlePayment = async () => {
    try {
      const response = await fetch('http://localhost:8000/book_slot/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: userInfo.id,
          sports_complex: selectedComplex,
          booking_date: selectedDate,
          booking_time: selectedSlot,
          facility: selectedFacility,
        }),
      });
      if (!response.ok) throw new Error('Booking failed');
      const booking = await response.json();
      setBookedSlots([...bookedSlots, booking]);
      setSelectedSlot('');
      setSelectedDate(null);
      setShowCalendar(false);
      setShowPayment(false);
    } catch (error) {
      console.error('Error making booking:', error);
    }
  };

  return (
    <div className="booking-container">
      <h1>Welcome, {userInfo?.first_name || 'User'}</h1>

      <div className="booking-selection">
      <h2>Select Sports Complex</h2>
       <select value={selectedComplex} onChange={(e) => setSelectedComplex(e.target.value)}>
           <option value="">Select Complex</option>
           {sportsComplexes.map((complex) => (
            <option key={complex.id} value={complex.id}>
              {complex.name}
            </option>
          ))}
        </select>

        {selectedComplex && (
          <>
            <h2>Select Facility</h2>
            <select value={selectedFacility} onChange={(e) => setSelectedFacility(e.target.value)}>
              <option value="">Select Facility</option>
              {facilities.map((facility) => (
                <option key={facility.id} value={facility.id}>
                  {facility.name}
                </option>
              ))}
            </select>
          </>
        )}

        {selectedFacility && (
          <>
            <h2>Select a Time Slot</h2>
            <select value={selectedSlot} onChange={handleSlotChange}>
              <option value="">Select Slot</option>
              {availableSlots.map((slot) => (
                <option key={slot.id} value={slot.time}>
                  {slot.time} - ${slot.price}
                </option>
              ))}
            </select>
          </>
        )}
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
          <p>Slot: {selectedSlot}</p>
          <p>Date: {selectedDate.toLocaleDateString()}</p>
          <button onClick={handleCheckAvailability}>Check Availability</button>
        </div>
      )}

      {showPayment && (
        <div className="payment-section">
          <h2>Payment</h2>
          <p>Confirm your payment for {selectedSlot} on {selectedDate.toLocaleDateString()}</p>
          <button onClick={handlePayment}>Pay Now</button>
        </div>
      )}

      <div className="booked-slots">
        <h2>Your Booked Slots</h2>
        {bookedSlots.length > 0 ? (
          <ul>
            {bookedSlots.map((slot, index) => (
              <li key={index}>
                {slot.booking_date} - {slot.booking_time} - {slot.facility}
              </li>
            ))}
          </ul>
        ) : (
          <p>No bookings yet.</p>
        )}
      </div>
    </div>
  );
};

export default BookingPage;






/*import React, { useState } from 'react';
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

export default Dashboard; */