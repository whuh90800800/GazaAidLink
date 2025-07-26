// In-memory storage implementation for Vercel
const charities = [
  {
    id: "1",
    name: "Islamic Relief USA",
    description: "One of the largest Muslim charities providing humanitarian aid worldwide, with a strong focus on Gaza and Palestine relief efforts.",
    website: "https://irusa.org",
    category: "muslim",
    focusArea: "Humanitarian Aid",
    featured: "false"
  },
  {
    id: "2", 
    name: "Penny Appeal",
    description: "International charity organization providing emergency aid, sustainable development, and orphan care across the Muslim world including Gaza.",
    website: "https://pennyappeal.org",
    category: "muslim",
    focusArea: "Emergency Relief",
    featured: "true"
  },
  {
    id: "3",
    name: "Muslim Aid",
    description: "UK-based international development charity working to alleviate poverty and suffering across the world, with active programs in Palestine.",
    website: "https://muslimaid.org", 
    category: "muslim",
    focusArea: "International Development",
    featured: "false"
  },
  {
    id: "4",
    name: "ISNA Relief",
    description: "Islamic Society of North America's humanitarian arm providing disaster relief and development aid to communities in need worldwide.",
    website: "https://isnarelief.org",
    category: "muslim", 
    focusArea: "Disaster Relief",
    featured: "false"
  },
  {
    id: "5",
    name: "Helping Hand for Relief and Development",
    description: "International humanitarian organization providing emergency relief, healthcare, education, and sustainable development programs.",
    website: "https://hhrd.org",
    category: "muslim",
    focusArea: "Healthcare & Education", 
    featured: "false"
  },
  {
    id: "6",
    name: "Al-Khair Foundation",
    description: "UK-based charity providing humanitarian aid, education, and healthcare services to vulnerable communities worldwide including Palestine.",
    website: "https://alkhair.org",
    category: "muslim",
    focusArea: "Education & Healthcare",
    featured: "false"
  },
  {
    id: "7", 
    name: "Ummah Welfare Trust",
    description: "100% donation policy charity providing emergency aid, orphan care, and development programs across the Muslim world.",
    website: "https://uwt.org",
    category: "muslim",
    focusArea: "Orphan Care",
    featured: "false"
  },
  {
    id: "8",
    name: "Muslim Hands",
    description: "International development and relief charity working to tackle poverty worldwide with programs supporting Palestinian communities.",
    website: "https://muslimhands.org",
    category: "muslim", 
    focusArea: "Poverty Relief",
    featured: "false"
  },
  {
    id: "9",
    name: "Palestine Children's Relief Fund",
    description: "Humanitarian organization providing medical care and humanitarian aid specifically to children and families in Palestine and Gaza.",
    website: "https://pcrf.net",
    category: "gaza",
    focusArea: "Children's Medical Care",
    featured: "false"
  },
  {
    id: "10",
    name: "Middle East Children's Alliance",
    description: "Non-profit organization working to improve the lives of children in the Middle East through medical aid and educational programs.",
    website: "https://mecaforpeace.org",
    category: "gaza",
    focusArea: "Children's Welfare",
    featured: "false"
  },
  {
    id: "11",
    name: "Medical Aid for Palestinians",
    description: "UK-based charity providing medical supplies, healthcare training, and emergency medical relief to Palestinian communities.",
    website: "https://map.org.uk",
    category: "medical",
    focusArea: "Medical Aid",
    featured: "false"
  },
  {
    id: "12",
    name: "Gaza Mutual Aid",
    description: "Grassroots organization providing direct financial assistance and medical support to families and healthcare workers in Gaza.",
    website: "https://gazamutualaid.com",
    category: "gaza",
    focusArea: "Direct Aid",
    featured: "false"
  },
  {
    id: "13",
    name: "Doctors Without Borders",
    description: "International medical humanitarian organization providing emergency medical care and healthcare services in conflict zones including Gaza.",
    website: "https://doctorswithoutborders.org",
    category: "medical",
    focusArea: "Emergency Medical Care",
    featured: "false"
  }
];

const storage = {
  charities: {
    getAll: async () => charities,
    getByCategory: async (category) => charities.filter(c => c.category === category),
    search: async (query) => {
      const searchTerm = query.toLowerCase();
      return charities.filter(charity => 
        charity.name.toLowerCase().includes(searchTerm) ||
        charity.description.toLowerCase().includes(searchTerm) ||
        charity.focusArea.toLowerCase().includes(searchTerm)
      );
    },
    create: async (charity) => {
      const newCharity = { 
        ...charity, 
        id: Date.now().toString() 
      };
      charities.push(newCharity);
      return newCharity;
    }
  }
};

module.exports = { storage };