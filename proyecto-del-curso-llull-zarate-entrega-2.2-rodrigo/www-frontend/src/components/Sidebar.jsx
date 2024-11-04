import React from 'react';
import { Drawer, List, ListItem, ListItemText, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    toggleSidebar();
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login'); 
    toggleSidebar(); 
  };

  // Check if the user is authenticated by checking the token in localStorage
  const isAuthenticated = !!localStorage.getItem('token');

  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'Beers List', path: '/beers' },
    { text: 'Bars List', path: '/bars' },
    { text: 'Events', path: '/events' },  // Ruta de eventos
    { text: 'User Search', path: '/search' },
    
    // Show "Friends" menu item only if the user is authenticated
    isAuthenticated ? { text: 'Friends', path: '/friends' } : null,
    
    // Show "Login" and "Sign Up" if the user is not authenticated
    !isAuthenticated ? { text: 'Login', path: '/login' } : null,
    !isAuthenticated ? { text: 'Sign Up', path: '/signup' } : null
  ].filter(Boolean);  // Remove null values from the array

  return (
    <Drawer anchor="left" open={isOpen} onClose={toggleSidebar}>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            selected={location.pathname === item.path}
            onClick={() => handleNavigation(item.path)}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}

        {isAuthenticated ? (
          <Button
            onClick={handleLogout}
            variant="contained"
            sx={{
              marginTop: '20px',
              backgroundColor: 'black',
              color: 'white',
              '&:hover': {
                backgroundColor: '#333',
              },
            }}
          >
            Logout
          </Button>
        ) : (
          <Button
            onClick={() => handleNavigation('/login')}
            variant="contained"
            sx={{
              marginTop: '20px',
              backgroundColor: 'black',
              color: 'white',
              '&:hover': {
                backgroundColor: '#333',
              },
            }}
          >
            Login
          </Button>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;