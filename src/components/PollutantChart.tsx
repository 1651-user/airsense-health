import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ForecastData } from '@/types';
import { format } from 'date-fns';

interface PollutantChartProps {
  data: ForecastData[];
  dataKey: 'pm25' | 'pm10' | 'aqi';
  color?: string;
  title: string;
}

export function PollutantChart({ data, dataKey, color = 'hsl(207, 90%, 54%)', title }: PollutantChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    time: format(new Date(item.time), 'HH:mm'),
  }));

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-md">
      <h3 className="font-semibold text-foreground mb-4">{title}</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10 }} 
              className="text-muted-foreground"
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 10 }} 
              className="text-muted-foreground"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${dataKey})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
