import { Volcano, FilterType } from "@/types/volcano";
import {VolcaniaAPI} from "@/utils/volcano-api.ts";

const api = new VolcaniaAPI("http://localhost:8080")

export async function filterVolcanoes(volcanoes: Volcano[], filter: FilterType, selectedContinent?: string, selectedCountry?: string): Volcano[] {
  switch (filter) {
    case 'all':
      return volcanoes;
      
    case 'highest':
      return await api.getTenHighest()

    case 'lowest':
      return await api.getTenLowest()

    case 'recentlyActive':
      return await api.getTenRecentActivity()

    case 'highestStratovolcano':
      return await api.getTenMostRecentStratovolcanoActivities()

    case 'recentlyActiveEurope':
      return await api.getTenMostRecentEuropeanActivities()

    case 'recentlyActiveUSA':
      return await api.getTenMostRecentAmericanActivities()

    case 'recentlyActiveSouthAmerica':
      return volcanoes.length !== 0 ? volcanoes
          .filter(v => v.region.toLowerCase().includes('amérique du sud') ||
              v.region.toLowerCase().includes('amerique du sud') ||
              v.region.toLowerCase().includes('south america'))
          .filter(v => {
            const year = parseInt(v.lastKnownEruption);
            return !isNaN(year);
          })
          .sort((a, b) => parseInt(b.lastKnownEruption) - parseInt(a.lastKnownEruption))
          .slice(0, 10) : [];

    case 'byContinent':
      if (selectedContinent) {
        return volcanoes.filter(v =>
            v.region.toLowerCase() === selectedContinent.toLowerCase()
        );
      }
      return volcanoes;

    case 'byCountry':
      if (selectedCountry) {
        return volcanoes.filter(v =>
            v.country.toLowerCase() === selectedCountry.toLowerCase()
        );
      }
      return volcanoes;

    default:
      return volcanoes;
  }
}

export function getUniqueValues(volcanoes: Volcano[], field: 'continent' | 'country'): string[] {
  const values = volcanoes.map(volcano => volcano[field]);
  return [...new Set(values)].filter(Boolean).sort();
}
