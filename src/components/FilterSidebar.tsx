
import React, { useState } from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "@/components/ui/sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilterType, Volcano } from '@/types/volcano';
import { getUniqueValues } from '@/utils/volcano-utils';
import { Mountain, ArrowDownAZ, ArrowUpAZ, Clock, Globe, MapPin } from 'lucide-react';

interface FilterSidebarProps {
  volcanoes: Volcano[];
  onFilterChange: (filter: FilterType, continent?: string, country?: string) => void;
  isLoading: boolean;
}

const filterOptions = [
  { id: 'all' as FilterType, label: 'Tous les volcans', icon: <Globe className="w-4 h-4 mr-2" /> },
  { id: 'highest' as FilterType, label: 'Top 10 - Les plus hauts', icon: <ArrowUpAZ className="w-4 h-4 mr-2" /> },
  { id: 'lowest' as FilterType, label: 'Top 10 - Les plus bas', icon: <ArrowDownAZ className="w-4 h-4 mr-2" /> },
  { id: 'recentlyActive' as FilterType, label: 'Top 10 - Dernière activité', icon: <Clock className="w-4 h-4 mr-2" /> },
  { id: 'highestStratovolcano' as FilterType, label: 'Top 10 - Strato-volcans les plus hauts', icon: <Mountain className="w-4 h-4 mr-2" /> },
  { id: 'recentlyActiveEurope' as FilterType, label: 'Top 10 - Récemment actifs en Europe', icon: <MapPin className="w-4 h-4 mr-2" /> },
  { id: 'recentlyActiveUSA' as FilterType, label: 'Top 10 - Récemment actifs aux USA', icon: <MapPin className="w-4 h-4 mr-2" /> },
  { id: 'recentlyActiveSouthAmerica' as FilterType, label: 'Top 10 - Récemment actifs en Amérique du Sud', icon: <MapPin className="w-4 h-4 mr-2" /> },
  { id: 'byContinent' as FilterType, label: 'Par continent', icon: <Globe className="w-4 h-4 mr-2" /> },
  { id: 'byCountry' as FilterType, label: 'Par pays', icon: <Globe className="w-4 h-4 mr-2" /> },
];

const FilterSidebar: React.FC<FilterSidebarProps> = ({ volcanoes, onFilterChange, isLoading }) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [selectedContinent, setSelectedContinent] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  
  const continents = getUniqueValues(volcanoes, 'continent');
  const countries = getUniqueValues(volcanoes, 'country');
  
  const handleFilterChange = (value: FilterType) => {
    setSelectedFilter(value);
    
    if (value !== 'byContinent') {
      setSelectedContinent('');
    }
    
    if (value !== 'byCountry') {
      setSelectedCountry('');
    }
    
    onFilterChange(value, selectedContinent, selectedCountry);
  };
  
  const handleContinentChange = (value: string) => {
    setSelectedContinent(value);
    onFilterChange('byContinent', value, selectedCountry);
  };
  
  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    onFilterChange('byCountry', selectedContinent, value);
  };
  
  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <div className="p-4">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            <Mountain className="w-6 h-6 mr-2 text-volcanic-lava" />
            Explorer les Volcans
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            {volcanoes.length > 0 ? `${volcanoes.length} volcans disponibles` : 'Aucun volcan chargé'}
          </p>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Filtres</SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[calc(100vh-250px)]">
              <div className="p-4">
                <RadioGroup 
                  value={selectedFilter} 
                  onValueChange={(value) => handleFilterChange(value as FilterType)}
                  className="space-y-2"
                  disabled={isLoading || volcanoes.length === 0}
                >
                  {filterOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="flex items-center cursor-pointer">
                        {option.icon}
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                
                {selectedFilter === 'byContinent' && (
                  <div className="mt-4">
                    <Label htmlFor="continent-select" className="mb-2 block">
                      Sélectionner un continent
                    </Label>
                    <Select 
                      value={selectedContinent} 
                      onValueChange={handleContinentChange}
                      disabled={continents.length === 0}
                    >
                      <SelectTrigger id="continent-select">
                        <SelectValue placeholder="Choisir un continent" />
                      </SelectTrigger>
                      <SelectContent>
                        {continents.map((continent) => (
                          <SelectItem key={continent} value={continent}>
                            {continent}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {selectedFilter === 'byCountry' && (
                  <div className="mt-4">
                    <Label htmlFor="country-select" className="mb-2 block">
                      Sélectionner un pays
                    </Label>
                    <Select 
                      value={selectedCountry} 
                      onValueChange={handleCountryChange}
                      disabled={countries.length === 0}
                    >
                      <SelectTrigger id="country-select">
                        <SelectValue placeholder="Choisir un pays" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default FilterSidebar;
