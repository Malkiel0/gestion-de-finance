import React, { useState, useEffect } from 'react';
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
import { CalendarIcon, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const categories = [
  { id: 'salary', label: 'Salaire', type: 'income' },
  { id: 'freelance', label: 'Freelance', type: 'income' },
  { id: 'rent', label: 'Loyer', type: 'expense' },
  { id: 'groceries', label: 'Courses', type: 'expense' },
  { id: 'transport', label: 'Transport', type: 'expense' },
  { id: 'entertainment', label: 'Loisirs', type: 'expense' },
];

const EditTransactionDialog = ({ isOpen, onClose, transaction, onEditTransaction, onDeleteTransaction }) => {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (transaction) {
      setType(transaction.amount > 0 ? 'income' : 'expense');
      setAmount(Math.abs(transaction.amount).toString());
      setCategory(categories.find(c => c.label === transaction.category)?.id || '');
      setDate(new Date(transaction.date));
    }
  }, [transaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const updatedTransaction = {
        ...transaction,
        type,
        amount: type === 'expense' ? -Number(amount) : Number(amount),
        category: categories.find(c => c.id === category)?.label || category,
        date: format(date, 'yyyy-MM-dd')
      };

      await onEditTransaction(updatedTransaction);
      onClose();
    } catch (err) {
      setError('Une erreur est survenue lors de la modification');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setError('');

    try {
      await onDeleteTransaction(transaction.id);
      onClose();
    } catch (err) {
      setError('Une erreur est survenue lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      setShowDeleteConfirm(false);
      onClose();
    }}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Modifier la transaction</DialogTitle>
        </DialogHeader>
        {showDeleteConfirm ? (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action est irréversible.
              </AlertDescription>
            </Alert>
            <div className="flex space-x-2">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirmer'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full"
              >
                Annuler
              </Button>
            </div>
          </div>
        ) : (
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
              <Label htmlFor="amount">Montant</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white"
              />
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

            <div className="flex space-x-2">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Modifier'
                )}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full"
              >
                Supprimer
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionDialog;