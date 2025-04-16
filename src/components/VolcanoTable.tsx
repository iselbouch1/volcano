
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Volcano } from '@/types/volcano';

interface VolcanoTableProps {
  volcanoes: Volcano[];
  onSelectVolcano: (volcano: Volcano) => void;
}

const VolcanoTable: React.FC<VolcanoTableProps> = ({ volcanoes, onSelectVolcano }) => {
  return (
    <div className="bg-card border rounded-lg shadow-sm max-h-[500px]">
      <ScrollArea className="h-[500px]">
        <Table>
          <TableHeader className="sticky top-0 bg-card z-10">
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead>Altitude</TableHead>
              <TableHead className="hidden md:table-cell">Dernière activité</TableHead>
              <TableHead>Pays</TableHead>
              <TableHead className="hidden lg:table-cell">Région</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {volcanoes.length > 0 ? (
              volcanoes.map((volcano) => (
                <TableRow 
                  key={volcano.id}
                  onClick={() => onSelectVolcano(volcano)}
                  className="cursor-pointer hover:bg-accent"
                >
                  <TableCell className="font-medium">{volcano.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {volcano.primaryVolcanoType || "-"}
                  </TableCell>
                  <TableCell>{volcano.elevation} m</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {volcano.lastKnownEruption || "-"}
                  </TableCell>
                  <TableCell>{volcano.country || "-"}</TableCell>
                  <TableCell className="hidden lg:table-cell">{volcano.region || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Aucun volcan à afficher
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default VolcanoTable;
