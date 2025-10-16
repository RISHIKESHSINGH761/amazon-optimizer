const scraper = require('../services/scraper');
const aiService = require('../services/aiService');

exports.optimizeByAsin = async (req, res) => {
  try {
    const { asin } = req.body;
    if (!asin) return res.status(400).json({ error: 'ASIN required' });

    console.log(`🛒 Starting optimization for ASIN: ${asin}`);

    const scraped = await scraper.scrapeProductByASIN(asin); 

    const optimized = await aiService.optimizeListing(scraped);

    return res.json({
      success: true,
      scraped: {
        title: scraped.title,
        bullets: scraped.bullets,
        description: scraped.description,
        price: scraped.price,
        image: scraped.image
      },
      optimized: {
        title: optimized.title,
        bullets: optimized.bullets,
        description: optimized.description,
        keywords: optimized.keywords
      },
      asin: asin,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error('❌ Optimization error:', err);
    return res.status(500).json({ 
      error: 'Server error', 
      details: err.message,
      success: false
    });
  }
};

exports.getHistoryByAsin = async (req, res) => {
  res.json({ 
    message: 'History feature requires database connection',
    history: []
  });
};

exports.getAll = async (req, res) => {
  res.json({ 
    message: 'All optimizations feature requires database connection',
    optimizations: []
  });
};