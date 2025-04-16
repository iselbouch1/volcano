import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Volcano } from '@/types/volcano';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Fix for default marker icon
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface VolcanoMapProps {
  volcanoes: Volcano[];
  isLoading: boolean;
}

const VolcanoMap: React.FC<VolcanoMapProps> = ({ volcanoes, isLoading }) => {
  const [selectedVolcano, setSelectedVolcano] = useState<Volcano | null>(null);

  const handleVolcanoSelect = (volcano: Volcano) => {
    setSelectedVolcano(volcano);
  };

  const handleCloseCard = () => {
    setSelectedVolcano(null);
  };

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-volcanic-lava border-t-transparent animate-spin mb-4"></div>
            <p>Chargement de la carte...</p>
          </div>
        </div>
      )}

      <MapContainer 
        center={[45, 0]} 
        zoom={4} 
        scrollWheelZoom={true} 
        className="w-full h-screen"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {volcanoes.map((volcano) => (
          volcano.latitude && volcano.longitude && (
            <Marker
              key={volcano.id}
              position={[volcano.latitude, volcano.longitude]}
              eventHandlers={{
                click: () => setSelectedVolcano(volcano)
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{volcano.name}</h3>
                  <p>Type: {volcano.primaryVolcanoType || 'Type inconnu'}</p>
                  <p>Altitude: {volcano.elevation} m</p>
                  <p>Localisation: {volcano.country}</p>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>

      {selectedVolcano && (
        <div className="absolute bottom-4 left-4 max-w-sm w-full z-10">
          <Card className="border border-volcanic-lava/30 bg-background/90 backdrop-blur">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{selectedVolcano.name}</CardTitle>
                <button 
                  onClick={() => setSelectedVolcano(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
              <CardDescription>
                {selectedVolcano.primaryVolcanoType || 'Type inconnu'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Altitude:</span>
                  <span>{selectedVolcano.elevation} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Pays:</span>
                  <span>{selectedVolcano.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Coordonnées:</span>
                  <span>
                    {selectedVolcano.latitude.toFixed(2)}, {selectedVolcano.longitude.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Dernière activité:</span>
                  <span>{selectedVolcano.lastKnownEruption || 'Inconnue'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VolcanoMap;
