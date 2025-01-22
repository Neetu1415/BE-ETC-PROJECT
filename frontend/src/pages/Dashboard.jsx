
import React, { useState, useEffect } from 'react';
import '../App.css';
import { useSelector } from 'react-redux'

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

  const facilityMapping = {
    CT : 'cricket',
    OFCT : 'open field cricket',
    HT : 'hockey astro turf',
    A1 : 'atheletic track',
    A2 : 'atheletics',
    CN : 'conference hall and other rooms',
    S1 : 'Swimming Pool',
    S2 : 'learn to swim Classes',
    S3 : 'learn to swim and life saving',
    S4 : 'use of swimming pool only through booking',
    FT1 : 'football play field',
    FT2 : 'D.B Bandodkar Football Ground',
    GY : 'Gymnasium',
    GT : 'Gymnastics',
    IN : 'Indoor hall',
    BD : 'Badminton',
    INBD : 'indoor hall badminton',
    TT : 'Table Tennis',
    INTT : 'indoor hall table tennis',
    WT : 'weightlifting',
    INWT : 'indoor weight lifting',
    TK : 'Taekwondo',
    HB : 'handball',
    BB : 'basketball',
    CH : 'chess',
    JD : 'Judo',
    AC : 'archery',
    BX : 'boxing',
    RS : 'roller skating',
    OF : 'Open field(outdoor)',
    AA : 'all facilities',
    OO : 'open field outdoor'
  }

  const complexMapping={
    P : 'PEDDEM SPORTS COMPLEX',
    A : 'ATHLETIC STADIUM BAMBOLIM',
    MP :'MULTIPURPOSE INDOOR STADIUM (PEDDEM)',
    SP :'DR SHYAMA PRASAD MUKHERJEE INDOOR STADIUM',
    MC :'MULTIPURPOSE INDOOR CAMPAL',
    MN : 'MANOHAR PARRIKAR INDOOR STADIUM NAVELIM',
    MF : 'MULTIPURPOSE HALL FATORDA',
    IP : 'INDOOR HALL PONDA / SPORTS COMPLEX PONDA',
    SF : 'SWIMMING POOL FATORDA',
    AG : 'ASSOLNA GROUND',
    TM : 'TILAK MAIDAN',
    AC : 'AGONDA SPORTS COMPLEX',
    BG : 'BENAULIM GROUND',
    UG : 'UTORGA GROUND',
    FM :'FATORDA MULTIPURPOSE INDOOR STADIUM',
    PF : 'PJN STADIUM FATORDA',
    FC : 'FATORDA OPEN SPORTS COMPLEX'
  }
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










