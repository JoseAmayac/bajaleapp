import { useState, type FormEvent } from 'react'
import { useActivities } from '../hooks/useActivities'
import type { DailyActivity } from '../types'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Card } from '../components/ui/Card'

const today = new Date().toISOString().split('T')[0]

const QUICK_TYPES = ['Caminata', 'Gym', 'Bicicleta', 'Natación', 'Otro']

const INTENSITY_STYLES: Record<string, string> = {
  baja:     'bg-green-50 text-green-600',
  moderada: 'bg-amber-50 text-amber-600',
  alta:     'bg-red-50 text-red-500',
}

export function ActivityPage() {
  const { activities, loading, addActivity, deleteActivity } = useActivities(today)
  const [activityType, setActivityType] = useState('')
  const [duration, setDuration] = useState('')
  const [intensity, setIntensity] = useState<DailyActivity['intensity']>('moderada')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!activityType.trim() || !duration) return
    setSubmitting(true)
    await addActivity({
      activity_type: activityType.trim(),
      duration_minutes: parseInt(duration),
      intensity,
      notes: notes.trim() || null,
    })
    setActivityType('')
    setDuration('')
    setNotes('')
    setSubmitting(false)
  }

  return (
    <div className="flex flex-col gap-4 pt-2">

      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Nueva actividad</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">Tipo</label>
            <div className="flex flex-wrap gap-2">
              {QUICK_TYPES.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setActivityType(t)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    activityType === t
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-200'
                      : 'border-gray-200 text-gray-500 hover:border-emerald-300 bg-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <input
              className="w-full rounded-xl bg-gray-50 border border-gray-100 px-3.5 py-3 text-[15px] text-gray-900 placeholder:text-gray-300 outline-none focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all mt-1"
              placeholder="O escribe aquí..."
              value={activityType}
              onChange={e => setActivityType(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Duración (min)"
              type="number"
              min={1}
              value={duration}
              onChange={e => setDuration(e.target.value)}
              placeholder="30"
              required
            />
            <Select
              label="Intensidad"
              value={intensity ?? 'moderada'}
              onChange={e => setIntensity(e.target.value as DailyActivity['intensity'])}
            >
              <option value="baja">Baja</option>
              <option value="moderada">Moderada</option>
              <option value="alta">Alta</option>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">Notas (opcional)</label>
            <textarea
              className="w-full rounded-xl bg-gray-50 border border-gray-100 px-3.5 py-3 text-[15px] text-gray-900 placeholder:text-gray-300 outline-none focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 resize-none transition-all"
              rows={2}
              placeholder="Ej: Corrí en el parque..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Guardando...' : 'Agregar actividad'}
          </Button>
        </form>
      </Card>

      {loading ? (
        <p className="text-center text-gray-300 py-12 text-sm">Cargando...</p>
      ) : activities.length === 0 ? (
        <p className="text-center text-gray-300 py-12 text-sm">Sin actividades registradas hoy</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {activities.map(a => (
            <Card key={a.id}>
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[15px] font-medium text-gray-800">{a.activity_type}</p>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${INTENSITY_STYLES[a.intensity ?? 'moderada']}`}>
                      {a.intensity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {a.duration_minutes} min
                    {a.calories_burned_estimated ? ` · ~${Math.round(a.calories_burned_estimated)} kcal` : ''}
                  </p>
                  {a.notes && <p className="text-xs text-gray-400 mt-1">{a.notes}</p>}
                </div>
                <button onClick={() => deleteActivity(a.id)} className="p-2 text-gray-300 hover:text-red-400 rounded-xl hover:bg-red-50 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
