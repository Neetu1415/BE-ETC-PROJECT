import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import '../App.css';
import { TextField, MenuItem, Button } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { getUserInfo } from "../features/auth/authSlice"; 
import { groupMapping, typeMapping, facilityMapping, complexMapping } from './Mapping';

// Helper: Refresh access token
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
  // State declarations
  const [bookings, setBookings] = useState([]);
  const [charges, setCharges] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  
  const [selectedComplex, setSelectedComplex] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [facilityRate, setFacilityRate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  
  const [uniqueComplexes, setUniqueComplexes] = useState([]);
  const [uniqueFacilities, setUniqueFacilities] = useState([]);
  const [uniqueGroups, setUniqueGroups] = useState([]);
  const [uniqueTypes, setUniqueTypes] = useState([]);
  
  const [errorInfo, setErrorInfo] = useState("");
  
  const dispatch = useDispatch();
  const { user, isAuthenticated, userInfo, token } = useSelector((state) => state.auth);
  const userEmail = user?.email || userInfo?.email || "Email not available";

  // Format date to YYYY-MM-DD (IST)
  const toISTDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Convert Date object to "HH:mm" string (assumed to be in local/IST time)
  const convertLocalToISTTime = (date) => {
    return date.toTimeString().slice(0, 5);
  };

  // Get a Date object with hours and minutes set (assumed IST)
  const getISTTimeInLocal = (baseDate, istHour, istMinute) => {
    const date = new Date(baseDate);
    date.setHours(istHour, istMinute, 0, 0);
    return date;
  };

  // --- Fetching Data on Component Mount ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch charges for dropdown options
        const chargesResponse = await fetch('http://localhost:8000/facility_booking/charges/');
        if (!chargesResponse.ok) throw new Error('Failed to fetch charges');
        const chargesData = await chargesResponse.json();
        setCharges(Array.isArray(chargesData) ? chargesData : []);
        
        // Refresh or get access token
        let accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          accessToken = await refreshAccessToken();
          if (!accessToken) return;
        }

        // Fetch bookings for availability checks
        const bookingsResponse = await fetch("http://localhost:8000/facility_booking/bookings/list/");
        if (!bookingsResponse.ok) throw new Error("Failed to fetch bookings");
        const bookingsData = await bookingsResponse.json();
        // Expecting an object with a key "bookings"
        const bookingsList = bookingsData.bookings ? bookingsData.bookings : [];
        setBookings(bookingsList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // --- Update Dropdown Options from Charges ---
  useEffect(() => {
    // Unique sports complexes
    const complexes = [...new Set(charges.map(charge => charge.sports_complex_name))];
    setUniqueComplexes(complexes);
  }, [charges]);

  useEffect(() => {
    if (selectedComplex) {
      // Filter facilities for the selected complex
      const facilities = [...new Set(
        charges
          .filter(charge => charge.sports_complex_name === selectedComplex)
          .map(charge => charge.facility_type)
      )];
      setUniqueFacilities(facilities);
      // Reset facility, group, and type selections
      setSelectedFacility('');
      setUniqueGroups([]);
      setUniqueTypes([]);
      setSelectedGroup('');
      setSelectedType('');
    } else {
      setUniqueFacilities([]);
      setUniqueGroups([]);
      setUniqueTypes([]);
    }
  }, [selectedComplex, charges]);

  useEffect(() => {
    if (selectedFacility) {
      // Filter groups for the selected facility and complex
      const groups = [...new Set(
        charges
          .filter(charge => 
            charge.sports_complex_name === selectedComplex &&
            charge.facility_type === selectedFacility
          )
          .map(charge => charge.group)
      )];
      setUniqueGroups(groups);
      setUniqueTypes([]);
      setSelectedGroup('');
      setSelectedType('');
    } else {
      setUniqueGroups([]);
      setUniqueTypes([]);
    }
  }, [selectedFacility, selectedComplex, charges]);

  useEffect(() => {
    if (selectedGroup) {
      // Filter types for the selected group, facility, and complex
      const types = [...new Set(
        charges
          .filter(charge =>
            charge.sports_complex_name === selectedComplex &&
            charge.facility_type === selectedFacility &&
            charge.group === selectedGroup
          )
          .map(charge => charge.type)
      )];
      setUniqueTypes(types);
      setSelectedType('');
    } else {
      setUniqueTypes([]);
    }
  }, [selectedGroup, selectedFacility, selectedComplex, charges]);

  // --- Update Facility Rate ---
  useEffect(() => {
    if (selectedType) {
      const charge = charges.find(charge =>
        charge.sports_complex_name === selectedComplex &&
        charge.facility_type === selectedFacility &&
        charge.group === selectedGroup &&
        charge.type === selectedType
      );
      setFacilityRate(charge?.rate || null);
    }
  }, [selectedType, selectedComplex, selectedFacility, selectedGroup, charges]);

  // --- Update Booked Slots Based on Selected Date, Facility, and Complex ---
  useEffect(() => {
    if (selectedFacility && selectedComplex && selectedDate) {
      const selectedDateStr = toISTDateString(selectedDate);
      const filteredBookings = bookings.filter(booking =>
        booking.facility_type === selectedFacility &&
        booking.sports_complex === selectedComplex &&
        booking.booking_date === selectedDateStr
      );
      const slots = filteredBookings
        .map(booking => booking.booking_time.slice(0, 5))
        .sort(); // Optional: sort the times
      setBookedSlots(slots);
    }
  }, [selectedFacility, selectedComplex, selectedDate, bookings]);

  // --- Time Picker: Disable Booked Times ---
  const shouldDisableTime = (time) => {
    if (!time) return false;
    const istTimeString = convertLocalToISTTime(time);
    return bookedSlots.some(slot => slot === istTimeString);
  };

  // --- Handle Booking Submission ---
  const handleBookingSubmit = async () => {
    if (!selectedDate || !selectedTime || !selectedFacility || !selectedGroup || !selectedType) {
      setErrorInfo("Please select all required fields.");
      return;
    }
    
    // Format date and time to the expected format
    const formatToLocalDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const formatToIST = (date) => {
      const options = { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        timeZone: 'Asia/Kolkata' 
      };
      return new Intl.DateTimeFormat('en-IN', options).format(date);
    };

    // Build booking details payload
    const bookingDetails = {
      booking_date: formatToLocalDate(selectedDate),
      booking_time: formatToIST(selectedTime),
      sports_complex_name: selectedComplex,
      facility_type: selectedFacility,
      group: selectedGroup,
      type: selectedType,
      rate: facilityRate,
      user_email: userEmail,
    };

    try {
      let accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        accessToken = await refreshAccessToken();
        if (!accessToken) return;
      }
  
      const response = await fetch('http://localhost:8000/facility_booking/bookings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(bookingDetails),
      });
  
      if (response.ok) {
        const result = await response.json();
        alert('Booking submitted successfully!');
        // Re-fetch bookings after submission to update availability
        const fetchBookings = async () => {
          let accessToken = localStorage.getItem('access_token');
          if (!accessToken) {
            accessToken = await refreshAccessToken();
            if (!accessToken) return;
          }
          const response = await fetch("http://localhost:8000/facility_booking/bookings/list/", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const data = await response.json();
          const bookingsList = data.bookings ? data.bookings : [];
          setBookings(bookingsList);
        };
        await fetchBookings();
        setErrorInfo("");
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

  // --- Render ---
  return (
    <div className="dropdown-container">
      <div className="title-container">
        <h2 className="title1">Facility Bookings</h2>
      </div>

      {/* Sports Complex Dropdown */}
      <TextField
        select
        label="Select Sports Complex"
        value={selectedComplex}
        onChange={(e) => setSelectedComplex(e.target.value)}
        fullWidth
        margin="normal"
      >
        <MenuItem value="">Select a Complex</MenuItem>
        {uniqueComplexes.map((complex, index) => (
          <MenuItem key={index} value={complex}>
            {complexMapping[complex] || complex}
          </MenuItem>
        ))}
      </TextField>

      {/* Facility Dropdown */}
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

      {/* Group Dropdown */}
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

      {/* Type Dropdown */}
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

      {/* Date Picker */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Select Date"
          value={selectedDate}
          onChange={setSelectedDate}
          minDate={new Date()}
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
            minTime={selectedDate ? getISTTimeInLocal(selectedDate, 9, 0) : null}
            maxTime={selectedDate ? getISTTimeInLocal(selectedDate, 18, 0) : null}
            views={['hours']}
            ampm={false}
            renderInput={(props) => <TextField {...props} fullWidth margin="normal" />}
            minutesStep={60}
          />
        </LocalizationProvider>
      )}

      {/* Display Facility Rate */}
      {selectedFacility && selectedGroup && selectedType && facilityRate !== null && (
        <div className="rate-display">
          <h3>
            Rate for {facilityMapping[selectedFacility]} ({groupMapping[selectedGroup]} - {typeMapping[selectedType]}):
            ₹{facilityRate}
          </h3>
        </div>
      )}

      {/* Display Error Information */}
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
















