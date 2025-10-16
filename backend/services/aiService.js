const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "your_google_ai_key");

async function optimizeListing(scraped) {
  if (!process.env.GOOGLE_AI_API_KEY && !process.env.OPENAI_API_KEY) {
    return getMockOptimization(scraped);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
CRITICAL RULES - READ CAREFULLY:
1. NEVER use generic phrases like "enhanced performance", "superior quality", "user-friendly design", "excellent value", "trusted brand"
2. Keep ALL original product-specific features and benefits
3. Make improvements while staying 100% truthful to the actual product
4. Focus on concrete, specific benefits - not vague marketing fluff
5. Keep bullets concise (under 15 words each)
6. Description should be 2-3 short paragraphs maximum

ORIGINAL PRODUCT DATA:
TITLE: ${scraped.title || ''}
BULLETS: ${(scraped.bullets || []).join(' | ')}
DESCRIPTION: ${scraped.description || ''}

OPTIMIZATION GOAL:
- Improve clarity and persuasiveness while keeping 100% accurate
- Highlight the most compelling features from the original
- Use active, benefit-focused language
- Remove any redundant or repetitive information

Return ONLY valid JSON with this exact structure:
{
  "title": "optimized title under 150 chars - keep product specifics",
  "bullets": ["specific benefit 1", "specific benefit 2", "specific benefit 3", "specific benefit 4", "specific benefit 5"],
  "description": "2-3 short paragraphs focusing on key benefits",
  "keywords": ["specific", "relevant", "product", "keywords", "only"]
}

IMPORTANT: Each bullet must reference actual product features from the original data. No generic marketing speak.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const jsonMatch = text.match(/(\{[\s\S]*\})/);
      const jsonText = jsonMatch ? jsonMatch[1] : text;
      const parsed = JSON.parse(jsonText);
      
      return {
        title: parsed.title || scraped.title,
        bullets: parsed.bullets || scraped.bullets,
        description: parsed.description || scraped.description,
        keywords: parsed.keywords || ['amazon', 'product', 'online', 'shopping']
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

function getMockOptimization(scraped) {
  const originalText = scraped.title + ' ' + (scraped.bullets || []).join(' ');
  
  return {
    title: scraped.title,
    bullets: (scraped.bullets || []).slice(0, 5), 
    description: scraped.description ? scraped.description.substring(0, 500) : "Product description",
    keywords: ['amazon', 'product', 'online', 'shopping']
  };
}

module.exports = { optimizeListing };