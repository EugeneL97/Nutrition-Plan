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

// Log daily metrics
const logDailyMetrics: RequestHandler = (req, res) => {
  try {
    const { weight, sleepHours, wakeTime, digestionRating, date } = req.body;
    
    if (!weight || !sleepHours || !wakeTime || !digestionRating) {
      res.status(400).json({ 
        success: false, 
        error: 'Weight, sleep hours, wake time, and digestion rating are required' 
      });
      return;
    }

    // Validate digestion rating (1-5)
    if (digestionRating < 1 || digestionRating > 5) {
      res.status(400).json({ 
        success: false, 
        error: 'Digestion rating must be between 1 and 5' 
      });
      return;
    }

    const dailyLog = {
      id: `log-${Date.now()}`,
      weight: parseFloat(weight),
      sleepHours: parseFloat(sleepHours),
      wakeTime,
      digestionRating: parseInt(digestionRating),
      date: date || new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString()
    };

    // Store in memory for demo purposes (in production, this would go to a database)
    // Note: localStorage is not available on the server side
    const existingLogs = global.dailyLogs || [];
    const updatedLogs = [dailyLog, ...existingLogs];
    global.dailyLogs = updatedLogs;

    res.json({ success: true, data: dailyLog });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// Get daily logs
const getDailyLogs: RequestHandler = (req, res) => {
  try {
    const { limit = 30 } = req.query;
    
    // Get from memory for demo purposes
    const logs = global.dailyLogs || [];
    const recentLogs = logs.slice(0, parseInt(limit as string));
    
    res.json({ success: true, data: recentLogs });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// Calculate optimal score
const getOptimalScore: RequestHandler = (req, res) => {
  try {
    const logs = global.dailyLogs || [];
    
    if (logs.length === 0) {
      res.json({ 
        success: true, 
        data: { 
          score: 0, 
          recommendations: ['Start logging your daily metrics to get personalized recommendations'],
          factors: {
            sleep: { score: 0, weight: 0.4 },
            digestion: { score: 0, weight: 0.3 },
            weight: { score: 0, weight: 0.3 }
          }
        } 
      });
      return;
    }

    const recentLogs = logs.slice(0, 7); // Last 7 days
    
    // Calculate sleep score (target: 7-9 hours)
    const avgSleepHours = recentLogs.reduce((sum, log) => sum + log.sleepHours, 0) / recentLogs.length;
    const sleepScore = avgSleepHours >= 7 && avgSleepHours <= 9 ? 100 : 
                      avgSleepHours >= 6 && avgSleepHours <= 10 ? 70 : 40;

    // Calculate digestion score (target: 4-5 rating)
    const avgDigestion = recentLogs.reduce((sum, log) => sum + log.digestionRating, 0) / recentLogs.length;
    const digestionScore = avgDigestion >= 4 ? 100 : 
                          avgDigestion >= 3 ? 70 : 40;

    // Calculate weight consistency (if user has a goal)
    const weightScore = 70; // Placeholder - would need goal data

    // Calculate overall score
    const overallScore = Math.round(
      (sleepScore * 0.4) + (digestionScore * 0.3) + (weightScore * 0.3)
    );

    // Generate recommendations
    const recommendations = [];
    if (sleepScore < 70) {
      recommendations.push('Focus on getting 7-9 hours of sleep consistently');
    }
    if (digestionScore < 70) {
      recommendations.push('Consider tracking which foods affect your digestion');
    }
    if (overallScore < 70) {
      recommendations.push('Prioritize sleep and digestion for better results');
    }

    res.json({ 
      success: true, 
      data: { 
        score: overallScore,
        recommendations,
        factors: {
          sleep: { score: sleepScore, weight: 0.4 },
          digestion: { score: digestionScore, weight: 0.3 },
          weight: { score: weightScore, weight: 0.3 }
        }
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

router.post('/generate-plan', generatePlan);
router.get('/demo-plan/:goals', getDemoPlan);
router.post('/daily-log', logDailyMetrics);
router.get('/daily-logs', getDailyLogs);
router.get('/optimal-score', getOptimalScore);

export default router; 