import { AQIStatus, HealthCondition, SensorReading } from '@/types';

/**
 * Calculate AQI from PM2.5 concentration
 * Based on US EPA AQI calculation method
 */
export function calculateAQIFromPM25(pm25: number): number {
  const breakpoints = [
    { low: 0, high: 12, aqiLow: 0, aqiHigh: 50 },
    { low: 12.1, high: 35.4, aqiLow: 51, aqiHigh: 100 },
    { low: 35.5, high: 55.4, aqiLow: 101, aqiHigh: 150 },
    { low: 55.5, high: 150.4, aqiLow: 151, aqiHigh: 200 },
    { low: 150.5, high: 250.4, aqiLow: 201, aqiHigh: 300 },
    { low: 250.5, high: 500.4, aqiLow: 301, aqiHigh: 500 },
  ];

  for (const bp of breakpoints) {
    if (pm25 >= bp.low && pm25 <= bp.high) {
      return Math.round(
        ((bp.aqiHigh - bp.aqiLow) / (bp.high - bp.low)) * (pm25 - bp.low) + bp.aqiLow
      );
    }
  }

  return pm25 > 500 ? 500 : 0;
}

/**
 * Get AQI status from AQI value
 */
export function getAQIStatus(aqi: number): AQIStatus {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy';
  return 'hazardous';
}

/**
 * Generate personalized health advice based on AQI and health conditions
 */
export function getPersonalizedAdvice(
  readings: SensorReading,
  conditions: HealthCondition[]
): string[] {
  const advice: string[] = [];
  const { pm25, pm10, co2 } = readings;

  // General advice
  if (pm25 > 35) {
    advice.push('PM2.5 levels are elevated. Consider limiting outdoor activities.');
  }

  // Condition-specific advice
  if (conditions.includes('asthma')) {
    if (pm25 > 25) {
      advice.push('As someone with asthma, avoid strenuous outdoor activities and carry your inhaler.');
    }
    if (pm25 > 50) {
      advice.push('HIGH ALERT: PM2.5 is at unsafe levels for asthma. Stay indoors with air filtration.');
    }
  }

  if (conditions.includes('heart_disease') || conditions.includes('elderly')) {
    if (pm25 > 35) {
      advice.push('Elevated pollution may affect cardiovascular health. Consider staying indoors.');
    }
    if (pm25 > 55) {
      advice.push('ALERT: Air quality may pose serious cardiovascular risks. Avoid all outdoor exertion.');
    }
  }

  if (conditions.includes('allergies')) {
    if (pm10 > 50) {
      advice.push('High particulate matter may trigger allergies. Consider taking antihistamines.');
    }
  }

  if (conditions.includes('copd')) {
    if (pm25 > 20) {
      advice.push('COPD patients should avoid outdoor activities when PM2.5 exceeds 20 µg/m³.');
    }
  }

  if (conditions.includes('weak_immunity')) {
    if (pm25 > 35) {
      advice.push('Those with weakened immune systems should limit exposure during elevated pollution.');
    }
  }

  // CO2 advice (indoor)
  if (co2 > 1000) {
    advice.push('Indoor CO₂ levels are high. Open windows or improve ventilation.');
  }
  if (co2 > 1500) {
    advice.push('POOR VENTILATION: CO₂ levels indicate inadequate fresh air. Ventilate immediately.');
  }

  // Default good news
  if (advice.length === 0) {
    advice.push('Air quality is good. Enjoy your outdoor activities!');
  }

  return advice;
}

/**
 * Calculate health risk score (0-100) based on AQI and health profile
 */
export function calculateHealthRisk(
  aqi: number,
  conditions: HealthCondition[],
  sensitivity: 'low' | 'medium' | 'high'
): number {
  let baseRisk = (aqi / 500) * 100; // Normalize to 0-100

  // Adjust for health conditions
  const conditionMultipliers: Record<HealthCondition, number> = {
    asthma: 1.5,
    allergies: 1.2,
    copd: 1.8,
    heart_disease: 1.6,
    weak_immunity: 1.3,
    elderly: 1.4,
  };

  let multiplier = 1;
  conditions.forEach(condition => {
    multiplier = Math.max(multiplier, conditionMultipliers[condition] || 1);
  });

  // Adjust for sensitivity
  const sensitivityMultipliers = {
    low: 0.8,
    medium: 1,
    high: 1.3,
  };

  baseRisk *= multiplier * sensitivityMultipliers[sensitivity];

  return Math.min(100, Math.round(baseRisk));
}

/**
 * Get color for AQI status
 */
export function getAQIColor(status: AQIStatus): string {
  const colors: Record<AQIStatus, string> = {
    good: '#43A047',
    moderate: '#FFD700',
    unhealthy: '#FB8C00',
    hazardous: '#E53935',
  };
  return colors[status];
}

/**
 * Format pollutant value with unit
 */
export function formatPollutant(value: number, type: keyof SensorReading): string {
  const units: Partial<Record<keyof SensorReading, string>> = {
    pm25: 'µg/m³',
    pm10: 'µg/m³',
    co2: 'ppm',
    co: 'ppm',
    no2: 'ppb',
    o3: 'ppb',
    so2: 'ppb',
    temperature: '°C',
    humidity: '%',
  };

  return `${value} ${units[type] || ''}`;
}
