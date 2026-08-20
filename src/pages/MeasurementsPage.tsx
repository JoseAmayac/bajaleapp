import { useState, type FormEvent } from 'react'
import { useMeasurements } from '../hooks/useMeasurements'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'

export function MeasurementsPage() {
  const { measurements, loading, addMeasurement, deleteMeasurement } = useMeasurements()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    measurement_date: new Date().toISOString().split('T')[0],
    weight_kg: '', waist_cm: '', hip_cm: '', chest_cm: '',
    arm_cm: '', thigh_cm: '', body_fat_pct: '', notes: '',
  })

  const set = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.weight_kg) return
    setSubmitting(true)
    setError('')
    try {
      await addMeasurement({
        measurement_date: form.measurement_date,
        weight_kg: parseFloat(form.weight_kg),
        waist_cm: form.waist_cm ? parseFloat(form.waist_cm) : null,
        hip_cm: form.hip_cm ? parseFloat(form.hip_cm) : null,
        chest_cm: form.chest_cm ? parseFloat(form.chest_cm) : null,
        arm_cm: form.arm_cm ? parseFloat(form.arm_cm) : null,
        thigh_cm: form.thigh_cm ? parseFloat(form.thigh_cm) : null,
        body_fat_pct: form.body_fat_pct ? parseFloat(form.body_fat_pct) : null,
        notes: form.notes || null,
      })
      setForm(prev => ({ ...prev, weight_kg: '', waist_cm: '', hip_cm: '', chest_cm: '', arm_cm: '', thigh_cm: '', body_fat_pct: '', notes: '' }))
    } catch {
      setError('Ya existe un registro para esa fecha.')
    }
    setSubmitting(false)
  }

  return (
    <div className="flex flex-col gap-4 pt-2">

      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Nuevo registro</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input label="Fecha" type="date" value={form.measurement_date} onChange={e => set('measurement_date', e.target.value)} required />
          <Input label="Peso (kg) *" type="number" step="0.1" placeholder="70.5" value={form.weight_kg} onChange={e => set('weight_kg', e.target.value)} required />

          <div className="grid grid-cols-2 gap-3">
            <Input label="Cintura (cm)" type="number" step="0.1" placeholder="80" value={form.waist_cm} onChange={e => set('waist_cm', e.target.value)} />
            <Input label="Cadera (cm)" type="number" step="0.1" placeholder="95" value={form.hip_cm} onChange={e => set('hip_cm', e.target.value)} />
            <Input label="Pecho (cm)" type="number" step="0.1" placeholder="90" value={form.chest_cm} onChange={e => set('chest_cm', e.target.value)} />
            <Input label="Brazo (cm)" type="number" step="0.1" placeholder="30" value={form.arm_cm} onChange={e => set('arm_cm', e.target.value)} />
            <Input label="Muslo (cm)" type="number" step="0.1" placeholder="55" value={form.thigh_cm} onChange={e => set('thigh_cm', e.target.value)} />
            <Input label="% Grasa" type="number" step="0.1" placeholder="20" value={form.body_fat_pct} onChange={e => set('body_fat_pct', e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">Notas (opcional)</label>
            <textarea
              className="w-full rounded-xl bg-gray-50 border border-gray-100 px-3.5 py-3 text-[15px] text-gray-900 placeholder:text-gray-300 outline-none focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 resize-none transition-all"
              rows={2}
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Guardando...' : 'Guardar medidas'}
          </Button>
        </form>
      </Card>

      {loading ? (
        <p className="text-center text-gray-300 py-12 text-sm">Cargando...</p>
      ) : measurements.length === 0 ? (
        <p className="text-center text-gray-300 py-12 text-sm">Sin medidas registradas</p>
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                {['Fecha', 'Peso', 'Cintura', 'Cadera', '% Grasa', ''].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {measurements.map((m, i) => (
                <tr key={m.id} className={`${i !== measurements.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{m.measurement_date}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{m.weight_kg} kg</td>
                  <td className="px-4 py-3 text-gray-500">{m.waist_cm ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{m.hip_cm ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{m.body_fat_pct ? `${m.body_fat_pct}%` : '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteMeasurement(m.id)} className="p-1.5 text-gray-300 hover:text-red-400 rounded-lg hover:bg-red-50 transition-colors">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
