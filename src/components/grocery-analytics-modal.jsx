import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChartBar, X } from 'lucide-react';
import GroceryStatistics from './grocery-statistics';
import ItemSuggestions from './item-suggestions';
import PriceHistoryChart from './price-history-chart';

const GroceryAnalyticsModal = ({ isOpen, onClose, transactions }) => {
  const groceryTransactions = transactions.filter(t => 
    t.category === 'Courses' && t.details && t.details.length > 0
  );

  // Extraire l'historique des prix de tous les articles
  const itemsHistory = groceryTransactions.reduce((acc, transaction) => {
    transaction.details.forEach(item => {
      if (!acc[item.name]) {
        acc[item.name] = [];
      }
      acc[item.name].push({
        date: transaction.date,
        price: item.price,
        quantity: item.quantity
      });
    });
    return acc;
  }, {});

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <ChartBar className="h-6 w-6" />
            Analyse des courses
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <ScrollArea className="h-full pr-4">
          <div className="space-y-8">
            {/* Statistiques générales */}
            <section>
              <GroceryStatistics transactions={groceryTransactions} />
            </section>

            {/* Suggestions et historique des prix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Suggestions d'articles */}
              <section>
                <h3 className="text-lg font-semibold mb-4">Suggestions</h3>
                <ItemSuggestions 
                  recentItems={groceryTransactions.flatMap(t => 
                    t.details.map(item => ({
                      ...item,
                      date: t.date
                    }))
                  )}
                  onSelectItem={(item) => {
                    // À implémenter: action lors de la sélection d'un article
                    console.log('Selected item:', item);
                  }}
                />
              </section>

              {/* Historique des prix */}
              <section>
                <h3 className="text-lg font-semibold mb-4">Évolution des prix</h3>
                <div className="space-y-4">
                  {Object.entries(itemsHistory)
                    .sort(([,a], [,b]) => b.length - a.length)
                    .slice(0, 3)
                    .map(([itemName, history]) => (
                      <PriceHistoryChart 
                        key={itemName}
                        itemHistory={history}
                        itemName={itemName}
                      />
                    ))
                  }
                </div>
              </section>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default GroceryAnalyticsModal;