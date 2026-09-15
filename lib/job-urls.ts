const LINKEDIN_HOSTS=new Set(["linkedin.com","www.linkedin.com"]);

export function canonicalJobUrl(raw:string){
 let url:URL;
 try{url=new URL(raw)}catch{throw new Error("Job URL is malformed")}
 if(url.protocol!=="https:")throw new Error("Job URL must use HTTPS");
 if(url.username||url.password||url.port||raw.includes("\\"))throw new Error("Ambiguous job URL is not allowed");
 const host=url.hostname.toLowerCase();
 if(!LINKEDIN_HOSTS.has(host))throw new Error("Job URL host is not approved");
 const match=url.pathname.match(/^\/jobs\/view\/(?:[^/]*-)?(\d+)\/?$/);
 if(!match)throw new Error("LinkedIn URL must point to a numeric job listing");
 return `https://www.linkedin.com/jobs/view/${match[1]}`;
}

const postedCodes:Record<string,string>={"Past 24 hours":"r86400","Past week":"r604800","Past month":"r2592000"};
const workplaceCodes:Record<string,string>={"On-site":"1","Remote":"2","Hybrid":"3"};
export function linkedInSearchUrl(title:string,location:string,filters?:{postedWithin?:string;workplace?:string;languageFilter?:string}){
 const url=new URL("https://www.linkedin.com/jobs/search/");
 const languageTerms:Record<string,string>={"Japanese mentioned":"Japanese","Korean mentioned":"Korean","Japanese or Korean mentioned":"Japanese OR Korean"};
 url.searchParams.set("keywords",[title,filters?.languageFilter?languageTerms[filters.languageFilter]:""].filter(Boolean).join(" "));url.searchParams.set("location",location);
 const posted=filters?.postedWithin&&postedCodes[filters.postedWithin];if(posted)url.searchParams.set("f_TPR",posted);
 const workplace=filters?.workplace&&workplaceCodes[filters.workplace];if(workplace)url.searchParams.set("f_WT",workplace);
 return url.toString();
}
