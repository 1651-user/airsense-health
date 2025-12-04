import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bell, TrendingUp, Clock, Wind, Droplets } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AQICard } from '@/components/AQICard';
import { HealthAlertBanner } from '@/components/HealthAlertBanner';
import { mockSensors, generateAlerts, getAQILabel, getAQIDescription } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, healthProfile } = useAuth();
  const navigate = useNavigate();

  // Get nearest sensor (mock - first one for demo)
  const primarySensor = mockSensors[0];
  
  // Generate personalized alerts based on health profile
  const alerts = useMemo(() => {
    if (!healthProfile || !user) return [];
    return generateAlerts(user._id, healthProfile.conditions);
  }, [healthProfile, user]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero px-6 pt-12 pb-24 text-primary-foreground">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-primary-foreground/80 text-sm">{greeting}</p>
              <h1 className="text-2xl font-bold">{user?.name || 'User'}</h1>
            </div>
            <button className="relative p-2 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors">
              <Bell className="w-5 h-5" />
              {alerts.length > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-destructive rounded-full text-xs flex items-center justify-center">
                  {alerts.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
            <MapPin className="w-4 h-4" />
            <span>{primarySensor.location.address}</span>
          </div>
        </motion.div>
      </header>

      {/* Main AQI Card */}
      <div className="px-6 -mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-lg mx-auto"
        >
          <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
            {/* AQI Display */}
            <div className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
                <Clock className="w-4 h-4" />
                <span>Updated just now</span>
              </div>
              
              <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                <div className={`absolute inset-0 rounded-full ${
                  primarySensor.status === 'good' ? 'bg-success/20' :
                  primarySensor.status === 'moderate' ? 'bg-aqi-moderate/20' :
                  primarySensor.status === 'unhealthy' ? 'bg-warning/20' :
                  'bg-destructive/20'
                }`} />
                <div className="relative z-10 text-center">
                  <span className={`text-5xl font-bold ${
                    primarySensor.status === 'good' ? 'text-success' :
                    primarySensor.status === 'moderate' ? 'text-aqi-moderate' :
                    primarySensor.status === 'unhealthy' ? 'text-warning' :
                    'text-destructive'
                  }`}>
                    {primarySensor.aqi}
                  </span>
                  <p className="text-sm text-muted-foreground">AQI</p>
                </div>
              </div>

              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                primarySensor.status === 'good' ? 'bg-success/10 text-success' :
                primarySensor.status === 'moderate' ? 'bg-aqi-moderate/10 text-aqi-moderate' :
                primarySensor.status === 'unhealthy' ? 'bg-warning/10 text-warning' :
                'bg-destructive/10 text-destructive'
              }`}>
                {getAQILabel(primarySensor.status)}
              </div>

              <p className="text-sm text-muted-foreground mt-3 max-w-xs mx-auto">
                {getAQIDescription(primarySensor.status)}
              </p>
            </div>

            {/* Pollutant Grid */}
            <div className="grid grid-cols-2 gap-px bg-border">
              {[
                { label: 'PM2.5', value: primarySensor.readings.pm25, unit: 'µg/m³', icon: Wind },
                { label: 'PM10', value: primarySensor.readings.pm10, unit: 'µg/m³', icon: Wind },
                { label: 'CO₂', value: primarySensor.readings.co2, unit: 'ppm', icon: Droplets },
                { label: 'Humidity', value: primarySensor.readings.humidity, unit: '%', icon: Droplets },
              ].map(({ label, value, unit, icon: Icon }) => (
                <div key={label} className="bg-card p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{label}</span>
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    {value} <span className="text-xs text-muted-foreground">{unit}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Health Alerts */}
      {alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-6 mt-6"
        >
          <div className="max-w-lg mx-auto">
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Your Health Alerts
            </h2>
            <HealthAlertBanner alerts={alerts} />
          </div>
        </motion.div>
      )}

      {/* Nearby Sensors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-6 mt-6 pb-8"
      >
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Nearby Sensors
            </h2>
            <button 
              onClick={() => navigate('/map')}
              className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
            >
              View All
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {mockSensors.slice(0, 4).map((sensor, index) => (
              <motion.div
                key={sensor.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <AQICard 
                  sensor={sensor} 
                  compact 
                  onClick={() => navigate(`/forecast?sensor=${sensor.id}`)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
