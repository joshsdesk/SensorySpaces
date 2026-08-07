export type SensoryLevel = 'Low' | 'Medium' | 'High' | 'Dimmed' | 'Natural' | 'Bright' | 'Moderate';

export interface SensoryAttribute {
  value: SensoryLevel;
  status?: 'verified' | 'inferred';
  source?: 'human' | 'baseline' | 'ai';
  confidence?: number;
}

export interface SensoryDetail {
  value: string;
  source?: string;
}

export interface SensoryProfile {
  noiseLevel: SensoryAttribute;
  lighting: SensoryAttribute;
  crowdDensity: SensoryAttribute;
  details: SensoryDetail[];
}

export interface LocationData {
  address: string;
  geo?: {
    type: string;
    coordinates: [number, number]; // [lng, lat]
  };
}

export interface SensoryEvent {
  _id: string;
  metadata: {
    title: string;
    description: string;
    date: string;
    location: LocationData;
    organizer: string;
    source?: string;
  };
  sensoryProfile: SensoryProfile;
  createdAt?: string;
}

export interface SensoryVenue {
  _id: string;
  name: string;
  type: string;
  location: LocationData;
  sensoryProfile: {
    noiseLevel: string;
    lighting: string;
    crowdDensity: string;
    amenities: string[];
  };
}

export interface ChildProfile {
  _id: string;
  userId: string;
  name: string;
  preferences: {
    noiseLevel: string[];
    lighting: string[];
    crowdDensity: string[];
    interests: string[];
    avoidances: string[];
    desiredFeatures: string[];
    preferredTimeOfDay: string[];
    venueType: string[];
    weatherImportance: string;
  };
  onboardingResponses?: Record<string, string>;
  isActive?: boolean;
}

export interface WeatherAura {
  type: 'noise' | 'lighting' | 'comfort';
  level: 'high' | 'low' | 'bright' | 'dim' | 'alert';
  label: string;
  description: string;
  icon: string;
}
