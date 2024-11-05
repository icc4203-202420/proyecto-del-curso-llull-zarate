import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }
  token = (await Notifications.getExpoPushTokenAsync({ projectId: 'bc90e3fe-355e-464d-a9db-e6645624b1e1' })).data;

  return token;
}

export async function savePushToken() {
    const token = await registerForPushNotificationsAsync();
    if (token) {
      try {
        const JWT_TOKEN = await SecureStore.getItemAsync('JWT_TOKEN')
  
        await axios.post(`http://192.168.0.23:3001/api/v1/users/update_push_token`, {
          expo_push_token: token,
        }, {
          headers: {
            Authorization: `${JWT_TOKEN}`,
          },
        });
      } catch (error) {
        console.error('Error al actualizar el token de notificación:', error);
      }
    }
  }
  