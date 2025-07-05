# Nutrition Plan App

## What is this?

The Nutrition Plan is an innovative web application that automates meal planning based on individual lifestyles and preferences. As a fitness enthusiast and bodybuilder, I recognized the need for personalized nutrition plans that go beyond the typical "chicken, broccoli, and rice" meals. A tailored diet is crucial for adherence and ultimately, weight loss and fitness success.

## Why does this exist?

My goal with this project is to challenge myself as a solo developer and further develop my skills in software engineering, while applying my knowledge in nutrition and kinesiology. The Nutrition Plan offers a wide range of diet plans, catering to individuals seeking general health to athletes looking to optimize their performance in their respective sports.

The key insight is that **different lifestyles have completely different nutrition needs**:

- **Bodybuilders** need high protein, strict timing, and supplement integration
- **Casual gym goers** want balanced nutrition with moderate protein and flexible timing
- **Busy professionals** need quick meals, workplace options, and time-efficient prep
- **Average people** want simple, sustainable approaches focused on weight management

Traditional nutrition apps treat everyone the same. This app recognizes that a bodybuilder preparing for a contest has vastly different needs than a busy professional trying to eat healthy at work.

## How it works

The app uses AI-powered meal generation to create personalized nutrition plans based on:
- **Lifestyle type** (bodybuilder, casual gym goer, busy professional, average joe)
- **Fitness goals** (weight loss, muscle gain, maintenance, energy boost)
- **Dietary restrictions** (vegetarian, gluten-free, etc.)
- **Nutrition targets** (calories, protein, carbs, fat)

Each lifestyle has specific meal patterns, timing considerations, and nutritional priorities that make the generated plans realistic and useful.

## Project Structure

```
Nutrition-Plan/
├── frontend/          # Next.js 14 + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── app/       # Next.js App Router pages
│   │   ├── components/ # React components
│   │   ├── contexts/  # React contexts
│   │   └── lib/       # Frontend utilities and API client
│   └── package.json
├── backend/           # Express.js + Node.js API
│   ├── src/
│   │   ├── routes/    # API routes
│   │   ├── services/  # Business logic and AI integration
│   │   └── index.js   # Express server
│   └── package.json
└── README.md
```

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

### Environment Variables

**Frontend** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Backend** (`.env`):
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Context** - State management

### Backend
- **Express.js** - Node.js web framework
- **Google Gemini API** - AI-powered meal generation
- **CORS** - Cross-origin resource sharing

## Features

- **Lifestyle-based nutrition planning**
- **AI-powered meal generation**
- **Multi-step plan creation**
- **Detailed meal breakdowns**
- **Responsive design**
- **User authentication (demo)**
- **Plan management**

## API Endpoints

### GET /api/nutrition/lifestyles
Get available lifestyle types and their characteristics.

### POST /api/nutrition/generate-plan
Generate a personalized meal plan based on lifestyle and goals.

### GET /api/nutrition/demo-plan/:lifestyle
Get a demo meal plan for a specific lifestyle.

## Design Philosophy

The app emphasizes **lifestyle-first** nutrition planning, recognizing that different users have vastly different needs, constraints, and goals. This approach ensures that meal plans are not just nutritionally sound, but also practical and sustainable for each user's specific situation.

## Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Railway/Render)
```bash
cd backend
# Deploy to your preferred platform
```
