"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  BarChart3, CalendarDays, Check, CheckCircle2, ChevronRight, CircleDot, Clock3,
  Headphones, LayoutDashboard, ListTodo, Plus, Search, Settings, Sparkles, Target,
  Timer, TrendingUp, X
} from "lucide-react";
import { dailyQuotes, dayIndex, japaneseWords } from "@/lib/daily-content";

type Status = "Not Started" | "In Progress" | "Blocked" | "Waiting" | "Completed";
type Task = {
  id: number; name: string; description: string; category: string; start: string; deadline: string;
  priority: number; difficulty: number; effort: number; status: Status; tags: string; notes: string; dependencies: string;
};

const navigation = [
  {id:"today",label:"Today",icon:LayoutDashboard}, {id:"tasks",label:"Tasks",icon:ListTodo},
  {id:"timeline",label:"Timeline",icon:CalendarDays}, {id:"analytics",label:"Analytics",icon:BarChart3},
  {id:"completed",label:"Completed",icon:CheckCircle2},
];

const APP_TIME_ZONE = "Asia/Hong_Kong";
const datePartsFormatter = new Intl.DateTimeFormat("en-GB", {timeZone:APP_TIME_ZONE,year:"numeric",month:"2-digit",day:"2-digit"});
const fullDateFormatter = new Intl.DateTimeFormat("en-GB", {timeZone:APP_TIME_ZONE,weekday:"long",day:"numeric",month:"long",year:"numeric"});
const hourFormatter = new Intl.DateTimeFormat("en-GB", {timeZone:APP_TIME_ZONE,hour:"2-digit",hourCycle:"h23"});
const monthFormatter = new Intl.DateTimeFormat("en-GB", {timeZone:"UTC",month:"short"});
const completedDateFormatter = new Intl.DateTimeFormat("en-GB", {timeZone:"UTC",day:"numeric",month:"short",year:"numeric"});

