/*
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Toolbar,
    AppBar,
    Menu,
    MenuItem,
    Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import { logout, reset } from '../../features/auth/authSlice'; // Ensure this import is correct

const Nav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const handleProfileClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout()); // Call the Redux logout action
        dispatch(reset()); // Reset any additional state if needed
        handleCloseMenu(); // Close the profile menu
        toggleDrawer(); // Close the drawer
        navigate('/'); // Redirect to the home page
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
                    <Button
                        color="inherit"
                        onClick={handleProfileClick}
                        style={{
                            textDecoration: 'none',
                            color: 'white',
                            fontSize: '20px',
                        }}
                    >
                        Profile
                    </Button>
                    
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                        PaperProps={{
                            style: {
                                backgroundColor: '#1f1f38',
                                color: 'white',
                            },
                        }}
                    >
                        {userInfo?.email && (
                            <MenuItem disabled style={{ color: 'white', fontWeight: 'bold' }}>
                                {`Email: ${userInfo.email}`}
                            </MenuItem>
                        )}
                        <MenuItem onClick={handleLogout} style={{ color: 'white' }}>
                            Logout
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            
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
                            <DashboardIcon style={{ color: 'white' }} />
                        </ListItemIcon>
                        {isOpen && <ListItemText primary="Booking" style={{ color: 'white' }} />}
                    </ListItem>

                   
                    {userInfo && (
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
*/

/*
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Toolbar,
    AppBar,
    Menu,
    MenuItem,
    Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';

const Nav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const handleProfileClick = (event) => {
        setAnchorEl(event.currentTarget); // Open the menu when profile is clicked
    };

    const handleCloseMenu = () => {
        setAnchorEl(null); // Close the menu when clicked outside
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
                    <Button
                        color="inherit"
                        onClick={handleProfileClick}
                        style={{
                            textDecoration: 'none',
                            color: 'white',
                            fontSize: '20px',
                        }}
                    >
                        {userInfo?.email ? `Profile` : 'Profile'}
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                        PaperProps={{
                            style: {
                                backgroundColor: '#1f1f38', // Menu background color
                                color: 'white', // Text color
                            },
                        }}
                    >
                        {userInfo?.email && (
                            <MenuItem disabled style={{ color: 'white' }}>
                                {`Email: ${userInfo.email}`}
                            </MenuItem>
                        )}
                    </Menu>
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

                    <ListItem button component={NavLink} to="/booking" onClick={toggleDrawer}>
                        <ListItemIcon>
                            <DashboardIcon style={{ color: 'white' }} />
                        </ListItemIcon>
                        {isOpen && <ListItemText primary="Booking" style={{ color: 'white' }} />}
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
};

export default Nav;
*/


/*
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
    Menu,
    MenuItem,
    Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';

const Nav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
    };

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const handleProfileClick = (event) => {
        setAnchorEl(event.currentTarget); // Open the menu when profile is clicked
    };

    const handleCloseMenu = () => {
        setAnchorEl(null); // Close the menu when an item is selected or clicked outside
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
                    <Button
                        color="inherit"
                        onClick={handleProfileClick}
                        style={{
                            textDecoration: 'none',
                            color: 'white',
                            fontSize: '20px',
                        }}
                    >
                        {userInfo?.email ? `Profile` : 'Profile'}
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                    >
                        {userInfo?.email && (
                            <MenuItem disabled>{`Email: ${userInfo.email}`}</MenuItem>
                        )}
                        {userInfo && (
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <LogoutIcon style={{ color: 'black' }} />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        )}
                    </Menu>
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

                    <ListItem button component={NavLink} to="/booking" onClick={toggleDrawer}>
                        <ListItemIcon>
                            <DashboardIcon style={{ color: 'white' }} />
                        </ListItemIcon>
                        {isOpen && <ListItemText primary="Booking" style={{ color: 'white' }} />}
                    </ListItem>

                    {userInfo && (
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
*/
/*
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';

const Nav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);

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
                        style={{
                            textDecoration: 'none',
                            color: 'white',
                            fontSize: '20px',
                            marginRight: '10px',
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
                            <DashboardIcon style={{ color: 'white' }} />
                        </ListItemIcon>
                        {isOpen && <ListItemText primary="Booking" style={{ color: 'white' }} />}
                    </ListItem>

                    {userInfo && (
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
*/



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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';

const Nav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);

    const handleLogout = () => {
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
                        {isOpen && (
                            <ListItemText primary="Dashboard" style={{ color: 'white' }} />
                        )}
                    </ListItem>
                    <ListItem button component={NavLink} to="/booking" onClick={toggleDrawer}>
                        <ListItemIcon>
                            <DashboardIcon style={{ color: 'white' }} />
                        </ListItemIcon>
                        {isOpen && (
                            <ListItemText primary="Booking" style={{ color: 'white' }} />
                        )}
                    </ListItem>

                    {userInfo && (
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
