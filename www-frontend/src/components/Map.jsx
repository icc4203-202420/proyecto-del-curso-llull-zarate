import React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { TextField, Button, Box } from '@mui/material';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 37.7749, // Coordenadas por defecto (San Francisco)
  lng: -122.4194
};

function Map({ bars }) {
  const [selectedBar, setSelectedBar] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredBars, setFilteredBars] = React.useState(bars);

  const handleSearch = () => {
    const results = bars.filter(bar =>
      bar.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBars(results);
  };

  return (
    <Box>
      <TextField
        label="Buscar bares por nombre"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button
        variant="contained"
        sx={{
          backgroundColor: 'black',
          color: 'white',
          '&:hover': {
            backgroundColor: '#333',
          },
        }}
        onClick={handleSearch}
      >
        Buscar
      </Button>
      <LoadScript
        googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY"  // Sustituye por tu clave API de Google Maps
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={10}
        >
          {filteredBars.map(bar => (
            <Marker
              key={bar.id}
              position={{ lat: bar.latitude, lng: bar.longitude }}
              onClick={() => setSelectedBar(bar)}
            />
          ))}
          {selectedBar && (
            <InfoWindow
              position={{ lat: selectedBar.latitude, lng: selectedBar.longitude }}
              onCloseClick={() => setSelectedBar(null)}
            >
              <div>
                <h2>{selectedBar.name}</h2>
                <p>{selectedBar.location}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </Box>
  );
}

export default Map;
