import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  console.log('Seeding GigOS v1...')
  const domainData = [
    {type:'REMOTE_SURVEYS',name:'Remote Surveys & Studies',icon:'📊',color:'emerald'},
    {type:'TESTING_RESEARCH',name:'Testing & Game Research',icon:'🎮',color:'indigo'},
    {type:'AI_DATA',name:'AI & Data Tasks',icon:'🧠',color:'amber'},
    {type:'FIELD_LOCAL',name:'Field & Local Gigs',icon:'🏪',color:'cyan'},
    {type:'ADULT_PRIVATE',name:'Adult / Private Creator',icon:'🔒',color:'rose'},
  ]
  const domains: Record<string,any> = {}
  for(const d of domainData) {
    const dm = await prisma.workDomain.upsert({where:{type:d.type as any},update:{name:d.name,icon:d.icon,color:d.color},create:{type:d.type as any,name:d.name,icon:d.icon,color:d.color}})
    domains[d.type]=dm; console.log(`✓ Domain: ${d.name}`)
  }
  const providers = [
    {name:'Prolific',slug:'prolific',dt:'REMOTE_SURVEYS',desc:'Academic & AI research studies.',web:'https://www.prolific.com',dash:'https://app.prolific.com',pay:'PayPal; $8–15/hr',min:8,max:15,pt:'cash',priv:false},
    {name:'PlaytestCloud',slug:'playtestcloud',dt:'TESTING_RESEARCH',desc:'Paid game testing sessions.',web:'https://www.playtestcloud.com',dash:'https://www.playtestcloud.com/tester',pay:'$9–12 per session',min:18,max:24,pt:'cash',priv:false},
    {name:'Outlier.ai',slug:'outlier',dt:'AI_DATA',desc:'AI training, evaluation, annotation.',web:'https://outlier.ai',dash:'https://platform.outlier.ai',pay:'$15–25+/hr',min:15,max:25,pt:'cash',priv:false},
    {name:'Survey Merchandiser',slug:'survey-merchandiser',dt:'FIELD_LOCAL',desc:'In-store audits, merch, resets.',web:'https://survey.com',dash:'https://app.survey.com',pay:'$10–100+ per job',min:10,max:100,pt:'cash',priv:false},
    {name:'OnlyFans',slug:'onlyfans',dt:'ADULT_PRIVATE',desc:'Subscription & PPV creator platform.',web:'https://onlyfans.com',dash:'https://onlyfans.com/my/settings/creator',pay:'80% rev share',min:0,max:9999,pt:'subs+ppv+tips',priv:true},
  ]
  for(const p of providers) {
    await prisma.provider.upsert({where:{slug:p.slug},update:{},create:{name:p.name,slug:p.slug,domainId:domains[p.dt].id,description:p.desc,websiteUrl:p.web,dashboardUrl:p.dash,payoutInfo:p.pay,typicalPayMin:p.min,typicalPayMax:p.max,payoutType:p.pt,isPrivate:p.priv}})
    console.log(`✓ Provider: ${p.name}`)
  }
  console.log('Seed complete!')
}
main().catch(console.error).finally(()=>prisma.$disconnect())
