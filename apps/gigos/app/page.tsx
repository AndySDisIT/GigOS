import Link from 'next/link'
export default function CommandCenter() {
  return (
    <main className="space-y-8">
      <section><h1 className="text-3xl font-bold">Command Center</h1><p className="text-zinc-400 text-sm mt-1">Atlanta • Today • Your mission control</p></section>
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div><div className="text-2xl font-bold text-emerald-400">$0.00</div><div className="text-xs text-zinc-500 mt-1">Today's Earnings</div></div>
          <div><div className="text-2xl font-bold text-cyan-400">$0/hr</div><div className="text-xs text-zinc-500 mt-1">Effective Rate</div></div>
          <div><div className="text-2xl font-bold text-violet-400">0h 0m</div><div className="text-xs text-zinc-500 mt-1">Time Worked</div></div>
        </div>
      </section>
      <section className="rounded-xl border border-cyan-400/30 bg-zinc-900/70 p-6">
        <div className="text-xs uppercase tracking-widest text-cyan-400 mb-2">Next Best Action</div>
        <p className="text-zinc-400 text-sm">No active route. Browse Field & Local gigs or plan your next 3 hours.</p>
        <div className="mt-4 flex gap-3">
          <Link href="/field-local" className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-black hover:bg-cyan-400">Browse Field Gigs</Link>
          <Link href="/domains" className="rounded-full border border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-800">View All Domains</Link>
        </div>
      </section>
      <section>
        <h2 className="text-sm uppercase tracking-widest text-zinc-500 mb-4">Work Domains</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            {name:'Field & Local',icon:'🏪',desc:'Mystery shops, merch, audits',href:'/field-local'},
            {name:'Remote Surveys',icon:'📊',desc:'Prolific, surveys, studies',href:'/domains'},
            {name:'AI & Data',icon:'🧠',desc:'Outlier, annotation, RLHF',href:'/domains'},
            {name:'Game Testing',icon:'🎮',desc:'PlaytestCloud, beta tests',href:'/domains'},
          ].map((d) => (
            <Link key={d.name} href={d.href} className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 hover:border-zinc-600 transition">
              <div className="text-2xl mb-2">{d.icon}</div>
              <div className="font-semibold text-sm">{d.name}</div>
              <div className="text-xs text-zinc-500 mt-1">{d.desc}</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
