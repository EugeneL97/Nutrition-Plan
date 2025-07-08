// API client for communicating with the backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Lifestyle {
  name: string;
  description: string;
  characteristics: string[];
  nutritionFocus: {
    protein: string;
    carbs: string;
    fat: string;
    mealFrequency: string;
    timing: string;
  };
}

export interface NutritionGoals {
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance';
  dietaryRestrictions: string[];
  calorieTarget: number;
  proteinTarget: number;
  carbTarget: number;
  fatTarget: number;
}

export interface MealPlan {
  id: string;
  name: string;
  description: string;
  lifestyle: string;
  dailyMeals: DailyMeal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  created_at: string;
}

export interface DailyMeal {
  day: string;
  meals: Meal[];
}

export interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getLifestyles(): Promise<{ success: boolean; data: Record<string, Lifestyle> }> {
    return this.request('/nutrition/lifestyles');
  }

  async generateMealPlan(
    lifestyle: string,
    goals: string,
    restrictions: string[] = []
  ): Promise<{ success: boolean; data: MealPlan }> {
    return this.request('/nutrition/generate-plan', {
      method: 'POST',
      body: JSON.stringify({
        lifestyle,
        goals,
        restrictions,
      }),
    });
  }

  async getDemoPlan(lifestyle: string): Promise<{ success: boolean; data: MealPlan }> {
    return this.request(`/nutrition/demo-plan/${lifestyle}`);
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Fallback demo data for when backend is not available
export const demoLifestyles: Record<string, Lifestyle> = {
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