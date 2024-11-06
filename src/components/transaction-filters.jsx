import React, { useState } from 'react';
import { Search, Filter, Calendar, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

const TransactionFilters = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });
  const [activeFilters, setActiveFilters] = useState([]);

  const categories = [
    'Salaire', 'Loyer', 'Courses', 'Transport', 'Loisirs', 'Santé',
    'Restaurant', 'Shopping', 'Factures', 'Autres'
  ];

  const updateFilters = () => {
    // Construire la liste des filtres actifs
    const newFilters = [];
    if (searchTerm) newFilters.push({ type: 'search', value: searchTerm });
    if (selectedType !== 'all') newFilters.push({ type: 'type', value: selectedType });
    if (selectedCategory !== 'all') newFilters.push({ type: 'category', value: selectedCategory });
    if (dateRange.start || dateRange.end) newFilters.push({ type: 'date', value: dateRange });
    if (amountRange.min || amountRange.max) newFilters.push({ type: 'amount', value: amountRange });
    
    setActiveFilters(newFilters);

    // Appeler le callback avec tous les filtres
    onFilterChange({
      searchTerm,
      type: selectedType,
      category: selectedCategory,
      dateRange,
      amountRange
    });
  };

  const clearFilter = (filterType) => {
    switch (filterType) {
      case 'search':
        setSearchTerm('');
        break;
      case 'type':
        setSelectedType('all');
        break;
      case 'category':
        setSelectedCategory('all');
        break;
      case 'date':
        setDateRange({ start: '', end: '' });
        break;
      case 'amount':
        setAmountRange({ min: '', max: '' });
        break;
      default:
        break;
    }
    updateFilters();
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedCategory('all');
    setDateRange({ start: '', end: '' });
    setAmountRange({ min: '', max: '' });
    setActiveFilters([]);
    onFilterChange({});
  };

  return (
    <div className="space-y-4">
      {/* Barre de recherche et filtres */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Rechercher une transaction..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                updateFilters();
              }}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        <Select value={selectedType} onValueChange={(value) => {
          setSelectedType(value);
          updateFilters();
        }}>
          <SelectTrigger className="w-[150px] bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="income">Revenus</SelectItem>
            <SelectItem value="expense">Dépenses</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={(value) => {
          setSelectedCategory(value);
          updateFilters();
        }}>
          <SelectTrigger className="w-[150px] bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category.toLowerCase()}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Période
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 bg-white/10 backdrop-blur-md border-white/20">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <label className="text-sm text-gray-200">Du</label>
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => {
                      setDateRange(prev => ({ ...prev, start: e.target.value }));
                      updateFilters();
                    }}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm text-gray-200">Au</label>
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => {
                      setDateRange(prev => ({ ...prev, end: e.target.value }));
                      updateFilters();
                    }}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white">
              <Filter className="w-4 h-4 mr-2" />
              Montant
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 bg-white/10 backdrop-blur-md border-white/20">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <label className="text-sm text-gray-200">Min (€)</label>
                  <Input
                    type="number"
                    value={amountRange.min}
                    onChange={(e) => {
                      setAmountRange(prev => ({ ...prev, min: e.target.value }));
                      updateFilters();
                    }}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm text-gray-200">Max (€)</label>
                  <Input
                    type="number"
                    value={amountRange.max}
                    onChange={(e) => {
                      setAmountRange(prev => ({ ...prev, max: e.target.value }));
                      updateFilters();
                    }}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Filtres actifs */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-400">Filtres actifs:</span>
          {activeFilters.map((filter, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-blue-500/20 text-blue-200 hover:bg-blue-500/30"
            >
              {filter.type === 'search' && `Recherche: ${filter.value}`}
              {filter.type === 'type' && `Type: ${filter.value}`}
              {filter.type === 'category' && `Catégorie: ${filter.value}`}
              {filter.type === 'date' && 'Période personnalisée'}
              {filter.type === 'amount' && 'Montant personnalisé'}
              <button
                onClick={() => clearFilter(filter.type)}
                className="ml-2 hover:text-blue-100"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-400 hover:text-white"
          >
            Effacer tout
          </Button>
        </div>
      )}
    </div>
  );
};

export default TransactionFilters;