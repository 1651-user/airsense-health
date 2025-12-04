import { motion } from 'framer-motion';
import { Wind, Droplets, Thermometer } from 'lucide-react';
import { Sensor, AQIStatus } from '@/types';
import { getAQILabel, getAQIDescription } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface AQICardProps {
  sensor: Sensor;
  onClick?: () => void;
  compact?: boolean;
}

const statusStyles: Record<AQIStatus, string> = {
  good: 'bg-success text-success-foreground',
  moderate: 'bg-aqi-moderate text-foreground',
  unhealthy: 'bg-warning text-warning-foreground',
  hazardous: 'bg-destructive text-destructive-foreground',
};

const statusBgStyles: Record<AQIStatus, string> = {
  good: 'from-success/20 to-success/5',
  moderate: 'from-aqi-moderate/20 to-aqi-moderate/5',
  unhealthy: 'from-warning/20 to-warning/5',
  hazardous: 'from-destructive/20 to-destructive/5',
};

export function AQICard({ sensor, onClick, compact = false }: AQICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-xl bg-card border border-border shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg",
        compact ? "p-4" : "p-6"
      )}
    >
      {/* Background gradient based on status */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-50",
        statusBgStyles[sensor.status]
      )} />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className={cn(
              "font-semibold text-foreground",
              compact ? "text-sm" : "text-lg"
            )}>
              {sensor.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {sensor.location.address}
            </p>
          </div>
          
          {/* AQI Badge */}
          <div className={cn(
            "rounded-full px-3 py-1 font-bold",
            statusStyles[sensor.status],
            compact ? "text-lg" : "text-2xl"
          )}>
            {sensor.aqi}
          </div>
        </div>

        {/* Status */}
        <div className="mb-4">
          <span className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
            statusStyles[sensor.status]
          )}>
            {getAQILabel(sensor.status)}
          </span>
          {!compact && (
            <p className="text-sm text-muted-foreground mt-2">
              {getAQIDescription(sensor.status)}
            </p>
          )}
        </div>

        {/* Key Readings */}
        {!compact && (
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
              <Wind className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">PM2.5</p>
                <p className="font-semibold text-sm">{sensor.readings.pm25} µg/m³</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
              <Thermometer className="w-4 h-4 text-warning" />
              <div>
                <p className="text-xs text-muted-foreground">Temp</p>
                <p className="font-semibold text-sm">{sensor.readings.temperature}°C</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
              <Droplets className="w-4 h-4 text-info" />
              <div>
                <p className="text-xs text-muted-foreground">Humidity</p>
                <p className="font-semibold text-sm">{sensor.readings.humidity}%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
