import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { DailyMeal } from '../types'

export function useMeals(date: string) {
  const [meals, setMeals] = useState<(DailyMeal & { signed_url?: string })[]>([])
  const [loading, setLoading] = useState(true)

  const getSignedUrls = async (rows: DailyMeal[]) => {
    const withImages = rows.filter(m => m.image_url)
    if (!withImages.length) return rows.map(m => ({ ...m, signed_url: undefined }))

    const signed = await Promise.all(
      withImages.map(m =>
        supabase.storage.from('meal-images').createSignedUrl(m.image_url!, 3600)
      )
    )

    return rows.map((m, i) => {
      const idx = withImages.findIndex(w => w.id === m.id)
      return { ...m, signed_url: idx >= 0 ? (signed[idx].data?.signedUrl ?? undefined) : undefined }
    })
  }

  const fetch = useCallback(async () => {
    const { data } = await supabase
      .from('daily_meals')
      .select('*')
      .eq('meal_date', date)
      .order('created_at', { ascending: true })
    const rows = data ?? []
    setMeals(await getSignedUrls(rows))
    setLoading(false)
  }, [date])

  useEffect(() => { fetch() }, [fetch])

  const addMeal = async (
    meal: Pick<DailyMeal, 'meal_type' | 'description'> & {
      calories_estimated?: number | null
      protein_g?: number | null
      carbs_g?: number | null
      fat_g?: number | null
      image_base64?: string | null
      image_mime_type?: string | null
    }
  ) => {
    const { image_base64, image_mime_type, ...mealData } = meal
    const { data: { user } } = await supabase.auth.getUser()

    const hasManualNutrition = meal.calories_estimated != null

    // Subir imagen al bucket si existe
    let image_url: string | null = null
    if (image_base64) {
      const ext = image_mime_type === 'image/png' ? 'png' : 'jpg'
      const path = `${user!.id}/${date}-${Date.now()}.${ext}`
      const bytes = Uint8Array.from(atob(image_base64), c => c.charCodeAt(0))
      const { error: uploadError } = await supabase.storage
        .from('meal-images')
        .upload(path, bytes, { contentType: image_mime_type ?? 'image/jpeg' })
      if (!uploadError) image_url = path
    }

    const { data, error } = await supabase
      .from('daily_meals')
      .insert({
        ...mealData,
        image_url,
        meal_date: date,
        user_id: user!.id,
        ai_processed: hasManualNutrition,
      })
      .select()
      .single()

    if (error || !data) return

    setMeals(prev => [...prev, data])

    // Solo llamar a la IA si el usuario no ingresó calorías manualmente
    if (!hasManualNutrition) {
      supabase.functions.invoke('estimate-nutrition', {
        body: { meal_id: data.id, description: data.description, image_url: data.image_url },
      }).then(() => fetch())
    }
  }

  const updateMeal = async (id: string, updates: Partial<Pick<DailyMeal, 'meal_type' | 'description'>>) => {
    const { data } = await supabase
      .from('daily_meals')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (data) setMeals(prev => prev.map(m => m.id === id ? data : m))
  }

  const deleteMeal = async (id: string) => {
    await supabase.from('daily_meals').delete().eq('id', id)
    setMeals(prev => prev.filter(m => m.id !== id))
  }

  const totalCalories = meals.reduce((sum, m) => sum + (m.calories_estimated ?? 0), 0)

  return { meals, loading, addMeal, updateMeal, deleteMeal, totalCalories, refresh: fetch }
}
