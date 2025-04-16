
export interface Volcano {
  id: string;
  name: string;
  altitude: number;
  country: string;
  continent: string;
  latitude: number;
  longitude: number;
  type: string;
  lastActivity: string;
}

export type FilterType = 
  | 'all'
  | 'highest'
  | 'lowest'
  | 'recentlyActive'
  | 'highestStratovolcano'
  | 'recentlyActiveEurope'
  | 'recentlyActiveUSA'
  | 'recentlyActiveSouthAmerica'
  | 'byContinent'
  | 'byCountry';

export interface FilterOption {
  id: FilterType;
  label: string;
  description?: string;
  icon?: string;
}
