import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import '../App.css';
import { TextField, MenuItem, Button } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { getUserInfo } from "../features/auth/authSlice"; 

// Helper function for refreshing access tokens
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    alert('No refresh token found. Please log in again.');
    return null;
  }

  try {
    const response = await fetch('http://localhost:8000/api/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('access_token', data.access);
      return data.access;
    } else {
      alert('Session expired. Please log in again.');
      return null;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    alert('An error occurred while refreshing the token.');
    return null;
  }
};


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
  const [facilityRate, setFacilityRate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const dispatch = useDispatch();
  const { user, isAuthenticated, userInfo, token } = useSelector((state) => state.auth);

  const userEmail = user?.email || userInfo?.email || "Email not available";

  // Fetch user info if not already loaded
  useEffect(() => {
    if (isAuthenticated && !userInfo?.email && token?.access) {
      dispatch(getUserInfo(token.access));
    }
  }, [isAuthenticated, userInfo, token, dispatch]);

  
  


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
    OO: 'open field outdoor',
  };

  // Fetch data with async/await
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:8000/facility_booking/charges/');
        if (!response.ok) throw new Error('Network response was not ok');
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
      const filtered = bookings.filter((booking) => booking.sports_complex_name === selectedComplex);
      setFilteredBookings(filtered);
      setUniqueFacilities([...new Set(filtered.map((booking) => booking.facility_type))]);
      setUniqueGroups([...new Set(filtered.map((booking) => booking.group))]);
      setUniqueTypes([...new Set(filtered.map((booking) => booking.type))]);
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
      const selectedBooking = filteredBookings.find(
        (booking) =>
          booking.facility_type === selectedFacility &&
          booking.group === selectedGroup &&
          booking.type === selectedType
      );
      setFacilityRate(selectedBooking?.rate || null);
    }
  }, [selectedFacility, selectedGroup, selectedType, filteredBookings]);

  // Handle booking submission
  const handleBookingSubmit = async () => {
    if (!selectedDate || !selectedTime || !selectedFacility || !selectedGroup || !selectedType) {
      alert("Please select all required fields.");
      return;
    }
    
    const formatToIST = (date) => {
      const options = { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' };
      return new Intl.DateTimeFormat('en-IN', options).format(date);
    };

    // Construct booking details to match the backend serializer expectations
    const bookingDetails = {
      booking_date: selectedDate.toISOString().split("T")[0],
      booking_time: formatToIST(selectedTime), // Send time in IST format
      sports_complex_name: selectedComplex, // Corrected to use the sports complex name
      facility_type: selectedFacility,
      group: selectedGroup,
      type: selectedType,
      rate: facilityRate,
      user_email: userEmail,
    };
  
    console.log('Booking details being sent:', bookingDetails);
  
    try {
      let accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        accessToken = await refreshAccessToken(); // Fetch a new token if not available
        if (!accessToken) return; // Stop if no valid token
      }
  
      const response = await fetch('http://localhost:8000/facility_booking/bookings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`, // Add authorization header
        },
        body: JSON.stringify(bookingDetails), // Send the payload
      });
  
      if (response.ok) {
        const result = await response.json();
        alert('Booking submitted successfully!');
        console.log('Booking response:', result);
      } else {
        const error = await response.json();
        console.error('Error submitting booking:', error);
        alert('Failed to submit booking. Check the input and try again.');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('An error occurred while submitting the booking.');
    }
  };
  
  

  return (
    <div className="dropdown-container">
      <div className="title-container">
        <h2 className="title1">Facility Bookings</h2>
      </div>

      {/* Dropdown for selecting sports complex */}
      <TextField
        select
        label="Select Sports Complex"
        value={selectedComplex}
        onChange={(e) => setSelectedComplex(e.target.value)}
        fullWidth
        margin="normal"
      >
        <MenuItem value="">Select a Complex</MenuItem>
        {bookings
          .map((booking) => booking.sports_complex_name)
          .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
          .map((complex, index) => (
            <MenuItem key={index} value={complex}>
              {complex}
            </MenuItem>
          ))}
      </TextField>

      {/* Dropdown for selecting a facility based on the selected complex */}
      {selectedComplex && (
        <TextField
          select
          label="Select Facility"
          value={selectedFacility}
          onChange={(e) => setSelectedFacility(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="">Select a Facility</MenuItem>
          {uniqueFacilities.length > 0 ? (
            uniqueFacilities.map((facility) => (
              <MenuItem key={facility} value={facility}>
                {facilityMapping[facility] || 'Unknown Facility'}
              </MenuItem>
            ))
          ) : (
            <MenuItem>No facilities available</MenuItem>
          )}
        </TextField>
      )}

      {/* Dropdown for selecting group */}
      {selectedComplex && (
        <TextField
          select
          label="Select Group"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="">Select a Group</MenuItem>
          {uniqueGroups.length > 0 ? (
            uniqueGroups.map((group) => (
              <MenuItem key={group} value={group}>
                {groupMapping[group] || 'Unknown Group'}
              </MenuItem>
            ))
          ) : (
            <MenuItem>No groups available</MenuItem>
          )}
        </TextField>
      )}

      {/* Dropdown for selecting type */}
      {selectedComplex && (
        <TextField
          select
          label="Select Type"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="">Select a Type</MenuItem>
          {uniqueTypes.length > 0 ? (
            uniqueTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {typeMapping[type] || 'Unknown Type'}
              </MenuItem>
            ))
          ) : (
            <MenuItem>No types available</MenuItem>
          )}
        </TextField>
      )}

      {/* Date Picker */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Select Date"
          value={selectedDate}
          onChange={setSelectedDate}
          minDate={new Date()} // Prevent past date selection
          renderInput={(props) => <TextField {...props} fullWidth margin="normal" />}
        />
      </LocalizationProvider>

      {/* Time Picker */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TimePicker
          label="Select Time"
          value={selectedTime}
          onChange={setSelectedTime}
          renderInput={(props) => <TextField {...props} fullWidth margin="normal" />}
        />
      </LocalizationProvider>

      {/* Display the rate for the selected facility */}
      {selectedFacility && selectedGroup && selectedType && facilityRate !== null && (
        <div className="rate-display">
          <h3>
            Rate for {facilityMapping[selectedFacility]} ({groupMapping[selectedGroup]} - {typeMapping[selectedType]}):
            ₹{facilityRate}
          </h3>
        </div>
      )}

      {/* Submit Booking Button */}
      <Button variant="contained" color="primary" onClick={handleBookingSubmit}>
        Submit Booking
      </Button>
    </div>
  );
};

export default FacilityBookings;

















