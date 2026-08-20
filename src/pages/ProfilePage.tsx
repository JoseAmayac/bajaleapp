import { useState, useEffect, type FormEvent } from 'react'
import { useProfile } from '../hooks/useProfile'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Card } from '../components/ui/Card'

export function ProfilePage() {
  const { profile, loading, updateProfile } = useProfile()
  const { signOut, session } = useAuth()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    full_name: '', height_cm: '', starting_weight_kg: '',
    goal_weight_kg: '', daily_calorie_goal: '', activity_level: 'moderado',
  })

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? '',
        height_cm: profile.height_cm?.toString() ?? '',
        starting_weight_kg: profile.starting_weight_kg?.toString() ?? '',
        goal_weight_kg: profile.goal_weight_kg?.toString() ?? '',
        daily_calorie_goal: profile.daily_calorie_goal?.toString() ?? '',
        activity_level: profile.activity_level ?? 'moderado',
      })
    }
  }, [profile])

  const set = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await updateProfile({
      full_name: form.full_name || null,
      height_cm: form.height_cm ? parseFloat(form.height_cm) : null,
      starting_weight_kg: form.starting_weight_kg ? parseFloat(form.starting_weight_kg) : null,
      goal_weight_kg: form.goal_weight_kg ? parseFloat(form.goal_weight_kg) : null,
      daily_calorie_goal: form.daily_calorie_goal ? parseInt(form.daily_calorie_goal) : null,
      activity_level: form.activity_level as any,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <p className="text-center text-gray-300 py-16 text-sm">Cargando...</p>

  return (
    <div className="flex flex-col gap-4 pt-2">

      {/* Info cuenta */}
      <Card className="flex items-center gap-3">
        <div className="w-11 h-11 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={1.8} className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-medium text-gray-800 truncate">{form.full_name || 'Sin nombre'}</p>
          <p className="text-xs text-gray-400 truncate">{session?.user.email}</p>
        </div>
      </Card>

      {/* Formulario */}
      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Datos personales</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input label="Nombre" value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Tu nombre" />
          <Input label="Altura (cm)" type="number" step="0.1" value={form.height_cm} onChange={e => set('height_cm', e.target.value)} placeholder="170" />

          <div className="grid grid-cols-2 gap-3">
            <Input label="Peso inicial (kg)" type="number" step="0.1" value={form.starting_weight_kg} onChange={e => set('starting_weight_kg', e.target.value)} placeholder="80" />
            <Input label="Peso meta (kg)" type="number" step="0.1" value={form.goal_weight_kg} onChange={e => set('goal_weight_kg', e.target.value)} placeholder="70" />
          </div>

          <Input label="Objetivo calórico (kcal/día)" type="number" value={form.daily_calorie_goal} onChange={e => set('daily_calorie_goal', e.target.value)} placeholder="2000" />

          <Select label="Nivel de actividad" value={form.activity_level} onChange={e => set('activity_level', e.target.value)}>
            <option value="sedentario">Sedentario</option>
            <option value="ligero">Ligero</option>
            <option value="moderado">Moderado</option>
            <option value="activo">Activo</option>
            <option value="muy_activo">Muy activo</option>
          </Select>

          <Button type="submit" disabled={saving} className="w-full mt-1">
            {saving ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar cambios'}
          </Button>
        </form>
      </Card>

      <Button variant="secondary" onClick={signOut} className="w-full text-red-500 border-red-100 hover:bg-red-50">
        Cerrar sesión
      </Button>
    </div>
  )
}
