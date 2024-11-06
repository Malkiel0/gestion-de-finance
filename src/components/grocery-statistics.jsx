import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  ShoppingBag, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight,
  Package,
  Repeat,
  Euro
} from 'lucide-react';

// Définition des couleurs pour le graphique
const COLORS = [
  '#3B82F6', // bleu
  '#60A5FA', // bleu clair
  '#93C5FD', // bleu plus clair
  '#BFDBFE', // bleu très clair
  '#DBEAFE', // bleu le plus clair
  '#2563EB', // bleu foncé
  '#1D4ED8', // bleu plus foncé
  '#1E40AF', // bleu encore plus foncé
  '#1E3A8A', // bleu très foncé
  '#172554', // bleu le plus foncé
];

const GroceryStatistics = ({ transactions }) => {
  const stats = useMemo(() => {
    // Filtrer les transactions de courses avec des détails
    const groceryTransactions = transactions.filter(
      t => t.category === 'Courses' && t.details
    );

    // Calculer les statistiques par article
    const itemStats = groceryTransactions
      .flatMap(t => t.details)
      .reduce((acc, item) => {
        if (!acc[item.name]) {
          acc[item.name] = {
            name: item.name,
            totalSpent: 0,
            quantity: 0,
            occurrences: 0,
            priceHistory: []
          };
        }
        acc[item.name].totalSpent += item.price * item.quantity;
        acc[item.name].quantity += item.quantity;
        acc[item.name].occurrences += 1;
        acc[item.name].priceHistory.push({
          date: new Date(item.date),
          price: item.price
        });
        return acc;
      }, {});

    // Statistiques mensuelles
    const monthlyStats = groceryTransactions.reduce((acc, t) => {
      const month = format(new Date(t.date), 'MMM yyyy', { locale: fr });
      if (!acc[month]) {
        acc[month] = {
          month,
          total: 0,
          transactions: 0,
          items: 0
        };
      }
      acc[month].total += Math.abs(t.amount);
      acc[month].transactions += 1;
      acc[month].items += t.details.reduce((sum, item) => sum + item.quantity, 0);
      return acc;
    }, {});

    // Préparer les données pour les graphiques
    return {
      overview: {
        totalSpent: groceryTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0),
        avgTransaction: groceryTransactions.length ? 
          groceryTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / groceryTransactions.length : 0,
        totalItems: groceryTransactions.reduce(
          (sum, t) => sum + t.details.reduce((iSum, item) => iSum + item.quantity, 0), 0
        ),
        uniqueItems: Object.keys(itemStats).length
      },
      topItems: Object.entries(itemStats)
        .sort(([,a], [,b]) => b.totalSpent - a.totalSpent)
        .slice(0, 10)
        .map(([name, stats]) => ({
          name,
          value: stats.totalSpent,
          quantity: stats.quantity,
          avgPrice: stats.totalSpent / stats.quantity
        })),
      monthlyData: Object.values(monthlyStats)
        .sort((a, b) => new Date(a.month) - new Date(b.month))
        .slice(-6),
      frequentItems: Object.entries(itemStats)
        .sort(([,a], [,b]) => b.occurrences - a.occurrences)
        .slice(0, 10)
        .map(([name, stats]) => ({
          name,
          occurrences: stats.occurrences,
          avgPrice: stats.totalSpent / stats.quantity
        }))
    };
  }, [transactions]);

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/20">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-blue-200">Total dépensé</p>
                <h3 className="text-2xl font-bold text-white mt-2">
                  {stats.overview.totalSpent.toFixed(2)}€
                </h3>
              </div>
              <Euro className="text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/20">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-blue-200">Panier moyen</p>
                <h3 className="text-2xl font-bold text-white mt-2">
                  {stats.overview.avgTransaction.toFixed(2)}€
                </h3>
              </div>
              <ShoppingBag className="text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/20">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-blue-200">Articles achetés</p>
                <h3 className="text-2xl font-bold text-white mt-2">
                  {stats.overview.totalItems}
                </h3>
              </div>
              <Package className="text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/20">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-blue-200">Articles uniques</p>
                <h3 className="text-2xl font-bold text-white mt-2">
                  {stats.overview.uniqueItems}
                </h3>
              </div>
              <Repeat className="text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analyses détaillées */}
      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList className="bg-white/5 border-white/20">
          <TabsTrigger value="monthly" className="data-[state=active]:bg-white/10">
            <Calendar className="w-4 h-4 mr-2" />
            Évolution mensuelle
          </TabsTrigger>
          <TabsTrigger value="items" className="data-[state=active]:bg-white/10">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Top articles
          </TabsTrigger>
          <TabsTrigger value="frequent" className="data-[state=active]:bg-white/10">
            <Repeat className="w-4 h-4 mr-2" />
            Articles fréquents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="mt-0">
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle>Évolution des dépenses</CardTitle>
              <CardDescription className="text-blue-200">
                Aperçu des 6 derniers mois
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="#94A3B8" />
                    <YAxis stroke="#94A3B8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(30, 41, 59, 0.9)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        color: '#fff'
                      }}
                      formatter={(value) => [`${value.toFixed(2)}€`, 'Montant']}
                    />
                    <Bar dataKey="total" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="mt-0">
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle>Top des dépenses par article</CardTitle>
              <CardDescription className="text-blue-200">
                Articles sur lesquels vous dépensez le plus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.topItems}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                      >
                        {stats.topItems.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(30, 41, 59, 0.9)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '6px',
                          color: '#fff'
                        }}
                        formatter={(value) => [`${value.toFixed(2)}€`, 'Montant']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ScrollArea className="h-[300px]">
                  {stats.topItems.map((item, index) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg"
                    >
                      <div>
                        <span className="font-medium text-white">{item.name}</span>
                        <div className="text-sm text-blue-200">
                          {item.quantity} unités • {item.avgPrice.toFixed(2)}€/unité
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-white">
                          {item.value.toFixed(2)}€
                        </span>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="frequent" className="mt-0">
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle>Articles fréquemment achetés</CardTitle>
              <CardDescription className="text-blue-200">
                Basé sur le nombre d'achats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {stats.frequentItems.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div>
                        <span className="font-medium text-white">{item.name}</span>
                        <div className="text-sm text-blue-200">
                          Prix moyen: {item.avgPrice.toFixed(2)}€
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-white">{item.occurrences}x</span>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroceryStatistics;