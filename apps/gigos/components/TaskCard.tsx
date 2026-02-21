'use client'
type Props = {
  title: string; providerName: string; payoutAmount?: number|null
  payoutCurrency?: string|null; estMinutes?: number|null; location?: string|null
  deadlineAt?: string|Date|null; url: string; distanceMiles?: number|null
  travelMinutes?: number|null; travelMode?: string|null
}
export function TaskCard(p: Props) {
  const rate = p.payoutAmount && p.estMinutes ? `$${((p.payoutAmount/p.estMinutes)*60).toFixed(2)}/hr` : null
  const dead = p.deadlineAt ? (() => {
    const diff = new Date(p.deadlineAt!).getTime()-Date.now()
    if(diff<0) return 'OVERDUE'
    const h=Math.floor(diff/3600000),m=Math.floor((diff%3600000)/60000)
    return h<1?`Due in ${m}m`:h<24?`Due in ${h}h`:(`Due in ${Math.floor(h/24)}d`)
  })() : 'No deadline'
  const urgent = p.deadlineAt && new Date(p.deadlineAt).getTime()-Date.now()<7200000
  return (
    <div className={`rounded-xl border p-4 transition ${urgent?'border-red-500/50 bg-red-950/20':'border-zinc-800 bg-zinc-900/70 hover:border-cyan-400/60'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-cyan-400">{p.providerName}</div>
          <h3 className="mt-1 text-base font-semibold">{p.title}</h3>
          {p.location && <p className="mt-1 text-xs text-zinc-400">{p.location}</p>}
          {p.distanceMiles!=null && <p className="mt-0.5 text-xs text-zinc-500">{p.distanceMiles.toFixed(1)} mi{p.travelMinutes?` • ~${p.travelMinutes} min ${p.travelMode??''}`:''}</p>}
        </div>
        <div className="text-right shrink-0">
          <div className="font-semibold text-emerald-400">{p.payoutAmount?`$${p.payoutAmount.toFixed(2)}`:'—'}</div>
          <div className="text-xs text-zinc-400">{p.estMinutes?`${p.estMinutes} min`:'—'}</div>
          {rate && <div className="text-xs text-cyan-400 mt-0.5">{rate}</div>}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className={`text-xs ${urgent?'font-semibold text-red-400':'text-zinc-500'}`}>{dead}</span>
        <button onClick={() => window.open(p.url,'_blank')} className="rounded-full bg-cyan-500 px-3 py-1 text-xs font-semibold text-black hover:bg-cyan-400">View / Claim</button>
      </div>
    </div>
  )
}
