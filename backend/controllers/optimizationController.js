const Optimization = require('../models/Optimization');
const scraper = require('../services/scraper');
const aiService = require('../services/aiService');

exports.optimizeByAsin = async (req, res) => {
  try {
    const { asin } = req.body;
    if (!asin) return res.status(400).json({ error: 'ASIN required' });

    const scraped = await scraper.scrapeProductByASIN(asin); 

    const optimized = await aiService.optimizeListing(scraped);

    const record = await Optimization.create({
      asin,
      original_title: scraped.title,
      original_bullets: JSON.stringify(scraped.bullets),
      original_description: scraped.description,
      optimized_title: optimized.title,
      optimized_bullets: JSON.stringify(optimized.bullets),
      optimized_description: optimized.description,
      keywords: JSON.stringify(optimized.keywords)
    });

    return res.json({ record, optimized, scraped });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
};

exports.getHistoryByAsin = async (req, res) => {
  const { asin } = req.params;
  const items = await Optimization.findAll({ where: { asin }, order: [['createdAt', 'DESC']] });
  res.json(items);
};

exports.getAll = async (req, res) => {
  const items = await Optimization.findAll({ order: [['createdAt', 'DESC']], limit: 200 });
  res.json(items);
};
