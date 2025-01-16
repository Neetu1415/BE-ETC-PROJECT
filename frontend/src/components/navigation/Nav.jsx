import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset, login } from '../../features/auth/authSlice';
import {
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Toolbar,
    AppBar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import BookIcon from '@mui/icons-material/Book';
import AddBoxIcon from '@mui/icons-material/AddBox';

const Nav = () => {
    const [isOpen, setIsOpen] = useState(false); // Drawer open/close state
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux state for user info
    const { userInfo } = useSelector((state) => state.auth);

    // Handle logout
    const handleLogout = () => {
        dispatch(logout());
        dispatch(reset());
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('userInfo');
        setIsOpen(false); // Close drawer
        navigate('/'); // Redirect to home/login page
    };

    // Check and rehydrate user info on app load
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('userInfo'));
        if (storedUser) {
            dispatch(login(storedUser)); // Restore user info if available
        } else {
            dispatch(logout()); // Clear Redux state if no user info
        }
    }, [dispatch]);

    // Toggle drawer
    const toggleDrawer = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <>
            {/* AppBar for navigation */}
            <AppBar position="fixed" style={{ backgroundColor: '#1f1f38' }}>
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer}
                    >
                        <MenuIcon style={{ color: 'white' }} />
                    </IconButton>
                    <span
                        style={{
                            textDecoration: 'none',
                            color: 'white',
                            fontSize: '20px',
                        }}
                    >
                        {userInfo?.email ? `Profile: ${userInfo.email}` : 'Profile: Guest'}
                    </span>
                </Toolbar>
            </AppBar>

            {/* Sidebar Drawer */}
            <Drawer
                variant="temporary"
                open={isOpen}
                onClose={toggleDrawer}
                PaperProps={{
                    style: {
                        backgroundColor: '#1f1f38',
                        width: isOpen ? 240 : 70,
                        transition: 'width 0.3s ease-in-out',
                    },
                }}
            >
                <List>
                    <ListItem button component={NavLink} to="/" onClick={toggleDrawer}>
                        <ListItemIcon>
                            <HomeIcon style={{ color: 'white' }} />
                        </ListItemIcon>
                        {isOpen && <ListItemText primary="Home" style={{ color: 'white' }} />}
                    </ListItem>

                    <ListItem button component={NavLink} to="/dashboard" onClick={toggleDrawer}>
                        <ListItemIcon>
                            <DashboardIcon style={{ color: 'white' }} />
                        </ListItemIcon>
                        {isOpen && <ListItemText primary="Dashboard" style={{ color: 'white' }} />}
                    </ListItem>

                    <ListItem button component={NavLink} to="/booking" onClick={toggleDrawer}>
                        <ListItemIcon>
                            <AddBoxIcon style={{ color: 'white' }} />
                        </ListItemIcon>
                        {isOpen && <ListItemText primary="Booking" style={{ color: 'white' }} />}
                    </ListItem>

                    <ListItem button component={NavLink} to="/booked" onClick={toggleDrawer}>
                        <ListItemIcon>
                            <BookIcon style={{ color: 'white' }} />
                        </ListItemIcon>
                        {isOpen && <ListItemText primary="Booked" style={{ color: 'white' }} />}
                    </ListItem>

                    {userInfo ? (
                        <ListItem button onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon style={{ color: 'white' }} />
                            </ListItemIcon>
                            {isOpen && <ListItemText primary="Logout" style={{ color: 'white' }} />}
                        </ListItem>
                    ) : (
                        <ListItem button component={NavLink} to="/login" onClick={toggleDrawer}>
                            <ListItemIcon>
                                <LogoutIcon style={{ color: 'white' }} />
                            </ListItemIcon>
                            {isOpen && <ListItemText primary="Login" style={{ color: 'white' }} />}
                        </ListItem>
                    )}
                </List>
            </Drawer>
        </>
    );
};

export default Nav;
