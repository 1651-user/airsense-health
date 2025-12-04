/**
 * API Service Template for AirSense 5G
 * 
 * This file contains the API integration templates for connecting
 * to a Node.js + Express + MongoDB backend.
 * 
 * To use with a real backend:
 * 1. Set up your Node.js + Express server
 * 2. Configure MongoDB connection
 * 3. Update the API_BASE_URL constant
 * 4. Implement the backend endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('airsense_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'API Error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// ==========================================
// AUTH ENDPOINTS
// ==========================================

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
  };
}

export const authApi = {
  /**
   * POST /auth/signup
   * Create a new user account
   */
  signup: (data: SignupRequest): Promise<AuthResponse> =>
    apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * POST /auth/login
   * Authenticate user and get token
   */
  login: (data: LoginRequest): Promise<AuthResponse> =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ==========================================
// USER PROFILE ENDPOINTS
// ==========================================

export interface HealthProfile {
  userId: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  conditions: string[];
  activity: string;
  sensitivity: string;
}

export const userApi = {
  /**
   * GET /user/profile/:id
   * Get user's health profile
   */
  getProfile: (userId: string): Promise<HealthProfile> =>
    apiCall(`/user/profile/${userId}`),

  /**
   * PUT /user/profile/:id
   * Update user's health profile
   */
  updateProfile: (userId: string, data: Partial<HealthProfile>): Promise<HealthProfile> =>
    apiCall(`/user/profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// ==========================================
// SENSOR ENDPOINTS
// ==========================================

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
  status: 'good' | 'moderate' | 'unhealthy' | 'hazardous';
  lastUpdated: string;
}

export interface SensorHistory {
  timestamp: string;
  readings: SensorReading;
  aqi: number;
}

export interface SensorForecast {
  time: string;
  pm25: number;
  pm10: number;
  aqi: number;
  confidence: number;
}

export const sensorApi = {
  /**
   * GET /sensors/realtime
   * Get real-time data from all sensors
   */
  getRealtime: (): Promise<Sensor[]> =>
    apiCall('/sensors/realtime'),

  /**
   * GET /sensors/history/:id
   * Get historical data for a specific sensor
   */
  getHistory: (sensorId: string, hours: number = 24): Promise<SensorHistory[]> =>
    apiCall(`/sensors/history/${sensorId}?hours=${hours}`),

  /**
   * GET /sensors/forecast/:id
   * Get ML-based forecast for a specific sensor
   */
  getForecast: (sensorId: string, hours: number = 24): Promise<SensorForecast[]> =>
    apiCall(`/sensors/forecast/${sensorId}?hours=${hours}`),
};

// ==========================================
// ALERTS ENDPOINTS
// ==========================================

export interface Alert {
  id: string;
  userId: string;
  timestamp: string;
  pollutant: string;
  message: string;
  severity: 'info' | 'warning' | 'danger';
  read: boolean;
}

export const alertApi = {
  /**
   * GET /alerts/:userId
   * Get all alerts for a user
   */
  getAlerts: (userId: string): Promise<Alert[]> =>
    apiCall(`/alerts/${userId}`),

  /**
   * PUT /alerts/:alertId/read
   * Mark an alert as read
   */
  markAsRead: (alertId: string): Promise<void> =>
    apiCall(`/alerts/${alertId}/read`, { method: 'PUT' }),
};

// ==========================================
// CHAT/NLP ENDPOINTS
// ==========================================

export interface ChatRequest {
  message: string;
  userId: string;
  context?: {
    healthConditions?: string[];
    currentAQI?: number;
    location?: string;
  };
}

export interface ChatResponse {
  response: string;
  intent: string;
  confidence: number;
  suggestions?: string[];
}

export const chatApi = {
  /**
   * POST /chat/query
   * Send a message to the NLP chatbot
   */
  sendMessage: (data: ChatRequest): Promise<ChatResponse> =>
    apiCall('/chat/query', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ==========================================
// BACKEND MONGODB COLLECTIONS REFERENCE
// ==========================================

/**
 * MongoDB Collection Schemas (for backend reference):
 * 
 * users:
 * {
 *   _id: ObjectId,
 *   name: string,
 *   email: string (unique),
 *   password_hash: string,
 *   createdAt: Date
 * }
 * 
 * health_profiles:
 * {
 *   _id: ObjectId,
 *   userId: ObjectId (ref: users),
 *   age: number,
 *   gender: string,
 *   conditions: string[],
 *   activity: string,
 *   sensitivity: string,
 *   updatedAt: Date
 * }
 * 
 * sensors:
 * {
 *   _id: ObjectId,
 *   sensorId: string (unique),
 *   name: string,
 *   location: {
 *     lat: number,
 *     lng: number,
 *     address: string
 *   },
 *   isActive: boolean
 * }
 * 
 * sensor_history:
 * {
 *   _id: ObjectId,
 *   sensorId: string,
 *   timestamp: Date,
 *   readings: {
 *     pm25: number,
 *     pm10: number,
 *     co2: number,
 *     co: number,
 *     no2: number,
 *     o3: number,
 *     so2: number,
 *     temperature: number,
 *     humidity: number
 *   },
 *   aqi: number
 * }
 * 
 * sensor_predictions:
 * {
 *   _id: ObjectId,
 *   sensorId: string,
 *   generatedAt: Date,
 *   predictions: [{
 *     time: Date,
 *     pm25: number,
 *     pm10: number,
 *     aqi: number,
 *     confidence: number
 *   }],
 *   model: string (e.g., "XGBoost", "LSTM", "VAR")
 * }
 * 
 * alerts:
 * {
 *   _id: ObjectId,
 *   userId: ObjectId (ref: users),
 *   timestamp: Date,
 *   pollutant: string,
 *   message: string,
 *   severity: string,
 *   read: boolean
 * }
 */

export default {
  auth: authApi,
  user: userApi,
  sensor: sensorApi,
  alert: alertApi,
  chat: chatApi,
};
