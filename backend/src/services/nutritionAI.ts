import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'demo-key');

// Lifestyle types with different nutrition approaches
const LIFESTYLES = {
  bodybuilder: {
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
  },
  casual_gym_goer: {
    name: 'Casual Gym Goer',
    description: 'Regular exercise with moderate fitness goals',
    characteristics: [
      'Moderate protein (1g per lb bodyweight)',
      'Balanced nutrition approach',
      'Flexible meal timing',
      'General fitness focus',
      'Sustainable habits'
    ],
    nutritionFocus: {
      protein: 'moderate',
      carbs: 'balanced',
      fat: 'balanced',
      mealFrequency: '3-5 meals per day',
      timing: 'flexible'
    }
  },
  busy_professional: {
    name: 'Busy Professional',
    description: 'Time-constrained with workplace nutrition needs',
    characteristics: [
      'Quick meal solutions',
      'Workplace cafeteria options',
      'Snack-based nutrition',
      'Time-efficient prep',
      'Stress management focus'
    ],
    nutritionFocus: {
      protein: 'adequate',
      carbs: 'moderate',
      fat: 'moderate',
      mealFrequency: '3 meals + snacks',
      timing: 'flexible'
    }
  },
  average_joe: {
    name: 'Average Joe',
    description: 'General health and weight management focus',
    characteristics: [
      'Simple, sustainable approach',
      'Weight loss/maintenance focus',
      'Basic nutrition knowledge',
      'No strict timing requirements',
      'Lifestyle-friendly meals'
    ],
    nutritionFocus: {
      protein: 'adequate',
      carbs: 'moderate',
      fat: 'controlled',
      mealFrequency: '3 meals per day',
      timing: 'flexible'
    }
  }
};

class NutritionAI {
  private model: any;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateMealPlan(lifestyle, goals, restrictions) {
    try {
      const lifestyleConfig = LIFESTYLES[lifestyle];
      if (!lifestyleConfig) {
        throw new Error('Invalid lifestyle type');
      }

      const prompt = this.buildLifestyleSpecificPrompt(lifestyleConfig, goals, restrictions);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseMealPlanResponse(text, lifestyleConfig, goals);
    } catch (error) {
      console.error('Error generating meal plan:', error);
      return this.generateDemoMealPlan(lifestyle, goals);
    }
  }

  buildLifestyleSpecificPrompt(lifestyleConfig, goals, restrictions) {
    return `Create a single day nutrition plan for a ${lifestyleConfig.name.toLowerCase()}.

Lifestyle Characteristics:
${lifestyleConfig.characteristics.map(char => `- ${char}`).join('\n')}

Nutrition Focus:
- Protein: ${lifestyleConfig.nutritionFocus.protein}
- Carbs: ${lifestyleConfig.nutritionFocus.carbs}
- Fat: ${lifestyleConfig.nutritionFocus.fat}
- Meal Frequency: ${lifestyleConfig.nutritionFocus.mealFrequency}
- Timing: ${lifestyleConfig.nutritionFocus.timing}

User Goals: ${goals}
Dietary Restrictions: ${restrictions.join(', ') || 'None'}

Generate a meal plan that:
1. Aligns with the lifestyle characteristics
2. Provides appropriate meal frequency and timing
3. Includes realistic prep times for the lifestyle
4. Offers practical meal options
5. Considers the user's specific goals and restrictions

Format as a structured meal plan for a single day.`;
  }

  parseMealPlanResponse(text, lifestyleConfig, goals) {
    // For now, return demo data - in production, parse AI response
    return this.generateDemoMealPlan(lifestyleConfig.name.toLowerCase(), goals);
  }

  generateDemoMealPlan(lifestyle, goals) {
    const lifestyleConfig = LIFESTYLES[lifestyle] || LIFESTYLES.average_joe;
    
    // Generate a single day of meals
    const meals = this.generateLifestyleSpecificMeals(lifestyleConfig, 1);
    const dailyMeals = [{ day: 'Daily Meals', meals }];

    // Format goal name properly
    const goalName = goals.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

    return {
      id: `plan-${Date.now()}`,
      name: `${goalName} Plan`,
      description: `A nutrition plan optimized for ${goalName.toLowerCase()}`,
      lifestyle: lifestyle,
      dailyMeals,
      totalCalories: this.calculateTotalCalories(lifestyleConfig, 1),
      totalProtein: this.calculateTotalProtein(lifestyleConfig, 1),
      totalCarbs: this.calculateTotalCarbs(lifestyleConfig, 1),
      totalFat: this.calculateTotalFat(lifestyleConfig, 1),
      created_at: new Date().toISOString()
    };
  }

