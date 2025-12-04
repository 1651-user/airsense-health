import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { mockSensors } from '@/data/mockData';

const suggestedQuestions = [
  "Is it safe for me to go outside?",
  "Why is PM2.5 high in my area?",
  "Give advice for children during high pollution",
  "What should I do if I have asthma?",
];

// Mock AI responses based on health profile
const generateResponse = (query: string, conditions: string[]): string => {
  const lowerQuery = query.toLowerCase();
  const currentAQI = mockSensors[0].aqi;
  
  if (lowerQuery.includes('safe') && lowerQuery.includes('outside')) {
    if (conditions.includes('asthma')) {
      return currentAQI > 50 
        ? `Based on current conditions (AQI: ${currentAQI}) and your asthma, I'd recommend limiting outdoor activities. If you must go out, wear an N95 mask and carry your inhaler. The air quality is expected to improve in the next few hours.`
        : `Current air quality (AQI: ${currentAQI}) is good! It should be safe for outdoor activities. However, as someone with asthma, keep your inhaler handy and avoid areas with heavy traffic.`;
    }
    return currentAQI > 100 
      ? `The current AQI is ${currentAQI}, which is in the unhealthy range. It's best to limit prolonged outdoor exposure, especially for sensitive groups. Consider rescheduling outdoor activities.`
      : `The air quality is ${currentAQI > 50 ? 'moderate' : 'good'} right now (AQI: ${currentAQI}). You can safely go outside for most activities.`;
  }
  
  if (lowerQuery.includes('pm2.5') || lowerQuery.includes('pm 2.5')) {
    return `PM2.5 refers to fine particulate matter smaller than 2.5 micrometers. Current PM2.5 in your area is ${mockSensors[0].readings.pm25} µg/m³. ${
      mockSensors[0].readings.pm25 > 35 
        ? 'This is elevated, likely due to traffic emissions, construction, or regional pollution. Consider using an air purifier indoors.'
        : 'This level is within the safe range. Keep monitoring throughout the day as levels can change.'
    }`;
  }
  
  if (lowerQuery.includes('children') || lowerQuery.includes('kids')) {
    return `For children during elevated pollution:\n\n• Keep windows closed and use air purifiers\n• Limit outdoor playtime, especially during peak hours (7-9 AM, 5-7 PM)\n• Ensure proper hydration\n• Monitor for symptoms like coughing or difficulty breathing\n• Schools should consider moving PE classes indoors when AQI exceeds 100`;
  }
  
  if (lowerQuery.includes('asthma')) {
    return `For asthma management during poor air quality:\n\n• Always carry your rescue inhaler\n• Take preventive medication as prescribed\n• Monitor air quality before outdoor activities\n• Wear an N95 mask when AQI > 50\n• Keep windows closed and use HEPA filters\n• Stay hydrated and avoid triggers like dust and smoke`;
  }
  
  if (lowerQuery.includes('mask')) {
    return `Regarding masks for air pollution:\n\n• N95/KN95 masks filter 95% of particles including PM2.5\n• Surgical masks offer limited protection against fine particles\n• Cloth masks don't protect against air pollution\n• Replace masks when they become damp or dirty\n• Ensure a proper seal around your face for maximum protection`;
  }
  
  return `I understand you're asking about "${query}". Based on the current air quality data:\n\n• AQI: ${currentAQI} (${currentAQI <= 50 ? 'Good' : currentAQI <= 100 ? 'Moderate' : 'Unhealthy'})\n• PM2.5: ${mockSensors[0].readings.pm25} µg/m³\n• PM10: ${mockSensors[0].readings.pm10} µg/m³\n\nWould you like specific advice based on your health profile? Feel free to ask about outdoor activities, health precautions, or air quality trends.`;
};

export default function Chat() {
  const { healthProfile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your AirSense health assistant. I can help you understand air quality data and provide personalized advice based on your health profile. ${
        healthProfile?.conditions.length 
          ? `I see you have ${healthProfile.conditions.join(', ')} in your health profile - I'll tailor my recommendations accordingly.` 
          : ''
      }\n\nHow can I help you today?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const response = generateResponse(text, healthProfile?.conditions || []);
    
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 sticky top-0 z-50">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Health Assistant</h1>
            <p className="text-sm text-muted-foreground">AI-powered air quality advice</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-40">
        <div className="max-w-lg mx-auto space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' ? 'bg-primary' : 'gradient-primary'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-primary-foreground" />
                    ) : (
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-card border border-border'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="bg-card border border-border rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-36 left-0 right-0 px-4"
        >
          <div className="max-w-lg mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Suggested questions</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => handleSend(question)}
                  className="px-3 py-2 bg-card border border-border rounded-full text-sm text-foreground hover:border-primary/50 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Input */}
      <div className="fixed bottom-20 left-0 right-0 bg-background border-t border-border px-4 py-4">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="max-w-lg mx-auto flex gap-3"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about air quality..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
