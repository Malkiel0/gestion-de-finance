import React, { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, TrendingUp } from "lucide-react";

const ItemSuggestions = ({ recentItems, onSelectItem }) => {
  const [suggestions, setSuggestions] = useState({
    recent: [],
    frequent: [],
    trending: []
  });

  useEffect(() => {
    // Traiter les articles récents pour générer les suggestions
    if (recentItems && recentItems.length > 0) {
      // Articles récents (derniers 5)
      const recent = [...new Set(recentItems
        .slice(0, 5)
        .map(item => ({
          ...item,
          lastPrice: item.price
        })))];

      // Articles fréquents
      const frequency = recentItems.reduce((acc, item) => {
        acc[item.name] = (acc[item.name] || 0) + 1;
        return acc;
      }, {});

      const frequent = Object.entries(frequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => {
          const lastItem = recentItems.find(item => item.name === name);
          return {
            name,
            count,
            lastPrice: lastItem.price
          };
        });

      // Articles avec augmentation de prix
      const itemsByName = recentItems.reduce((acc, item) => {
        if (!acc[item.name]) {
          acc[item.name] = [];
        }
        acc[item.name].push(item);
        return acc;
      }, {});

      const trending = Object.entries(itemsByName)
        .map(([name, items]) => {
          if (items.length < 2) return null;
          const sorted = items.sort((a, b) => new Date(b.date) - new Date(a.date));
          const priceChange = ((sorted[0].price - sorted[sorted.length - 1].price) / sorted[sorted.length - 1].price) * 100;
          return {
            name,
            priceChange,
            lastPrice: sorted[0].price
          };
        })
        .filter(Boolean)
        .sort((a, b) => Math.abs(b.priceChange) - Math.abs(a.priceChange))
        .slice(0, 5);

      setSuggestions({ recent, frequent, trending });
    }
  }, [recentItems]);

  return (
    <Card className="bg-white/5 border-white/20">
      <CardHeader>
        <CardTitle className="text-lg text-white">Suggestions d'articles</CardTitle>
      </CardHeader>
      <CardContent>
        <Command className="bg-white/5 border-white/20">
          <CommandInput 
            placeholder="Rechercher un article..."
            className="bg-white/5 border-white/20 text-white"
          />
          <ScrollArea className="h-[300px]">
            <CommandEmpty>Aucun article trouvé</CommandEmpty>
            
            <CommandGroup heading="Récents" className="text-blue-200">
              {suggestions.recent.map((item, index) => (
                <CommandItem
                  key={`recent-${index}`}
                  onSelect={() => onSelectItem(item)}
                  className="hover:bg-white/10 text-white"
                >
                  <Clock className="w-4 h-4 mr-2 text-blue-400" />
                  <span className="flex-1">{item.name}</span>
                  <span className="text-blue-200">{item.lastPrice.toFixed(2)}€</span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="Les plus achetés" className="text-blue-200">
              {suggestions.frequent.map((item, index) => (
                <CommandItem
                  key={`frequent-${index}`}
                  onSelect={() => onSelectItem(item)}
                  className="hover:bg-white/10 text-white"
                >
                  <Star className="w-4 h-4 mr-2 text-yellow-400" />
                  <span className="flex-1">{item.name}</span>
                  <Badge variant="secondary" className="mr-2">
                    {item.count}x
                  </Badge>
                  <span className="text-blue-200">{item.lastPrice.toFixed(2)}€</span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="Évolution des prix" className="text-blue-200">
              {suggestions.trending.map((item, index) => (
                <CommandItem
                  key={`trending-${index}`}
                  onSelect={() => onSelectItem(item)}
                  className="hover:bg-white/10 text-white"
                >
                  <TrendingUp className="w-4 h-4 mr-2 text-red-400" />
                  <span className="flex-1">{item.name}</span>
                  <Badge 
                    variant={item.priceChange > 0 ? "destructive" : "success"}
                    className="mr-2"
                  >
                    {item.priceChange > 0 ? '+' : ''}{item.priceChange.toFixed(1)}%
                  </Badge>
                  <span className="text-blue-200">{item.lastPrice.toFixed(2)}€</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </CardContent>
    </Card>
  );
};

export default ItemSuggestions;