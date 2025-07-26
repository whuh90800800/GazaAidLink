import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Charity } from "@shared/schema";
import Navbar from "@/components/navbar";
import SearchFilter from "@/components/search-filter";
import CharitySection from "@/components/charity-section";
import Footer from "@/components/footer";
import { Heart, Quote } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: allCharities = [], isLoading } = useQuery<Charity[]>({
    queryKey: ["/api/charities"],
  });

  // Filter charities based on search and category
  const filteredCharities = allCharities.filter((charity) => {
    const matchesSearch = 
      charity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      charity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      charity.focusArea.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || charity.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCharitiesByCategory = (category: string) => 
    filteredCharities.filter(charity => charity.category === category);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading charities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="border-l-4 border-primary pl-6 mb-8 text-left inline-block">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Supporting Gaza Through Verified Charities
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              A comprehensive directory of trusted charitable organizations providing aid to Gaza and Palestinian communities. 
              Each organization has been researched to help you make informed decisions about your charitable giving.
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <p className="text-lg text-foreground font-medium italic flex items-center justify-center gap-2">
              <Quote className="h-5 w-5 text-primary" />
              "Allah S.W.T Knows Best and we can only guess"
              <Quote className="h-5 w-5 text-primary rotate-180" />
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Please verify all organizations independently before donating
            </p>
          </div>

          <SearchFilter 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>
      </section>

      {/* Charity Sections */}
      <CharitySection
        id="muslim-charities"
        title="Muslim Charitable Organizations"
        subtitle="Established Islamic relief organizations with strong track records in humanitarian aid and Palestinian support."
        icon="mosque"
        charities={getCharitiesByCategory("muslim")}
        className="bg-muted/50"
      />

      <CharitySection
        id="international"
        title="International Relief Organizations"
        subtitle="Globally recognized humanitarian organizations providing critical aid and support to Palestinian communities."
        icon="globe"
        charities={getCharitiesByCategory("international")}
      />

      <CharitySection
        id="gaza-specific"
        title="Gaza-Specific Relief Organizations"
        subtitle="Organizations specifically focused on providing direct aid and support to the people of Gaza."
        icon="map-pin"
        charities={getCharitiesByCategory("gaza")}
        className="bg-muted/50"
      />

      <CharitySection
        id="medical"
        title="Medical Aid Organizations"
        subtitle="Specialized medical organizations providing healthcare, medical supplies, and emergency medical assistance."
        icon="stethoscope"
        charities={getCharitiesByCategory("medical")}
      />

      <CharitySection
        id="education"
        title="Educational Support Organizations"
        subtitle="Organizations dedicated to supporting education and empowering Palestinian students and educational institutions."
        icon="graduation-cap"
        charities={getCharitiesByCategory("education")}
        className="bg-muted/50"
      />

      <Footer />
    </div>
  );
}
