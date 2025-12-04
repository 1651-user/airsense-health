import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Clock, ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';
import { mockSensors, generateForecastData, getAQILabel } from '@/data/mockData';
import { PollutantChart } from '@/components/PollutantChart';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function Forecast() {
  const [searchParams] = useSearchParams();
  const sensorId = searchParams.get('sensor') || mockSensors[0].id;
  const { healthProfile } = useAuth();
  
  const [selectedPeriod, setSelectedPeriod] = useState<'24h' | '7d'>('24h');
  
  const sensor = mockSensors.find(s => s.id === sensorId) || mockSensors[0];
  
  const forecastData = useMemo(() => {
    return generateForecastData(selectedPeriod === '24h' ? 24 : 168);
  }, [selectedPeriod]);

  // Generate personalized insights
  const insights = useMemo(() => {
    const tips: string[] = [];
    
    if (healthProfile?.conditions.includes('asthma')) {
      if (sensor.readings.pm25 > 35) {
        tips.push('PM2.5 levels are elevated. As someone with asthma, consider wearing a mask if going outdoors.');
      } else {
        tips.push('Current PM2.5 levels are safe for moderate outdoor activity.');
      }
    }
    
    if (healthProfile?.conditions.includes('heart_disease') || healthProfile?.conditions.includes('elderly')) {
      tips.push('Avoid strenuous outdoor activities during peak pollution hours (typically 7-9 AM and 5-7 PM).');
    }
    
    if (healthProfile?.activity === 'athlete') {
      if (sensor.aqi > 80) {
        tips.push('Consider moving your workout indoors or reducing intensity today.');
      } else {
        tips.push('Air quality is suitable for outdoor exercise.');
      }
    }
    
    if (sensor.readings.co2 > 1000) {
      tips.push('High CO₂ levels detected. Ensure good ventilation in indoor spaces.');
    }
    
    if (tips.length === 0) {
      tips.push('Air quality is generally good in your area. Enjoy your day!');
    }
    
    return tips;
  }, [healthProfile, sensor]);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 sticky top-0 z-50">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Air Quality Forecast</h1>
              <p className="text-sm text-muted-foreground">{sensor.name}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-6 max-w-lg mx-auto space-y-6">
        {/* Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex bg-muted rounded-xl p-1"
        >
          <button
            onClick={() => setSelectedPeriod('24h')}
            className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
              selectedPeriod === '24h'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Clock className="w-4 h-4" />
            24 Hours
          </button>
          <button
            onClick={() => setSelectedPeriod('7d')}
            className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
              selectedPeriod === '7d'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Calendar className="w-4 h-4" />
            7 Days
          </button>
        </motion.div>

        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Current AQI</p>
              <p className="text-4xl font-bold text-foreground">{sensor.aqi}</p>
            </div>
            <div className={`px-4 py-2 rounded-xl font-semibold ${
              sensor.status === 'good' ? 'bg-success/10 text-success' :
              sensor.status === 'moderate' ? 'bg-aqi-moderate/10 text-aqi-moderate' :
              sensor.status === 'unhealthy' ? 'bg-warning/10 text-warning' :
              'bg-destructive/10 text-destructive'
            }`}>
              {getAQILabel(sensor.status)}
            </div>
          </div>

          {/* Forecast Trend */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-muted-foreground">
                Expected to be <span className="font-medium text-success">Good</span> in 4 hours
              </span>
            </div>
          </div>
        </motion.div>

        {/* Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PollutantChart 
            data={forecastData} 
            dataKey="aqi" 
            title="AQI Forecast"
            color="hsl(207, 90%, 54%)"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <PollutantChart 
            data={forecastData} 
            dataKey="pm25" 
            title="PM2.5 Forecast"
            color="hsl(122, 40%, 45%)"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <PollutantChart 
            data={forecastData} 
            dataKey="pm10" 
            title="PM10 Forecast"
            color="hsl(33, 97%, 51%)"
          />
        </motion.div>

        {/* Personalized Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-primary/5 border border-primary/20 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">What This Means for You</h3>
          </div>
          <ul className="space-y-3">
            {insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">{insight}</p>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Sensor Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-between"
        >
          <Button variant="outline" size="sm">
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Sensor {mockSensors.findIndex(s => s.id === sensor.id) + 1} of {mockSensors.length}
          </span>
          <Button variant="outline" size="sm">
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
