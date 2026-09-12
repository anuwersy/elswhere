import {z} from "zod";

export const evidenceSchema=z.object({statement:z.string().min(1),evidence:z.string().min(1),confidence:z.enum(["strong","moderate","limited"])}).strict();
export const cvAnalysisSchema=z.object({
 candidateProfile:z.object({headline:z.string(),executiveProfile:z.string(),careerLevel:z.string(),primaryFunctions:z.array(z.string()),industryExperience:z.array(z.string()),leadershipProfile:z.string(),deliveryProfile:z.string()}).strict(),
 strengths:z.array(z.object({name:z.string(),explanation:z.string(),evidence:z.string(),confidence:z.enum(["strong","moderate","limited"])}).strict()).min(1),
 achievements:z.array(z.object({achievement:z.string(),evidence:z.string()}).strict()),
 capabilityClusters:z.array(z.object({name:z.string(),explanation:z.string(),evidence:z.string()}).strict()),
 transferableSkills:z.array(z.object({skill:z.string(),beyondCurrentIndustry:z.string(),evidence:z.string()}).strict()),
 potentialWeaknesses:z.array(z.object({issue:z.string(),explanation:z.string()}).strict()),
 improvementActions:z.array(z.object({priority:z.number().int().min(1),action:z.string(),reason:z.string()}).strict()),
 searchKeywords:z.object({jobTitles:z.array(z.string()),capabilities:z.array(z.string()),industries:z.array(z.string()),technologies:z.array(z.string()),seniority:z.array(z.string()),booleanTerms:z.array(z.string()),exclusions:z.array(z.string())}).strict(),
}).strict();
export type CVAnalysis=z.infer<typeof cvAnalysisSchema>;

export const directionSchema=z.object({id:z.string(),title:z.string(),category:z.enum(["strongest","adjacent","wildcard"]),fitBand:z.enum(["strong","credible","exploratory","major pivot"]),why:z.string(),evidence:z.array(z.string()),transferableStrengths:z.array(z.string()),industries:z.array(z.string()),seniority:z.string(),missingCapabilities:z.array(z.string()),retraining:z.string(),entryRoute:z.string(),alternativeTitles:z.array(z.string()),keywords:z.array(z.string()),risks:z.array(z.string()),enjoyment:z.string().optional(),selected:z.boolean().default(false),priority:z.enum(["Primary","Secondary","Experimental"]).default("Secondary")}).strict();
export const directionsSchema=z.array(directionSchema).min(3);
export type CareerDirection=z.infer<typeof directionSchema>;

export const jobAssessmentSchema=z.object({verdict:z.enum(["Strong evidence alignment","Credible opportunity","Potential fit — review gaps","Fit limited by a mandatory requirement","Stretch opportunity","Insufficient job information"]),executiveSummary:z.string(),matchingRequirements:z.array(z.string()),partialMatches:z.array(z.string()),missingRequirements:z.array(z.string()),mandatoryGaps:z.array(z.string()),relevantEvidence:z.array(z.string()),transferableStrengths:z.array(z.string()),risks:z.array(z.string()),interviewPositioning:z.array(z.string()),cvTailoring:z.array(z.string()),applicationNarrative:z.string(),questions:z.array(z.string()),category:z.enum(["strongest","adjacent","wildcard"])}).strict();
export function hashText(text:string){let h1=0xdeadbeef,h2=0x41c6ce57;for(const c of text.trim()){const n=c.charCodeAt(0);h1=Math.imul(h1^n,2654435761);h2=Math.imul(h2^n,1597334677)}return `${(h1>>>0).toString(16).padStart(8,"0")}${(h2>>>0).toString(16).padStart(8,"0")}`}

export function gate(state:{cv?:{analysis?:unknown};directions?:CareerDirection[];jobs?:unknown[]}){
 const analysed=!!state.cv?.analysis;const selected=state.directions?.some(d=>d.selected)||false;const hasJobs=(state.jobs?.length||0)>0;
 return {cv:true,directions:analysed,scan:analysed&&selected,matches:hasJobs,saved:hasJobs};
}
