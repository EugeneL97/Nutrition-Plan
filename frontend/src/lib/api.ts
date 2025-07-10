// API client for communicating with the backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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

  async generateMealPlan(
    goals: string,
    restrictions: string[] = []
  ): Promise<{ success: boolean; data: MealPlan }> {
    return this.request('/nutrition/generate-plan', {
      method: 'POST',
      body: JSON.stringify({
        goals,
        restrictions,
      }),
    });
  }

  async getDemoPlan(goals: string): Promise<{ success: boolean; data: MealPlan }> {
    return this.request(`/nutrition/demo-plan/${goals}`);
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE_URL);