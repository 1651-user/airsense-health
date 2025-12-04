import { motion } from 'framer-motion';
import { User, Heart, Activity, Shield, Settings, LogOut, ChevronRight, Bell, Moon, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const conditionLabels: Record<string, string> = {
  asthma: 'Asthma',
  allergies: 'Allergies',
  copd: 'COPD',
  heart_disease: 'Heart Disease',
  weak_immunity: 'Weak Immunity',
  elderly: 'Elderly (60+)',
};

const activityLabels: Record<string, string> = {
  student: 'Student',
  indoor_worker: 'Indoor Worker',
  outdoor_worker: 'Outdoor Worker',
  athlete: 'Athlete',
};

export default function Profile() {
  const { user, healthProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="gradient-hero px-6 pt-12 pb-20 text-primary-foreground">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-foreground/20 backdrop-blur mb-4">
            <User className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold">{user?.name || 'User'}</h1>
          <p className="text-primary-foreground/80">{user?.email}</p>
        </motion.div>
      </header>

      <div className="px-6 -mt-10 max-w-lg mx-auto space-y-6">
        {/* Health Profile Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">Health Profile</h2>
                    <p className="text-sm text-muted-foreground">Your personalized settings</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/health-profile')}>
                  Edit
                </Button>
              </div>

              {healthProfile ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted rounded-xl">
                      <p className="text-xs text-muted-foreground">Age</p>
                      <p className="font-semibold text-foreground">{healthProfile.age} years</p>
                    </div>
                    <div className="p-3 bg-muted rounded-xl">
                      <p className="text-xs text-muted-foreground">Gender</p>
                      <p className="font-semibold text-foreground capitalize">{healthProfile.gender}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Health Conditions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {healthProfile.conditions.length > 0 ? (
                        healthProfile.conditions.map(condition => (
                          <span
                            key={condition}
                            className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-xs font-medium"
                          >
                            {conditionLabels[condition]}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No conditions selected</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted rounded-xl">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        Activity
                      </p>
                      <p className="font-semibold text-foreground text-sm">
                        {activityLabels[healthProfile.activity]}
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-xl">
                      <p className="text-xs text-muted-foreground">Sensitivity</p>
                      <p className={cn(
                        "font-semibold text-sm capitalize",
                        healthProfile.sensitivity === 'low' && 'text-success',
                        healthProfile.sensitivity === 'medium' && 'text-warning',
                        healthProfile.sensitivity === 'high' && 'text-destructive'
                      )}>
                        {healthProfile.sensitivity}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <Button variant="outline" className="w-full" onClick={() => navigate('/health-profile')}>
                  Complete Health Profile
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-0">
              {[
                { icon: Bell, label: 'Notifications', description: 'Manage alert preferences' },
                { icon: Globe, label: 'Location', description: 'Change your default location' },
                { icon: Moon, label: 'Appearance', description: 'Theme and display settings' },
                { icon: Settings, label: 'App Settings', description: 'General app preferences' },
              ].map(({ icon: Icon, label, description }, index) => (
                <button
                  key={label}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 hover:bg-muted transition-colors",
                    index !== 3 && "border-b border-border"
                  )}
                >
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">{label}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center space-y-2"
        >
          <p className="text-sm text-muted-foreground">AirSense 5G v1.0.0</p>
          <p className="text-xs text-muted-foreground">
            Smart Air Quality Monitoring with Personalized Health Insights
          </p>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
