import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset, getUserInfo } from '../../features/auth/authSlice';
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
import AddBoxIcon from '@mui/icons-material/AddBox';
import HomeIcon from '@mui/icons-material/Home';
import BookIcon from '@mui/icons-material/Book';

const Nav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        console.log("User state changed:", user);
        if (user && user.role) {
          if (user.role === "stadium_admin") {
            navigate("/stadium/dashboard");
          } else if (user.role === "overall_admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/customer/dashboard");
          }
        }
      }, [user, navigate]);
      

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        dispatch(logout());
        dispatch(reset());
        setIsOpen(false); // Close the sidebar
        navigate('/');
    };

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
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
                        {userInfo?.email ? `Profile: ${userInfo.email}` : 'Profile'}
                    </span>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="temporary"
                open={isOpen}
                onClose={toggleDrawer}
                PaperProps={{
                    style: {
                        backgroundColor: '#1f1f38', // Sidebar background color
                        width: isOpen ? 240 : 70, // Dynamic width for animation
                        transition: 'width 0.3s ease-in-out',
                    },
                }}
            >
                <List>
                    {/* Home Link */}
                    <ListItem button component={NavLink} to="/" onClick={toggleDrawer}>
                        <ListItemIcon>
                            <HomeIcon style={{ color: 'white' }} />
                        </ListItemIcon>
                        {isOpen && <ListItemText primary="Home" style={{ color: 'white' }} />}
                    </ListItem>

                    {/* Dashboard Link: Render based on role */}
                    {user && user.role === 'customer' && (
                        <ListItem
                            button
                            component={NavLink}
                            to="/customer/dashboard"
                            onClick={toggleDrawer}
                        >
                            <ListItemIcon>
                                <DashboardIcon style={{ color: 'white' }} />
                            </ListItemIcon>
                            {isOpen && (
                                <ListItemText primary="Customer Dashboard" style={{ color: 'white' }} />
                            )}
                        </ListItem>
                    )}

                    {user && user.role === 'stadium_admin' && (
                        <ListItem
                            button
                            component={NavLink}
                            to="/stadium/dashboard"
                            onClick={toggleDrawer}
                        >
                            <ListItemIcon>
                                <DashboardIcon style={{ color: 'white' }} />
                            </ListItemIcon>
                            {isOpen && (
                                <ListItemText primary="Stadium Dashboard" style={{ color: 'white' }} />
                            )}
                        </ListItem>
                    )}

                    {user && user.role === 'overall_admin' && (
                        <ListItem
                            button
                            component={NavLink}
                            to="/admin/dashboard"
                            onClick={toggleDrawer}
                        >
                            <ListItemIcon>
                                <DashboardIcon style={{ color: 'white' }} />
                            </ListItemIcon>
                            {isOpen && (
                                <ListItemText primary="Admin Dashboard" style={{ color: 'white' }} />
                            )}
                        </ListItem>
                    )}

                    {/* Additional Links for Customers */}
                    {user && user.role === 'customer' && (
                        <>
                            <ListItem
                                button
                                component={NavLink}
                                to="/customer/booking"
                                onClick={toggleDrawer}
                            >
                                <ListItemIcon>
                                    <AddBoxIcon style={{ color: 'white' }} />
                                </ListItemIcon>
                                {isOpen && (
                                    <ListItemText primary="Booking" style={{ color: 'white' }} />
                                )}
                            </ListItem>

                            <ListItem
                                button
                                component={NavLink}
                                to="/customer/booked"
                                onClick={toggleDrawer}
                            >
                                <ListItemIcon>
                                    <BookIcon style={{ color: 'white' }} />
                                </ListItemIcon>
                                {isOpen && (
                                    <ListItemText primary="Booked" style={{ color: 'white' }} />
                                )}
                            </ListItem>
                        </>
                    )}

                    {/* Logout Link: Show for all logged in users */}
                    {user && (
                        <ListItem button onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon style={{ color: 'white' }} />
                            </ListItemIcon>
                            {isOpen && <ListItemText primary="Logout" style={{ color: 'white' }} />}
                        </ListItem>
                    )}
                </List>
            </Drawer>
        </>
    );
};

export default Nav;
