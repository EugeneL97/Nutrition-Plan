'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface CreatePlanFormProps {
  onPlanCreated?: (planId: string) => void
}

export default function CreatePlanForm({ onPlanCreated }: CreatePlanFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  
  const [formData, setFormData] = useState({
    goal: 'muscle_gain',
    dietaryRestrictions: [] as string[],
    calorieTarget: 2000,
    proteinTarget: 150,
    carbTarget: 200,
    fatTarget: 65
  })

  const [restrictionInput, setRestrictionInput] = useState('')

  const goals = [
    { value: 'weight_loss', label: 'Weight Loss', icon: '⚖' },
    { value: 'muscle_gain', label: 'Muscle Gain', icon: '💪' },
    { value: 'maintenance', label: 'Maintenance', icon: '🔄' }
  ]

  const commonRestrictions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 
    'Nut-Free', 'Low-Carb', 'Keto', 'Paleo'
  ]

  // Calculate macros based on calories and goal
  const calculateMacros = (calories: number, goal: string) => {
    let proteinRatio, carbRatio, fatRatio
    
    switch (goal) {
      case 'muscle_gain':
        proteinRatio = 0.3 // 30% protein
        carbRatio = 0.45   // 45% carbs
        fatRatio = 0.25    // 25% fat
        break
      case 'weight_loss':
        proteinRatio = 0.35 // 35% protein
        carbRatio = 0.35   // 35% carbs
        fatRatio = 0.30    // 30% fat
        break
      case 'maintenance':
      default:
        proteinRatio = 0.25 // 25% protein
        carbRatio = 0.50   // 50% carbs
        fatRatio = 0.25    // 25% fat
        break
    }
    
    const protein = Math.round((calories * proteinRatio) / 4) // 4 calories per gram
    const carbs = Math.round((calories * carbRatio) / 4)      // 4 calories per gram
    const fat = Math.round((calories * fatRatio) / 9)         // 9 calories per gram
    
    return { protein, carbs, fat }
  }

  // Update macros when calories or goal changes
  useEffect(() => {
    const { protein, carbs, fat } = calculateMacros(formData.calorieTarget, formData.goal)
    setFormData(prev => ({
      ...prev,
      proteinTarget: protein,
      carbTarget: carbs,
      fatTarget: fat
    }))
  }, [formData.calorieTarget, formData.goal])

  const addRestriction = () => {
    if (restrictionInput.trim() && !formData.dietaryRestrictions.includes(restrictionInput.trim())) {
      setFormData(prev => ({
        ...prev,
        dietaryRestrictions: [...prev.dietaryRestrictions, restrictionInput.trim()]
      }))
      setRestrictionInput('')
    }
  }

  const removeRestriction = (restriction: string) => {
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.filter(r => r !== restriction)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await apiClient.generateMealPlan(
        formData.goal,
        formData.dietaryRestrictions
      )
      
      if (response.success) {
        const mealPlan = response.data
        
        // Store the plan in localStorage for demo purposes
        const existingPlans = JSON.parse(localStorage.getItem('nutrition-plans') || '[]')
        const updatedPlans = [mealPlan, ...existingPlans]
        localStorage.setItem('nutrition-plans', JSON.stringify(updatedPlans))

        onPlanCreated?.(mealPlan.id)
        router.push(`/plans/${mealPlan.id}`)
      }
    } catch (error) {
      console.error('Error creating plan:', error)
      // Fallback to demo data if API fails
      const demoPlan = {
        id: `demo-${Date.now()}`,
        name: `${formData.goal.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Plan`,
        description: `Demo plan for ${formData.goal.replace('_', ' ')}`,
        dailyMeals: [],
        totalCalories: formData.calorieTarget * 7,
        totalProtein: formData.proteinTarget * 7,
        totalCarbs: formData.carbTarget * 7,
        totalFat: formData.fatTarget * 7,
        created_at: new Date().toISOString()
      }
      
      const existingPlans = JSON.parse(localStorage.getItem('nutrition-plans') || '[]')
      const updatedPlans = [demoPlan, ...existingPlans]
      localStorage.setItem('nutrition-plans', JSON.stringify(updatedPlans))

      onPlanCreated?.(demoPlan.id)
      router.push(`/plans/${demoPlan.id}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Nutrition Plan</h2>
        <p className="text-gray-600">Let AI generate a personalized meal plan based on your goals</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            1
          </div>
          <div className={`w-16 h-1 mx-2 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
          <div className={`w-16 h-1 mx-2 ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            3
          </div>
        </div>
      </div>

      {/* Step 1: Goal Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">What's your primary goal?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => (
              <button
                key={goal.value}
                onClick={() => setFormData(prev => ({ ...prev, goal: goal.value }))}
                className={`p-6 border-2 rounded-lg transition-colors text-left ${
                  formData.goal === goal.value
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50'
                }`}
              >
                <div className="text-3xl mb-2">{goal.icon}</div>
                <h4 className="font-semibold text-gray-900">{goal.label}</h4>
              </button>
            ))}
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Dietary Restrictions */}
      {step === 2 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Any dietary restrictions?</h3>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {commonRestrictions.map((restriction) => (
                <button
                  key={restriction}
                  onClick={() => {
                    if (formData.dietaryRestrictions.includes(restriction)) {
                      removeRestriction(restriction)
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        dietaryRestrictions: [...prev.dietaryRestrictions, restriction]
                      }))
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    formData.dietaryRestrictions.includes(restriction)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {restriction}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={restrictionInput}
                onChange={(e) => setRestrictionInput(e.target.value)}
                placeholder="Add custom restriction..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onKeyPress={(e) => e.key === 'Enter' && addRestriction()}
              />
              <button
                onClick={addRestriction}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Nutrition Targets */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Set your nutrition targets</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Calories
              </label>
              <input
                type="number"
                value={formData.calorieTarget}
                onChange={(e) => setFormData(prev => ({ ...prev, calorieTarget: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min="1200"
                max="4000"
                step="50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Protein (g/day)
              </label>
              <input
                type="number"
                value={formData.proteinTarget}
                onChange={(e) => setFormData(prev => ({ ...prev, proteinTarget: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min="50"
                max="300"
                step="5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carbs (g/day)
              </label>
              <input
                type="number"
                value={formData.carbTarget}
                onChange={(e) => setFormData(prev => ({ ...prev, carbTarget: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min="50"
                max="500"
                step="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fat (g/day)
              </label>
              <input
                type="number"
                value={formData.fatTarget}
                onChange={(e) => setFormData(prev => ({ ...prev, fatTarget: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min="30"
                max="150"
                step="5"
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Protein, carbs, and fat are automatically calculated based on your calorie target and goal. 
              You can adjust them manually if needed.
            </p>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating Plan...' : 'Generate Plan'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
} 