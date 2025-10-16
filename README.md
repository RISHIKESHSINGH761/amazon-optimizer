# Amazon Listing Optimizer 

Transform your Amazon product listings with AI-powered optimization. This tool scrapes real-time product data and generates SEO-enhanced titles, bullet points, and descriptions that drive conversions.

##  What It Does

- **Scrapes Amazon product data** in real-time while bypassing bot detection
- **AI-optimizes listings** with product-specific enhancements (no generic marketing fluff)
- **Stores optimization history** for easy reference and comparison
- **Production-ready deployment** with proper error handling and fallbacks

## Tech Stack

**Backend:** Node.js, Express, Sequelize, Puppeteer with stealth plugins  
**Frontend:** React, Vite, Axios  
**Database:** MySQL (deployed on Railway)  
**AI:** Google Gemini AI  
**Deployment:** Backend on Railway, Frontend on Netlify

## Quick Start

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
cd frontend
npm install
cd backend
npm install

NOTE: If you get any dependency error please install it through command

amazon-optimizer/
├── backend/
│   ├── services/
│   │   ├── scraper.js      # Amazon data extraction
│   │   └── aiService.js    # AI optimization engine
│   ├── models/             # Database models (Optimization)
│   ├── controllers/        # API route handlers
│   └── config/             # Database configuration
└── frontend/
    ├── components/         # React components
    ├── services/           # API communication
    └── pages/              # Application views

POST /api/optimize - Optimize a product using its ASIN

GET /api/history/:asin - Get optimization history for a specific ASIN

GET /api/optimizations - Retrieve all saved optimizations

