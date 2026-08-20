import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { DailyActivity } from '../types'

export function useActivities(date: string) {
  const [activities, setActivities] = useState<DailyActivity[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data } = await supabase
      .from('daily_activity')
      .select('*')
      .eq('activity_date', date)
      .order('created_at', { ascending: true })
    setActivities(data ?? [])
    setLoading(false)
  }, [date])

  useEffect(() => { fetch() }, [fetch])

  const addActivity = async (activity: Pick<DailyActivity, 'activity_type' | 'duration_minutes' | 'intensity' | 'notes'>) => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('daily_activity')
      .insert({ ...activity, activity_date: date, user_id: user!.id })
      .select()
      .single()
    if (data) setActivities(prev => [...prev, data])
  }

  const deleteActivity = async (id: string) => {
    await supabase.from('daily_activity').delete().eq('id', id)
    setActivities(prev => prev.filter(a => a.id !== id))
  }

  return { activities, loading, addActivity, deleteActivity }
}
