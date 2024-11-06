"use client";

import React from 'react';
import { Search, CalendarRange, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const categories = [
  { id: 'all', label: 'Toutes les catégories' },
  { id: 'salary', label: 'Salaire', type: 'income' },
  { id: 'freelance', label: 'Freelance', type: 'income' },
  { id: 'rent', label: 'Loyer', type: 'expense' },
  { id: 'groceries', label: 'Courses', type: 'expense' },
  { id: 'transport', label: 'Transport', type: 'expense' },
  { id: 'entertainment', label: 'Loisirs', type: 'expense' },
];

const periods = [
  { id: 'all', label: 'Toutes les périodes' },
  { id: 'today', label: 'Aujourd\'hui' },
  { id: 'week', label: 'Cette semaine' },
  { id: 'month', label: 'Ce mois' },
  { id: 'year', label: 'Cette année' },
  { id: 'custom', label: 'Période personnalisée' },
];

const TransactionFilters = ({ 
  onFilterChange, 
  filters 
}) => {
  const handleSearchChange = (e) => {
    onFilterChange({ 
      ...filters, 
      search: e.target.value 
    });
  };

  const handleCategoryChange = (value) => {
    onFilterChange({ 
      ...filters, 
      category: value 
    });
  };

  const handlePeriodChange = (value) => {
    onFilterChange({ 
      ...filters, 
      period: value 
    });
  };

  const handleDateRangeChange = (dates) => {
    onFilterChange({ 
      ...filters, 
      dateRange: dates 
    });
  };

  const handleTypeChange = (value) => {
    onFilterChange({ 
      ...filters, 
      type: value 
    });
  };

  return (
    <div className="space-y-4">

      
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Rechercher une transaction..."
          className="pl-10 bg-white/10 border-white/20 text-white"
          value={filters.search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Filtres rapides */}
      <div className="flex flex-wrap gap-2">
        <Select value={filters.type} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-[140px] bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="income">Revenus</SelectItem>
            <SelectItem value="expense">Dépenses</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.period} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            {periods.map((period) => (
              <SelectItem key={period.id} value={period.id}>
                {period.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {filters.period === 'custom' && (
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white"
              >
                <CalendarRange className="h-4 w-4 mr-2" />
                {filters.dateRange?.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, "P", { locale: fr })} -{" "}
                      {format(filters.dateRange.to, "P", { locale: fr })}
                    </>
                  ) : (
                    format(filters.dateRange.from, "P", { locale: fr })
                  )
                ) : (
                  "Sélectionner les dates"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={filters.dateRange?.from}
                selected={filters.dateRange}
                onSelect={handleDateRangeChange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};

export default TransactionFilters;