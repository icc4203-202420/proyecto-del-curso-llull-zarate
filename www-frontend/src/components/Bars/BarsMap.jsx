import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Box, TextField, Button, CircularProgress, Typography } from '@mui/material';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: -33.4369, // Santiago, Chile
  lng: -70.6344,
};

const API_KEY = 'AIzaSyCLC2xC1C3WseaoSFx2cy8XN6hpBWKYN6g';

const BarsMap = ({ barsData }) => {
  const [mapInstance, setMapInstance] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBars, setFilteredBars] = useState(barsData || []);
  const [currentLocation, setCurrentLocation] = useState(defaultCenter);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBar, setSelectedBar] = useState(null);

  useEffect(() => {
    if (barsData) {
      setFilteredBars(
        barsData.filter(
          (bar) => bar.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, barsData]);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLoading(false);
          const userPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(userPosition);
          if (mapInstance) {
            mapInstance.panTo(userPosition);
          }
        },
        (err) => {
          setIsLoading(false);
          setError("Geolocation failed, defaulting to Santiago.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '20vh',
        backgroundColor: 'white',
        color: 'black',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <TextField
        label="Search for bars"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2, width: '300px' }}
      />
      <Button variant="contained" color="primary" onClick={handleGetLocation}>
        Find Bars Near Me
      </Button>
      {isLoading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      <LoadScript googleMapsApiKey={API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentLocation}
          zoom={14}
          onLoad={(map) => setMapInstance(map)}
        >
          {filteredBars.map((bar) => (
            <Marker
              key={bar.id}
              position={bar.position}
              title={bar.name}
              onClick={() => setSelectedBar(bar)}
            />
          ))}
          {selectedBar && (
            <InfoWindow
              position={selectedBar.position}
              onCloseClick={() => setSelectedBar(null)}
            >
              <div>
                <h2>{selectedBar.name}</h2>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </Box>
  );
}

export default BarsMap;