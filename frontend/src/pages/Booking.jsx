import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import '../App.css';
import { TextField, MenuItem, Button, Typography } from '@mui/material';
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
  // ---------------------- State Declarations ----------------------
  const [charges, setCharges] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]); // Booked start times in "HH:mm" format

  // Selections for dropdowns (complex, facility, group, type)
  const [selectedComplex, setSelectedComplex] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [facilityRate, setFacilityRate] = useState(null);
  
  // Date and time states
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null); // Start time
  const [selectedEndTime, setSelectedEndTime] = useState(null); // Computed end time
  const [fullyBookedDates, setFullyBookedDates] = useState([]);
  const [errorInfo, setErrorInfo] = useState("");

  // Unique dropdown options
  const [uniqueComplexes, setUniqueComplexes] = useState([]);
  const [uniqueFacilities, setUniqueFacilities] = useState([]);
  const [uniqueGroups, setUniqueGroups] = useState([]);
  const [uniqueTypes, setUniqueTypes] = useState([]);
  
  const dispatch = useDispatch();
  const { user, isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const userEmail = user?.email || userInfo?.email || "Email not available";

  // ---------------------- Helper Functions ----------------------
  const toISTDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const convertLocalToISTTime = (date) => date.toTimeString().slice(0, 5);

  const getISTTimeInLocal = (baseDate, hour, minute) => {
    const date = new Date(baseDate);
    date.setHours(hour, minute, 0, 0);
    return date;
  };

  // ---------------------- Fetch Charges on Mount ----------------------
  useEffect(() => {
    const fetchCharges = async () => {
      try {
        const res = await fetch('http://localhost:8000/facility_booking/charges/');
        if (!res.ok) throw new Error('Failed to fetch charges');
        const data = await res.json();
        setCharges(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching charges:", err);
      }
    };
    fetchCharges();
  }, []);

  // ---------------------- Update Dropdown Options ----------------------
  useEffect(() => {
    const complexes = [...new Set(charges.map(charge => charge.sports_complex_name))];
    setUniqueComplexes(complexes);
  }, [charges]);

  useEffect(() => {
    if (selectedComplex) {
      const facilities = [...new Set(
        charges.filter(charge => charge.sports_complex_name === selectedComplex)
               .map(charge => charge.facility_type)
      )];
      setUniqueFacilities(facilities);
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
      const groups = [...new Set(
        charges.filter(charge =>
          charge.sports_complex_name === selectedComplex &&
          charge.facility_type === selectedFacility
        ).map(charge => charge.group)
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
      const types = [...new Set(
        charges.filter(charge =>
          charge.sports_complex_name === selectedComplex &&
          charge.facility_type === selectedFacility &&
          charge.group === selectedGroup
        ).map(charge => charge.type)
      )];
      setUniqueTypes(types);
      setSelectedType('');
    } else {
      setUniqueTypes([]);
    }
  }, [selectedGroup, selectedFacility, selectedComplex, charges]);

  // ---------------------- Update Facility Rate ----------------------
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

  // ---------------------- Fetch Bookings from Backend ----------------------
  useEffect(() => {
    const fetchFilteredBookings = async () => {
      if (selectedFacility && selectedComplex && selectedDate) {
        const dateStr = toISTDateString(selectedDate);
        const params = new URLSearchParams({
          facility_type: selectedFacility,
          sports_complex: selectedComplex,
          booking_date: dateStr,
        });
        try {
          let accessToken = localStorage.getItem('access_token');
          if (!accessToken) {
            accessToken = await refreshAccessToken();
            if (!accessToken) return;
          }
          const res = await fetch(`http://localhost:8000/facility_booking/bookings/list/?${params.toString()}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (!res.ok) throw new Error("Failed to fetch filtered bookings");
          const data = await res.json();
          const slots = (data.bookings || [])
            .map(booking => booking.booking_time.slice(0, 5))
            .sort();
          setBookedSlots(slots);
        } catch (err) {
          console.error("Error fetching filtered bookings:", err);
        }
      }
    };
    fetchFilteredBookings();
  }, [selectedFacility, selectedComplex, selectedDate]);

  // ---------------------- Fetch Fully Booked Dates for FD ----------------------
  useEffect(() => {
    const fetchFullyBookedDates = async () => {
      if (["FD"].includes(selectedType) && selectedFacility && selectedComplex) {
        const params = new URLSearchParams({
          facility_type: selectedFacility,
          sports_complex: selectedComplex,
        });
        try {
          let accessToken = localStorage.getItem('access_token');
          if (!accessToken) {
            accessToken = await refreshAccessToken();
            if (!accessToken) return;
          }
          const res = await fetch(`http://localhost:8000/facility_booking/bookings/fully-booked/?${params.toString()}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (!res.ok) throw new Error("Failed to fetch fully booked dates");
          const data = await res.json();
          setFullyBookedDates(data.fullyBookedDates || []);
        } catch (err) {
          console.error("Error fetching fully booked dates:", err);
        }
      } else {
        setFullyBookedDates([]);
      }
    };
    fetchFullyBookedDates();
  }, [selectedType, selectedFacility, selectedComplex]);
  
  // ---------------------- Handle Booking Duration Based on Type ----------------------
  useEffect(() => {
    if (!selectedDate) return;
    if (selectedType === "FD") {
      setSelectedTime(getISTTimeInLocal(selectedDate, 9, 0));
      setSelectedEndTime(getISTTimeInLocal(selectedDate, 18, 0));
    } else if (selectedType === "HD") {
      if (selectedTime) {
        const startStr = convertLocalToISTTime(selectedTime);
        if (startStr === "09:00") {
          setSelectedEndTime(getISTTimeInLocal(selectedDate, 13, 0));
        } else if (startStr === "14:00") {
          setSelectedEndTime(getISTTimeInLocal(selectedDate, 18, 0));
        } else {
          setErrorInfo("For Half Day bookings, please select either 09:00 or 14:00 as start time.");
          setSelectedTime(null);
          setSelectedEndTime(null);
        }
      }
    } else {
      if (selectedTime) {
        setSelectedEndTime(new Date(selectedTime.getTime() + 60 * 60 * 1000));
      }
    }
  }, [selectedType, selectedDate, selectedTime]);

  // ---------------------- Disable Already Booked Times ----------------------
  const shouldDisableTime = (time) => {
    if (!time) return false;
    const istTimeString = convertLocalToISTTime(time);
    const count = bookedSlots.filter(slot => slot === istTimeString).length;
    return count >= 2;
  };
  
  // ---------------------- Render Time Pickers ----------------------
  const renderTimePickers = () => {
    if (!selectedDate || !selectedFacility) return null;
    if (selectedType === "FD") {
      return (
        <Typography variant="body1" style={{ margin: '16px 0' }}>
          Full Day Booking: 09:00 - 18:00
        </Typography>
      );
    } else if (selectedType === "HD") {
      return (
        <>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              label="Select Start Time (HD: 09:00 or 14:00)"
              value={selectedTime}
              onChange={(newTime) => setSelectedTime(newTime)}
              shouldDisableTime={(time, view) => {
                if (view === "hours") {
                  const hour = new Date(time).getHours();
                  if (hour !== 9 && hour !== 14) return true;
                  const candidate = hour === 9 ? "09:00" : "14:00";
                  return bookedSlots.includes(candidate);
                }
                if (view === "minutes") {
                  return new Date(time).getMinutes() !== 0;
                }
                return false;
              }}
              minTime={getISTTimeInLocal(selectedDate, 9, 0)}
              maxTime={getISTTimeInLocal(selectedDate, 18, 0)}
              views={['hours', 'minutes']}
              ampm={false}
              renderInput={(props) => <TextField {...props} fullWidth margin="normal" />}
              minutesStep={60}
            />
          </LocalizationProvider>
          {selectedTime && selectedEndTime && (
            <Typography variant="body2">
              Computed End Time: {convertLocalToISTTime(selectedEndTime)}
            </Typography>
          )}
        </>
      );
    } else {
      return (
        <>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              label="Select Start Time"
              value={selectedTime}
              onChange={(newTime) => setSelectedTime(newTime)}
              shouldDisableTime={shouldDisableTime}
              minTime={getISTTimeInLocal(selectedDate, 9, 0)}
              maxTime={getISTTimeInLocal(selectedDate, 18, 0)}
              views={['hours', 'minutes']}
              ampm={false}
              renderInput={(props) => <TextField {...props} fullWidth margin="normal" />}
              minutesStep={60}
            />
          </LocalizationProvider>
          {selectedTime && selectedEndTime && (
            <Typography variant="body2">
              Computed End Time (1-hour duration): {convertLocalToISTTime(selectedEndTime)}
            </Typography>
          )}
          {(["M", "Q", "Y"].includes(selectedType)) && selectedDate && (
            <Typography variant="body2" style={{ marginTop: '8px' }}>
              {selectedType === "M" && `Monthly booking: This slot will be booked for 30 days from ${toISTDateString(selectedDate)}.`}
              {selectedType === "Q" && `Quarterly booking: This slot will be booked for 90 days from ${toISTDateString(selectedDate)}.`}
              {selectedType === "Y" && `Annual booking: This slot will be booked for 365 days from ${toISTDateString(selectedDate)}.`}
            </Typography>
          )}
        </>
      );
    }
  };

  // ---------------------- Booking Submission Function ----------------------
  const handleBookingSubmit = async () => {
    if (!selectedDate || !selectedFacility || !selectedGroup || !selectedType) {
      setErrorInfo("Please select all required fields.");
      return;
    }
    if ((selectedType !== "FD" && selectedType !== "HD") && !selectedTime) {
      setErrorInfo("Please select a start time.");
      return;
    }
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

    const bookingDetails = {
      booking_date: formatToLocalDate(selectedDate),
      booking_time: formatToIST(selectedTime || getISTTimeInLocal(selectedDate, 9, 0)),
      booking_end_time: formatToIST(selectedEndTime || getISTTimeInLocal(selectedDate, 18, 0)),
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

  // ---------------------- Razorpay Payment Function ----------------------
  const openRazorpayPayment = async () => {
    // Dynamically load Razorpay's checkout script if not already loaded
    const scriptId = 'razorpay-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onerror = () => {
        alert('Razorpay SDK failed to load. Please check your connection.');
      };
      document.body.appendChild(script);
      // Wait for the script to load
      await new Promise((resolve) => {
        script.onload = resolve;
      });
    }

    // Configure payment options. Adjust the key, amount, and other details as needed.
    const options = {
      key: "rzp_test_ZgP96zXbEjW6Ge", // Replace with your Razorpay key
      amount: facilityRate ? facilityRate * 100 : 0, // Convert rate to paise (if applicable)
      currency: "INR",
      name: "Your Company Name",
      description: "Test Transaction",
      // Order details can be added here if you create an order on your backend
      handler: async function (response) {
        // Payment successful. Now submit the booking.
        await handleBookingSubmit();
      },
      prefill: {
        name: user?.name || '',
        email: userEmail,
      },
      theme: {
        color: "#3399cc"
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  // ---------------------- Render UI ----------------------
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
          shouldDisableDate={(date) => {
            if (selectedType === "FD" && selectedFacility && selectedComplex) {
              const dateStr = toISTDateString(date);
              return fullyBookedDates.includes(dateStr);
            }
            return false;
          }}
          renderInput={(props) => <TextField {...props} fullWidth margin="normal" />}
        />
      </LocalizationProvider>

      {/* Time Pickers or Fixed Display Based on Booking Type */}
      {selectedDate && selectedFacility && renderTimePickers()}

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

      {/* Razorpay Payment Button */}
      <Button variant="contained" color="primary" onClick={openRazorpayPayment}>
        Proceed to Payment
      </Button>
    </div>
  );
};

export default FacilityBookings;















