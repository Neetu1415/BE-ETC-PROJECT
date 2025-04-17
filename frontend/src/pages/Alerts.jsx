// src/pages/Alerts.jsx
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from '@mui/material';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('Access token not found. Please log in.');
        }
        const response = await fetch('http://127.0.0.1:8000/api/v1/camera/alerts/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          // If 404, assume there are simply no alerts.
          if (response.status === 404) {
            setAlerts([]);
            setLoading(false);
            return;
          }
          throw new Error(`Failed to fetch alerts. Status: ${response.status}`);
        }
        const data = await response.json();
        // data is expected to be an array of alert objects.
        setAlerts(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  if (loading) return <Typography>Loading alerts...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <TableContainer component={Paper} style={{ margin: '16px' }}>
      <Typography variant="h6" style={{ padding: '16px' }}>
         Alerts 
      </Typography>
      {alerts.length === 0 ? (
        <Typography style={{ padding: '16px' }}>No alerts found</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Violation Count</TableCell>
              <TableCell>Last Violation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alerts.map((alert, index) => (
              <TableRow key={alert.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{alert.message}</TableCell>
                <TableCell>{alert.violation_count}</TableCell>
                <TableCell>{alert.last_violation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default Alerts;
