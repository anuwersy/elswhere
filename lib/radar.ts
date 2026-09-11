export const TOPICS: Record<string,string[]> = {
 "AI strategy":["ai strategy","enterprise ai"], "GenAI, LLM, RAG, and AI agents":["generative ai","genai","llm","rag","agentic ai","ai agent"],
 "AI governance and Responsible AI":["ai governance","responsible ai","trusted ai"], Transformation:["transformation","digital transformation"],
 "Programme delivery":["programme delivery","program delivery","programme management","program management"], "Operating models and process improvement":["operating model","process improvement"],
 "Stakeholder and C-level management":["stakeholder management","c-level","executive workshop"], "People leadership":["people leadership","team leadership","mentoring"],
 "Data strategy and governance":["data strategy","data governance"], "Migration and integration":["data migration","data integration","migration","integration"],
 "Financial services":["financial services","banking","insurance"], "Finance operations":["finance transformation","fp&a","record-to-report","procure-to-pay","order-to-cash"],
 "Change and adoption":["change management","adoption"], "Commercial growth":["commercial","revenue","go-to-market","business development"],
 "Strategic consulting":["strategy consulting","strategic consulting","advisory"], "Translating technology into business value":["business value","technology strategy"],
 Oracle:["oracle"], Databricks:["databricks"], "Power BI":["power bi"], Alteryx:["alteryx"], Azure:["azure"], AWS:["aws","amazon web services"], GCP:["gcp","google cloud"], Python:["python"], SQL:["sql"], "ML engineering":["machine learning engineer","ml engineering"], PMP:["pmp"], SAFe:["safe"]
};
export type LanguageLevel="native"|"fluent"|"intermediate"|"beginner"|"unknown";
export type Profile={name:string;currentRole:string;positioning:string;cvText:string;languages:{english:LanguageLevel;japanese:LanguageLevel;korean:LanguageLevel};exclusions:string[]};
export type Requirement={topic:string;jobEvidence:string;cvEvidence:string;status:"Experience evidence"|"Skill mentioned"|"Not evidenced";mandatory:boolean;weight:number};
export type Job={id:string;url:string;externalId?:string;title:string;company:string;location:string;description:string;postedAt?:string;workplace?:string;salaryMin?:number;salaryText?:string;keywordScore:number;evidenceScore:number;verdict:string;requirements:Requirement[];flags:string[];seenAt:string};
const esc=(s:string)=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
const sentence=(text:string,term:string)=>text.split(/(?<=[.!?])\s+|\n+/).find(s=>new RegExp(`\\b${esc(term)}\\b`,"i").test(s))?.trim()||"";
const delivery=/\b(led|delivered|implemented|managed|designed|launched|transformed|advised|owned)\b/i;
const negate=/\b(seeking|interested in|learning|beginner|no experience|without experience)\b/i;
export function assessRequirements(description:string,cv:string):Requirement[]{
 const d=description.toLowerCase();
 return Object.entries(TOPICS).filter(([,terms])=>terms.some(t=>d.includes(t))).map(([topic,terms])=>{
  const term=terms.find(t=>d.includes(t))!; const jobEvidence=sentence(description,term); const cvLine=terms.map(t=>sentence(cv,t)).find(Boolean)||"";
  const status=!cvLine||negate.test(cvLine)?"Not evidenced":delivery.test(cvLine)?"Experience evidence":"Skill mentioned";
  const mandatory=new RegExp(`(?:must|required|mandatory|minimum|at least)[^.!?]{0,70}${esc(term)}|${esc(term)}[^.!?]{0,45}(?:required|mandatory)`,"i").test(description);
  return {topic,jobEvidence,cvEvidence:cvLine,status,mandatory,weight:mandatory?2:1};
 });
}
export function languageGaps(description:string,languages:Profile["languages"]){
 const out:string[]=[]; const d=description.toLowerCase();
 for(const lang of ["japanese","korean","english"] as const){const mandatory=new RegExp(`(?:fluent|native|business|professional|mandatory|required)[^.!?]{0,30}${lang}|${lang}[^.!?]{0,40}(?:fluent|native|business|mandatory|required)`,"i").test(d); if(mandatory&&languages[lang]!=="unknown"&&!(["native","fluent","intermediate"].includes(languages[lang])))out.push(`Mandatory ${lang[0].toUpperCase()+lang.slice(1)} conflicts with saved ${languages[lang]} proficiency`)}
 return out;
}
export function assessJob(input:Omit<Job,"keywordScore"|"evidenceScore"|"verdict"|"requirements"|"flags"|"seenAt">,profile:Profile,salaryFloor=8000000):Job{
 const reqs=assessRequirements(input.description,profile.cvText); const denom=reqs.reduce((n,r)=>n+r.weight,0); const earned=reqs.reduce((n,r)=>n+r.weight*(r.status==="Experience evidence"?1:r.status==="Skill mentioned"?.5:0),0); const evidenceScore=denom?Math.round(100*earned/denom):0;
 const text=`${input.title} ${input.description}`.toLowerCase(); const role=Math.min(40,["ai","transformation","strategy","data","governance"].filter(x=>text.includes(x)).length*8); const senior=Math.min(20,["director","head","lead","senior","manager"].filter(x=>input.title.toLowerCase().includes(x)).length*10); const capability=Math.min(25,Math.round(evidenceScore*.25)); const sector=Math.min(15,["financial services","banking","insurance"].filter(x=>text.includes(x)).length*5); const keywordScore=role+senior+capability+sector;
 const flags=languageGaps(input.description,profile.languages); if(!input.salaryText)flags.push("Salary not disclosed"); else if(input.salaryMin===undefined)flags.push("Salary could not be parsed"); else if(input.location.toLowerCase().includes("japan")&&input.salaryMin<salaryFloor)flags.push("Salary below selected floor"); if(!input.postedAt)flags.push("Posting date unknown"); if(!input.description.trim())flags.push("Description not scanned");
 const mandatory=reqs.filter(r=>r.mandatory&&r.status==="Not evidenced").length; const verdict=evidenceScore>=80&&!mandatory?"Strong evidence alignment":evidenceScore>=60&&!mandatory?"Potential fit — review gaps":mandatory?"Fit limited by requirement gap":evidenceScore>=35?"Stretch":"Insufficient evidence";
 return {...input,keywordScore,evidenceScore,verdict,requirements:reqs,flags,seenAt:new Date().toISOString()};
}
export function normalizeLinkedInUrl(raw:string){try{const u=new URL(raw);const match=u.pathname.match(/\/jobs\/view\/(?:[^/]*-)?(\d+)/);return match?`https://www.linkedin.com/jobs/view/${match[1]}`:`${u.origin}${u.pathname}`.replace(/\/$/,"")}catch{return raw.trim().toLowerCase()}}
export function dedupeJobs(jobs:Job[]){const seen=new Set<string>();return jobs.filter(j=>{const key=j.externalId||normalizeLinkedInUrl(j.url);if(seen.has(key))return false;seen.add(key);return true})}
export function isLockAvailable(lock:{startedAt:string}|null,now=Date.now(),staleMs=130000){return !lock||now-new Date(lock.startedAt).getTime()>staleMs}
