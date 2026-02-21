import { prisma } from '@/lib/prisma'
import { TaskCard } from '@/components/TaskCard'
import { FieldLocalFilters } from '@/components/FieldLocalFilters'
import { Suspense } from 'react'
export const dynamic = 'force-dynamic'
const SPEEDS: Record<string,number> = {WALK:3,BIKE:10,E_BIKE:15,SCOOTER:12,DRIVE:22,TRANSIT:12,MIXED:18}
const LABELS: Record<string,string> = {WALK:'walk',BIKE:'bike',E_BIKE:'e-bike',SCOOTER:'scooter',DRIVE:'drive',TRANSIT:'transit',MIXED:'mixed'}
const BASE = {lat:33.749,lng:-84.388}
function miles(la1:number,lo1:number,la2:number,lo2:number) {
  const r=(v:number)=>v*Math.PI/180,R=3958.8
  const a=Math.sin(r(la2-la1)/2)**2+Math.cos(r(la1))*Math.cos(r(la2))*Math.sin(r(lo2-lo1)/2)**2
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))
}
type SP = { mode?:string; minPayout?:string; maxMinutes?:string; maxDistance?:string; sortBy?:string }
export default async function FieldLocalPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams
  const mode = sp.mode??'WALK', speed=SPEEDS[mode]??3
  const where: any = { domainType:'FIELD_LOCAL', status:'AVAILABLE' }
  if(sp.minPayout) where.payoutAmount={gte:parseFloat(sp.minPayout)}
  if(sp.maxMinutes) where.estMinutes={lte:parseInt(sp.maxMinutes)}
  let raw: any[] = []
  try { raw = await prisma.task.findMany({ where, include:{provider:true}, take:100 }) } catch {}
  const maxDist = sp.maxDistance ? parseFloat(sp.maxDistance) : null
  let tasks = raw.map(t => {
    const d = t.latitude&&t.longitude ? miles(BASE.lat,BASE.lng,t.latitude,t.longitude) : null
    return { ...t, distanceMiles:d, travelMinutes:d?Math.round((d/speed)*60):null }
  }).filter(t => maxDist==null||t.distanceMiles==null||t.distanceMiles<=maxDist)
  const s = sp.sortBy??'deadline'
  if(s==='value') tasks.sort((a,b)=>((b.payoutAmount/b.estMinutes)||0)-((a.payoutAmount/a.estMinutes)||0))
  else if(s==='distance') tasks.sort((a,b)=>(a.distanceMiles??999)-(b.distanceMiles??999))
  else tasks.sort((a,b)=>new Date(a.deadlineAt??'9999').getTime()-new Date(b.deadlineAt??'9999').getTime())
  return (
    <main className="space-y-4">
      <header><h1 className="text-2xl font-semibold">Field & Local Gigs</h1><p className="text-sm text-zinc-400 mt-1">Survey Merchandiser + field tasks near Atlanta</p></header>
      <Suspense><FieldLocalFilters initial={sp}/></Suspense>
      {tasks.length===0 && <p className="text-sm text-zinc-500 mt-4">No gigs match your filters, or none imported yet.</p>}
      <div className="space-y-3">
        {tasks.slice(0,50).map((t:any) => (
          <TaskCard key={t.id} title={t.title} providerName={t.provider?.name??'Unknown'}
            payoutAmount={t.payoutAmount} payoutCurrency={t.payoutCurrency} estMinutes={t.estMinutes}
            location={t.location} deadlineAt={t.deadlineAt} url={t.url}
            distanceMiles={t.distanceMiles} travelMinutes={t.travelMinutes} travelMode={LABELS[mode]}/>
        ))}
      </div>
    </main>
  )
}
