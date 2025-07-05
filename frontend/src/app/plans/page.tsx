'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { MealPlan } from '@/lib/api'

export default function PlansPage() {
  const { user } = useAuth()
  const [plans, setPlans] = useState<MealPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchPlans()
    }
  }, [user])

  const fetchPlans = async () => {
    // Simulate loading
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Get plans from localStorage
    const storedPlans = JSON.parse(localStorage.getItem('nutrition-plans') || '[]')
    setPlans(storedPlans)
    setLoading(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please sign in to view your plans
          </h2>
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Nutrition Plans</h1>
            <p className="mt-2 text-gray-600">
              Manage and view your personalized nutrition plans
            </p>
          </div>
          <Link
            href="/plans/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create New Plan
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading plans...</div>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No nutrition plans yet</div>
            <Link
              href="/plans/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create Your First Plan
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-indigo-500 rounded-md flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        <Link href={`/plans/${plan.id}`} className="hover:text-indigo-600">
                          {plan.name}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-500">{plan.description}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <span className="ml-1 font-medium">{plan.dailyMeals.length} days</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Calories:</span>
                      <span className="ml-1 font-medium">{Math.round(plan.totalCalories / plan.dailyMeals.length)}/day</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      Created {new Date(plan.created_at).toLocaleDateString()}
                    </div>
                    <Link
                      href={`/plans/${plan.id}`}
                      className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 