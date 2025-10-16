const { scrapeProductByASIN } = require('../services/scraper');
const aiService = require('../services/aiService');

exports.optimizeByAsin = async (req, res) => {
  try {
    const { asin } = req.body;
    if (!asin) return res.status(400).json({ error: 'ASIN required' });

    const scraped = await scrapeProductByASIN(asin);
    const optimized = await aiService.optimizeListing(scraped);

    return res.json({
      success: true,
      scraped: {
        title: scraped.title,
        bullets: scraped.bullets,
        description: scraped.description,
        price: scraped.price
      },
      optimized: {
        title: optimized.title,
        bullets: optimized.bullets,
        description: optimized.description,
        keywords: optimized.keywords
      },
      asin: asin
    });

  } catch (err) {
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