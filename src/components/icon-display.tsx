// src/components/icon-display.tsx
import * as React from 'react';
import {
  Anchor, Bike, Bus, Camera, Car, Castle, Compass, Fish, Grape,
  HeartHandshake, Hotel, Info, LifeBuoy, LucideProps, Map, Mountain,
  Navigation, Palmtree, Plane, Sailboat, Ship, Sprout, Sun, Tent,
  Ticket, Train, TramFront, TreePine, UtensilsCrossed, Waves, Wind,
  Wine, Zap, Backpack, BedDouble, CookingPot,
  MapPin, PersonStanding, ShoppingBag, Utensils, Wifi
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const availableIcons: { [key: string]: React.FC<LucideProps> } = {
  Anchor, Bike, Bus, Camera, Car, Castle, Compass, Fish, Grape,
  HeartHandshake, Hotel, Info, LifeBuoy, Map, Mountain, Navigation,
  Palmtree, Plane, Sailboat, Ship, Sprout, Sun, Tent, Ticket, Train,
  TramFront, TreePine, UtensilsCrossed, Waves, Wind, Wine, Zap,
  Backpack, BedDouble, CookingPot, MapPin,
  PersonStanding, ShoppingBag, Utensils, Wifi
};

type IconDisplayProps = {
  iconName: string;
  className?: string;
};

export const IconDisplay: React.FC<IconDisplayProps> = ({ iconName, className }) => {
  const IconComponent = availableIcons[iconName];

  if (!IconComponent) {
    // Return a default icon or null if the icon name is not found
    return <Info className={cn("h-4 w-4", className)} />;
  }

  return (
    <div className="flex items-center gap-2">
      <IconComponent className={cn("h-4 w-4", className)} />
    </div>
  );
};
