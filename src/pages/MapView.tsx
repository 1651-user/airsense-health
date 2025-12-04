import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Layers, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { mockSensors, getAQILabel } from '@/data/mockData';
import { Sensor, AQIStatus } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import 'leaflet/dist/leaflet.css';

// Custom marker icons based on AQI status
const createMarkerIcon = (status: AQIStatus) => {
  const colors: Record<AQIStatus, string> = {
    good: '#43A047',
    moderate: '#FFD700',
    unhealthy: '#FB8C00',
    hazardous: '#E53935',
  };

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 36px;
        height: 36px;
        background: ${colors[status]};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 11px;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);
  
  return null;
}

export default function MapView() {
  const navigate = useNavigate();
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [mapCenter] = useState<[number, number]>([40.7128, -74.0060]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Sensor Map</h1>
            <p className="text-sm text-muted-foreground">10 Active Sensors</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Layers className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon">
              <Navigation className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Map */}
      <div className="h-[calc(100vh-160px)]">
        <MapContainer
          center={mapCenter}
          zoom={12}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={mapCenter} />
          
          {mockSensors.map((sensor) => (
            <Marker
              key={sensor.id}
              position={[sensor.location.lat, sensor.location.lng]}
              icon={createMarkerIcon(sensor.status)}
              eventHandlers={{
                click: () => setSelectedSensor(sensor),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-foreground">{sensor.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{sensor.location.address}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold">{sensor.aqi}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sensor.status === 'good' ? 'bg-success/10 text-success' :
                      sensor.status === 'moderate' ? 'bg-aqi-moderate/10 text-aqi-moderate' :
                      sensor.status === 'unhealthy' ? 'bg-warning/10 text-warning' :
                      'bg-destructive/10 text-destructive'
                    }`}>
                      {getAQILabel(sensor.status)}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate(`/forecast?sensor=${sensor.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-24 left-6 right-6 z-40"
      >
        <div className="max-w-md mx-auto bg-card rounded-xl border border-border shadow-lg p-4">
          <p className="text-sm font-medium text-foreground mb-3">AQI Legend</p>
          <div className="flex items-center justify-between">
            {[
              { status: 'good', label: 'Good', color: 'bg-success' },
              { status: 'moderate', label: 'Moderate', color: 'bg-aqi-moderate' },
              { status: 'unhealthy', label: 'Unhealthy', color: 'bg-warning' },
              { status: 'hazardous', label: 'Hazardous', color: 'bg-destructive' },
            ].map(({ status, label, color }) => (
              <div key={status} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Selected Sensor Panel */}
      {selectedSensor && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-24 left-6 right-6 z-50"
        >
          <div className="max-w-md mx-auto bg-card rounded-xl border border-border shadow-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground">{selectedSensor.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedSensor.location.address}</p>
              </div>
              <button 
                onClick={() => setSelectedSensor(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-2 mb-3">
              <div className="text-center p-2 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">AQI</p>
                <p className="font-bold text-foreground">{selectedSensor.aqi}</p>
              </div>
              <div className="text-center p-2 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">PM2.5</p>
                <p className="font-bold text-foreground">{selectedSensor.readings.pm25}</p>
              </div>
              <div className="text-center p-2 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">PM10</p>
                <p className="font-bold text-foreground">{selectedSensor.readings.pm10}</p>
              </div>
              <div className="text-center p-2 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">CO₂</p>
                <p className="font-bold text-foreground">{selectedSensor.readings.co2}</p>
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={() => navigate(`/forecast?sensor=${selectedSensor.id}`)}
            >
              View Forecast & Details
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
