



import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../../features/auth/authSlice';
import {
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Toolbar,
    AppBar,
    Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';

const Nav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(reset());
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
                        to="/"
                        style={{
                            textDecoration: 'none',
                            color: 'white',
                            fontSize: '20px',
                            marginRight: '10px',
                        }}
                    >
                    Profile
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





/*
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, reset } from '../../features/auth/authSlice'
import { toast } from 'react-toastify'

const Nav = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user } = useSelector((state) => state.auth)

    const handleLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate("/")
    }


    return (
        <nav className="navbar">
            <NavLink className="logo" to="/">Logo</NavLink>
            <ul className="nav-links">
                {user ?
                    <>
                        <NavLink className='nav-childs' to="/dashboard">Dashboard</NavLink>
                        <NavLink className='nav-childs' to="/" onClick={handleLogout}>Logout</NavLink>
                    </>
                    :
                    <>
                        <NavLink className='nav-childs' to="/dashboard">Dashboard</NavLink>
                    </>
                }
            </ul>
        </nav>
    )
}

export default Nav
*/
