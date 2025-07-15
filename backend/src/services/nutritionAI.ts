import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY
console.log('API Key check:');
console.log('  - API_KEY exists:', !!API_KEY);
console.log('  - API_KEY value:', API_KEY ? `${API_KEY.substring(0, 8)}...` : 'undefined');
console.log('  - Is demo key:', API_KEY === 'demo-key');

const genAI = new GoogleGenerativeAI(API_KEY || 'demo-key');

// Bodybuilder nutrition configuration (default for MVP)
const BODYBUILDER_CONFIG = {
    name: 'Bodybuilder',
    description: 'Focused on muscle building and contest preparation',
    characteristics: [
      'High protein requirements (1.2-1.5g per lb bodyweight)',
      'Strict meal timing',
      'Detailed macro tracking',
      'Supplement integration',
      'Contest prep cycles'
    ],
    nutritionFocus: {
      protein: 'high',
      carbs: 'moderate',
      fat: 'moderate',
      mealFrequency: '6-8 meals per day',
      timing: 'critical'
  }
};

class NutritionAI {
  private model: any;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
  }

  async generateMealPlan(goals, restrictions) {
    console.log('generateMealPlan called with:', { goals, restrictions });
    
    try {
      // Check if Gemini API key is available
      if (!API_KEY || API_KEY === 'demo-key') {
        console.log('Using demo data - API key not available or is demo key');
        return this.generateDemoMealPlan(goals);
      }
      
      console.log('API key found, making Gemini API call...');
      const prompt = this.buildPrompt(goals, restrictions);
      console.log('Prompt length:', prompt.length);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('AI Response received:');
      console.log('  - Length:', text.length);
      console.log('  - First 200 chars:', text.substring(0, 200));
      
      const parsedResult = this.parseMealPlanResponse(text, goals);
      console.log('Parsed result:', {
        name: parsedResult.name,
        mealsCount: parsedResult.dailyMeals[0].meals.length,
        aiGenerated: (parsedResult as any).aiGenerated || false
      });
      
      return parsedResult;
    } catch (error) {
      console.error('Error generating meal plan:', error);
      console.log('Falling back to demo data');
      return this.generateDemoMealPlan(goals);
    }
  }

  buildPrompt(goals, restrictions) {
    // Define specific macro targets based on goals
    const macroTargets = this.getMacroTargets(goals);
    
    return `Create a single day nutrition plan for a bodybuilder that MUST meet these exact targets:

MANDATORY DAILY TARGETS:
- Total Calories: ${macroTargets.calories}
- Total Protein: ${macroTargets.protein}g
- Total Carbs: ${macroTargets.carbs}g  
- Total Fat: ${macroTargets.fat}g

Bodybuilder Characteristics:
${BODYBUILDER_CONFIG.characteristics.map(char => `- ${char}`).join('\n')}

Nutrition Focus:
- Protein: ${BODYBUILDER_CONFIG.nutritionFocus.protein}
- Carbs: ${BODYBUILDER_CONFIG.nutritionFocus.carbs}
- Fat: ${BODYBUILDER_CONFIG.nutritionFocus.fat}
- Meal Frequency: ${BODYBUILDER_CONFIG.nutritionFocus.mealFrequency}
- Timing: ${BODYBUILDER_CONFIG.nutritionFocus.timing}

User Goals: ${goals}
Dietary Restrictions: ${restrictions.join(', ') || 'None'}

CRITICAL REQUIREMENTS:
1. The sum of all meals MUST equal the target macros above
2. Use accurate nutrition values for each ingredient
3. Verify calculations - each meal's macros should add up correctly
4. Distribute meals appropriately throughout the day

Please format your response EXACTLY like this:

MEAL 1: [Meal Name]
- Calories: [number]
- Protein: [number]g
- Carbs: [number]g
- Fat: [number]g
- Ingredients: [ingredient 1], [ingredient 2], [ingredient 3]

MEAL 2: [Meal Name]
- Calories: [number]
- Protein: [number]g
- Carbs: [number]g
- Fat: [number]g
- Ingredients: [ingredient 1], [ingredient 2], [ingredient 3]

Continue for 4-6 meals that sum to the exact target macros.`;
  }

  getMacroTargets(goals) {
    // You could make this more sophisticated based on user input
    // For now, using bodybuilder defaults for muscle gain
    return {
      calories: 3375,
      protein: 240,
      carbs: 424,
      fat: 80
    };
  }

  parseMealPlanResponse(text, goals) {
    try {
      // Try to parse structured response from AI
      const lines = text.split('\n');
      const meals = [];
      let currentMeal = null;
      let totalCalories = 0;
      let totalProtein = 0;
      let totalCarbs = 0;
      let totalFat = 0;

      for (const line of lines) {
        const trimmed = line.trim();
        
        // Look for meal headers (MEAL X: format)
        const mealMatch = trimmed.match(/^MEAL\s+\d+:\s*(.+)/i);
        if (mealMatch) {
          if (currentMeal) {
            meals.push(currentMeal);
            totalCalories += currentMeal.calories;
            totalProtein += currentMeal.protein;
            totalCarbs += currentMeal.carbs;
            totalFat += currentMeal.fat;
          }
          currentMeal = {
            name: mealMatch[1].trim(),
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            ingredients: [],
            instructions: [],
            prepTime: 15,
            cookTime: 20
          };
          continue;
        }
        
        // Parse nutritional info
        if (currentMeal) {
          const caloriesMatch = trimmed.match(/^-?\s*Calories:\s*(\d+)/i);
          const proteinMatch = trimmed.match(/^-?\s*Protein:\s*(\d+)g?/i);
          const carbsMatch = trimmed.match(/^-?\s*Carbs:\s*(\d+)g?/i);
          const fatMatch = trimmed.match(/^-?\s*Fat:\s*(\d+)g?/i);
          const ingredientsMatch = trimmed.match(/^-?\s*Ingredients:\s*(.+)/i);
          
          if (caloriesMatch) currentMeal.calories = parseInt(caloriesMatch[1]);
          if (proteinMatch) currentMeal.protein = parseInt(proteinMatch[1]);
          if (carbsMatch) currentMeal.carbs = parseInt(carbsMatch[1]);
          if (fatMatch) currentMeal.fat = parseInt(fatMatch[1]);
          if (ingredientsMatch) {
            currentMeal.ingredients = ingredientsMatch[1]
              .split(',')
              .map(ingredient => ingredient.trim())
              .filter(ingredient => ingredient.length > 0);
          }
        }
      }
      
      // Add the last meal
      if (currentMeal) {
        meals.push(currentMeal);
        totalCalories += currentMeal.calories;
        totalProtein += currentMeal.protein;
        totalCarbs += currentMeal.carbs;
        totalFat += currentMeal.fat;
      }

      // If parsing failed or no meals found, fall back to demo
      if (meals.length === 0) {
        console.log('Failed to parse AI response, falling back to demo data');
        console.log('AI Response:', text);
        return this.generateDemoMealPlan(goals);
      }

      // Validate against targets
      const targets = this.getMacroTargets(goals);
      const tolerance = 0.1; // 10% tolerance
      
      const caloriesOff = Math.abs(totalCalories - targets.calories) > targets.calories * tolerance;
      const proteinOff = Math.abs(totalProtein - targets.protein) > targets.protein * tolerance;
      const carbsOff = Math.abs(totalCarbs - targets.carbs) > targets.carbs * tolerance;
      const fatOff = Math.abs(totalFat - targets.fat) > targets.fat * tolerance;
      
      if (caloriesOff || proteinOff || carbsOff || fatOff) {
        console.warn('Nutrition targets missed:');
        console.warn(`Target: ${targets.calories}cal, ${targets.protein}g protein, ${targets.carbs}g carbs, ${targets.fat}g fat`);
        console.warn(`Actual: ${totalCalories}cal, ${totalProtein}g protein, ${totalCarbs}g carbs, ${totalFat}g fat`);
      }

      // Format goal name properly
      const goalName = goals.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

      return {
        id: `plan-${Date.now()}`,
        name: `${goalName} Plan (AI Generated)`,
        description: `An AI-generated nutrition plan optimized for ${goalName.toLowerCase()}`,
        dailyMeals: [{ day: 'Daily Meals', meals }],
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
        created_at: new Date().toISOString(),
        aiGenerated: true,
        targetAccuracy: {
          calories: Math.abs(totalCalories - targets.calories) / targets.calories * 100,
          protein: Math.abs(totalProtein - targets.protein) / targets.protein * 100,
          carbs: Math.abs(totalCarbs - targets.carbs) / targets.carbs * 100,
          fat: Math.abs(totalFat - targets.fat) / targets.fat * 100
        }
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return this.generateDemoMealPlan(goals);
    }
  }

  generateDemoMealPlan(goals) {
    // Generate a single day of meals
    const meals = this.generateBodybuilderMeals(1);
    const dailyMeals = [{ day: 'Daily Meals', meals }];

    // Format goal name properly
    const goalName = goals.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

    return {
      id: `plan-${Date.now()}`,
      name: `${goalName} Plan`,
      description: `A nutrition plan optimized for ${goalName.toLowerCase()}`,
      dailyMeals,
      totalCalories: this.calculateTotalCalories(1),
      totalProtein: this.calculateTotalProtein(1),
      totalCarbs: this.calculateTotalCarbs(1),
      totalFat: this.calculateTotalFat(1),
      created_at: new Date().toISOString(),
      aiGenerated: false
    };
  }

  generateBodybuilderMeals(dayNumber) {
    return [
          this.createMeal('Pre-Workout Shake', 300, 25, 30, 8, ['Protein powder', 'Banana', 'Oats', 'Almond milk'], ['Blend all ingredients', 'Drink 30 minutes before workout'], 5, 0),
          this.createMeal('Post-Workout Meal', 450, 35, 45, 12, ['Chicken breast', 'Sweet potato', 'Broccoli', 'Olive oil'], ['Grill chicken', 'Bake sweet potato', 'Steam broccoli'], 15, 25),
          this.createMeal('Protein-Rich Dinner', 400, 40, 25, 15, ['Salmon', 'Quinoa', 'Asparagus', 'Lemon'], ['Bake salmon', 'Cook quinoa', 'Roast asparagus'], 20, 30)
    ];
  }

  createMeal(name, calories, protein, carbs, fat, ingredients, instructions, prepTime, cookTime) {
    return {
      name,
      calories,
      protein,
      carbs,
      fat,
      ingredients,
      instructions,
      prepTime,
      cookTime
    };
  }

  calculateTotalCalories(days) {
    return 1150; // Sum of the demo meals
  }

  calculateTotalProtein(days) {
    return 100; // Sum of the demo meals
  }

  calculateTotalCarbs(days) {
    return 100; // Sum of the demo meals
  }

  calculateTotalFat(days) {
    return 35; // Sum of the demo meals
  }
}

export default new NutritionAI(); 