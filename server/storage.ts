import { type Charity, type InsertCharity } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllCharities(): Promise<Charity[]>;
  getCharitiesByCategory(category: string): Promise<Charity[]>;
  searchCharities(query: string): Promise<Charity[]>;
  createCharity(charity: InsertCharity): Promise<Charity>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private charities: Map<string, Charity>;

  constructor() {
    this.users = new Map();
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
      
      // International Relief
      {
        name: "Save the Children",
        description: "Leading children's rights organization providing emergency relief, education, and protection services to Palestinian children and families in Gaza and the West Bank.",
        website: "https://www.savethechildren.org",
        category: "international",
        focusArea: "Children's Rights",
        featured: "true"
      },
      {
        name: "Oxfam International",
        description: "Global organization fighting inequality and poverty, providing water, sanitation, and emergency aid to communities in Palestinian territories.",
        website: "https://www.oxfam.org",
        category: "international",
        focusArea: "Water & Sanitation",
        featured: "false"
      },
      {
        name: "Médecins Sans Frontières",
        description: "International medical humanitarian organization providing emergency medical care and mental health support in Gaza and Palestinian territories.",
        website: "https://www.msf.org",
        category: "international",
        focusArea: "Medical Emergency",
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
      
      // Education
      {
        name: "Palestine Education Fund",
        description: "Supporting Palestinian students through scholarships, school rebuilding programs, and educational resource distribution.",
        website: "https://www.palestineeducation.org",
        category: "education",
        focusArea: "Scholarships",
        featured: "false"
      },
      {
        name: "Gaza School Reconstruction",
        description: "Focused on rebuilding and repairing schools damaged in Gaza, providing safe learning environments for children.",
        website: "https://www.gazaschools.org",
        category: "education",
        focusArea: "Infrastructure",
        featured: "false"
      },
      {
        name: "Digital Learning Initiative",
        description: "Providing technology and digital learning resources to Palestinian students, enabling remote education opportunities.",
        website: "https://www.digitallearningpalestine.org",
        category: "education",
        focusArea: "Technology",
        featured: "false"
      }
    ];

    initialCharities.forEach(charity => {
      const id = randomUUID();
      const fullCharity: Charity = { ...charity, id };
      this.charities.set(id, fullCharity);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
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
    const charity: Charity = { ...insertCharity, id };
    this.charities.set(id, charity);
    return charity;
  }
}

export const storage = new MemStorage();
