"use client";

import React, { useState, useEffect } from 'react';
import { PlusCircle, Wallet, TrendingUp, PieChart, Settings, CreditCard, Cloud, Droplets, LogOut, UserCircle, BarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell,
} from 'recharts';
import { useAuth } from './budget/auth-context';
import { LoginModal } from './budget/login-modal';
import { AddTransactionDialog } from './add-transaction-dialog';


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditTransactionDialog from './budget/edit-transaction-dialog';
import TransactionFilters from './budget/transaction-filters';
import ExportDialog from './export-dialog';
import StatisticsDialog from './statistics-dialog';
import TransactionDetailsDialog from './transaction-details-dialog';
import GroceryAnalyticsModal from './grocery-analytics-modal';


// Ajoutez cette constante après vos imports mais avant le composant BudgetDashboard
const categories = [
  { id: 'salary', label: 'Salaire', type: 'income' },
  { id: 'freelance', label: 'Freelance', type: 'income' },
  { id: 'rent', label: 'Loyer', type: 'expense' },
  { id: 'groceries', label: 'Courses', type: 'expense' },
  { id: 'transport', label: 'Transport', type: 'expense' },
  { id: 'entertainment', label: 'Loisirs', type: 'expense' },
];







const RainDrop = ({ delay = 0 }) => (
  <div
    className="absolute w-0.5 h-10 bg-blue-400/20 rounded-full animate-rain"
    style={{
      left: `${Math.random() * 100}%`,
      animationDelay: `${delay}ms`,
      filter: 'blur(1px)'
    }}
  />
);

