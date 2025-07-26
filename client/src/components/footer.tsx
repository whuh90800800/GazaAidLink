import { Mail, Globe, FileText, DollarSign, AlertTriangle, Quote } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div>
            <h4 className="text-lg font-semibold text-primary mb-4 flex items-center justify-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Important Notice
            </h4>
            <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              This directory is provided for informational purposes. Please conduct your own due diligence before donating to any organization.
            </p>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 text-center">
          <p className="text-muted-foreground mb-4">
            © 2024 Gaza Relief Directory. Built with compassion for humanitarian aid.
          </p>
          <div className="border border-border rounded-lg p-4 inline-block">
            <p className="text-foreground font-medium italic flex items-center gap-2">
              <Quote className="h-4 w-4 text-primary" />
              "Allah S.W.T Knows Best and we can only guess"
              <Quote className="h-4 w-4 text-primary rotate-180" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}