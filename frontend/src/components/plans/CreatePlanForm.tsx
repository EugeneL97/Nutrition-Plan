'use client'

import { useState } from 'react'
import { apiClient, demoLifestyles, type Lifestyle } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface CreatePlanFormProps {
  onPlanCreated?: (planId: string) => void
}

export default function CreatePlanForm({ onPlanCreated }: CreatePlanFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  
  const [formData, setFormData] = useState({
    lifestyle: 'average_joe',
    goal: 'weight_loss',
    dietaryRestrictions: [] as string[],
    calorieTarget: 2000,
    proteinTarget: 150,
    carbTarget: 200,
    fatTarget: 65,
    days: 7
  })

  const [restrictionInput, setRestrictionInput] = useState('')

  const goals = [
    { value: 'weight_loss', label: 'Weight Loss', icon: '⚖' },
    { value: 'muscle_gain', label: 'Muscle Gain', icon: '💪' },
    { value: 'maintenance', label: 'Maintenance', icon: '🔄' },
    { value: 'energy_boost', label: 'Energy Boost', icon: '⚡' }
  ]

  const lifestyles = Object.entries(demoLifestyles).map(([key, lifestyle]) => ({
    key,
    ...lifestyle
  }))

  const commonRestrictions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 
    'Nut-Free', 'Low-Carb', 'Keto', 'Paleo'
  ]

  const handleLifestyleSelect = (lifestyle: string) => {
    setFormData(prev => ({ ...prev, lifestyle }))
    setStep(2)
  }

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
        formData.lifestyle,
        formData.goal,
        formData.dietaryRestrictions,
        formData.days
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
        name: `${demoLifestyles[formData.lifestyle]?.name} ${formData.goal} Plan`,
        description: `Demo plan for ${formData.lifestyle}`,
        lifestyle: formData.lifestyle,
        dailyMeals: [],
        totalCalories: formData.calorieTarget * formData.days,
        totalProtein: formData.proteinTarget * formData.days,
        totalCarbs: formData.carbTarget * formData.days,
        totalFat: formData.fatTarget * formData.days,
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
          <div className={`w-16 h-1 mx-2 ${step >= 4 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 4 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            4
          </div>
        </div>
      </div>

      {/* Step 1: Lifestyle Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">What's your lifestyle?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lifestyles.map((lifestyle) => (
              <button
                key={lifestyle.key}
                onClick={() => handleLifestyleSelect(lifestyle.key)}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-left"
              >
                <div className="text-2xl mb-2">
                  {lifestyle.key === 'bodybuilder' && '💪'}
                  {lifestyle.key === 'casual_gym_goer' && '🏋'}
                  {lifestyle.key === 'busy_professional' && '💼'}
                  {lifestyle.key === 'average_joe' && '👤'}
                </div>
                <h4 className="font-semibold text-gray-900">{lifestyle.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{lifestyle.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Goal Selection */}
      {step === 2 && (
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

      {/* Step 3: Dietary Restrictions */}
      {step === 3 && (
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
              onClick={() => setStep(2)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Nutrition Targets */}
      {step === 4 && (
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
                Plan Duration (days)
              </label>
              <input
                type="number"
                value={formData.days}
                onChange={(e) => setFormData(prev => ({ ...prev, days: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min="1"
                max="30"
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

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(3)}
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