const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(stealthPlugin());

async function scrapeProductByASIN(asin) {
  if (!asin || asin.length < 5) {
    return getRealisticMockData(asin);
  }

  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-blink-features=AutomationControlled'
      ]
    });
    
    const page = await browser.newPage();
    
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    
    await page.setViewport({ width: 1366, height: 768 });
    

    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    console.log(`🛒 Attempting to scrape ASIN with bypass measures: ${asin}`);
    
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
    
    await page.goto(`https://www.amazon.com/dp/${asin}`, { 
      waitUntil: 'domcontentloaded', 
      timeout: 15000 
    });

    const pageTitle = await page.title();
    if (pageTitle.includes('Page Not Found') || pageTitle.includes('Error') || pageTitle.includes('Robot')) {
      throw new Error('Amazon blocking detected - Product not found or access denied');
    }

    try {
      await page.waitForSelector('#productTitle, #title, h1, [data-feature-name="title"]', { 
        timeout: 8000 
      });
    } catch (error) {
      console.log('Primary selectors not found, trying fallback selectors...');
      await page.waitForSelector('.a-size-large, .product-title, [cel_widget_id*="title"]', { 
        timeout: 5000 
      });
    }

    const productData = await page.evaluate(() => {
      
      let title = document.querySelector('#productTitle')?.innerText?.trim() ||
                 document.querySelector('#productTitle')?.textContent?.trim() ||
                 document.querySelector('#title h1')?.innerText?.trim() ||
                 document.querySelector('h1.a-size-large')?.innerText?.trim() ||
                 document.querySelector('[data-feature-name="title"]')?.innerText?.trim() ||
                 'Product Title';

      const bulletPoints = [];
      const bulletSelectors = [
        '#feature-bullets li span.a-list-item',
        '#feature-bullets li',
        '.a-ordered-list li',
        '.a-unordered-list li',
        '[data-feature-name="featureBullets"] li'
      ];

      bulletSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          const text = el.textContent?.trim();
          if (text && text.length > 10 && 
              !text.toLowerCase().includes('customer') && 
              !text.toLowerCase().includes('review')) {
            bulletPoints.push(text);
          }
        });
      });

      const uniqueBullets = [...new Set(bulletPoints)].slice(0, 5);

      let description = '';
      const descSelectors = [
        '#productDescription p',
        '#productDescription',
        '[data-feature-name="productDescription"]',
        '#aplus h3',
        '#aplus p',
        '.a-section.a-spacing-medium'
      ];

      descSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          const text = el.textContent?.trim();
          if (text && text.length > 50 && text.length < 2000) {
            description = text;
          }
        });
      });

      let price = document.querySelector('.a-price-whole')?.textContent?.trim() ||
                 document.querySelector('.a-price .a-offscreen')?.textContent?.trim() ||
                 document.querySelector('.a-color-price')?.textContent?.trim() ||
                 'Price not available';

      let image = document.querySelector('#landingImage')?.src ||
                 document.querySelector('.a-dynamic-image')?.src;

      return {
        title: title,
        bullets: uniqueBullets.length > 0 ? uniqueBullets : ['Key feature 1', 'Key feature 2', 'Key feature 3'],
        description: description || 'Product description not available',
        price: price,
        image: image
      };
    });

    if (productData.title && productData.title !== 'Product Title') {
      console.log('✅ Successfully scraped real product data with bypass measures');
      return {
        ...productData,
        asin: asin,
        scraped: true
      };
    } else {
      throw new Error('Could not extract real product data - Amazon might be blocking');
    }
    
  } catch (error) {
    console.log(`❌ Scraping failed for ASIN ${asin} with bypass measures:`, error.message);
    console.log('🔄 Falling back to realistic mock data...');
    return {
      ...getRealisticMockData(asin),
      asin: asin,
      scraped: false,
      error: error.message
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

function getRealisticMockData(asin) {
  const mockProducts = {
    'B08N5WRWNW': {
      title: 'Echo Dot (4th Gen) | Smart speaker with Alexa | Charcoal',
      bullets: [
        'Meet the all-new Echo Dot - Our most popular smart speaker with Alexa',
        'Voice control your entertainment - Stream songs from Amazon Music, Apple Music, Spotify, and more',
        'Ready to help - Ask Alexa to play music, answer questions, play the news, check the weather, set alarms, and control compatible smart home devices',
        'Control your smart home - Use your voice to turn on lights, adjust thermostats, and lock doors with compatible devices',
        'Connect with others - Call almost anyone hands-free. Instantly drop in on other rooms or announce to the whole house'
      ],
      description: 'Our most popular smart speaker - Now with improved sound and a new design. Echo Dot is a voice-controlled smart speaker with Alexa, designed for any room. Just ask for music, news, information, and more. You can also control compatible smart home devices with your voice.',
      price: '$49.99'
    },
    'B07H65KP63': {
      title: 'All-new Echo Show 5 (2nd Gen) | Smart display with Alexa | Charcoal',
      bullets: [
        'VOICE AND VIDEO CALLS - Call friends and family who have the Alexa app or an Echo device with a screen',
        'SMART HOME AT A GLANCE - See compatible security cameras and video doorbells like Ring and blink',
        'ENTERTAINMENT - Watch shows, movies, and music videos from Amazon Music, Netflix, and Prime Video',
        'STAY IN THE KNOW - Check your calendar, weather, and news with customizable clock faces',
        'EASY TO USE - Simple set up and intuitive controls'
      ],
      description: 'Echo Show 5 (2nd Gen) features a compact design that fits perfectly into small spaces. The 5.5" smart display with Alexa lets you video call, control smart home devices, watch videos, and more.',
      price: '$84.99'
    },
    'B08C1W6N63': {
      title: 'Fire TV Stick 4K streaming device with Alexa Voice Remote',
      bullets: [
        'Brilliant 4K Ultra HD - Stream in 4K Ultra HD with support for Dolby Vision, HDR, and HDR10+',
        'Home theater audio with Dolby Atmos - Feel scenes come to life with immersive Dolby Atmos audio',
        'Voice control with Alexa - Use your voice to quickly find, launch, and control content',
        'Tons of apps - Watch favorites from Netflix, Prime Video, Disney+, and more',
        'Live TV - Watch live TV, news, and sports with subscriptions to Hulu, YouTube TV, and others'
      ],
      description: 'Fire TV Stick 4K streaming device with the next-generation Alexa Voice Remote (includes TV controls). Enjoy brilliant picture quality with 4K Ultra HD, Dolby Vision, and HDR10+.',
      price: '$39.99'
    }
  };

  if (mockProducts[asin]) {
    return mockProducts[asin];
  }

  return {
    title: `Amazon Product ${asin}`,
    bullets: [
      'High-quality construction for long-lasting durability',
      'Advanced features for enhanced performance and user experience',
      'User-friendly design with intuitive controls and setup',
      'Excellent value with competitive pricing and reliable support',
      'Trusted brand known for quality and customer satisfaction'
    ],
    description: `This premium product offers exceptional quality and performance. Designed with attention to detail, it provides reliable operation and great value for everyday use. Features advanced technology that enhances user experience while maintaining ease of use.`,
    price: '$99.99'
  };
}

module.exports = { scrapeProductByASIN };