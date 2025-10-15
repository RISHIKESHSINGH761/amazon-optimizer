const { GoogleGenerativeAI } = require("@google/generative-ai");

// Free Google Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "your_google_ai_key");

async function optimizeListing(scraped) {
  // If no API key, use mock data
  if (!process.env.GOOGLE_AI_API_KEY && !process.env.OPENAI_API_KEY) {
    return getMockOptimization(scraped);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are an Amazon listing optimization expert. Optimize this product listing:

ORIGINAL TITLE: ${scraped.title || ''}

ORIGINAL BULLETS: ${(scraped.bullets || []).join(', ')}

ORIGINAL DESCRIPTION: ${scraped.description || ''}

Return ONLY valid JSON with this exact structure:
{
  "title": "optimized title under 200 chars",
  "bullets": ["bullet 1", "bullet 2", "bullet 3", "bullet 4", "bullet 5"],
  "description": "2-3 paragraph optimized description",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    try {
      const jsonMatch = text.match(/(\{[\s\S]*\})/);
      const jsonText = jsonMatch ? jsonMatch[1] : text;
      const parsed = JSON.parse(jsonText);
      
      return {
        title: parsed.title || `Optimized: ${scraped.title}`.substring(0, 150),
        bullets: parsed.bullets || scraped.bullets,
        description: parsed.description || scraped.description,
        keywords: parsed.keywords || ['amazon', 'optimized', 'product']
      };
    } catch (parseError) {
      console.error('JSON parse error, using mock data');
      return getMockOptimization(scraped);
    }
  } catch (error) {
    console.error('AI API error:', error.message);
    return getMockOptimization(scraped);
  }
}

// Fallback mock data
function getMockOptimization(scraped) {
  return {
    title: `[AI OPTIMIZED] ${scraped.title}`.substring(0, 150),
    bullets: [
      'Enhanced performance with advanced technology',
      'Superior quality materials for lasting durability', 
      'User-friendly design for easy operation',
      'Excellent value with competitive pricing',
      'Trusted brand with reliable customer support'
    ],
    description: `This professionally optimized product listing enhances your Amazon presence with compelling copy that drives conversions. ${scraped.description}`,
    keywords: ['premium', 'best seller', 'high quality', 'amazon choice', 'featured product']
  };
}

module.exports = { optimizeListing };