import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

const GroceryDetailsDialog = ({ isOpen, onClose, initialItems = [], onSave }) => {
  const [items, setItems] = useState(initialItems);
  const [newItem, setNewItem] = useState({ name: '', price: '', quantity: '1' });

  const addItem = () => {
    if (newItem.name && newItem.price) {
      setItems([...items, { 
        id: Date.now(),
        name: newItem.name,
        price: parseFloat(newItem.price),
        quantity: parseInt(newItem.quantity) || 1
      }]);
      setNewItem({ name: '', price: '', quantity: '1' });
    }
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSubmit = () => {
    onSave(items);
    onClose();
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Détails des courses</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Formulaire d'ajout */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-5">
              <Label>Article</Label>
              <Input
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                placeholder="Nom de l'article"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="col-span-3">
              <Label>Prix (€)</Label>
              <Input
                type="number"
                step="0.01"
                value={newItem.price}
                onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                placeholder="Prix"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="col-span-2">
              <Label>Qté</Label>
              <Input
                type="number"
                min="1"
                value={newItem.quantity}
                onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="col-span-2 flex items-end">
              <Button 
                onClick={addItem}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Liste des articles */}
          <ScrollArea className="h-[300px] rounded-md border border-white/20 p-4">
            <div className="space-y-2">
              {items.map(item => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-blue-200">
                      {item.quantity} × {item.price.toFixed(2)}€ = {(item.quantity * item.price).toFixed(2)}€
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {items.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  Aucun article ajouté
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Total */}
          <div className="flex justify-between items-center py-2 border-t border-white/20">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-xl font-bold">{total.toFixed(2)}€</span>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Enregistrer les détails
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroceryDetailsDialog;