
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, List, BarChart4 } from 'lucide-react';
import { Volcano, FilterType } from '@/types/volcano';
import { filterVolcanoes } from '@/utils/volcano-utils';

import FilterSidebar from '@/components/FilterSidebar';
import VolcanoMap from '@/components/VolcanoMap';
import VolcanoTable from '@/components/VolcanoTable';
import DashboardStats from '@/components/DashboardStats';
import {VolcaniaAPI} from "@/utils/volcano-api.ts";

const api = new VolcaniaAPI("http://localhost:8080")

const Index = () => {
  const [volcanoes, setVolcanoes] = useState<Volcano[]>([]);
  const [filteredVolcanoes, setFilteredVolcanoes] = useState<Volcano[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('map');
  const [selectedVolcano, setSelectedVolcano] = useState<Volcano | null>(null);

  if (volcanoes.length === 0) {
    api.getVolcanoes().then((volcanoes) => {setVolcanoes(volcanoes); handleDataLoaded(volcanoes);});
  }
  
  const handleDataLoaded = (data: Volcano[]) => {
    setVolcanoes(data);
    setFilteredVolcanoes(data);
  };
  
  const handleFilterChange = (filter: FilterType, continent?: string, country?: string) => {
    setIsLoading(true);
    
    // Petit délai pour permettre une animation et éviter de bloquer l'UI
    setTimeout(async () => {
      const filtered = await filterVolcanoes(volcanoes, filter, continent, country);
      setFilteredVolcanoes(filtered);
      setIsLoading(false);
    }, 300);
  };
  
  const handleVolcanoSelection = (volcano: Volcano) => {
    setSelectedVolcano(volcano);
    setActiveTab('map');
  };

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <FilterSidebar 
            volcanoes={volcanoes} 
            onFilterChange={handleFilterChange} 
            isLoading={isLoading}
          />
          
          <main className="flex-1 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur sticky top-0 z-10">
              <div className="flex items-center">
                <SidebarTrigger />
                <h1 className="text-2xl font-bold ml-2">Explorateur de Volcans</h1>
              </div>
              
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab} 
                className="hidden sm:block"
              >
                <TabsList>
                  <TabsTrigger value="map" className="flex items-center">
                    <Globe className="mr-2 h-4 w-4" />
                    Carte
                  </TabsTrigger>
                  <TabsTrigger value="list" className="flex items-center">
                    <List className="mr-2 h-4 w-4" />
                    Liste
                  </TabsTrigger>
                  <TabsTrigger value="stats" className="flex items-center">
                    <BarChart4 className="mr-2 h-4 w-4" />
                    Statistiques
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex-1 p-4">
              {volcanoes.length === 0 ? (
                <div className="max-w-md mx-auto my-8">
                  Loading...
                </div>
              ) : (
                <div className="h-full">
                  {activeTab === 'map' && (
                    <div className="h-[calc(100vh-120px)] rounded-lg overflow-hidden border">
                      <VolcanoMap 
                        volcanoes={filteredVolcanoes}
                        isLoading={isLoading}
                      />
                    </div>
                  )}
                  
                  {activeTab === 'list' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                          {filteredVolcanoes.length} volcans affichés
                        </h2>
                      </div>
                      <VolcanoTable 
                        volcanoes={filteredVolcanoes}
                        onSelectVolcano={handleVolcanoSelection}
                      />
                    </div>
                  )}
                  
                  {activeTab === 'stats' && (
                    <div className="space-y-6">
                      <DashboardStats volcanoes={filteredVolcanoes} />
                      
                      <div className="bg-card rounded-lg border p-6">
                        <h2 className="text-xl font-semibold mb-4">À propos de cette application</h2>
                        <p className="mb-4">
                          Cette application interactive permet de visualiser environ 1300 volcans 
                          du monde entier. Elle offre différentes possibilités de filtrage pour 
                          explorer les volcans selon leur altitude, leur activité récente, 
                          leur type et leur localisation.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Note: Pour utiliser la carte interactive, vous devez fournir 
                          une clé API Mapbox (disponible gratuitement sur mapbox.com).
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Index;
