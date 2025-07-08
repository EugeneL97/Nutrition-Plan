import express, { RequestHandler } from 'express';
import nutritionAI from '../services/nutritionAI';

const router = express.Router();

// Get available lifestyles
const getLifestyles: RequestHandler = (req, res) => {
  try {
    const lifestyles = nutritionAI.getLifestyles();
    res.json({ success: true, data: lifestyles });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// Generate meal plan
const generatePlan: RequestHandler = async (req, res) => {
  try {
    const { lifestyle, goals, restrictions } = req.body;
    
    if (!lifestyle || !goals) {
      res.status(400).json({ 
        success: false, 
        error: 'Lifestyle and goals are required' 
      });
      return;
    }

    const mealPlan = await nutritionAI.generateMealPlan(
      lifestyle, 
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
    const { lifestyle } = req.params;
    
    const mealPlan = nutritionAI.generateDemoMealPlan(lifestyle, 'demo');
    res.json({ success: true, data: mealPlan });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

router.get('/lifestyles', getLifestyles);
router.post('/generate-plan', generatePlan);
router.get('/demo-plan/:lifestyle', getDemoPlan);

export default router; 