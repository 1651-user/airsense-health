import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Activity, Shield, ChevronRight, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { HealthCondition, ActivityLevel, PollutionSensitivity } from '@/types';
import { cn } from '@/lib/utils';

const healthConditions: { id: HealthCondition; label: string; icon: string }[] = [
  { id: 'asthma', label: 'Asthma', icon: '🫁' },
  { id: 'allergies', label: 'Allergies', icon: '🤧' },
  { id: 'copd', label: 'COPD', icon: '💨' },
  { id: 'heart_disease', label: 'Heart Disease', icon: '❤️' },
  { id: 'weak_immunity', label: 'Weak Immunity', icon: '🛡️' },
  { id: 'elderly', label: 'Elderly (60+)', icon: '👴' },
];

const activityLevels: { id: ActivityLevel; label: string; description: string }[] = [
  { id: 'student', label: 'Student', description: 'Mostly indoors with some outdoor activities' },
  { id: 'indoor_worker', label: 'Indoor Worker', description: 'Office or home-based work' },
  { id: 'outdoor_worker', label: 'Outdoor Worker', description: 'Regular outdoor exposure' },
  { id: 'athlete', label: 'Athlete', description: 'High outdoor activity levels' },
];

const sensitivityLevels: { id: PollutionSensitivity; label: string; color: string }[] = [
  { id: 'low', label: 'Low', color: 'bg-success' },
  { id: 'medium', label: 'Medium', color: 'bg-warning' },
  { id: 'high', label: 'High', color: 'bg-destructive' },
];

export default function HealthProfile() {
  const [step, setStep] = useState(1);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [conditions, setConditions] = useState<HealthCondition[]>([]);
  const [activity, setActivity] = useState<ActivityLevel>('indoor_worker');
  const [sensitivity, setSensitivity] = useState<PollutionSensitivity>('medium');
  
  const { updateHealthProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const toggleCondition = (id: HealthCondition) => {
    setConditions(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleComplete = () => {
    updateHealthProfile({
      age: parseInt(age) || 30,
      gender,
      conditions,
      activity,
      sensitivity,
    });
    
    toast({
      title: 'Profile Complete!',
      description: 'Your health profile has been saved. You will now receive personalized air quality alerts.',
    });
    
    navigate('/dashboard');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Basic Information</h2>
              <p className="text-muted-foreground mt-1">Help us personalize your experience</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Age</label>
                <Input
                  type="number"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="1"
                  max="120"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Gender</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['male', 'female', 'other'] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={cn(
                        "py-3 px-4 rounded-xl border-2 font-medium capitalize transition-all",
                        gender === g
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10 mb-4">
                <Shield className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Health Conditions</h2>
              <p className="text-muted-foreground mt-1">Select any that apply to you</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {healthConditions.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => toggleCondition(id)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                    conditions.includes(id)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <span className="text-2xl">{icon}</span>
                  <span className="font-medium text-sm">{label}</span>
                  {conditions.includes(id) && (
                    <Check className="w-5 h-5 text-primary ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-success/10 mb-4">
                <Activity className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Activity & Sensitivity</h2>
              <p className="text-muted-foreground mt-1">Tell us about your daily routine</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Activity Level</label>
                <div className="space-y-2">
                  {activityLevels.map(({ id, label, description }) => (
                    <button
                      key={id}
                      onClick={() => setActivity(id)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                        activity === id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{label}</p>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
                      {activity === id && <Check className="w-5 h-5 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Pollution Sensitivity
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {sensitivityLevels.map(({ id, label, color }) => (
                    <button
                      key={id}
                      onClick={() => setSensitivity(id)}
                      className={cn(
                        "py-3 px-4 rounded-xl border-2 font-medium transition-all",
                        sensitivity === id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className={cn("w-3 h-3 rounded-full mx-auto mb-2", color)} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "flex-1 h-2 rounded-full transition-all",
                s <= step ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>

        {/* Step Content */}
        {renderStep()}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button
            variant="hero"
            onClick={() => (step < 3 ? setStep(step + 1) : handleComplete())}
            className="flex-1"
          >
            {step < 3 ? (
              <>
                Continue
                <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              'Complete Profile'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
