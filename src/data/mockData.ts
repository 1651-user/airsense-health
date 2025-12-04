import { Sensor, ForecastData, Alert, AQIStatus } from '@/types';

export const mockSensors: Sensor[] = [
  {
    id: 'sensor_1',
    name: 'Downtown Central',
    location: { lat: 40.7128, lng: -74.0060, address: '123 Main St, Downtown' },
    readings: { pm25: 12, pm10: 25, co2: 450, co: 0.5, no2: 15, o3: 30, so2: 5, temperature: 22, humidity: 55 },
    aqi: 42,
    status: 'good',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'sensor_2',
    name: 'Industrial Zone',
    location: { lat: 40.7580, lng: -73.9855, address: '456 Factory Rd, Industrial' },
    readings: { pm25: 55, pm10: 85, co2: 800, co: 1.2, no2: 45, o3: 55, so2: 15, temperature: 24, humidity: 48 },
    aqi: 152,
    status: 'unhealthy',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'sensor_3',
    name: 'Residential Park',
    location: { lat: 40.7829, lng: -73.9654, address: '789 Park Ave, Uptown' },
    readings: { pm25: 8, pm10: 18, co2: 380, co: 0.3, no2: 10, o3: 25, so2: 3, temperature: 21, humidity: 60 },
    aqi: 28,
    status: 'good',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'sensor_4',
    name: 'Highway Junction',
    location: { lat: 40.7484, lng: -73.9857, address: '321 Highway Blvd' },
    readings: { pm25: 38, pm10: 65, co2: 650, co: 0.9, no2: 35, o3: 45, so2: 10, temperature: 23, humidity: 52 },
    aqi: 105,
    status: 'moderate',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'sensor_5',
    name: 'School District',
    location: { lat: 40.7614, lng: -73.9776, address: '555 Education Lane' },
    readings: { pm25: 15, pm10: 28, co2: 520, co: 0.4, no2: 18, o3: 32, so2: 6, temperature: 22, humidity: 58 },
    aqi: 52,
    status: 'moderate',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'sensor_6',
    name: 'Harbor District',
    location: { lat: 40.6892, lng: -74.0445, address: '888 Waterfront Dr' },
    readings: { pm25: 22, pm10: 42, co2: 420, co: 0.6, no2: 22, o3: 38, so2: 8, temperature: 20, humidity: 65 },
    aqi: 68,
    status: 'moderate',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'sensor_7',
    name: 'Tech Campus',
    location: { lat: 40.7589, lng: -73.9851, address: '100 Innovation Way' },
    readings: { pm25: 10, pm10: 20, co2: 400, co: 0.35, no2: 12, o3: 28, so2: 4, temperature: 21, humidity: 55 },
    aqi: 35,
    status: 'good',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'sensor_8',
    name: 'Medical Center',
    location: { lat: 40.7794, lng: -73.9632, address: '200 Health Plaza' },
    readings: { pm25: 18, pm10: 35, co2: 480, co: 0.5, no2: 20, o3: 35, so2: 7, temperature: 22, humidity: 50 },
    aqi: 58,
    status: 'moderate',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'sensor_9',
    name: 'Sports Complex',
    location: { lat: 40.7505, lng: -73.9934, address: '300 Stadium Rd' },
    readings: { pm25: 25, pm10: 48, co2: 550, co: 0.7, no2: 25, o3: 40, so2: 9, temperature: 23, humidity: 45 },
    aqi: 75,
    status: 'moderate',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'sensor_10',
    name: 'Airport Zone',
    location: { lat: 40.6413, lng: -73.7781, address: '1 Airport Blvd' },
    readings: { pm25: 65, pm10: 95, co2: 750, co: 1.5, no2: 55, o3: 60, so2: 18, temperature: 25, humidity: 42 },
    aqi: 175,
    status: 'unhealthy',
    lastUpdated: new Date().toISOString(),
  },
];

export const generateForecastData = (hours: number = 24): ForecastData[] => {
  const data: ForecastData[] = [];
  const now = new Date();
  
  for (let i = 0; i < hours; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000);
    const baseAqi = 45 + Math.sin(i / 6) * 20;
    
    data.push({
      time: time.toISOString(),
      pm25: Math.max(5, baseAqi * 0.4 + Math.random() * 10),
      pm10: Math.max(10, baseAqi * 0.8 + Math.random() * 15),
      aqi: Math.round(Math.max(20, baseAqi + Math.random() * 15)),
    });
  }
  
  return data;
};

export const generateAlerts = (userId: string, conditions: string[]): Alert[] => {
  const alerts: Alert[] = [];
  
  if (conditions.includes('asthma')) {
    alerts.push({
      id: 'alert_1',
      userId,
      timestamp: new Date().toISOString(),
      pollutant: 'PM2.5',
      message: 'PM2.5 levels are elevated. As someone with asthma, avoid outdoor activities and use your inhaler if needed.',
      severity: 'warning',
    });
  }
  
  if (conditions.includes('heart_disease') || conditions.includes('elderly')) {
    alerts.push({
      id: 'alert_2',
      userId,
      timestamp: new Date().toISOString(),
      pollutant: 'PM2.5',
      message: 'Air quality may affect cardiovascular health. Consider staying indoors with filtered air.',
      severity: 'warning',
    });
  }
  
  if (conditions.includes('allergies')) {
    alerts.push({
      id: 'alert_3',
      userId,
      timestamp: new Date().toISOString(),
      pollutant: 'Pollen/PM10',
      message: 'High particulate matter detected. Take antihistamines and limit outdoor exposure.',
      severity: 'info',
    });
  }
  
  return alerts;
};

export const getAQIStatus = (aqi: number): AQIStatus => {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy';
  return 'hazardous';
};

export const getAQILabel = (status: AQIStatus): string => {
  const labels: Record<AQIStatus, string> = {
    good: 'Good',
    moderate: 'Moderate',
    unhealthy: 'Unhealthy',
    hazardous: 'Hazardous',
  };
  return labels[status];
};

export const getAQIDescription = (status: AQIStatus): string => {
  const descriptions: Record<AQIStatus, string> = {
    good: 'Air quality is satisfactory with minimal health risk.',
    moderate: 'Air quality is acceptable. Some pollutants may pose a moderate health concern.',
    unhealthy: 'Members of sensitive groups may experience health effects. General public less likely affected.',
    hazardous: 'Health alert: everyone may experience serious health effects.',
  };
  return descriptions[status];
};
