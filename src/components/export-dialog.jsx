import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText, Settings } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ExportDialog = ({ transactions }) => {
  const [fileFormat, setFileFormat] = useState('csv');
  const [period, setPeriod] = useState('all');
  const [isOpen, setIsOpen] = useState(false);

  const filterTransactionsByPeriod = (transactions, period) => {
    const today = new Date();
    const filtered = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      switch (period) {
        case 'month':
          return (
            transactionDate.getMonth() === today.getMonth() &&
            transactionDate.getFullYear() === today.getFullYear()
          );
        case 'year':
          return transactionDate.getFullYear() === today.getFullYear();
        default:
          return true;
      }
    });
    return filtered;
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const exportData = () => {
    const filteredTransactions = filterTransactionsByPeriod(transactions, period);
    let content = '';
    let filename = `transactions_${fileFormat}_${formatDate(new Date())}`;

    if (fileFormat === 'csv') {
      const headers = ['Date', 'Type', 'Catégorie', 'Montant'];
      const rows = filteredTransactions.map(t => [
        t.date,
        t.type,
        t.category,
        t.amount
      ]);
      content = [headers, ...rows].map(row => row.join(',')).join('\n');
      filename += '.csv';
    } else {
      content = JSON.stringify(filteredTransactions, null, 2);
      filename += '.json';
    }

    const blob = new Blob([content], { type: `text/${fileFormat === 'csv' ? 'csv' : 'json'};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-300 hover:text-blue-200 relative"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-900/95 backdrop-blur-lg border-blue-500/20">
        <DialogHeader>
          <DialogTitle className="text-white">Exporter les transactions</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm text-blue-200">Format d&apos;export</label>
            <Select
              value={fileFormat}
              onValueChange={setFileFormat}
            >
              <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Sélectionner le format" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900/95 border-blue-500/20">
                <SelectItem value="csv">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    CSV
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    JSON
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-blue-200">Période</label>
            <Select
              value={period}
              onValueChange={setPeriod}
            >
              <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Sélectionner la période" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900/95 border-blue-500/20">
                <SelectItem value="all">Toutes les transactions</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={exportData}
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
          >
            <FileText className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;