import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useMeals } from '../hooks/useMeals'
import { useMeasurements } from '../hooks/useMeasurements'
import { useProfile } from '../hooks/useProfile'
import { Card } from '../components/ui/Card'

const today = new Date().toISOString().split('T')[0]

const QUICK = [
  { to: '/comidas', label: 'Agregar comida', sub: 'Registra lo que comiste',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /> },
  { to: '/actividad', label: 'Actividad', sub: 'Registra tu ejercicio',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /> },
  { to: '/medidas', label: 'Medidas', sub: 'Registra tu peso',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
]

export function DashboardPage() {
  const { totalCalories } = useMeals(today)
  const { measurements } = useMeasurements()
  const { profile } = useProfile()

  const goal = profile?.daily_calorie_goal ?? 2000
  const pct = Math.min(100, Math.round((totalCalories / goal) * 100))
  const remaining = Math.max(0, goal - totalCalories)

  const latestWeight = measurements.find(m => m.weight_kg)?.weight_kg
  const goalWeight = profile?.goal_weight_kg
  const startWeight = profile?.starting_weight_kg

  const chartData = [...measurements]
    .reverse()
    .slice(-12)
    .filter(m => m.weight_kg)
    .map(m => ({ date: m.measurement_date.slice(5), peso: m.weight_kg }))

  return (
    <div className="flex flex-col gap-4 pt-2">

      {/* Calorías */}
      <Card className="overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Calorías hoy</p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-4xl font-bold text-gray-900">{Math.round(totalCalories)}</span>
              <span className="text-sm text-gray-400">/ {goal} kcal</span>
            </div>
          </div>
          <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${pct >= 100 ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
            {pct >= 100 ? 'Límite alcanzado' : `${Math.round(remaining)} restantes`}
          </div>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${pct >= 100 ? 'bg-red-400' : 'bg-emerald-400'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </Card>

      {/* Peso actual */}
      {latestWeight && (
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Peso actual</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{latestWeight} <span className="text-sm font-normal text-gray-400">kg</span></p>
          </Card>
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Meta</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {goalWeight ?? '—'} <span className="text-sm font-normal text-gray-400">kg</span>
            </p>
            {goalWeight && startWeight && (
              <p className="text-xs text-emerald-600 mt-0.5">
                {(startWeight - goalWeight) > 0 ? `−${(startWeight - goalWeight).toFixed(1)} kg objetivo` : ''}
              </p>
            )}
          </Card>
        </div>
      )}

      {/* Gráfica */}
      {chartData.length > 1 && (
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-4">Progreso de peso</p>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v: unknown) => [`${v} kg`, 'Peso']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: 13 }}
              />
              <Line type="monotone" dataKey="peso" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Accesos rápidos */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 px-1">Acciones rápidas</p>
        {QUICK.map(({ to, label, sub, icon }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3.5 hover:border-emerald-200 transition-all active:scale-[0.99]"
          >
            <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={2} className="w-5 h-5">
                {icon}
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-medium text-gray-800">{label}</p>
              <p className="text-xs text-gray-400">{sub}</p>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth={2} className="w-4 h-4 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  )
}
