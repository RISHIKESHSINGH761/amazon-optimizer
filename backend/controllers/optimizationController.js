const { scrapeProductByASIN } = require('../services/scraper');
const aiService = require('../services/aiService');
const Optimization = require('../models/Optimization');

exports.optimizeByAsin = async (req, res) => {
  try {
    const { asin } = req.body;
    if (!asin) return res.status(400).json({ error: 'ASIN required' });

    // Scrape product data
    const scraped = await scrapeProductByASIN(asin);
    
    // Optimize with AI
    const optimized = await aiService.optimizeListing(scraped);

    // Save to database
    const optimization = await Optimization.create({
      asin: asin,
      original_title: scraped.title,
      original_bullets: JSON.stringify(scraped.bullets),
      original_description: scraped.description,
      original_price: scraped.price,
      optimized_title: optimized.title,
      optimized_bullets: JSON.stringify(optimized.bullets),
      optimized_description: optimized.description,
      keywords: JSON.stringify(optimized.keywords)
    });

    return res.json({
      success: true,
      id: optimization.id,
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
      asin: asin,
      createdAt: optimization.createdAt
    });

  } catch (err) {
    console.error('Optimization error:', err);
    return res.status(500).json({ 
      error: 'Server error', 
      details: err.message,
      success: false
    });
  }
};

exports.getHistoryByAsin = async (req, res) => {
  try {
    const { asin } = req.params;
    
    const optimizations = await Optimization.findAll({
      where: { asin },
      order: [['createdAt', 'DESC']]
    });

    const history = optimizations.map(opt => ({
      id: opt.id,
      asin: opt.asin,
      original_title: opt.original_title,
      optimized_title: opt.optimized_title,
      createdAt: opt.createdAt
    }));

    res.json({ 
      success: true,
      history: history
    });
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ 
      error: 'Database error',
      details: err.message,
      history: []
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const optimizations = await Optimization.findAll({
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    const result = optimizations.map(opt => ({
      id: opt.id,
      asin: opt.asin,
      original_title: opt.original_title,
      optimized_title: opt.optimized_title,
      createdAt: opt.createdAt
    }));

    res.json({ 
      success: true,
      optimizations: result
    });
  } catch (err) {
    console.error('Get all error:', err);
    res.status(500).json({ 
      error: 'Database error',
      details: err.message,
      optimizations: []
    });
  }
};