  generateLifestyleSpecificMeals(lifestyleConfig, dayNumber) {
    const meals = [];
    
    switch (lifestyleConfig.name.toLowerCase()) {
      case 'bodybuilder':
        meals.push(
          this.createMeal('Pre-Workout Shake', 300, 25, 30, 8, ['Protein powder', 'Banana', 'Oats', 'Almond milk'], ['Blend all ingredients', 'Drink 30 minutes before workout'], 5, 0),
          this.createMeal('Post-Workout Meal', 450, 35, 45, 12, ['Chicken breast', 'Sweet potato', 'Broccoli', 'Olive oil'], ['Grill chicken', 'Bake sweet potato', 'Steam broccoli'], 15, 25),
          this.createMeal('Protein-Rich Dinner', 400, 40, 25, 15, ['Salmon', 'Quinoa', 'Asparagus', 'Lemon'], ['Bake salmon', 'Cook quinoa', 'Roast asparagus'], 20, 30)
        );
        break;
        
      case 'casual gym goer':
        meals.push(
          this.createMeal('Protein Oatmeal Bowl', 350, 20, 45, 12, ['Oats', 'Protein powder', 'Berries', 'Almonds'], ['Cook oats', 'Mix in protein powder', 'Top with berries'], 10, 5),
          this.createMeal('Grilled Chicken Salad', 400, 35, 25, 18, ['Chicken breast', 'Mixed greens', 'Cherry tomatoes', 'Balsamic'], ['Grill chicken', 'Assemble salad'], 15, 20),
          this.createMeal('Balanced Dinner', 450, 30, 40, 20, ['Lean beef', 'Brown rice', 'Vegetables'], ['Cook beef', 'Prepare rice', 'Steam vegetables'], 20, 25)
        );
        break;
        
      case 'busy professional':
        meals.push(
          this.createMeal('Quick Breakfast Wrap', 300, 20, 35, 10, ['Eggs', 'Whole wheat tortilla', 'Spinach', 'Cheese'], ['Scramble eggs', 'Assemble wrap'], 8, 5),
          this.createMeal('Office Lunch Bowl', 400, 25, 40, 15, ['Quinoa', 'Chickpeas', 'Mixed vegetables', 'Tahini'], ['Prepare quinoa', 'Mix ingredients', 'Add dressing'], 10, 15),
          this.createMeal('Easy Dinner', 350, 30, 30, 12, ['Turkey', 'Pasta', 'Tomato sauce', 'Herbs'], ['Cook turkey', 'Boil pasta', 'Combine with sauce'], 15, 20)
        );
        break;
        
      default: // average joe
        meals.push(
          this.createMeal('Simple Breakfast', 300, 15, 40, 10, ['Greek yogurt', 'Granola', 'Honey', 'Fruit'], ['Layer ingredients in bowl'], 5, 0),
          this.createMeal('Light Lunch', 350, 20, 35, 12, ['Tuna', 'Whole grain bread', 'Lettuce', 'Mayo'], ['Mix tuna with mayo', 'Assemble sandwich'], 8, 0),
          this.createMeal('Home Dinner', 400, 25, 35, 15, ['Pork chop', 'Mashed potatoes', 'Green beans'], ['Cook pork chop', 'Prepare sides'], 20, 25)
        );
    }
    
    return meals;
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

  calculateTotalCalories(lifestyleConfig, days) {
    const baseCalories = lifestyleConfig.nutritionFocus.protein === 'high' ? 2200 : 2000;
    return baseCalories;
  }

  calculateTotalProtein(lifestyleConfig, days) {
    const baseProtein = lifestyleConfig.nutritionFocus.protein === 'high' ? 180 : 120;
    return baseProtein;
  }

  calculateTotalCarbs(lifestyleConfig, days) {
    const baseCarbs = 200; // Moderate baseline
    return baseCarbs;
  }

  calculateTotalFat(lifestyleConfig, days) {
    const baseFat = 65; // Moderate baseline
    return baseFat;
  }

  getLifestyles() {
    return LIFESTYLES;
  }
}

export default new NutritionAI(); 