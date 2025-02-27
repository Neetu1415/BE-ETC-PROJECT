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
  useMediaQuery
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

const Nav = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, userInfo } = useSelector((state) => state.auth);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  const closeDrawer = () => setDrawerOpen(false);

  // Horizontal nav items (desktop) without Logout
  const navItems = (
    <>
      <NavLink to="/" className="nav-item">
        Home
      </NavLink>

      {user && user.role === 'customer' && (
        <NavLink to="/customer/dashboard" className="nav-item">
          Customer Dashboard
        </NavLink>
      )}
      {user && user.role === 'stadium_admin' && (
        <NavLink to="/stadium/dashboard" className="nav-item">
          Stadium Dashboard
        </NavLink>
      )}
      {user && user.role === 'overall_admin' && (
        <NavLink to="/admin/dashboard" className="nav-item">
          Admin Dashboard
        </NavLink>
      )}

      {user && user.role === 'customer' && (
        <>
          <NavLink to="/customer/booking" className="nav-item">
            Booking
          </NavLink>
          <NavLink to="/customer/booked" className="nav-item">
            Booked
          </NavLink>
        </>
      )}

      {/* Photo Gallery link */}
      <NavLink to="/photo-gallery" className="nav-item">
        Photo Gallery
      </NavLink>
    </>
  );

  // Drawer (mobile) nav items (includes Logout)
  const drawerItems = (
    <List className="drawer-list">
      {isMobile && userInfo?.email && (
        <ListItem className="drawer-item">
          <ListItemIcon>
            <AccountCircleIcon className="drawer-icon" />
          </ListItemIcon>
          <ListItemText primary={`Profile: ${userInfo.email}`} />
        </ListItem>
      )}

      <ListItem
        button
        component={NavLink}
        to="/"
        onClick={closeDrawer}
        className="drawer-item"
      >
        <ListItemIcon>
          <HomeIcon className="drawer-icon" />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>

      {user && user.role === 'customer' && (
        <ListItem
          button
          component={NavLink}
          to="/customer/dashboard"
          onClick={closeDrawer}
          className="drawer-item"
        >
          <ListItemIcon>
            <DashboardIcon className="drawer-icon" />
          </ListItemIcon>
          <ListItemText primary="Customer Dashboard" />
        </ListItem>
      )}
      {user && user.role === 'stadium_admin' && (
        <ListItem
          button
          component={NavLink}
          to="/stadium/dashboard"
          onClick={closeDrawer}
          className="drawer-item"
        >
          <ListItemIcon>
            <DashboardIcon className="drawer-icon" />
          </ListItemIcon>
          <ListItemText primary="Stadium Dashboard" />
        </ListItem>
      )}
      {user && user.role === 'overall_admin' && (
        <ListItem
          button
          component={NavLink}
          to="/admin/dashboard"
          onClick={closeDrawer}
          className="drawer-item"
        >
          <ListItemIcon>
            <DashboardIcon className="drawer-icon" />
          </ListItemIcon>
          <ListItemText primary="Admin Dashboard" />
        </ListItem>
      )}

      {user && user.role === 'customer' && (
        <>
          <ListItem
            button
            component={NavLink}
            to="/customer/booking"
            onClick={closeDrawer}
            className="drawer-item"
          >
            <ListItemIcon>
              <AddBoxIcon className="drawer-icon" />
            </ListItemIcon>
            <ListItemText primary="Booking" />
          </ListItem>
          <ListItem
            button
            component={NavLink}
            to="/customer/booked"
            onClick={closeDrawer}
            className="drawer-item"
          >
            <ListItemIcon>
              <BookIcon className="drawer-icon" />
            </ListItemIcon>
            <ListItemText primary="Booked" />
          </ListItem>
        </>
      )}

      <ListItem
        button
        component={NavLink}
        to="/photo-gallery"
        onClick={closeDrawer}
        className="drawer-item"
      >
        
        <ListItemIcon>
          <PhotoLibraryIcon className="drawer-icon" />
        </ListItemIcon>
        <ListItemText primary="Photo Gallery" />
      </ListItem>

      {user && (
        <ListItem button onClick={handleLogout} className="drawer-item">
          <ListItemIcon>
            <LogoutIcon className="drawer-icon" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      )}
    </List>
  );

  return (
    <>
      <AppBar position="fixed" className="nav-appbar">
        {/* -- Top row: Logo only -- */}
        <Box className="nav-header">
          <Box
            component="img"
            src="/image/government_of_goa-removebg-preview_upscaled.png"
            alt="Goa Government Logo"
            className="nav-logo"
          />
        </Box>

        {/* -- Horizontal line under logo -- */}
        <Box className="nav-line" />

        {/* -- Second row (Toolbar) for navigation items -- */}
        <Toolbar className="nav-toolbar">
          {/* Mobile: show hamburger + optional user info */}
          {isMobile ? (
            <Box className="nav-mobile-left">
              <IconButton
                color="inherit"
                onClick={() => setDrawerOpen(true)}
                edge="start"
                className="nav-hamburger"
              >
                <MenuIcon />
              </IconButton>
              {/* Add anything else you want in the top-left for mobile */}
            </Box>
          ) : (
            /* Desktop: Show hamburger on the left if you still want a Drawer */
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
          )}

          {/* Centered nav items */}
          <Box className="nav-center">{navItems}</Box>

          {/* Right side: Profile info */}
          <Box className="nav-right">
            {userInfo?.email && (
              <Typography variant="body1" className="nav-profile">
                Profile: {userInfo.email}
              </Typography>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer (for mobile) */}
      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        PaperProps={{ className: 'nav-drawer' }}
      >
        {drawerItems}
      </Drawer>

      {/* Spacer to push main content below fixed header */}
      <Box className="nav-spacer" />
    </>
  );
};

export default Nav;

