import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from 'lucide-react';

const PriceHistoryChart = ({ itemHistory }) => {
  const priceData = useMemo(() => {
    // Trie les données par date
    const sortedData = [...itemHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Calcule les statistiques
    const prices = sortedData.map(item => item.price);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const lastPrice = prices[prices.length - 1];
    const priceChange = ((lastPrice - prices[0]) / prices[0] * 100).toFixed(1);

    return {
      data: sortedData.map(item => ({
        date: format(new Date(item.date), 'd MMM', { locale: fr }),
        price: item.price,
      })),
      stats: { avgPrice, minPrice, maxPrice, priceChange }
    };
  }, [itemHistory]);

  return (
    <Card className="bg-white/5 border-white/20">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-white">Évolution du prix</CardTitle>
          <Badge 
            variant={priceData.stats.priceChange > 0 ? "destructive" : "success"}
            className="flex items-center gap-1"
          >
            {priceData.stats.priceChange > 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(priceData.stats.priceChange)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="#94A3B8"
                tick={{ fill: '#94A3B8' }}
              />
              <YAxis 
                stroke="#94A3B8"
                tick={{ fill: '#94A3B8' }}
                domain={['dataMin - 0.5', 'dataMax + 0.5']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(30, 41, 59, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  color: '#fff'
                }}
                formatter={(value) => [`${value.toFixed(2)}€`, 'Prix']}
              />
              <ReferenceLine 
                y={priceData.stats.avgPrice} 
                stroke="#94A3B8" 
                strokeDasharray="3 3"
                label={{ 
                  value: 'Moyenne', 
                  position: 'right',
                  fill: '#94A3B8'
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <div className="text-sm text-blue-200">Min</div>
            <div className="font-bold">{priceData.stats.minPrice.toFixed(2)}€</div>
          </div>
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <div className="text-sm text-blue-200">Moyenne</div>
            <div className="font-bold">{priceData.stats.avgPrice.toFixed(2)}€</div>
          </div>
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <div className="text-sm text-blue-200">Max</div>
            <div className="font-bold">{priceData.stats.maxPrice.toFixed(2)}€</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceHistoryChart;