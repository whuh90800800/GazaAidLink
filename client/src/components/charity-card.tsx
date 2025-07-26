import { ExternalLink, Star, CircleFadingArrowUp, Globe, MapPin, Stethoscope, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Charity } from "@shared/schema";

interface CharityCardProps {
  charity: Charity;
}

const categoryIcons = {
  muslim: CircleFadingArrowUp,
  international: Globe,
  gaza: MapPin,
  medical: Stethoscope,
  education: GraduationCap,
};

export default function CharityCard({ charity }: CharityCardProps) {
  const IconComponent = categoryIcons[charity.category as keyof typeof categoryIcons] || Star;
  const isFeatured = charity.featured === "true";

  return (
    <Card className={`h-full transition-all duration-300 hover:border-primary/50 ${isFeatured ? 'ring-2 ring-accent/50' : ''}`}>
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-center mb-4">
          <IconComponent className="text-secondary text-xl mr-3 h-5 w-5" />
          <h4 className={`text-xl font-semibold flex-1 ${isFeatured ? 'text-accent' : 'text-primary'}`}>
            {charity.name}
          </h4>
          {isFeatured && (
            <Badge variant="outline" className="bg-accent/20 text-accent border-accent/50">
              Featured
            </Badge>
          )}
        </div>
        
        <p className="text-muted-foreground mb-4 leading-relaxed flex-1">
          {charity.description}
        </p>
        
        <div className="mb-4">
          <Badge 
            variant="secondary" 
            className="bg-secondary/20 text-secondary border-secondary/50"
          >
            {charity.focusArea}
          </Badge>
        </div>
        
        <Button 
          asChild
          className={`mt-auto ${isFeatured ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}
        >
          <a 
            href={charity.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            Visit Website
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
