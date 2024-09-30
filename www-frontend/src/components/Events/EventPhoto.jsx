import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, TextField, Autocomplete } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EventPhoto = () => {
  const { id: eventId } = useParams(); // Obtener el ID del evento desde los parámetros
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [tagMode, setTagMode] = useState(false);
  const [tags, setTags] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);

  // Obtener la lista de usuarios para el etiquetado
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`/api/v1/users`);
        setAvailableUsers(response.data);
      } catch (err) {
        console.error('Error al obtener los usuarios:', err);
      }
    };
    fetchUsers();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // Previsualización de la imagen
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('photo', selectedFile);

      if (tagMode && tags.length > 0) {
        formData.append('tags', JSON.stringify(tags.map(tag => tag.id))); // Enviar los IDs de las personas etiquetadas
      }

      try {
        await axios.post(`/api/v1/events/${eventId}/upload_photo`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Foto subida exitosamente');
      } catch (err) {
        console.error('Error al subir la foto:', err);
        alert('Error al subir la foto.');
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Subir Foto
      </Typography>

      {/* Previsualización de la imagen */}
      {preview && (
        <Box sx={{ marginBottom: 2 }}>
          <img
            src={preview}
            alt="Previsualización"
            style={{ maxWidth: '300px', borderRadius: '8px' }}
          />
        </Box>
      )}

      <input
        accept="image/*"
        type="file"
        id="photo-input"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <label htmlFor="photo-input">
        <Button variant="contained" component="span" sx={{ marginBottom: 2 }}>
          Seleccionar Foto
        </Button>
      </label>

      <Button
        onClick={() => setTagMode(!tagMode)}
        variant="outlined"
        sx={{ marginBottom: 2 }}
      >
        {tagMode ? 'Desactivar Modo de Etiquetado' : 'Activar Modo de Etiquetado'}
      </Button>

      {/* Campo para etiquetar personas si el modo está activo */}
      {tagMode && (
        <Autocomplete
          multiple
          options={availableUsers}
          getOptionLabel={(option) => option.name}
          value={tags}
          onChange={(event, newValue) => setTags(newValue)}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Etiquetar Personas" placeholder="Añadir etiquetas" />
          )}
          sx={{ width: '300px', marginBottom: 2 }}
        />
      )}

      <Button
        onClick={handleUpload}
        disabled={!selectedFile}
        variant="contained"
        sx={{ backgroundColor: 'black', color: 'white' }}
      >
        Subir Foto
      </Button>
      
      
    </Box>
        


  );
};

export default EventPhoto;