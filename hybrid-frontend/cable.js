import { createConsumer } from '@rails/actioncable';
import * as SecureStore from 'expo-secure-store';

const createActionCableConsumer = async () => {
  try {
    const token = await SecureStore.getItemAsync('JWT_TOKEN'); // JWT puro
    if (!token) {
      console.error('JWT Token not found!');
      return null;
    }

    const websocketURL = `ws://192.168.0.207:3001/cable?token=${encodeURIComponent(token)}`;
    return createConsumer(websocketURL);
  } catch (error) {
    console.error('Error creating ActionCable consumer:', error);
    return null;
  }
};

export default createActionCableConsumer;