const iso = (d:Date) => {
  const parts=Object.fromEntries(datePartsFormatter.formatToParts(d).filter(part=>part.type!=="literal").map(part=>[part.type,part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
};
const dateOnly = (value:string) => new Date(`${value}T00:00:00Z`);
const daysFrom = (deadline:string, today:Date) => Math.round((dateOnly(deadline).getTime()-dateOnly(iso(today)).getTime())/86400000);
const dueText = (deadline:string,today:Date) => { const d=daysFrom(deadline,today); return d<0?`Overdue by ${Math.abs(d)} day${d===-1?"":"s"}`:d===0?"Due today":d===1?"Due tomorrow":`${d} days remaining`; };
const effortText=(minutes:number)=>minutes<60?`${minutes} min`:`${Math.floor(minutes/60)}h${minutes%60?` ${minutes%60}m`:""}`;
const emptyTask=(today:Date):Omit<Task,"id">=>({name:"",description:"",category:"",start:iso(today),deadline:"",priority:3,difficulty:2,effort:30,status:"Not Started",tags:"",notes:"",dependencies:""});

export default function FocusApp({initialNow}:{initialNow:string}){
  const [section,setSection]=useState("today"); const [tasks,setTasks]=useState<Task[]>([]); const [quick,setQuick]=useState("");
  const [modal,setModal]=useState(false); const [search,setSearch]=useState(""); const [now,setNow]=useState(initialNow);
  useEffect(()=>{setNow(new Date().toISOString())},[]);
  const today=useMemo(()=>new Date(now),[now]);
  const active=tasks.filter(t=>t.status!=="Completed"); const completed=tasks.filter(t=>t.status==="Completed");
  const filtered=tasks.filter(t=>t.name.toLowerCase().includes(search.toLowerCase()));
  const addQuick=()=>{if(!quick.trim())return;setTasks(x=>[...x,{...emptyTask(today),id:Date.now(),name:quick.trim(),deadline:iso(today)}]);setQuick("")};
  const complete=(id:number)=>setTasks(x=>x.map(t=>t.id===id?{...t,status:"Completed"}:t));
  return <div className="shell">
    <aside className="sidebar"><div className="brand"><span>FOCUS</span><b>.</b></div><nav>{navigation.map(({id,label,icon:Icon})=><button key={id} onClick={()=>setSection(id)} className={section===id?"active":""}><Icon size={17}/><span>{label}</span>{id==="tasks"&&active.length>0&&<em>{active.length}</em>}</button>)}</nav><button className="settings"><Settings size={17}/>Settings</button></aside>
    <main><header><div className="mobile-brand">FOCUS<b>.</b></div><div className="search"><Search size={16}/><input aria-label="Search tasks" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tasks"/></div><button className="primary compact" onClick={()=>setModal(true)}><Plus size={16}/>Add task</button></header>
      <div className="content">
        {section==="today"&&<Today today={today} tasks={active} completed={completed} quick={quick} setQuick={setQuick} addQuick={addQuick} openModal={()=>setModal(true)} complete={complete}/>} 
        {section==="tasks"&&<Tasks tasks={filtered} today={today} add={()=>setModal(true)} complete={complete}/>} 
        {section==="timeline"&&<Timeline tasks={active} today={today} add={()=>setModal(true)}/>} 
        {section==="analytics"&&<Analytics tasks={tasks} completed={completed} add={()=>setModal(true)}/>} 
        {section==="completed"&&<Completed tasks={completed} today={today} restore={id=>setTasks(x=>x.map(t=>t.id===id?{...t,status:"Not Started"}:t))}/>} 
      </div>
    </main>
    <div className="mobile-nav">{navigation.map(({id,label,icon:Icon})=><button key={id} onClick={()=>setSection(id)} className={section===id?"active":""}><Icon size={18}/><span>{label}</span></button>)}</div>
    {modal&&<TaskModal today={today} close={()=>setModal(false)} save={t=>{setTasks(x=>[...x,{...t,id:Date.now()}]);setModal(false);setSection("tasks")}}/>}
  </div>
}

function Today({today,tasks,completed,quick,setQuick,addQuick,openModal,complete}:{today:Date;tasks:Task[];completed:Task[];quick:string;setQuick:(s:string)=>void;addQuick:()=>void;openModal:()=>void;complete:(id:number)=>void}){
  const hour=Number(hourFormatter.format(today)); const greeting=hour>=5&&hour<12?"Good morning":hour>=12&&hour<18?"Good afternoon":"Good evening";
  const dateKey=iso(today); const word=japaneseWords[dayIndex(dateKey,japaneseWords.length)]; const quote=dailyQuotes[dayIndex(dateKey,dailyQuotes.length)];
  const urgent=tasks.filter(t=>t.priority>=4).length; const upcoming=tasks.filter(t=>daysFrom(t.deadline,today)>=0&&daysFrom(t.deadline,today)<=7).length;
  const ranked=[...tasks].sort((a,b)=>(b.priority*18-daysFrom(b.deadline,today)*2-b.difficulty*2-b.effort/30)-(a.priority*18-daysFrom(a.deadline,today)*2-a.difficulty*2-a.effort/30)).slice(0,3);
  const todayTasks=tasks.filter(t=>daysFrom(t.deadline,today)<=0); const totalMins=todayTasks.reduce((n,t)=>n+t.effort,0); const quickWins=tasks.filter(t=>t.effort<=30&&t.difficulty<=2).length;
  return <>
    <div className="welcome"><p className="eyebrow">YOUR DAILY FOCUS</p><h1>{greeting}, Jacob<span>.</span></h1><p className="full-date">{fullDateFormatter.format(today)}</p></div>
    <div className="daily-grid"><article className="daily-card japanese"><div className="card-label"><span>JAPANESE OF THE DAY</span><button aria-label="Pronunciation coming soon" title="Pronunciation coming soon"><Headphones size={15}/></button></div><strong>{word.hiragana}</strong><p><b>{word.kanji}</b><i/> {word.romaji}</p><small>{word.english}</small></article><article className="daily-card thought"><div className="card-label"><span>DAILY THOUGHT</span><Sparkles size={15}/></div><blockquote>“{quote}”</blockquote><small>FOR TODAY</small></article></div>
    <div className="stats"><Stat label="TODAY" value={todayTasks.length} note="tasks planned today"/><Stat label="URGENT" value={urgent} note="priority 4–5 tasks"/><Stat label="UPCOMING" value={upcoming} note="due within 7 days"/><Stat label="COMPLETED" value={completed.length} note="tasks completed"/></div>
    <section className="section-card focus"><SectionTitle title="TODAY'S FOCUS" subtitle="The highest-value things to move forward today." icon={Target}/>{ranked.length===0?<EmptyInline title="No tasks to prioritise yet." body="Add a task and FOCUS will recommend where to begin." action="ADD TASK" onClick={openModal}/>:<div className="focus-list">{ranked.map((t,i)=><div className="focus-row" key={t.id}><span className="rank">0{i+1}</span><div><h3>{t.name}</h3><p>{t.category||"Uncategorised"}</p><small><b>{dueText(t.deadline,today)}</b><i/>Priority {t.priority}<i/>{effortText(t.effort)}</small><em>{focusReason(t,today)}</em></div><button onClick={()=>{}}>START</button><button className="complete" onClick={()=>complete(t.id)} aria-label={`Complete ${t.name}`}><Check size={15}/></button></div>)}</div>}</section>
    <div className="lower-grid"><section className="section-card glance"><SectionTitle title="DAY AT A GLANCE" subtitle="A simple view of today's workload." icon={Timer}/>{tasks.length===0?<div className="clear-day"><span><span className="sun"/>Your day is clear.</span><small>Add something when you’re ready. There’s no need to fill the space.</small></div>:<><div className="capacity"><span>Available workload <b>{Math.min(100,Math.round(totalMins/480*100))}%</b></span><div><i style={{width:`${Math.min(100,totalMins/480*100)}%`}}/></div></div><dl><div><dt>Estimated work today</dt><dd>{effortText(totalMins)}</dd></div><div><dt>High-priority tasks</dt><dd>{urgent}</dd></div><div><dt>Quick wins</dt><dd>{quickWins}</dd></div><div><dt>Next deadline</dt><dd>{tasks.length?dueText([...tasks].sort((a,b)=>a.deadline.localeCompare(b.deadline))[0].deadline,today):"—"}</dd></div></dl></>}</section>
    <section className="section-card capture"><SectionTitle title="QUICK CAPTURE" subtitle="Get it out of your head in seconds." icon={Plus}/><div className="capture-box"><input value={quick} onChange={e=>setQuick(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addQuick()} placeholder="What do you need to get done?" aria-label="Quick task name"/><button className="primary" disabled={!quick.trim()} onClick={addQuick}>ADD</button></div><p>Press Enter to add. You can fill in the details later.</p></section></div>
    <section className="section-card deadlines"><SectionTitle title="UPCOMING DEADLINES" subtitle="What’s approaching over the next seven days." icon={CalendarDays}/>{upcoming===0?<div className="quiet-row"><CalendarDays size={18}/><span>No upcoming deadlines.</span></div>:tasks.filter(t=>daysFrom(t.deadline,today)>=0&&daysFrom(t.deadline,today)<=7).map(t=><div className="deadline-row" key={t.id}><span>{dateOnly(t.deadline).getUTCDate()}</span><div><b>{t.name}</b><small>{t.category||"Uncategorised"}</small></div><em>{dueText(t.deadline,today)}</em><Priority level={t.priority}/></div>)}</section>
  </>
}

function Stat({label,value,note}:{label:string;value:number;note:string}){return <article><span>{label}</span><strong>{value}</strong><small>{note}</small></article>}
function SectionTitle({title,subtitle,icon:Icon}:{title:string;subtitle:string;icon:any}){return <div className="section-title"><div className="section-icon"><Icon size={16}/></div><div><h2>{title}</h2><p>{subtitle}</p></div></div>}
function EmptyInline({title,body,action,onClick}:{title:string;body:string;action?:string;onClick?:()=>void}){return <div className="inline-empty"><div className="empty-symbol"><CircleDot size={20}/></div><h3>{title}</h3><p>{body}</p>{action&&<button className="secondary" onClick={onClick}><Plus size={15}/>{action}</button>}</div>}
function Priority({level}:{level:number}){return <span className={`priority priority-${level}`}><i/>P{level}</span>}
function Difficulty({level}:{level:number}){return <span className="difficulty" aria-label={`Difficulty ${level} of 5`}>{[1,2,3,4,5].map(n=><i key={n} className={n<=level?"filled":""}/>)}</span>}
function focusReason(t:Task,today:Date){const d=daysFrom(t.deadline,today);if(d<0)return "Overdue — move this forward";if(d<=2&&t.priority>=4)return "High priority + approaching deadline";if(t.effort<=30&&t.difficulty<=2)return "Quick win";if(t.priority>=4)return "High priority";return "Strong impact-to-effort balance"}

function Tasks({tasks,today,add,complete}:{tasks:Task[];today:Date;add:()=>void;complete:(id:number)=>void}){const [tab,setTab]=useState("ACTIVE");const shown=tasks.filter(t=>tab==="COMPLETED"?t.status==="Completed":tab==="ACTIVE"?t.status!=="Completed":daysFrom(t.deadline,today)>0&&t.status!=="Completed");return <><PageTitle eyebrow="WORKSPACE" title="Tasks" subtitle="A clear view of everything you’ve committed to." action={add}/><div className="tabs">{["ACTIVE","UPCOMING","COMPLETED"].map(x=><button className={tab===x?"active":""} onClick={()=>setTab(x)} key={x}>{x}<span>{tasks.filter(t=>x==="COMPLETED"?t.status==="Completed":x==="ACTIVE"?t.status!=="Completed":daysFrom(t.deadline,today)>0&&t.status!=="Completed").length}</span></button>)}</div>{shown.length===0?<PageEmpty icon={ListTodo} title={tasks.length===0?"Your workspace is ready":"Nothing here yet"} body={tasks.length===0?"No tasks yet. Add your first task and FOCUS will begin organising your workload.":"Tasks will appear here when they match this view."} action={tasks.length===0?add:undefined}/>:<div className="task-table"><div className="table-head"><span>TASK</span><span>STATUS</span><span>PRIORITY</span><span>DIFFICULTY</span><span>DEADLINE</span><span>EFFORT</span><span/></div>{shown.map(t=><div className="task-row" key={t.id}><div><b>{t.name}</b><small>{t.category||"Uncategorised"}</small></div><Status status={t.status}/><Priority level={t.priority}/><Difficulty level={t.difficulty}/><span className={daysFrom(t.deadline,today)<=0?"warn":""}>{dueText(t.deadline,today)}</span><span><Clock3 size={13}/>{effortText(t.effort)}</span>{t.status!=="Completed"?<button onClick={()=>complete(t.id)} aria-label={`Complete ${t.name}`}><Check size={15}/></button>:<span/>}</div>)}</div>}</>}
function Status({status}:{status:Status}){return <span className={`status status-${status.replaceAll(" ","").toLowerCase()}`}><i/>{status}</span>}

function Timeline({tasks,today,add}:{tasks:Task[];today:Date;add:()=>void}){return <><PageTitle eyebrow="SCHEDULE" title="Timeline" subtitle="See the shape of your workload before it gets crowded."/><section className="timeline-card">{tasks.length===0?<PageEmpty icon={CalendarDays} title="Nothing scheduled yet" body="Tasks will appear here across their start dates and deadlines." action={add}/>:<div className="timeline-list">{[...tasks].sort((a,b)=>a.deadline.localeCompare(b.deadline)).map(t=><div key={t.id}><span className="date-tile"><b>{dateOnly(t.deadline).getUTCDate()}</b>{monthFormatter.format(dateOnly(t.deadline))}</span><i/><div><b>{t.name}</b><small>{t.category||"Uncategorised"} · {effortText(t.effort)}</small></div><em>{dueText(t.deadline,today)}</em></div>)}</div>}</section></>}

function Analytics({tasks,completed,add}:{tasks:Task[];completed:Task[];add:()=>void}){return <><PageTitle eyebrow="INSIGHTS" title="Analytics" subtitle="Understand your workload without turning work into a game."/>{completed.length===0?<PageEmpty icon={TrendingUp} title="Insights will appear here" body="Once you start completing tasks, FOCUS will show your workload, productivity patterns and completion trends." action={tasks.length===0?add:undefined}/>:<div className="analytics-cards"><Stat label="COMPLETED" value={completed.length} note="all time"/><Stat label="ACTIVE" value={tasks.length-completed.length} note="in your workspace"/><Stat label="HIGH PRIORITY" value={tasks.filter(t=>t.priority>=4).length} note="need attention"/><Stat label="AVERAGE DIFFICULTY" value={Math.round(tasks.reduce((n,t)=>n+t.difficulty,0)/tasks.length)} note="out of five"/></div>}</>}

function Completed({tasks,today,restore}:{tasks:Task[];today:Date;restore:(id:number)=>void}){return <><PageTitle eyebrow="ARCHIVE" title="Completed" subtitle="A quiet record of finished work."/>{tasks.length===0?<PageEmpty icon={CheckCircle2} title="Completed work will live here" body="Finish your first task and it will be added to this archive."/>:<div className="completed-list">{tasks.map(t=><div key={t.id}><span className="done"><Check size={15}/></span><div><b>{t.name}</b><small>{t.category||"Uncategorised"}</small></div><span>{completedDateFormatter.format(dateOnly(t.deadline))}</span><em>{daysFrom(t.deadline,today)>=0?"Completed":"Completed late"}</em><Priority level={t.priority}/><button onClick={()=>restore(t.id)}>Restore</button></div>)}</div>}</>}

function PageTitle({eyebrow,title,subtitle,action}:{eyebrow:string;title:string;subtitle:string;action?:()=>void}){return <div className="page-title"><div><p className="eyebrow">{eyebrow}</p><h1>{title}<span>.</span></h1><p>{subtitle}</p></div>{action&&<button className="primary" onClick={action}><Plus size={16}/>Add task</button>}</div>}
function PageEmpty({icon:Icon,title,body,action}:{icon:any;title:string;body:string;action?:()=>void}){return <section className="page-empty"><span><Icon size={23}/></span><h2>{title}</h2><p>{body}</p>{action&&<button className="primary" onClick={action}><Plus size={15}/>Add first task</button>}</section>}

function TaskModal({today,close,save}:{today:Date;close:()=>void;save:(t:Omit<Task,"id">)=>void}){const [form,setForm]=useState(emptyTask(today));const set=(key:keyof typeof form,value:string|number)=>setForm(x=>({...x,[key]:value}));const submit=(e:FormEvent)=>{e.preventDefault();if(form.name.trim()&&form.deadline)save(form)};return <div className="overlay" onMouseDown={close}><form className="modal" onSubmit={submit} onMouseDown={e=>e.stopPropagation()}><div className="modal-head"><div><p className="eyebrow">NEW TASK</p><h2>Add something worth doing.</h2></div><button type="button" onClick={close}><X size={19}/></button></div><div className="form-body"><label className="wide">Task name <em>Required</em><input autoFocus value={form.name} onChange={e=>set("name",e.target.value)} placeholder="What needs to get done?" required/></label><label className="wide">Description<textarea value={form.description} onChange={e=>set("description",e.target.value)} placeholder="Add useful context or a clear outcome."/></label><div className="form-grid"><label>Category<input value={form.category} onChange={e=>set("category",e.target.value)} placeholder="e.g. Client work"/></label><label>Estimated effort<select value={form.effort} onChange={e=>set("effort",Number(e.target.value))}><option value={15}>15 minutes</option><option value={30}>30 minutes</option><option value={60}>1 hour</option><option value={120}>2 hours</option><option value={240}>4 hours</option><option value={480}>1 day</option></select></label><label>Start date<input type="date" value={form.start} onChange={e=>set("start",e.target.value)}/></label><label>Deadline <em>Required</em><input type="date" min={form.start||undefined} value={form.deadline} onChange={e=>set("deadline",e.target.value)} required/>{form.deadline&&<small className="date-result">{dueText(form.deadline,today)}</small>}</label><label>Priority<select value={form.priority} onChange={e=>set("priority",Number(e.target.value))}><option value={1}>1 — Minimal</option><option value={2}>2 — Low</option><option value={3}>3 — Medium</option><option value={4}>4 — High</option><option value={5}>5 — Critical</option></select></label><label>Difficulty<select value={form.difficulty} onChange={e=>set("difficulty",Number(e.target.value))}><option value={1}>1 — Very easy</option><option value={2}>2 — Easy</option><option value={3}>3 — Medium</option><option value={4}>4 — Hard</option><option value={5}>5 — Very hard</option></select></label><label>Status<select value={form.status} onChange={e=>set("status",e.target.value)}><option>Not Started</option><option>In Progress</option><option>Blocked</option><option>Waiting</option><option>Completed</option></select></label><label>Tags<input value={form.tags} onChange={e=>set("tags",e.target.value)} placeholder="planning, deep work"/></label><label>Dependencies<input value={form.dependencies} onChange={e=>set("dependencies",e.target.value)} placeholder="What needs to happen first?"/></label><label>Notes<input value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Anything else to remember"/></label></div></div><div className="modal-actions"><button type="button" onClick={close}>Cancel</button><button className="primary" disabled={!form.name.trim()||!form.deadline} type="submit">Create task<ChevronRight size={15}/></button></div></form></div>}
