# Amazon Listing Optimizer

## Setup Instructions
1. Clone repository
2. Backend: `cd backend && npm install`
3. Frontend: `cd frontend && npm install` 
4. Database: Create MySQL database `amazon_optimizer`
5. Environment: Copy .env.example to .env and add your keys
6. Run: `backend: npm run dev`, `frontend: npm run dev`

## AI Prompt Engineering
The AI prompt is designed to:
- Take original product data
- Generate optimized versions following Amazon guidelines
- Return structured JSON for easy parsing
- Avoid unsubstantiated claims

**Prompt Used:**
[Copy your prompt from aiService.js]

## Challenges & Design Decisions
- **Scraping Challenges**: Amazon's anti-bot measures require fallback to mock data
- **AI Integration**: Used OpenAI with proper error handling
- **Database Design**: Sequelize ORM for easy MySQL management
- **UI/UX**: Side-by-side comparison for easy review

## Tech Stack
- Backend: Node.js, Express, Sequelize, Puppeteer
- Frontend: React, Vite, Axios
- Database: MySQL
- AI: OpenAI GPT