import { Volcano, FilterType } from "@/types/volcano";
import {VolcaniaAPI} from "@/utils/volcano-api.ts";

const api = new VolcaniaAPI()

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
      return volcanoes
        
    case 'byContinent':
      return volcanoes
      
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
