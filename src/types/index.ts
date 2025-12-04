export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface HealthProfile {
  userId: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  conditions: HealthCondition[];
  activity: ActivityLevel;
  sensitivity: PollutionSensitivity;
}

export type HealthCondition = 
  | 'asthma' 
  | 'allergies' 
  | 'copd' 
  | 'heart_disease' 
  | 'weak_immunity' 
  | 'elderly';

export type ActivityLevel = 
  | 'student' 
  | 'indoor_worker' 
  | 'outdoor_worker' 
  | 'athlete';

export type PollutionSensitivity = 'low' | 'medium' | 'high';

export interface Sensor {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  readings: SensorReading;
  aqi: number;
  status: AQIStatus;
  lastUpdated: string;
}

export interface SensorReading {
  pm25: number;
  pm10: number;
  co2: number;
  co: number;
  no2: number;
  o3: number;
  so2: number;
  temperature: number;
  humidity: number;
}

export type AQIStatus = 'good' | 'moderate' | 'unhealthy' | 'hazardous';

export interface Alert {
  id: string;
  userId: string;
  timestamp: string;
  pollutant: string;
  message: string;
  severity: 'info' | 'warning' | 'danger';
}

export interface ForecastData {
  time: string;
  pm25: number;
  pm10: number;
  aqi: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
