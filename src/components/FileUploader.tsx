
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { parseExcelFile } from '@/utils/volcano-utils';
import { Volcano } from '@/types/volcano';
import { FileIcon, Upload } from 'lucide-react';

interface FileUploaderProps {
  onDataLoaded: (data: Volcano[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onDataLoaded }) => {
  const [loading, setLoading] = useState(false);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    toast({
      title: "Analyse du fichier en cours",
      description: "Veuillez patienter pendant le traitement des données...",
    });
    
    try {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const data = await parseExcelFile(file);
        
        if (data.length === 0) {
          toast({
            title: "Aucune donnée trouvée",
            description: "Le fichier ne contient aucune donnée valide avec des coordonnées",
            variant: "destructive"
          });
        } else {
          onDataLoaded(data);
          toast({
            title: "Données chargées avec succès",
            description: `${data.length} volcans ont été importés`,
          });
        }
      } else {
        toast({
          title: "Format de fichier non pris en charge",
          description: "Veuillez télécharger un fichier Excel (.xlsx/.xls)",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error parsing file:", error);
      toast({
        title: "Erreur lors du chargement du fichier",
        description: "Format du fichier incorrect ou colonnes manquantes",
        variant: "destructive"
      });
    }
    
    setLoading(false);
  };
  
  return (
    <div className="flex flex-col items-center p-6 border-2 border-dashed border-border rounded-lg bg-muted/30">
      <FileIcon className="w-10 h-10 text-primary mb-2" />
      <h3 className="text-lg font-semibold mb-1">Importer les données des volcans</h3>
      <p className="text-sm text-muted-foreground mb-4 text-center">
        Téléchargez votre fichier Excel contenant les données volcaniques
      </p>
      <p className="text-xs text-muted-foreground mb-4 text-center">
        Le fichier doit contenir les colonnes suivantes : Volcano Name, Country, Primary Volcano Type,
        Last Known Eruption, Latitude, Longitude, Elevation
      </p>
      
      <div className="relative">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".xlsx,.xls"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={loading}
        />
        <Button variant="default" disabled={loading}>
          {loading ? (
            <>
              <Upload className="mr-2 h-4 w-4 animate-pulse" /> 
              Chargement...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" /> 
              Sélectionner un fichier
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FileUploader;
