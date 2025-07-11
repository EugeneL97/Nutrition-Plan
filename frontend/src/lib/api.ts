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

export interface DailyLog {
  id: string;
  weight: number;
  sleepHours: number;
  wakeTime: string;
  digestionRating: number;
  date: string;
  created_at: string;
}

export interface OptimalScore {
  score: number;
  recommendations: string[];
  factors: {
    sleep: { score: number; weight: number };
    digestion: { score: number; weight: number };
    weight: { score: number; weight: number };
  };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
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

  async logDailyMetrics(
    weight: number,
    sleepHours: number,
    wakeTime: string,
    digestionRating: number,
    date?: string
  ): Promise<{ success: boolean; data: DailyLog }> {
    return this.request('/nutrition/daily-log', {
      method: 'POST',
      body: JSON.stringify({
        weight,
        sleepHours,
        wakeTime,
        digestionRating,
        date,
      }),
    });
  }

  async getDailyLogs(limit?: number): Promise<{ success: boolean; data: DailyLog[] }> {
    const params = limit ? `?limit=${limit}` : '';
    return this.request(`/nutrition/daily-logs${params}`);
  }

  async getOptimalScore(): Promise<{ success: boolean; data: OptimalScore }> {
    return this.request('/nutrition/optimal-score');
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE_URL);