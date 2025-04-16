import { read, utils } from "xlsx";
import { Volcano, FilterType } from "@/types/volcano";

export async function parseExcelFile(file: File): Promise<Volcano[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = utils.sheet_to_json(worksheet, { header: 1 });
        
        const headers = jsonData[1] as string[];
        if (!headers || headers.length === 0) {
          throw new Error("En-têtes de fichier manquants");
        }
        
        const columnIndices = {
          name: headers.findIndex(h => h?.includes("Volcano Name")),
          country: headers.findIndex(h => h?.includes("Country")),
          type: headers.findIndex(h => h?.includes("Primary Volcano Type")),
          lastActivity: headers.findIndex(h => h?.includes("Last Known Eruption")),
          latitude: headers.findIndex(h => h?.includes("Latitude")),
          longitude: headers.findIndex(h => h?.includes("Longitude")),
          altitude: headers.findIndex(h => h?.includes("Elevation")),
          continent: headers.findIndex(h => h?.includes("Region")),
        };
        
        console.log("Indices des colonnes trouvés:", columnIndices);
        
        if (columnIndices.name === -1 || columnIndices.latitude === -1 || columnIndices.longitude === -1) {
          throw new Error("Colonnes essentielles manquantes dans le fichier");
        }
        
        const volcanos: Volcano[] = [];
        for (let i = 2; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          if (!row || row.length === 0) continue;
          
          const volcano: Volcano = {
            id: `volcano-${i-2}`,
            name: row[columnIndices.name] || 'Unknown',
            country: row[columnIndices.country] || 'Unknown',
            type: row[columnIndices.type] || 'Unknown',
            lastActivity: row[columnIndices.lastActivity] || 'Unknown',
            latitude: parseFloat(row[columnIndices.latitude]) || 0,
            longitude: parseFloat(row[columnIndices.longitude]) || 0,
            altitude: columnIndices.altitude !== -1 ? parseFloat(row[columnIndices.altitude]) || 0 : 0,
            continent: columnIndices.continent !== -1 ? row[columnIndices.continent] || 'Unknown' : 'Unknown',
          };
          
          if (!isNaN(volcano.latitude) && !isNaN(volcano.longitude)) {
            volcanos.push(volcano);
          }
        }
        
        console.log(`${volcanos.length} volcans extraits du fichier`);
        resolve(volcanos);
      } catch (error) {
        console.error("Erreur lors de l'analyse du fichier:", error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
}

export function filterVolcanoes(volcanoes: Volcano[], filter: FilterType, selectedContinent?: string, selectedCountry?: string): Volcano[] {
  switch (filter) {
    case 'all':
      return volcanoes;
      
    case 'highest':
      return [...volcanoes]
        .sort((a, b) => b.altitude - a.altitude)
        .slice(0, 10);
        
    case 'lowest':
      return [...volcanoes]
        .filter(v => v.altitude >= 0)
        .sort((a, b) => a.altitude - b.altitude)
        .slice(0, 10);
        
    case 'recentlyActive':
      return [...volcanoes]
        .filter(v => {
          const year = parseInt(v.lastActivity);
          return !isNaN(year);
        })
        .sort((a, b) => parseInt(b.lastActivity) - parseInt(a.lastActivity))
        .slice(0, 10);
        
    case 'highestStratovolcano':
      return [...volcanoes]
        .filter(v => v.type.toLowerCase().includes('strato'))
        .sort((a, b) => b.altitude - a.altitude)
        .slice(0, 10);
        
    case 'recentlyActiveEurope':
      return [...volcanoes]
        .filter(v => v.continent.toLowerCase() === 'europe')
        .filter(v => {
          const year = parseInt(v.lastActivity);
          return !isNaN(year);
        })
        .sort((a, b) => parseInt(b.lastActivity) - parseInt(a.lastActivity))
        .slice(0, 10);
        
    case 'recentlyActiveUSA':
      return [...volcanoes]
        .filter(v => v.country.toLowerCase().includes('états-unis') || 
                     v.country.toLowerCase().includes('etats-unis') || 
                     v.country.toLowerCase().includes('usa') ||
                     v.country.toLowerCase().includes('united states'))
        .filter(v => {
          const year = parseInt(v.lastActivity);
          return !isNaN(year);
        })
        .sort((a, b) => parseInt(b.lastActivity) - parseInt(a.lastActivity))
        .slice(0, 10);
        
    case 'recentlyActiveSouthAmerica':
      return [...volcanoes]
        .filter(v => v.continent.toLowerCase().includes('amérique du sud') || 
                     v.continent.toLowerCase().includes('amerique du sud') ||
                     v.continent.toLowerCase().includes('south america'))
        .filter(v => {
          const year = parseInt(v.lastActivity);
          return !isNaN(year);
        })
        .sort((a, b) => parseInt(b.lastActivity) - parseInt(a.lastActivity))
        .slice(0, 10);
        
    case 'byContinent':
      if (selectedContinent) {
        return volcanoes.filter(v => 
          v.continent.toLowerCase() === selectedContinent.toLowerCase()
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
