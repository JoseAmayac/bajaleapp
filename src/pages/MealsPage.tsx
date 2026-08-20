import { useState, type FormEvent } from 'react'
import { useMeals } from '../hooks/useMeals'
import type { DailyMeal } from '../types'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Select'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'

const today = new Date().toISOString().split('T')[0]

const MEAL_LABELS: Record<DailyMeal['meal_type'], { label: string; color: string }> = {
  desayuno: { label: 'Desayuno', color: 'bg-amber-50 text-amber-600' },
  almuerzo: { label: 'Almuerzo', color: 'bg-blue-50 text-blue-600' },
  cena:     { label: 'Cena',     color: 'bg-indigo-50 text-indigo-600' },
  snack:    { label: 'Snack',    color: 'bg-pink-50 text-pink-600' },
}

export function MealsPage() {
  const { meals, loading, addMeal, updateMeal, deleteMeal, totalCalories } = useMeals(today)
  const [mealType, setMealType] = useState<DailyMeal['meal_type']>('desayuno')
  const [description, setDescription] = useState('')
  const [showNutrition, setShowNutrition] = useState(false)
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDesc, setEditDesc] = useState('')
  const [editType, setEditType] = useState<DailyMeal['meal_type']>('desayuno')

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault()
    if (!description.trim()) return
    setSubmitting(true)
    await addMeal({
      meal_type: mealType,
      description: description.trim(),
      calories_estimated: calories ? parseFloat(calories) : null,
      protein_g: protein ? parseFloat(protein) : null,
      carbs_g: carbs ? parseFloat(carbs) : null,
      fat_g: fat ? parseFloat(fat) : null,
    })
    setDescription('')
    setCalories('')
    setProtein('')
    setCarbs('')
    setFat('')
    setShowNutrition(false)
    setSubmitting(false)
  }

  const startEdit = (meal: DailyMeal) => {
    setEditingId(meal.id)
    setEditDesc(meal.description)
    setEditType(meal.meal_type)
  }

  const saveEdit = async (id: string) => {
    await updateMeal(id, { description: editDesc, meal_type: editType })
    setEditingId(null)
  }

  return (
    <div className="flex flex-col gap-4 pt-2">

      {/* Formulario */}
      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Nueva comida</p>
        <form onSubmit={handleAdd} className="flex flex-col gap-3">
          <Select value={mealType} onChange={e => setMealType(e.target.value as DailyMeal['meal_type'])} label="Tipo">
            <option value="desayuno">Desayuno</option>
            <option value="almuerzo">Almuerzo</option>
            <option value="cena">Cena</option>
            <option value="snack">Snack</option>
          </Select>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">¿Qué comiste?</label>
            <textarea
              className="w-full rounded-xl bg-gray-50 border border-gray-100 px-3.5 py-3 text-[15px] text-gray-900 placeholder:text-gray-300 outline-none focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 resize-none transition-all"
              rows={3}
              placeholder="Ej: 2 huevos revueltos, pan integral, café con leche..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>
          {/* Toggle nutrición manual */}
          <button
            type="button"
            onClick={() => setShowNutrition(!showNutrition)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-emerald-600 transition-colors self-start"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={`w-3.5 h-3.5 transition-transform ${showNutrition ? 'rotate-90' : ''}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            {showNutrition ? 'Ocultar datos nutricionales' : 'Ingresar datos nutricionales manualmente'}
          </button>

          {showNutrition && (
            <div className="flex flex-col gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-400">Si los dejas vacíos, la IA los estimará automáticamente.</p>
              <Input
                label="Calorías (kcal)"
                type="number"
                step="1"
                placeholder="350"
                value={calories}
                onChange={e => setCalories(e.target.value)}
              />
              <div className="grid grid-cols-3 gap-2">
                <Input label="Proteína (g)" type="number" step="0.1" placeholder="20" value={protein} onChange={e => setProtein(e.target.value)} />
                <Input label="Carbos (g)" type="number" step="0.1" placeholder="40" value={carbs} onChange={e => setCarbs(e.target.value)} />
                <Input label="Grasa (g)" type="number" step="0.1" placeholder="10" value={fat} onChange={e => setFat(e.target.value)} />
              </div>
            </div>
          )}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Guardando...' : calories ? 'Agregar comida' : 'Agregar y estimar con IA'}
          </Button>
        </form>
      </Card>

      {/* Resumen */}
      {meals.length > 0 && (
        <div className="flex justify-between items-center px-1">
          <span className="text-sm text-gray-400">{meals.length} comida{meals.length !== 1 ? 's' : ''} hoy</span>
          <span className="text-sm font-semibold text-emerald-600">{Math.round(totalCalories)} kcal</span>
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <p className="text-center text-gray-300 py-12 text-sm">Cargando...</p>
      ) : meals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-300 text-sm">Sin comidas registradas hoy</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {meals.map(meal => {
            const meta = MEAL_LABELS[meal.meal_type]
            return (
              <Card key={meal.id}>
                {editingId === meal.id ? (
                  <div className="flex flex-col gap-2.5">
                    <Select value={editType} onChange={e => setEditType(e.target.value as DailyMeal['meal_type'])}>
                      <option value="desayuno">Desayuno</option>
                      <option value="almuerzo">Almuerzo</option>
                      <option value="cena">Cena</option>
                      <option value="snack">Snack</option>
                    </Select>
                    <textarea
                      className="w-full rounded-xl bg-gray-50 border border-gray-100 px-3.5 py-3 text-sm outline-none focus:bg-white focus:border-emerald-400 resize-none"
                      rows={2}
                      value={editDesc}
                      onChange={e => setEditDesc(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => saveEdit(meal.id)}>Guardar</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancelar</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mb-1.5 ${meta.color}`}>
                        {meta.label}
                      </span>
                      <p className="text-[15px] text-gray-800 leading-snug">{meal.description}</p>
                      <p className="text-xs text-gray-400 mt-1.5">
                        {meal.ai_processed
                          ? `${Math.round(meal.calories_estimated ?? 0)} kcal · P ${meal.protein_g ?? 0}g · C ${meal.carbs_g ?? 0}g · G ${meal.fat_g ?? 0}g`
                          : '⏳ Calculando nutrición...'}
                      </p>
                    </div>
                    <div className="flex gap-0.5 shrink-0">
                      <button onClick={() => startEdit(meal)} className="p-2 text-gray-300 hover:text-gray-500 rounded-xl hover:bg-gray-50 transition-colors">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => deleteMeal(meal.id)} className="p-2 text-gray-300 hover:text-red-400 rounded-xl hover:bg-red-50 transition-colors">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
