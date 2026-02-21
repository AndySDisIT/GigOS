'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
type F = { minPayout?:string; maxMinutes?:string; maxDistance?:string; sortBy?:string; mode?:string }
export function FieldLocalFilters({ initial }: { initial: F }) {
  const router = useRouter(); const sp = useSearchParams()
  const [min, setMin] = useState(initial.minPayout??'')
  const [mins, setMins] = useState(initial.maxMinutes??'')
  const [dist, setDist] = useState(initial.maxDistance??'')
  const [sort, setSort] = useState(initial.sortBy??'deadline')
  const [mode, setMode] = useState(initial.mode??'WALK')
  function apply() {
    const p = new URLSearchParams(sp.toString())
    min?p.set('minPayout',min):p.delete('minPayout')
    mins?p.set('maxMinutes',mins):p.delete('maxMinutes')
    dist?p.set('maxDistance',dist):p.delete('maxDistance')
    p.set('sortBy',sort); p.set('mode',mode)
    router.push(`/field-local?${p.toString()}`)
  }
  function reset() { setMin('');setMins('');setDist('');setSort('deadline');setMode('WALK');router.push('/field-local') }
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-3">
      <div className="flex flex-wrap items-end gap-3 text-sm">
        <div className="flex flex-col"><label className="text-xs font-medium text-zinc-400">Travel Mode</label>
          <select className="mt-1 rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm text-zinc-50" value={mode} onChange={e=>setMode(e.target.value)}>
            <option value="WALK">🚶 Walk</option><option value="BIKE">🚴 Bike</option>
            <option value="E_BIKE">⚡ E-Bike</option><option value="SCOOTER">🛴 Scooter</option>
            <option value="TRANSIT">🚇 Transit</option><option value="DRIVE">🚗 Drive</option><option value="MIXED">🔀 Mixed</option>
          </select></div>
        <div className="flex flex-col"><label className="text-xs font-medium text-zinc-400">Min Payout ($)</label><input type="number" className="mt-1 w-20 rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm text-zinc-50" value={min} onChange={e=>setMin(e.target.value)} placeholder="0"/></div>
        <div className="flex flex-col"><label className="text-xs font-medium text-zinc-400">Max Time (min)</label><input type="number" className="mt-1 w-24 rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm text-zinc-50" value={mins} onChange={e=>setMins(e.target.value)} placeholder="240"/></div>
        <div className="flex flex-col"><label className="text-xs font-medium text-zinc-400">Max Distance (mi)</label><input type="number" className="mt-1 w-24 rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm text-zinc-50" value={dist} onChange={e=>setDist(e.target.value)} placeholder="5"/></div>
        <div className="flex flex-col"><label className="text-xs font-medium text-zinc-400">Sort By</label>
          <select className="mt-1 rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm text-zinc-50" value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="deadline">Soonest Deadline</option><option value="value">Highest $/hr</option><option value="distance">Nearest First</option>
          </select></div>
        <div className="ml-auto flex gap-2">
          <button onClick={reset} className="rounded-full border border-zinc-600 px-3 py-1 text-xs text-zinc-200 hover:bg-zinc-800">Reset</button>
          <button onClick={apply} className="rounded-full bg-cyan-500 px-3 py-1 text-xs font-semibold text-black hover:bg-cyan-400">Apply</button>
        </div>
      </div>
    </section>
  )
}