const BudgetDashboard = () => {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [isRaining, setIsRaining] = useState(true);
  const [raindrops, setRaindrops] = useState([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category: 'all',
    period: 'all',
    dateRange: null
  });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isTransactionDetailsOpen, setIsTransactionDetailsOpen] = useState(false);
  const [isGroceryAnalyticsOpen, setIsGroceryAnalyticsOpen] = useState(false);
  
  const handleAddTransaction = async (newTransaction) => {
    try {
      // Créer une copie de la nouvelle transaction avec un ID unique
      const transactionToAdd = {
        ...newTransaction,
        id: Date.now(), // Utiliser un timestamp comme ID unique
      };

      // Mettre à jour l'état local avec la nouvelle transaction
      const updatedTransactions = [transactionToAdd, ...transactions];
      setTransactions(updatedTransactions);
      calculateBalance(updatedTransactions);

      // Si l'utilisateur est connecté, sauvegarder dans le localStorage
      if (user) {
        localStorage.setItem(`transactions_${user.id}`, JSON.stringify(updatedTransactions));
      }

      // Fermer le dialogue d'ajout de transaction
      setIsAddTransactionOpen(false);

      // Optionnel : Afficher une notification de succès
      // toast.success('Transaction ajoutée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la transaction:', error);
      // Optionnel : Afficher une notification d'erreur
      // toast.error('Erreur lors de l\'ajout de la transaction');
    }
  };


  // Effet sonore de la pluie
  useEffect(() => {
    const audio = new Audio('/rain.mp3');
    if (isRaining) {
      audio.loop = true;
      audio.volume = 0.3;
      audio.play().catch(() => console.log('Lecture audio impossible'));
    }
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isRaining]);

  // Génération des gouttes de pluie
  useEffect(() => {
    const drops = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      delay: Math.random() * 2000
    }));
    setRaindrops(drops);
  }, []);

  // Données de démonstration
  const mockTransactions = [
    { id: 1, type: 'income', amount: 3000, category: 'Salaire', date: '2024-03-01' },
    { id: 2, type: 'expense', amount: -500, category: 'Loyer', date: '2024-03-02' },
    { id: 3, type: 'expense', amount: -200, category: 'Courses', date: '2024-03-03' },
    { id: 4, type: 'expense', amount: -150, category: 'Transport', date: '2024-03-04' },
    { id: 5, type: 'income', amount: 500, category: 'Freelance', date: '2024-03-05' }
  ];

  useEffect(() => {
    // Charger les transactions depuis le localStorage si l'utilisateur est connecté
    if (user) {
      const storedTransactions = localStorage.getItem(`transactions_${user.id}`);
      if (storedTransactions) {
        const parsedTransactions = JSON.parse(storedTransactions);
        setTransactions(parsedTransactions);
        calculateBalance(parsedTransactions);
      } else {
        setTransactions(mockTransactions);
        calculateBalance(mockTransactions);
      }
    } else {
      setTransactions([]);
      setCurrentBalance(0);
    }
  }, [user]);

  const calculateBalance = (trans) => {
    const total = trans.reduce((acc, curr) => acc + curr.amount, 0);
    setCurrentBalance(total);
  };



  const handleTransactionClick = (transaction) => {
    if (transaction.category === 'Courses' && transaction.details) {
      setSelectedTransaction(transaction);
      setIsTransactionDetailsOpen(true);
    } else {
      setEditingTransaction(transaction);
    }
  };

  const handleEditTransaction = async (updatedTransaction) => {
    const updatedTransactions = transactions.map(t =>
      t.id === updatedTransaction.id ? updatedTransaction : t
    );
    setTransactions(updatedTransactions);
    calculateBalance(updatedTransactions);

    if (user) {
      localStorage.setItem(`transactions_${user.id}`, JSON.stringify(updatedTransactions));
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    const updatedTransactions = transactions.filter(t => t.id !== transactionId);
    setTransactions(updatedTransactions);
    calculateBalance(updatedTransactions);

    if (user) {
      localStorage.setItem(`transactions_${user.id}`, JSON.stringify(updatedTransactions));
    }
  };

  const lineData = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
    balance: currentBalance - (i * 100)
  })).reverse();


  const filterTransactions = (transactions) => {
    return transactions.filter(transaction => {
      // Filtre de recherche
      if (filters.search && !transaction.category.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Filtre par type
      if (filters.type !== 'all' && transaction.type !== filters.type) {
        return false;
      }

      // Filtre par catégorie
      if (filters.category !== 'all') {
        const categoryInfo = categories.find(c => c.id === filters.category);
        if (categoryInfo) {
          return transaction.category === categoryInfo.label;
        }
        return false;
      }

      // Filtre par période
      if (filters.period !== 'all') {
        const transactionDate = new Date(transaction.date);
        const today = new Date();

        switch (filters.period) {
          case 'today':
            return transactionDate.toDateString() === today.toDateString();

          case 'week':
            const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return transactionDate >= lastWeek;

          case 'month':
            return (
              transactionDate.getMonth() === today.getMonth() &&
              transactionDate.getFullYear() === today.getFullYear()
            );

          case 'year':
            return transactionDate.getFullYear() === today.getFullYear();

          case 'custom':
            if (filters.dateRange?.from && filters.dateRange?.to) {
              return (
                transactionDate >= filters.dateRange.from &&
                transactionDate <= filters.dateRange.to
              );
            }
            break;
        }
      }

      return true;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 relative overflow-hidden">
      {/* Effet de pluie */}
      <div className="fixed inset-0 pointer-events-none">
        {raindrops.map(drop => (
          <RainDrop key={drop.id} delay={drop.delay} />
        ))}
      </div>

      {/* Effet de brouillard */}
      <div className="fixed inset-0 bg-gradient-to-t from-blue-500/5 to-transparent animate-fog" />

      {/* En-tête glacé */}
      <div className="relative backdrop-blur-sm bg-white/10 border-b border-white/20 p-6 mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent" />
        <div className="relative flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">
            <span className="relative">
              Finance Flow
              <span className="absolute -inset-1 bg-blue-500/20 blur-sm" />
            </span>
          </h1>
          <div className="flex items-center space-x-4">
            <Cloud className="text-blue-300 animate-pulse" />
            <Droplets className="text-blue-300 animate-bounce" />
            {user ? (
              <>
                <Button
                  onClick={() => setIsAddTransactionOpen(true)}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-9 w-9 cursor-pointer">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white/10 backdrop-blur-md border-white/20">
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-red-400 focus:text-red-400 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                onClick={() => setIsLoginOpen(true)}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <UserCircle className="w-4 h-4 mr-2" />
                Connexion
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto p-6 space-y-8">
        {user ? (
          <>
            {/* Carte du solde avec effet glacé */}
            <Card className="relative overflow-hidden backdrop-blur-md bg-white/10 border-none">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent" />
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              <CardContent className="relative p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-lg mb-2">Solde total</p>
                    <h2 className="text-5xl font-bold text-white">
                      {currentBalance.toLocaleString('fr-FR')} €
                    </h2>
                  </div>
                  <Wallet className="w-12 h-12 text-blue-300" />
                </div>
              </CardContent>
            </Card>

            {/* Grille de cartes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Carte graphique linéaire */}
              <Card className="backdrop-blur-md bg-white/5 border-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
                <CardHeader>
                  <CardTitle className="text-white">Évolution du solde</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineData}>
                        <defs>
                          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="date" stroke="#94A3B8" />
                        <YAxis stroke="#94A3B8" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="balance"
                          stroke="#60A5FA"
                          strokeWidth={2}
                          dot={{ stroke: '#60A5FA', strokeWidth: 2 }}
                          activeDot={{ r: 8 }}
                          fill="url(#gradient)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>


              {/* Liste des transactions */}
              <Card className="backdrop-blur-md bg-white/5 border-none relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-white">Dernières transactions</CardTitle>
                  <div className="flex items-center space-x-2 z-10">

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-300 hover:text-blue-200 z-20"
                      onClick={() => setIsAddTransactionOpen(true)}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>

                   
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-300 hover:text-blue-200"
                      onClick={() => setIsGroceryAnalyticsOpen(true)}
                    >
                     <BarChart className="h-4 w-4" />
                    </Button>

                    <div className="relative z-20">
                      <ExportDialog transactions={transactions} />
                      <StatisticsDialog transactions={transactions} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Nouveau composant de filtres */}
                  <TransactionFilters
                    filters={filters}
                    onFilterChange={setFilters}
                  />

                  <div className="space-y-4 max-h-[400px] overflow-y-auto mt-4">
                    {filterTransactions(transactions).length > 0 ? (
                      filterTransactions(transactions).map((transaction) => (
                        <div
                          key={transaction.id}
                          className="relative group p-4 backdrop-blur-sm bg-white/5 rounded-lg transition-all hover:bg-white/10"
                          onClick={() => handleTransactionClick(transaction)}
                        >
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/50 to-purple-500/50 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                {transaction.type === 'income' ?
                                  <TrendingUp className="w-4 h-4 text-green-400" /> :
                                  <CreditCard className="w-4 h-4 text-red-400" />
                                }
                              </div>
                              <div>
                                <p className="text-white font-medium">{transaction.category}</p>
                                <p className="text-sm text-blue-200">{transaction.date}</p>
                              </div>
                            </div>
                            <span className={transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}>
                              {transaction.type === 'income' ? '+' : '-'}
                              {Math.abs(transaction.amount).toLocaleString('fr-FR')} €
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        Aucune transaction ne correspond à vos critères de recherche
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Connectez-vous pour gérer vos finances
            </h2>
            <p className="text-blue-200 mb-8">
              Suivez vos dépenses et vos revenus en toute simplicité
            </p>
            <Button
              onClick={() => setIsLoginOpen(true)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <UserCircle className="w-4 h-4 mr-2" />
              Connexion
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />

<AddTransactionDialog
  isOpen={isAddTransactionOpen}
  onClose={() => setIsAddTransactionOpen(false)}
  onAddTransaction={handleAddTransaction}
  transactions={transactions} // Ajout de cette ligne
/>

      <EditTransactionDialog
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onEditTransaction={handleEditTransaction}
        onDeleteTransaction={handleDeleteTransaction}
        transaction={editingTransaction}
      />

<TransactionDetailsDialog
  isOpen={isTransactionDetailsOpen}
  onClose={() => {
    setIsTransactionDetailsOpen(false);
    setSelectedTransaction(null);
  }}
  transaction={selectedTransaction}
  onDelete={handleDeleteTransaction}
/>


      <GroceryAnalyticsModal
        isOpen={isGroceryAnalyticsOpen}
        onClose={() => setIsGroceryAnalyticsOpen(false)}
        transactions={transactions}
      />

      {/* Animations */}
      <style jsx global>{`
        @keyframes rain {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }

        @keyframes fog {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform:translateX(100%); }
        }

        .animate-rain {
          animation: rain 1.5s linear infinite;
        }

        .animate-fog {
          animation: fog 10s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        /* Scrollbar personnalisée */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Animation pour les cartes au survol */
        .card {
          transition: transform 0.2s ease;
        }

        .card:hover {
          transform: translateY(-2px);
        }

        /* Animation pour les boutons */
        .button-hover-effect {
          position: relative;
          overflow: hidden;
        }

        .button-hover-effect:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transform: translateX(-100%);
        }

        .button-hover-effect:hover:after {
          transform: translateX(100%);
          transition: transform 0.6s ease;
        }
      `}</style>
    </div>
  );
};

export default BudgetDashboard;