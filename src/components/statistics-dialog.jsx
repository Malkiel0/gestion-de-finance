import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  BarChart4, 
  PieChart, 
  TrendingUp, 
  Target,
  Calendar 
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const StatisticsDialog = ({ transactions }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Calcul des données pour le graphique en camembert des dépenses par catégorie
  const categoryData = useMemo(() => {
    const categoryTotals = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
        return acc;
      }, {});

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value
    }));
  }, [transactions]);

  // Calcul des données pour le graphique des tendances mensuelles
  const monthlyData = useMemo(() => {
    const monthlyTotals = transactions.reduce((acc, t) => {
      const date = new Date(t.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = { income: 0, expenses: 0, savings: 0 };
      }
      
      if (t.type === 'income') {
        acc[monthYear].income += t.amount;
      } else {
        acc[monthYear].expenses += Math.abs(t.amount);
      }
      
      acc[monthYear].savings = acc[monthYear].income - acc[monthYear].expenses;
      
      return acc;
    }, {});

    return Object.entries(monthlyTotals)
      .map(([date, values]) => ({
        date,
        ...values
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [transactions]);

  // Calcul des statistiques globales
  const stats = useMemo(() => {
    const total = transactions.reduce((acc, t) => acc + t.amount, 0);
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + Math.abs(t.amount), 0);
    
    return {
      total,
      totalIncome,
      totalExpenses,
      savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0
    };
  }, [transactions]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-300 hover:text-blue-200"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
        >
          <BarChart4 className="h-4 w-4 mr-2" />
          Statistiques
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] bg-gray-900/95 backdrop-blur-lg border-blue-500/20">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Analyse Détaillée</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 gap-4 bg-white/5">
            <TabsTrigger value="overview" className="text-white">
              <TrendingUp className="h-4 w-4 mr-2" />
              Vue d&apos;ensemble
            </TabsTrigger>
            <TabsTrigger value="categories" className="text-white">
              <PieChart className="h-4 w-4 mr-2" />
              Catégories
            </TabsTrigger>
            <TabsTrigger value="trends" className="text-white">
              <Calendar className="h-4 w-4 mr-2" />
              Tendances
            </TabsTrigger>
            <TabsTrigger value="goals" className="text-white">
              <Target className="h-4 w-4 mr-2" />
              Objectifs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/5 border-none">
                <CardHeader>
                  <CardTitle className="text-white">Aperçu Financier</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-200">Revenu Total</span>
                      <span className="text-green-400">
                        {stats.totalIncome.toLocaleString('fr-FR')} €
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-200">Dépenses Totales</span>
                      <span className="text-red-400">
                        {stats.totalExpenses.toLocaleString('fr-FR')} €
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-200">Taux d&apos;épargne</span>
                      <span className="text-blue-400">
                        {stats.savingsRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-none">
                <CardHeader>
                  <CardTitle className="text-white">Répartition des Dépenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="mt-4">
            <Card className="bg-white/5 border-none">
              <CardHeader>
                <CardTitle className="text-white">Détail par Catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="#94A3B8" />
                      <YAxis stroke="#94A3B8" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(30, 41, 59, 0.9)',
                          border: '1px solid rgba(148, 163, 184, 0.2)'
                        }}
                      />
                      <Bar dataKey="value" fill="#60A5FA" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="mt-4">
            <Card className="bg-white/5 border-none">
              <CardHeader>
                <CardTitle className="text-white">Évolution Mensuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="date" stroke="#94A3B8" />
                      <YAxis stroke="#94A3B8" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(30, 41, 59, 0.9)',
                          border: '1px solid rgba(148, 163, 184, 0.2)'
                        }}
                      />
                      <Line type="monotone" dataKey="income" stroke="#4ADE80" name="Revenus" />
                      <Line type="monotone" dataKey="expenses" stroke="#F87171" name="Dépenses" />
                      <Line type="monotone" dataKey="savings" stroke="#60A5FA" name="Épargne" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="mt-4">
            <Card className="bg-white/5 border-none">
              <CardHeader>
                <CardTitle className="text-white">Objectifs Financiers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-blue-200 py-8">
                  Fonctionnalité à venir : Définition et suivi des objectifs financiers
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default StatisticsDialog;