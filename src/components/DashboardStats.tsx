
import React, { useMemo } from 'react';
import { Volcano } from '@/types/volcano';

interface DashboardStatsProps {
  volcanoes: Volcano[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ volcanoes }) => {
  const stats = useMemo(() => {
    if (!volcanoes.length) {
      return {
        totalCount: 0,
        continentsCount: 0,
        countriesCount: 0,
        highestVolcano: null,
        recentActivity: null,
      };
    }
    
    const countries = new Set(volcanoes.map(v => v.country).filter(Boolean));
    const continents = new Set(volcanoes.map(v => v.region).filter(Boolean));
    
    // Le volcan le plus haut
    const highestVolcano = [...volcanoes]
      .sort((a, b) => b.elevation - a.elevation)[0];
    
    // Le volcan avec l'activité la plus récente (si les dates sont des années)
    const volcanoesWithValidDates = volcanoes
      .filter(v => {
        const year = parseInt(v.lastKnownEruption);
        return !isNaN(year);
      });
    
    const recentActivity = volcanoesWithValidDates.length > 0
      ? [...volcanoesWithValidDates].sort((a, b) => 
          parseInt(b.lastKnownEruption) - parseInt(a.lastKnownEruption)
        )[0]
      : null;
    
    return {
      totalCount: volcanoes.length,
      continentsCount: continents.size,
      countriesCount: countries.size,
      highestVolcano,
      recentActivity,
    };
  }, [volcanoes]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-card shadow-sm rounded-lg p-4 border">
        <h3 className="text-sm font-medium text-muted-foreground">Total de volcans</h3>
        <p className="text-3xl font-bold">{stats.totalCount}</p>
      </div>
      
      <div className="bg-card shadow-sm rounded-lg p-4 border">
        <h3 className="text-sm font-medium text-muted-foreground">Continents</h3>
        <p className="text-3xl font-bold">{stats.continentsCount}</p>
      </div>
      
      <div className="bg-card shadow-sm rounded-lg p-4 border">
        <h3 className="text-sm font-medium text-muted-foreground">Pays</h3>
        <p className="text-3xl font-bold">{stats.countriesCount}</p>
      </div>
      
      <div className="bg-card shadow-sm rounded-lg p-4 border">
        <h3 className="text-sm font-medium text-muted-foreground">Volcan le plus haut</h3>
        <p className="text-xl font-bold truncate">{stats.highestVolcano?.name || "-"}</p>
        {stats.highestVolcano && (
          <p className="text-sm text-muted-foreground">{stats.highestVolcano.elevation} m</p>
        )}
      </div>
    </div>
  );
};

export default DashboardStats;
