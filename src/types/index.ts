export interface Profile {
  id: string
  full_name: string | null
  height_cm: number | null
  starting_weight_kg: number | null
  goal_weight_kg: number | null
  birth_date: string | null
  sex: 'masculino' | 'femenino' | 'otro' | null
  activity_level: 'sedentario' | 'ligero' | 'moderado' | 'activo' | 'muy_activo' | null
  daily_calorie_goal: number | null
  created_at: string
  updated_at: string
}

export interface DailyMeal {
  id: string
  user_id: string
  meal_date: string
  meal_type: 'desayuno' | 'almuerzo' | 'cena' | 'snack'
  description: string
  calories_estimated: number | null
  protein_g: number | null
  carbs_g: number | null
  fat_g: number | null
  ai_processed: boolean
  image_url: string | null
  created_at: string
}

export interface DailyActivity {
  id: string
  user_id: string
  activity_date: string
  activity_type: string
  duration_minutes: number
  intensity: 'baja' | 'moderada' | 'alta' | null
  calories_burned_estimated: number | null
  notes: string | null
  created_at: string
}

export interface WeeklyMeasurement {
  id: string
  user_id: string
  measurement_date: string
  weight_kg: number | null
  waist_cm: number | null
  hip_cm: number | null
  chest_cm: number | null
  arm_cm: number | null
  thigh_cm: number | null
  body_fat_pct: number | null
  notes: string | null
  created_at: string
}

export interface DailySummary {
  user_id: string
  summary_date: string
  calories_consumed: number
  calories_burned: number
}
