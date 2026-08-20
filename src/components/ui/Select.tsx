import { type SelectHTMLAttributes } from 'react'

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

export function Select({ label, className = '', children, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {label}
        </label>
      )}
      <select
        className={`w-full rounded-xl bg-gray-50 border border-gray-100 px-3.5 py-3 text-[15px] text-gray-900 outline-none focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all appearance-none ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}
