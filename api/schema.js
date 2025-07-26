// Schema for Vercel API
const insertCharitySchema = {
  name: { type: 'string', required: true },
  description: { type: 'string', required: true },
  website: { type: 'string', required: true },
  category: { type: 'string', required: true },
  focusArea: { type: 'string', required: true },
  featured: { type: 'string', required: true }
};

module.exports = { insertCharitySchema };