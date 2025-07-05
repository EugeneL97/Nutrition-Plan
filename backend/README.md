# Nutrition Plan Backend API

Express.js backend API for the Nutrition Plan application.

## Quick Start

```bash
npm install
npm run dev
```

The API will be available at `http://localhost:5000`

## Environment Variables

Create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

## API Endpoints

- `GET /health` - Health check
- `GET /api/nutrition/lifestyles` - Get available lifestyles
- `POST /api/nutrition/generate-plan` - Generate meal plan
- `GET /api/nutrition/demo-plan/:lifestyle` - Get demo plan

## Development

```bash
npm run dev    # Development mode
npm start      # Production mode
npm test       # Run tests
``` 