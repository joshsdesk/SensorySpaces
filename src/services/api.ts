import axios from 'axios';
import { SensoryEvent, SensoryVenue, ChildProfile, WeatherAura } from '../types';

const API_BASE = '/api';

export const apiService = {
  // Events
  async getEvents(params?: { q?: string; noise?: string; lights?: string; crowds?: string; lat?: number; lng?: number; radius?: number }): Promise<SensoryEvent[]> {
    try {
      const res = await axios.get(`${API_BASE}/events`, { params });
      return res.data || [];
    } catch (err) {
      console.warn('API fetch events failed, falling back to empty list', err);
      return [];
    }
  },

  async createEvent(eventData: {
    title: string;
    description?: string;
    address?: string;
    date?: string;
    organizer?: string;
    noiseLevel?: string;
    lighting?: string;
    crowdDensity?: string;
    details?: string[];
  }): Promise<SensoryEvent> {
    const res = await axios.post(`${API_BASE}/events`, eventData);
    return res.data;
  },

  async getUnverifiedEvents(): Promise<SensoryEvent[]> {
    try {
      const res = await axios.get(`${API_BASE}/events/unverified`);
      return res.data || [];
    } catch (err) {
      return [];
    }
  },

  async verifyEvent(id: string): Promise<SensoryEvent> {
    const res = await axios.patch(`${API_BASE}/events/${id}/verify`);
    return res.data.event;
  },

  // Venues
  async getVenues(params?: { q?: string; type?: string }): Promise<SensoryVenue[]> {
    try {
      const res = await axios.get(`${API_BASE}/venues`, { params });
      return res.data || [];
    } catch (err) {
      return [];
    }
  },

  // Profiles
  async getProfiles(): Promise<ChildProfile[]> {
    try {
      const res = await axios.get(`${API_BASE}/profiles`);
      return res.data || [];
    } catch (err) {
      return [];
    }
  },

  async createProfile(profileData: Partial<ChildProfile>): Promise<ChildProfile> {
    const res = await axios.post(`${API_BASE}/profiles`, profileData);
    return res.data;
  },

  async updateProfile(id: string, updates: Partial<ChildProfile>): Promise<ChildProfile> {
    const res = await axios.put(`${API_BASE}/profiles/${id}`, updates);
    return res.data;
  },

  // Weather Aura
  async fetchSensoryAura(lat: number = 39.7392, lng: number = -104.9903): Promise<WeatherAura | null> {
    try {
      const res = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude: lat,
          longitude: lng,
          current: 'temperature_2m,weather_code',
          temperature_unit: 'fahrenheit',
          timezone: 'auto'
        }
      });
      if (res.data?.current) {
        const temp = Math.round(res.data.current.temperature_2m);
        const code = res.data.current.weather_code;

        if (code >= 95 && code <= 99) {
          return { type: 'noise', level: 'high', label: 'Thunder Warning', description: 'Thunderstorms likely; sudden sharp noises possible.', icon: '⚡' };
        }
        if (code >= 51 && code <= 82) {
          return { type: 'noise', level: 'low', label: 'Rain Ambient Pattern', description: 'Rhythmic rain patter on roofs and surfaces.', icon: '🌧️' };
        }
        if (code === 0 && temp > 85) {
          return { type: 'comfort', level: 'alert', label: 'Heat & Intense Sunlight', description: 'Bright glare and warmth outdoors.', icon: '☀️' };
        }
        if (code >= 45 && code <= 48) {
          return { type: 'lighting', level: 'dim', label: 'Overcast & Soft Lighting', description: 'Natural diffuse light with low ambient contrast.', icon: '☁️' };
        }
      }
      return { type: 'lighting', level: 'dim', label: 'Optimal Sensory Weather', description: 'Mild conditions with low weather sensory disruption.', icon: '🌤️' };
    } catch (err) {
      return null;
    }
  }
};
