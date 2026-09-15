import {describe,expect,it} from "vitest";
import {assessJob,assessRequirements,dedupeJobs,isLockAvailable,languageGaps,normalizeLinkedInUrl,type Job} from "../lib/radar";
import {DEFAULT_PROFILE} from "../lib/defaults";

describe("evidence mapping",()=>{
 it("distinguishes delivery evidence from a skill mention",()=>{const r=assessRequirements("AI governance and Power BI required.","Led AI governance delivery. Power BI.");expect(r.find(x=>x.topic.includes("governance"))?.status).toBe("Experience evidence");expect(r.find(x=>x.topic==="Power BI")?.status).toBe("Skill mentioned")});
 it("does not count aspirational or negative statements",()=>{const r=assessRequirements("Python and AWS required.","Interested in Python. No experience with AWS.");expect(r.every(x=>x.status==="Not evidenced")).toBe(true)});
 it("marks missing requirements not evidenced",()=>expect(assessRequirements("Databricks required.","Led transformation programmes.")[0].status).toBe("Not evidenced"));
});
describe("qualification checks",()=>{
 it("flags a mandatory language conflict",()=>expect(languageGaps("Business Japanese required.",DEFAULT_PROFILE.languages)[0]).toContain("beginner"));
 it("treats unknown Korean as missing mandatory evidence",()=>expect(languageGaps("Fluent Korean required.",DEFAULT_PROFILE.languages)[0]).toContain("unknown"));
 it("applies salary floor rules",()=>expect(assessJob({id:"1",url:"https://linkedin.com/jobs/view/1",title:"AI Director",company:"A",location:"Tokyo, Japan",description:"Lead AI strategy and transformation.",salaryText:"JPY 7m",salaryMin:7000000},DEFAULT_PROFILE,8000000).flags).toContain("Salary below selected floor"));
});
describe("state transitions",()=>{
 it("reassesses jobs when CV is replaced",()=>{const base={id:"1",url:"https://linkedin.com/jobs/view/1",title:"Cloud Lead",company:"A",location:"Hong Kong",description:"AWS and Python required."};const before=assessJob(base,{...DEFAULT_PROFILE,cvText:"Led transformation programmes."});const after=assessJob(base,{...DEFAULT_PROFILE,cvText:"Led AWS delivery and implemented Python automation."});expect(after.evidenceScore).toBeGreaterThan(before.evidenceScore)});
 it("deduplicates normalized URLs and external IDs",()=>{const mk=(id:string,url:string):Job=>({...assessJob({id,url,title:"AI Lead",company:"A",location:"HK",description:"AI strategy leadership role."},DEFAULT_PROFILE),externalId:"same"});expect(dedupeJobs([mk("1","https://www.linkedin.com/jobs/view/x-123?trk=a"),mk("2","https://www.linkedin.com/jobs/view/123")])).toHaveLength(1);expect(normalizeLinkedInUrl("https://www.linkedin.com/jobs/view/x-123?trk=a")).toBe("https://www.linkedin.com/jobs/view/123")});
 it("recovers stale scan locks",()=>{expect(isLockAvailable({startedAt:new Date(Date.now()-131000).toISOString()})).toBe(true);expect(isLockAvailable({startedAt:new Date().toISOString()})).toBe(false)});
});
