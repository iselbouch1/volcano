
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mountain } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Mountain className="w-24 h-24 text-volcanic-lava animate-float" />
            <div className="absolute top-0 w-24 h-24 bg-volcanic-lava blur-xl opacity-20 animate-pulse-slow"></div>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page non trouvée</h2>
        
        <p className="text-muted-foreground mb-8">
          La page que vous recherchez semble avoir été engloutie par de la lave ou s'est perdue dans les nuages volcaniques.
        </p>
        
        <Button asChild>
          <Link to="/">
            Retourner à l'accueil
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
