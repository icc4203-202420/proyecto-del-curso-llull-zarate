import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BeersList from './components/BeersList';
import BarsList from './components/BarsList';
import BarEvents from './components/BarEvents';
import UserSearch from './components/UserSearch';
import Home from './components/Home';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="App">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main style={{ marginLeft: isSidebarOpen ? 250 : 0, transition: 'margin-left 0.3s' }}>
          <header style={{ display: 'flex', alignItems: 'center', padding: '20px 20px', background: 'black', borderBottom: '1px solid #ddd' }}>
          <IconButton onClick={toggleSidebar} edge="start" style={{ color: 'white' }} aria-label="menu">
          <MenuIcon />
          </IconButton>
            <h1 style={{ flex: 1, textAlign: 'center', margin: 1,color: 'white' }}>dRINK.IO</h1>
          </header>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/beers" element={<BeersList />} />
            <Route path="/bars" element={<BarsList />} />
            <Route path="/bar/:id/events" element={<BarEvents />} />
            <Route path="/search" element={<UserSearch />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

