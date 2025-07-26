import { type Charity, type InsertCharity } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllCharities(): Promise<Charity[]>;
  getCharitiesByCategory(category: string): Promise<Charity[]>;
  searchCharities(query: string): Promise<Charity[]>;
  createCharity(charity: InsertCharity): Promise<Charity>;
}

export class MemStorage implements IStorage {
  private charities: Map<string, Charity>;

  constructor() {
    this.charities = new Map();
    this.initializeCharities();
  }

  private initializeCharities() {
    const initialCharities: InsertCharity[] = [
      // Muslim Charities
      {
        name: "Islamic Relief USA",
        description: "One of the largest Islamic charities in the US, providing emergency relief, development programs, and advocacy for Palestinians and other communities worldwide.",
        website: "https://www.islamicreliefusa.org",
        category: "muslim",
        focusArea: "Emergency Relief",
        featured: "false"
      },
      {
        name: "Zakat Foundation of America",
        description: "Dedicated to alleviating poverty and suffering through emergency relief, development programs, and education initiatives in Palestine and globally.",
        website: "https://www.zakat.org",
        category: "muslim",
        focusArea: "Development Programs",
        featured: "false"
      },
      {
        name: "Human Appeal International",
        description: "International charity providing sustainable development, emergency relief, and advocacy work with a strong focus on Palestinian territories.",
        website: "https://www.humanappeal.org",
        category: "muslim",
        focusArea: "Sustainable Development",
        featured: "false"
      },
      
      {
        name: "Penny Appeal",
        description: "UK-based Muslim charity providing emergency relief, water projects, and humanitarian aid to Palestinian communities in Gaza and the West Bank.",
        website: "https://www.pennyappeal.org",
        category: "muslim",
        focusArea: "Emergency Relief",
        featured: "true"
      },
      {
        name: "Muslim Aid",
        description: "International relief and development organization providing emergency assistance, healthcare, and education support in Palestinian territories.",
        website: "https://www.muslimaid.org",
        category: "muslim",
        focusArea: "Development Programs",
        featured: "false"
      },
      {
        name: "Islamic Society of North America Relief",
        description: "Providing humanitarian aid and emergency relief to Palestinian families through Islamic principles of charity and compassion.",
        website: "https://www.isnarelief.org",
        category: "muslim",
        focusArea: "Humanitarian Aid",
        featured: "false"
      },
      {
        name: "Helping Hand for Relief and Development",
        description: "International Muslim charity focused on emergency relief, medical aid, and sustainable development projects in Gaza.",
        website: "https://www.hhrd.org",
        category: "muslim",
        focusArea: "Medical Aid",
        featured: "false"
      },
      
      // Gaza Specific
      {
        name: "Palestine Children's Relief Fund",
        description: "Dedicated to providing medical care and humanitarian aid specifically to Palestinian children, with extensive operations in Gaza.",
        website: "https://www.pcrf.net",
        category: "gaza",
        focusArea: "Pediatric Care",
        featured: "false"
      },
      {
        name: "Gaza Emergency Appeal",
        description: "Emergency response fund providing immediate relief including food, medical supplies, and shelter assistance to families in Gaza.",
        website: "https://www.gazaemergencyappeal.org",
        category: "gaza",
        focusArea: "Emergency Relief",
        featured: "false"
      },
      {
        name: "Gaza Reconstruction Fund",
        description: "Focused on rebuilding infrastructure, homes, and essential services in Gaza, supporting long-term recovery and development.",
        website: "https://www.gazareconstruction.org",
        category: "gaza",
        focusArea: "Reconstruction",
        featured: "false"
      },
      
      // Medical Aid
      {
        name: "Palestine Red Crescent Society",
        description: "Leading medical emergency response organization providing ambulance services, emergency care, and medical aid throughout Palestinian territories.",
        website: "https://www.palestinercs.org",
        category: "medical",
        focusArea: "Emergency Medical",
        featured: "false"
      },
      {
        name: "Medical Aid for Palestinians",
        description: "UK-based charity providing medical aid, training, and capacity building for healthcare systems in Palestinian territories.",
        website: "https://www.map.org.uk",
        category: "medical",
        focusArea: "Healthcare Training",
        featured: "false"
      },
      {
        name: "Gaza Medical Relief",
        description: "Focused on providing essential medications, medical equipment, and surgical supplies to hospitals and clinics in Gaza.",
        website: "https://www.gazamedicalrelief.org",
        category: "medical",
        focusArea: "Medical Supplies",
        featured: "false"
      },
      
      // Additional Muslim Charities
      {
        name: "Al-Khair Foundation",
        description: "International Muslim charity providing emergency relief, clean water projects, and medical aid to Palestinian communities.",
        website: "https://www.alkhair.org",
        category: "muslim",
        focusArea: "Water Projects",
        featured: "false"
      },
      {
        name: "Ummah Welfare Trust",
        description: "UK-based Islamic charity specializing in emergency relief and development projects in Palestinian territories.",
        website: "https://www.uwt.org",
        category: "muslim",
        focusArea: "Emergency Relief",
        featured: "false"
      },
      {
        name: "Muslim Hands",
        description: "International relief organization providing humanitarian aid, medical assistance, and sustainable development in Gaza.",
        website: "https://www.muslimhands.org.uk",
        category: "muslim",
        focusArea: "Humanitarian Aid",
        featured: "false"
      }
    ];

    initialCharities.forEach(charity => {
      const id = randomUUID();
      const fullCharity: Charity = { ...charity, id, featured: charity.featured || "false" };
      this.charities.set(id, fullCharity);
    });
  }

  async getAllCharities(): Promise<Charity[]> {
    return Array.from(this.charities.values());
  }

  async getCharitiesByCategory(category: string): Promise<Charity[]> {
    return Array.from(this.charities.values()).filter(
      charity => charity.category === category
    );
  }

  async searchCharities(query: string): Promise<Charity[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.charities.values()).filter(
      charity => 
        charity.name.toLowerCase().includes(lowercaseQuery) ||
        charity.description.toLowerCase().includes(lowercaseQuery) ||
        charity.focusArea.toLowerCase().includes(lowercaseQuery)
    );
  }

  async createCharity(insertCharity: InsertCharity): Promise<Charity> {
    const id = randomUUID();
    const charity: Charity = { ...insertCharity, id, featured: insertCharity.featured || "false" };
    this.charities.set(id, charity);
    return charity;
  }
}

export const storage = new MemStorage();
