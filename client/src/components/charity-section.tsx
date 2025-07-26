import { CircleFadingArrowUp, Globe, MapPin, Stethoscope, GraduationCap } from "lucide-react";
import CharityCard from "./charity-card";
import type { Charity } from "@shared/schema";

interface CharitySectionProps {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  charities: Charity[];
  className?: string;
}

const icons = {
  mosque: CircleFadingArrowUp,
  globe: Globe,
  "map-pin": MapPin,
  stethoscope: Stethoscope,
  "graduation-cap": GraduationCap,
};

export default function CharitySection({
  id,
  title,
  subtitle,
  icon,
  charities,
  className = "",
}: CharitySectionProps) {
  const IconComponent = icons[icon as keyof typeof icons] || Globe;

  return (
    <section id={id} className={`py-16 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4 text-primary flex items-center justify-center gap-3">
            <IconComponent className="h-8 w-8" />
            {title}
          </h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>
        
        {charities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No organizations found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {charities.map((charity) => (
              <CharityCard key={charity.id} charity={charity} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
