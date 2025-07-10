import express, { RequestHandler } from 'express';
import nutritionAI from '../services/nutritionAI';

const router = express.Router();

// Generate meal plan
const generatePlan: RequestHandler = async (req, res) => {
  try {
    const { goals, restrictions } = req.body;
    
    if (!goals) {
      res.status(400).json({ 
        success: false, 
        error: 'Goals are required' 
      });
      return;
    }

    const mealPlan = await nutritionAI.generateMealPlan(
      goals, 
      restrictions || []
    );

    res.json({ success: true, data: mealPlan });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// Get demo meal plan
const getDemoPlan: RequestHandler = (req, res) => {
  try {
    const { goals } = req.params;
    
    const mealPlan = nutritionAI.generateDemoMealPlan(goals || 'muscle_gain');
    res.json({ success: true, data: mealPlan });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

router.post('/generate-plan', generatePlan);
router.get('/demo-plan/:goals', getDemoPlan);

export default router; 