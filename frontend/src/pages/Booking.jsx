import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import '../App.css';
import { TextField, MenuItem, Button } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { getUserInfo } from "../features/auth/authSlice"; 
import { groupMapping, typeMapping, facilityMapping, complexMapping } from './Mapping';
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
  const [bookedSlots, setBookedSlots] = useState([]);
  const dispatch = useDispatch();
  const { user, isAuthenticated, userInfo, token } = useSelector((state) => state.auth);
  const [errorInfo, setErrorInfo] = useState(""); // State to hold error messages

  const userEmail = user?.email || userInfo?.email || "Email not available";

  // Fetch user info if not already loaded
  useEffect(() => {
    if (isAuthenticated && !userInfo?.email && token?.access) {
      dispatch(getUserInfo(token.access));
    }
  }, [isAuthenticated, userInfo, token, dispatch]);

  useEffect(() => {
    // Fetch all bookings initially
    const fetchBookings = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/facility_booking/bookings/list/"
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchBookings();
  }, []);
  
  useEffect(() => {
    // Filter booked slots for the selected facility and date
    const fetchBookedSlots = () => {
      if (selectedFacility && selectedDate) {
        const filteredSlots = bookings
          .filter(
            (booking) =>
              booking.facility === selectedFacility &&
              new Date(booking.date).toISOString().split("T")[0] ===
                selectedDate.toISOString().split("T")[0]
          )
          .map((booking) => new Date(booking.booking_time));
  
        setBookedSlots(filteredSlots);
      }
    };
    fetchBookedSlots();
  }, [selectedFacility, selectedDate, bookings]);
  
  // Disable times already booked
  const shouldDisableTime = (time) => {
    return bookedSlots.some(
      (bookedTime) =>
        bookedTime.getHours() === time.getHours() &&
        bookedTime.getMinutes() === time.getMinutes()
    );
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


  // Filter bookings based on selected sports complex
useEffect(() => {
  if (selectedComplex) {
    const filtered = bookings.filter((booking) => booking.sports_complex_name === selectedComplex);
    setFilteredBookings(filtered);
    setUniqueFacilities([...new Set(filtered.map((booking) => booking.facility_type))]);
    setUniqueGroups([]);
    setUniqueTypes([]);
    setSelectedFacility('');
    setSelectedGroup('');
    setSelectedType('');
  } else {
    setFilteredBookings([]);
    setUniqueFacilities([]);
    setUniqueGroups([]);
    setUniqueTypes([]);
  }
}, [selectedComplex, bookings]);

// Filter groups based on selected facility
useEffect(() => {
  if (selectedFacility) {
    const filtered = filteredBookings.filter((booking) => booking.facility_type === selectedFacility);
    setUniqueGroups([...new Set(filtered.map((booking) => booking.group))]);
    setUniqueTypes([]);
    setSelectedGroup('');
    setSelectedType('');
  } else {
    setUniqueGroups([]);
    setUniqueTypes([]);
  }
}, [selectedFacility, filteredBookings]);

// Filter types based on selected group
useEffect(() => {
  if (selectedGroup) {
    const filtered = filteredBookings.filter(
      (booking) =>
        booking.facility_type === selectedFacility && booking.group === selectedGroup
    );
    setUniqueTypes([...new Set(filtered.map((booking) => booking.type))]);
    setSelectedType('');
  } else {
    setUniqueTypes([]);
  }
}, [selectedGroup, selectedFacility, filteredBookings]);



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
      setErrorInfo("Please select all required fields.");
      return;
    }
    
    const formatToIST = (date) => {
      const options = { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' };
      return new Intl.DateTimeFormat('en-IN', options).format(date);
    };

    const formatToLocalDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Construct booking details to match the backend serializer expectations
    const bookingDetails = {
      booking_date: formatToLocalDate(selectedDate), 
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
        setErrorInfo(""); // Clear error information
      } else {
        const error = await response.json();
        console.error('Error submitting booking:', error);
        setErrorInfo(error);
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

      {/* sports complex dropdown */} 
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
              {complexMapping[complex] || complex}
            </MenuItem>
          ))}
      </TextField>

      {/* facility dropdown */}
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
          {uniqueFacilities.map((facility) => (
            <MenuItem key={facility} value={facility}>
              {facilityMapping[facility] || 'Unknown Facility'}
            </MenuItem>
          ))}
        </TextField>
      )}

        {/* group dropdown */}
      {selectedFacility && (
        <TextField
          select
          label="Select Group"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="">Select a Group</MenuItem>
          {uniqueGroups.map((group) => (
            <MenuItem key={group} value={group}>
              {groupMapping[group] || 'Unknown Group'}
            </MenuItem>
          ))}
        </TextField>
      )}

      {/* Type dropdown */}
      {selectedGroup && (
        <TextField
          select
          label="Select Type"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="">Select a Type</MenuItem>
          {uniqueTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {typeMapping[type] || 'Unknown Type'}
            </MenuItem>
          ))}
        </TextField>
      )}

      {/* Date Picker*/ }
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
      {selectedDate && selectedFacility && (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <TimePicker
            label="Select Time"
            value={selectedTime}
            onChange={setSelectedTime}
            shouldDisableTime={shouldDisableTime}
            renderInput={(props) => <TextField {...props} fullWidth margin="normal" />}
          />
        </LocalizationProvider>
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

      
      {errorInfo && (
        <div className="error-info" style={{ color: 'red', marginTop: '10px' }}>
          {errorInfo}
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















