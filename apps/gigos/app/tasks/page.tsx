import { prisma } from '@/lib/prisma'
import { TaskCard } from '@/components/TaskCard'
export const dynamic = 'force-dynamic'
export default async function TasksPage() {
  let tasks: any[] = []
  try { tasks = await prisma.task.findMany({ include:{provider:true}, orderBy:{deadlineAt:'asc'}, take:100 }) } catch {}
  return (
    <main className="space-y-4">
      <header><h1 className="text-2xl font-semibold">My Tasks</h1><p className="text-sm text-zinc-400 mt-1">All tasks across every domain.</p></header>
      {tasks.length===0&&<p className="text-sm text-zinc-500">No tasks yet. Import gigs or add them manually.</p>}
      <div className="space-y-3">
        {tasks.map((t:any) => <TaskCard key={t.id} title={t.title} providerName={t.provider?.name??'Unknown'} payoutAmount={t.payoutAmount} payoutCurrency={t.payoutCurrency} estMinutes={t.estMinutes} location={t.location} deadlineAt={t.deadlineAt} url={t.url}/>)}
      </div>
    </main>
  )
}
