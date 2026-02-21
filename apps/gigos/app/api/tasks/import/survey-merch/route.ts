import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
type Gig = { externalId:string;title:string;storeName?:string;location?:string;latitude?:number;longitude?:number;payoutAmount?:number;payoutCurrency?:string;estMinutes?:number;deadline?:string|null;detailUrl:string }
function auth(req: NextRequest) { return req.headers.get('x-internal-token')===process.env.INTERNAL_SYNC_TOKEN }
export async function POST(req: NextRequest) {
  if(!auth(req)) return NextResponse.json({error:'Unauthorized'},{status:401})
  const {gigs} = await req.json() as {gigs:Gig[]}
  if(!Array.isArray(gigs)||!gigs.length) return NextResponse.json({error:'No gigs'},{status:400})
  const provider = await prisma.provider.findUnique({where:{slug:'survey-merchandiser'}})
  if(!provider) return NextResponse.json({error:'Provider not found'},{status:500})
  let created=0,updated=0
  for(const g of gigs) {
    if(!g.externalId||!g.title||!g.detailUrl) continue
    const eid=`sm-${g.externalId}`, dead=g.deadline?new Date(g.deadline):null
    const ex = await prisma.task.findFirst({where:{externalId:eid}})
    if(ex) { await prisma.task.update({where:{id:ex.id},data:{title:g.title,payoutAmount:g.payoutAmount??ex.payoutAmount,estMinutes:g.estMinutes??ex.estMinutes,location:g.location??ex.location,latitude:g.latitude??ex.latitude,longitude:g.longitude??ex.longitude,deadlineAt:dead??ex.deadlineAt,url:g.detailUrl}}); updated++ }
    else { await prisma.task.create({data:{providerId:provider.id,domainType:'FIELD_LOCAL',taskType:'MERCH_VISIT',externalId:eid,title:g.title,payoutAmount:g.payoutAmount??null,payoutCurrency:g.payoutCurrency??'USD',estMinutes:g.estMinutes??null,location:g.location??g.storeName??null,latitude:g.latitude??null,longitude:g.longitude??null,deadlineAt:dead,url:g.detailUrl,status:'AVAILABLE'}}); created++ }
  }
  return NextResponse.json({created,updated})
}
