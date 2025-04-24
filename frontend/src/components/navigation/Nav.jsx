// src/components/navigation/Nav.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../../features/auth/authSlice';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  useMediaQuery,
  Menu,
  MenuItem
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import AddBoxIcon from '@mui/icons-material/AddBox';
import HomeIcon from '@mui/icons-material/Home';
import BookIcon from '@mui/icons-material/Book';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';

const Nav = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, userInfo } = useSelector((state) => state.auth);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseProfileMenu = () => setAnchorEl(null);
  const closeDrawer = () => setDrawerOpen(false);

  const buildNavItem = (to, icon, label) => (
    <ListItem disablePadding>
      <ListItemButton component={NavLink} to={to} onClick={closeDrawer} className="drawer-item" sx={{ color: 'white' }}>
        <ListItemIcon sx={{ color: 'white' }}>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );

  return (
    <>
      <AppBar position="fixed" className="nav-appbar">
        <Box className="nav-header">
          <Box
            component="img"
            src="/image/government_of_goa-removebg-preview_upscaled.png"
            alt="Goa Government Logo"
            className="nav-logo"
          />
        </Box>
        <Box className="nav-line" />
        <Toolbar className="nav-toolbar">
          <Box className="nav-left">
            <IconButton
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              edge="start"
              className="nav-hamburger"
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Box className="nav-center" sx={{ color: 'white' }}>
            <NavLink to="/" className="nav-item" style={{ color: 'white' }}>Home</NavLink>
            {user?.role === 'customer' && <NavLink to="/customer/dashboard" className="nav-item" style={{ color: 'white' }}>Customer Dashboard</NavLink>}
            {user?.role === 'stadium_admin' && <NavLink to="/stadium/dashboard" className="nav-item" style={{ color: 'white' }}>Stadium Dashboard</NavLink>}
            {user?.role === 'overall_admin' && (
              <>
                <NavLink to="/admin/dashboard" className="nav-item" style={{ color: 'white' }}>Admin Dashboard</NavLink>
                <NavLink to="/admin/alerts" className="nav-item" style={{ color: 'white' }}>Alerts</NavLink>
              </>
            )}
            {user?.role === 'customer' && (
              <>
                <NavLink to="/customer/booking" className="nav-item" style={{ color: 'white' }}>Booking</NavLink>
                <NavLink to="/customer/booked" className="nav-item" style={{ color: 'white' }}>Booked</NavLink>
              </>
            )}
            <NavLink to="/photo-gallery" className="nav-item" style={{ color: 'white' }}>Photo Gallery</NavLink>
          </Box>
          <Box className="nav-right">
            {userInfo?.email && (
              <Typography
                variant="body1"
                className="nav-profile"
                onClick={handleProfileClick}
                sx={{ cursor: 'pointer', color: 'white' }}
              >
                {userInfo.email}
              </Typography>
            )}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseProfileMenu}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={() => { handleCloseProfileMenu(); handleLogout(); }}>
                <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="Logout" />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer open={drawerOpen} onClose={closeDrawer} PaperProps={{ className: 'nav-drawer' }}>
        <List className="drawer-list">
          {isMobile && userInfo?.email && (
            <ListItem disablePadding>
              <ListItemIcon sx={{ color: 'white' }}><AccountCircleIcon /></ListItemIcon>
              <ListItemText primary={`Profile: ${userInfo.email}`} sx={{ color: 'white' }} />
            </ListItem>
          )}
          {buildNavItem('/', <HomeIcon />, 'Home')}
          {user?.role === 'customer' && buildNavItem('/customer/dashboard', <DashboardIcon />, 'Customer Dashboard')}
          {user?.role === 'stadium_admin' && buildNavItem('/stadium/dashboard', <DashboardIcon />, 'Stadium Dashboard')}
          {user?.role === 'overall_admin' && buildNavItem('/admin/dashboard', <DashboardIcon />, 'Admin Dashboard')}
          {user?.role === 'overall_admin' && buildNavItem('/admin/alerts', <CircleNotificationsIcon />, 'Alerts')}
          {user?.role === 'customer' && buildNavItem('/customer/booking', <AddBoxIcon />, 'Booking')}
          {user?.role === 'customer' && buildNavItem('/customer/booked', <BookIcon />, 'Booked')}
          {buildNavItem('/photo-gallery', <PhotoLibraryIcon />, 'Photo Gallery')}
          {user && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => { closeDrawer(); handleLogout(); }} sx={{ color: 'white' }}>
                <ListItemIcon sx={{ color: 'white' }}><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Drawer>

      <Box className="nav-spacer" />
    </>
  );
};

export default Nav;
