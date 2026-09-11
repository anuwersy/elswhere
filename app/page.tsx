import RadarApp from "./radar-app";
import { DEFAULT_SEARCHES } from "@/lib/defaults";

export default function Page(){
  return <>
    <section className="live-role-strip" aria-labelledby="live-role-heading">
      <div><span>LIVE ROLE SEARCHES</span><h2 id="live-role-heading">Open current roles on LinkedIn</h2><p>The app does not scrape your personal account. Choose a market below to view live listings, then paste promising roles into the radar for CV assessment.</p></div>
      <div className="live-role-links">
        {[["Tokyo & Japan",0],["Seoul & South Korea",1],["Hong Kong",2]].map(([label,index])=>{
          const search=DEFAULT_SEARCHES[Number(index)];
          return <a key={String(label)} href={search.url} target="_blank" rel="noreferrer"><strong>{String(label)}</strong><small>5 career lanes · LinkedIn</small><b>View roles ↗</b></a>;
        })}
      </div>
    </section>
    <RadarApp/>
  </>;
}
