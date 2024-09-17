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

  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'Beers List', path: '/beers' },
    { text: 'Bars List', path: '/bars' },
    { text: 'Events', path: '/events' },  // Ruta de eventos
    { text: 'User Search', path: '/search' },
    { text: 'Bars Search', path: '/bars-search'},
    
    !localStorage.getItem('token') ? { text: 'Login', path: '/login' } : null,
    !localStorage.getItem('token') ? { text: 'Sign Up', path: '/signup' } : null
  ].filter(Boolean);

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
        {localStorage.getItem('token') ? (
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
