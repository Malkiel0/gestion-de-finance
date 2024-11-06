import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, ListPlus, Plus } from "lucide-react";
import GroceryDetailsDialog from './grocery-details-dialog';
import ItemSuggestions from './item-suggestions';

const categories = [
  { id: 'salary', label: 'Salaire', type: 'income' },
  { id: 'freelance', label: 'Freelance', type: 'income' },
  { id: 'rent', label: 'Loyer', type: 'expense' },
  { id: 'groceries', label: 'Courses', type: 'expense' },
  { id: 'transport', label: 'Transport', type: 'expense' },
  { id: 'entertainment', label: 'Loisirs', type: 'expense' },
];

export const AddTransactionDialog = ({ isOpen, onClose, onAddTransaction, transactions }) => {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGroceryDetailsOpen, setIsGroceryDetailsOpen] = useState(false);
  const [groceryItems, setGroceryItems] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const transaction = {
        id: Date.now(),
        type,
        amount: type === 'expense' ? -Number(amount) : Number(amount),
        category: categories.find(c => c.id === category)?.label || category,
        date: format(date, 'yyyy-MM-dd'),
        details: category === 'groceries' ? groceryItems : null
      };

      await onAddTransaction(transaction);
      onClose();
      // Réinitialiser l'état
      setGroceryItems([]);
      setAmount('');
      setCategory('');
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };
  // Préparer les données pour les suggestions
  const recentItems = transactions
    .filter(t => t.category === 'Courses' && t.details)
    .flatMap(t => t.details.map(item => ({
      ...item,
      date: t.date
    })));

  const handleGroceryDetailsSave = (items) => {
    setGroceryItems(items);
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setAmount(total.toFixed(2));
    setShowSuggestions(false);
  };

  const handleSelectSuggestedItem = (item) => {
    const newItems = [...groceryItems, {
      id: Date.now(),
      name: item.name,
      price: item.lastPrice,
      quantity: 1
    }];
    setGroceryItems(newItems);
    const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setAmount(total.toFixed(2));
  };


  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-gray-900 to-blue-900 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Nouvelle transaction</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Dépense</SelectItem>
                  <SelectItem value="income">Revenu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter(cat => cat.type === type)
                    .map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="amount">Montant</Label>
                {category === 'groceries' && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:text-blue-300"
                    onClick={() => setIsGroceryDetailsOpen(true)}
                  >
                    <ListPlus className="h-4 w-4 mr-2" />
                    Détailler les courses
                  </Button>
                )}
              </div>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white"
                readOnly={category === 'groceries' && groceryItems.length > 0}
              />
              {category === 'groceries' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Articles</Label>
                    <div className="space-x-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-blue-400 hover:text-blue-300"
                        onClick={() => setShowSuggestions(!showSuggestions)}
                      >
                        Suggestions
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-blue-400 hover:text-blue-300"
                        onClick={() => setIsGroceryDetailsOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter
                      </Button>
                    </div>
                  </div>

                  {showSuggestions && (
                    <div className="mt-2">
                      <ItemSuggestions
                        recentItems={recentItems}
                        onSelectItem={handleSelectSuggestedItem}
                      />
                    </div>
                  )}

                  {groceryItems.length > 0 && (
                    <div className="bg-white/5 rounded-lg p-3 space-y-2">
                      {groceryItems.map((item, index) => (
                        <div
                          key={item.id || index}
                          className="flex justify-between items-center text-sm"
                        >
                          <span>{item.name}</span>
                          <span>{item.quantity}x {item.price}€</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-white/10 border-white/20 text-white justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, 'P', { locale: fr })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Ajouter'
              )}
            </Button>
          </form>
        </DialogContent>

        <GroceryDetailsDialog
          isOpen={isGroceryDetailsOpen}
          onClose={() => setIsGroceryDetailsOpen(false)}
          initialItems={groceryItems}
          onSave={handleGroceryDetailsSave}
        />

      </Dialog>


    </>
  );
};