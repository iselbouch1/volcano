
export interface Volcano {
  id: number;
  volcanoNumber: number;
  name: string;
  country: string;
  primaryVolcanoType: string;
  activityEvidence: string;
  lastKnownEruption: number | null;
  region: string;
  subRegion: string;
  latitude: number;
  longitude: number;
  elevation: number;
  dominantRockType: string;
  tectonicSetting: string;
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
