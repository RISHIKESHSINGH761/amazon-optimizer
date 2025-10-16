const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(stealthPlugin());

async function scrapeProductByASIN(asin) {
  console.log(`🔍 Starting scrape for ASIN: ${asin}`);
  
  // Validate ASIN format
  if (!asin || asin.length < 5) {
    console.log('❌ Invalid ASIN, returning mock data');
    return getRealisticMockData(asin);
  }

  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-blink-features=AutomationControlled',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      ]
    });
    
    const page = await browser.newPage();
    
    // Enhanced stealth measures
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1366, height: 768 });
    
    // Block unnecessary resources
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    console.log(`🌐 Navigating to Amazon product page...`);
    
    // Use Amazon.in for Indian products
    const url = `https://www.amazon.in/dp/${asin}`;
    console.log(`📦 URL: ${url}`);
    
    await page.goto(url, { 
      waitUntil: 'networkidle2', 
      timeout: 30000 
    });

    // Check if we got blocked
    const pageTitle = await page.title();
    console.log(`📄 Page title: ${pageTitle}`);
    
    if (pageTitle.includes('Page Not Found') || pageTitle.includes('Robot')) {
      console.log('❌ Amazon blocking detected');
      throw new Error('Amazon blocking detected');
    }

    // Wait for product content with multiple selectors
    try {
      await page.waitForSelector('#productTitle, #title, h1, [data-feature-name="title"]', { 
        timeout: 10000 
      });
      console.log('✅ Found product title element');
    } catch (error) {
      console.log('❌ Could not find product title, trying fallback selectors...');
      // Try alternative selectors for Amazon India
      await page.waitForSelector('.a-size-large, .product-title, [cel_widget_id*="title"]', { 
        timeout: 5000 
      });
    }

    const productData = await page.evaluate(() => {
      console.log('🔍 Extracting product data from page...');
      
      // Enhanced title extraction for Amazon India
      let title = document.querySelector('#productTitle')?.innerText?.trim() ||
                 document.querySelector('#title h1')?.innerText?.trim() ||
                 document.querySelector('h1.a-size-large')?.innerText?.trim() ||
                 document.querySelector('[data-feature-name="title"]')?.innerText?.trim() ||
                 'Product Title Not Found';

      // Enhanced bullet points extraction
      const bulletPoints = [];
      const bulletSelectors = [
        '#feature-bullets li span.a-list-item',
        '#feature-bullets li',
        '.a-ordered-list li',
        '.a-unordered-list li',
        '[data-feature-name="featureBullets"] li',
        '#important-information li'  // Amazon India specific
      ];

      bulletSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          const text = el.textContent?.trim();
          if (text && text.length > 10 && 
              !text.toLowerCase().includes('customer') && 
              !text.toLowerCase().includes('review') &&
              !text.toLowerCase().includes('sponsored')) {
            bulletPoints.push(text);
          }
        });
      });

      // Enhanced description extraction
      let description = '';
      const descSelectors = [
        '#productDescription p',
        '#productDescription',
        '[data-feature-name="productDescription"]',
        '#aplus h3',
        '#aplus p',
        '.a-section.a-spacing-medium',
        '#productOverview'  // Amazon India specific
      ];

      descSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          const text = el.textContent?.trim();
          if (text && text.length > 50 && text.length < 2000) {
            description += text + ' ';
          }
        });
      });

      // Price extraction for Amazon India
      let price = document.querySelector('.a-price-whole')?.textContent?.trim() ||
                 document.querySelector('.a-price .a-offscreen')?.textContent?.trim() ||
                 document.querySelector('.a-color-price')?.textContent?.trim() ||
                 'Price not available';

      return {
        title: title,
        bullets: bulletPoints.slice(0, 5),
        description: description.trim() || 'Description not available',
        price: price,
        asin: asin
      };
    });

    console.log(`✅ Successfully scraped: ${productData.title}`);
    
    if (productData.title && productData.title !== 'Product Title Not Found') {
      return productData;
    } else {
      console.log('❌ Could not extract real product data');
      throw new Error('Could not extract real product data');
    }
    
  } catch (error) {
    console.log(`❌ Scraping failed: ${error.message}`);
    console.log('🔄 Falling back to realistic mock data...');
    return getRealisticMockData(asin);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}