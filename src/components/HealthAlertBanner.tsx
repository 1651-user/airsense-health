import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Heart, Shield, X } from 'lucide-react';
import { Alert } from '@/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface HealthAlertBannerProps {
  alerts: Alert[];
}

const severityStyles = {
  info: 'bg-info/10 border-info/30 text-info',
  warning: 'bg-warning/10 border-warning/30 text-warning',
  danger: 'bg-destructive/10 border-destructive/30 text-destructive',
};

const severityIcons = {
  info: Shield,
  warning: AlertTriangle,
  danger: Heart,
};

export function HealthAlertBanner({ alerts }: HealthAlertBannerProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id));

  const dismissAlert = (id: string) => {
    setDismissedAlerts(prev => new Set([...prev, id]));
  };

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {visibleAlerts.map((alert, index) => {
          const Icon = severityIcons[alert.severity];
          
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative flex items-start gap-3 p-4 rounded-xl border-2",
                severityStyles[alert.severity]
              )}
            >
              <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground">
                  {alert.pollutant} Alert
                </p>
                <p className="text-sm mt-1 text-muted-foreground">
                  {alert.message}
                </p>
              </div>
              <button
                onClick={() => dismissAlert(alert.id)}
                className="p-1 rounded-full hover:bg-background/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
