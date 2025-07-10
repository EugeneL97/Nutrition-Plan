import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'demo-key');

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
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateMealPlan(goals, restrictions) {
    try {
      const prompt = this.buildPrompt(goals, restrictions);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseMealPlanResponse(text, goals);
    } catch (error) {
      console.error('Error generating meal plan:', error);
      return this.generateDemoMealPlan(goals);
    }
  }

  buildPrompt(goals, restrictions) {
    return `Create a single day nutrition plan for a bodybuilder.

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

Generate a meal plan that:
1. Aligns with bodybuilder characteristics
2. Provides appropriate meal frequency and timing
3. Includes realistic prep times
4. Offers practical meal options
5. Considers the user's specific goals and restrictions

Format as a structured meal plan for a single day.`;
  }

  parseMealPlanResponse(text, goals) {
    // For now, return demo data - in production, parse AI response
    return this.generateDemoMealPlan(goals);
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
      created_at: new Date().toISOString()
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