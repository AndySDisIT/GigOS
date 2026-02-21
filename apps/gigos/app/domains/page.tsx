import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
export default async function DomainsPage() {
  let domains: any[] = []
  try { domains = await prisma.workDomain.findMany({ include: { providers: true } }) } catch {}
  const meta: Record<string, {icon:string}> = {
    REMOTE_SURVEYS:{icon:'📊'},TESTING_RESEARCH:{icon:'🎮'},
    AI_DATA:{icon:'🧠'},FIELD_LOCAL:{icon:'🏪'},ADULT_PRIVATE:{icon:'🔒'}
  }
  return (
    <main className="space-y-6">
      <header><h1 className="text-2xl font-bold">Work Domains</h1><p className="text-sm text-zinc-400 mt-1">All gig categories in GigOS</p></header>
      {domains.length === 0 && <p className="text-sm text-zinc-500 border border-zinc-800 rounded-xl p-6 text-center">No domains yet. Run: <code className="text-cyan-400">npx ts-node scripts/seed.ts</code></p>}
      <div className="space-y-4">
        {domains.map((domain) => (
          <div key={domain.id} className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{meta[domain.type]?.icon ?? '💼'}</span>
              <div><h2 className="font-semibold">{domain.name}</h2><p className="text-xs text-zinc-500">{domain.providers.filter((p: any) => !p.isPrivate).length} providers</p></div>
            </div>
            <div className="flex flex-wrap gap-2">
              {domain.providers.filter((p: any) => !p.isPrivate).map((provider: any) => (
                <div key={provider.id} className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm">
                  <div className="font-medium text-zinc-200">{provider.name}</div>
                  <div className="text-xs text-zinc-500">{provider.typicalPayMin && provider.typicalPayMax ? `$${provider.typicalPayMin}–$${provider.typicalPayMax}/hr` : 'Variable'}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
