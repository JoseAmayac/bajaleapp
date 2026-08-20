import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { WeeklyMeasurement } from '../types'

export function useMeasurements() {
  const [measurements, setMeasurements] = useState<WeeklyMeasurement[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data } = await supabase
      .from('weekly_measurements')
      .select('*')
      .order('measurement_date', { ascending: false })
    setMeasurements(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const addMeasurement = async (m: Omit<WeeklyMeasurement, 'id' | 'user_id' | 'created_at'>) => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('weekly_measurements')
      .insert({ ...m, user_id: user!.id })
      .select()
      .single()
    if (error) throw error
    if (data) setMeasurements(prev => [data, ...prev])
  }

  const deleteMeasurement = async (id: string) => {
    await supabase.from('weekly_measurements').delete().eq('id', id)
    setMeasurements(prev => prev.filter(m => m.id !== id))
  }

  return { measurements, loading, addMeasurement, deleteMeasurement }
}
