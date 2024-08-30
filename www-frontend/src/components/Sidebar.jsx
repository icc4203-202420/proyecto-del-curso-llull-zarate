import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    toggleSidebar();
  };

  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'Beers List', path: '/beers' },
    { text: 'Bars List', path: '/bars' },
    { text: 'Bar Events', path: '/bar/:id/events' },
    { text: 'User Search', path: '/search' },
    { text: 'Login', path: '/login' },
  ];

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={toggleSidebar}
      sx={{
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 250,
          boxSizing: 'border-box',
          backgroundColor: 'white', // Fondo blanco
        },
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              style={{
                width: '100%',
                justifyContent: 'center',
                color: 'black', // Texto negro
                padding: '10px 0',
              }}
              selected={location.pathname === item.path}
            >
              <ListItemText
                primary={item.text}
                style={{
                  textAlign: 'center',
                  fontSize: '21px', // Tamaño de fuente grande
                  color: 'black',
                  fontFamily: 'Arial, sans-serif', // Tipografía moderna
                  fontWeight: 'bold',
                }}
              />
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
};

export default Sidebar;
