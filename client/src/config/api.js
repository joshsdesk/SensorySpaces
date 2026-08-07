
import { Platform } from 'react-native';

// In a real production environment, you'd use a .env file or build-time variable.
// For this Beta/Demo, we switch between local dev and a placeholder production URL.

const DEV_API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';
const PROD_API_URL = 'https://api.sensoryspaces.org/api'; // Placeholder for future deployment

const IS_PROD = false; // Toggle this for production testing

const API_ROOT = IS_PROD ? PROD_API_URL : DEV_API_URL;

export default {
    events: `${API_ROOT}/events`,
    auth: `${API_ROOT}/auth`,
    profiles: `${API_ROOT}/profiles`,
    search: `${API_ROOT}/search`,
    venues: `${API_ROOT}/venues`,
    root: API_ROOT
};
