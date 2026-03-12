import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { MapPin, Zap } from "lucide-react";

type Sample = { imageUrl: string };
type Location = { city: string };

interface Designer {
  distance: number;
  image: string;
  name: string;
  location: Location;
  samples: Sample[];
  averageRating?: number | string | null;
}

export function DesignerCard({ designer }: { designer: Designer }) {
  // Format distance for UI
  const distanceLabel = designer.distance < 5 
    ? "Very Close" 
    : `${Math.round(designer.distance)} km away`;

  return (
    <Card className="w-full max-w-md overflow-hidden border-2 hover:border-primary transition-all">
      <CardHeader className="p-4 flex-row items-center gap-4 space-y-0">
        <div className="relative">
          <img 
            src={designer.image} 
            className="h-12 w-12 rounded-full object-cover" 
            alt={designer.name} 
          />
          {/* Pulsing Online Indicator */}
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white">
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
          </span>
        </div>
        <div>
          <h3 className="font-bold text-lg leading-none">{designer.name}</h3>
          <div className="flex items-center text-muted-foreground text-xs mt-1">
            <MapPin className="h-3 w-3 mr-1" />
            {distanceLabel} • {designer.location.city}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Portfolio Mini-Carousel */}
        <Carousel className="w-full">
          <CarouselContent className="-ml-1">
            {designer.samples.map((sample, index) => (
              <CarouselItem key={index} className="pl-1 basis-full">
                <img 
                  src={sample.imageUrl} 
                  className="aspect-video w-full object-cover bg-muted" 
                  alt="Work sample" 
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </CardContent>

      <CardFooter className="p-4 flex justify-between items-center bg-secondary/10">
        <div className="flex flex-col">
          <span className="text-xs uppercase text-muted-foreground font-semibold">Rating</span>
          <span className="text-sm font-bold">★ {designer.averageRating ?? "New"}</span>
        </div>
        <Button size="sm" className="gap-2">
          <Zap className="h-4 w-4 fill-current" />
          Hire Now
        </Button>
      </CardFooter>
    </Card>
  );
}