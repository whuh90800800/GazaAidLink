import { useState } from "react";
import { Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    { label: "Home", id: "home" },
    { label: "Muslim Charities", id: "muslim-charities" },
    { label: "Save the Children", id: "featured" },
    { label: "Gaza Specific", id: "gaza-specific" },
    { label: "Medical Aid", id: "medical" },
    { label: "Education", id: "education" },
  ];

  return (
    <header className="bg-card shadow-lg border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center cursor-pointer" onClick={() => scrollToSection("home")}>
            <Heart className="text-primary text-2xl mr-3" />
            <h1 className="text-2xl font-bold text-primary">Gaza Relief Directory</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.label}
              </button>
            ))}
          </nav>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-2 space-y-2 border-t border-border">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left text-muted-foreground hover:text-primary py-2 font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}