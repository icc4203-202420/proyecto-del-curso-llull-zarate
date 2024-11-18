import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.172:3001'; // Cambia a tu IP local o a la de producción según el caso.

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos de espera máxima para las solicitudes.
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api; 