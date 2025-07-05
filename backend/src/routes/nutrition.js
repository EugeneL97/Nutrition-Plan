const express = require('express');
const router = express.Router();
const nutritionAI = require('../services/nutritionAI');

// Get available lifestyles
router.get('/lifestyles', (req, res) => {
  try {
    const lifestyles = nutritionAI.getLifestyles();
    res.json({ success: true, data: lifestyles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate meal plan
router.post('/generate-plan', async (req, res) => {
  try {
    const { lifestyle, goals, restrictions, days } = req.body;
    
    if (!lifestyle || !goals) {
      return res.status(400).json({ 
        success: false, 
        error: 'Lifestyle and goals are required' 
      });
    }

    const mealPlan = await nutritionAI.generateMealPlan(
      lifestyle, 
      goals, 
      restrictions || [], 
      days || 7
    );

    res.json({ success: true, data: mealPlan });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get demo meal plan
router.get('/demo-plan/:lifestyle', (req, res) => {
  try {
    const { lifestyle } = req.params;
    const { days = 7 } = req.query;
    
    const mealPlan = nutritionAI.generateDemoMealPlan(lifestyle, 'demo', parseInt(days));
    res.json({ success: true, data: mealPlan });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router; 