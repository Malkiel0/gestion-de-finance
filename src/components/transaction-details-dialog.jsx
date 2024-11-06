import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ShoppingBag, Calendar, Tag, Wallet, Trash2 } from "lucide-react";

const TransactionDetailsDialog = ({ 
  isOpen, 
  onClose, 
  transaction, 
  onDelete 
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (!transaction) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'PPP', { locale: fr });
  };

  const handleDelete = () => {
    onDelete(transaction.id);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-gray-900 to-blue-900 text-white">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <ShoppingBag className="h-6 w-6" />
              Détails de la transaction
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </DialogHeader>

          <div className="space-y-6">
            {/* Informations générales */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-blue-200 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date
                </div>
                <div className="font-medium">{formatDate(transaction.date)}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-blue-200 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Catégorie
                </div>
                <div className="font-medium">{transaction.category}</div>
              </div>
              <div className="space-y-1 col-span-2">
                <div className="text-sm text-blue-200 flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Montant
                </div>
                <div className={`text-xl font-bold ${
                  transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {Math.abs(transaction.amount).toLocaleString('fr-FR')} €
                </div>
              </div>
            </div>

            {/* Détails des courses si disponible */}
            {transaction.category === 'Courses' && transaction.details && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Détail des articles</h3>
                <ScrollArea className="h-[300px] rounded-md border border-white/20">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/20">
                        <TableHead className="text-blue-200">Article</TableHead>
                        <TableHead className="text-right text-blue-200">Prix unitaire</TableHead>
                        <TableHead className="text-center text-blue-200">Quantité</TableHead>
                        <TableHead className="text-right text-blue-200">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transaction.details.map((item, index) => (
                        <TableRow 
                          key={item.id || index}
                          className="border-white/20 hover:bg-white/5"
                        >
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-right">
                            {item.price.toFixed(2)} €
                          </TableCell>
                          <TableCell className="text-center">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            {(item.price * item.quantity).toFixed(2)} €
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>

                {/* Résumé */}
                <div className="bg-white/5 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">Nombre d'articles</span>
                    <span className="font-medium">
                      {transaction.details.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">Articles uniques</span>
                    <span className="font-medium">{transaction.details.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">Prix moyen par article</span>
                    <span className="font-medium">
                      {(transaction.amount / transaction.details.reduce((sum, item) => sum + item.quantity, 0)).toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-900 text-white border border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Êtes-vous sûr de vouloir supprimer cette transaction et tous ses détails ? 
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDelete}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TransactionDetailsDialog;