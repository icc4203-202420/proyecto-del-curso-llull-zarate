import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import BeersList from './components/Beers/BeersList';
import BeerDetails from './components/Beers/BeerDetails';

import BarsList from './components/Bars/BarsList';
import BarsMap from './components/Bars/BarsMap';

import UserSearch from './components/User/UserSearch';

import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Sidebar from './components/Sidebar';

import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './App.css';

import EventsList from './components/Events/EventsList';

import EventsBar from './components/Bars/EventsBar';

// Este componente puede ser usado para proteger rutas que requieren autenticación
const ProtectedRoute = ({ element, isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Control de autenticación

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="App">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main style={{ marginLeft: isSidebarOpen ? 250 : 0, transition: 'margin-left 0.3s' }}>
          <header
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '20px',
              backgroundColor: 'black',
              color: 'white',
              borderBottom: '1px solid #ddd',
            }}
          >
            <IconButton
              onClick={toggleSidebar}
              edge="start"
              style={{ color: 'white' }}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <h1 style={{ flex: 1, textAlign: 'center', margin: 0 }}>dRINK.IO</h1>
          </header>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/beers" element={<BeersList />} />
            <Route path="/beer/:id" element={<BeerDetails />} />
            
            {/* Agrega la ruta del mapa de bares */}
            {/* <Route path="/bars/map" element={<BarsMap />} /> */}
            <Route path="/bars" element={<BarsList />} />
            
            <Route path="/bar/:id/events" element={<EventsBar />} />
      
            
            <Route path="/events" element={<EventsList />} />

            <Route path="/search" element={<UserSearch />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Ejemplo de ruta protegida que requiere autenticación */}
            <Route 
              path="/profile"
              element={<ProtectedRoute element={<UserSearch />} isAuthenticated={isAuthenticated} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
