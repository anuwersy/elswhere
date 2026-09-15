import {z} from "zod";
import {getIdentity} from "@vercel/passport";
import {canonicalJobUrl} from "./job-urls";

export const jobInput=z.object({
  url:z.string().transform((v,ctx)=>{try{return canonicalJobUrl(v)}catch(e){ctx.addIssue({code:"custom",message:e instanceof Error?e.message:"Invalid job URL"});return z.NEVER}}),
  title:z.string().min(2).max(200),company:z.string().min(1).max(160),location:z.string().min(1).max(160),
  description:z.string().min(20).max(50000),postedAt:z.string().optional(),workplace:z.string().optional(),salaryText:z.string().optional(),salaryMin:z.number().optional()
});

/** Resolve the authenticated Sites identity, or the single protected Vercel owner. */
export async function userId(req:Request){
  const id=req.headers.get("oai-authenticated-user-id");
  if(id)return id;
  const host=new URL(req.url).hostname;
  if(host==="localhost"||host==="127.0.0.1")return "local-preview";
  try{
    const identity=await getIdentity(req);
    if(identity?.subject)return identity.subject;
  }catch{
    // Treat an invalid Passport token as unauthenticated.
  }
  const cookie=req.headers.get("cookie")||"";
  const session=cookie.split(";").map(part=>part.trim().split("=")).find(([name])=>name==="radar_session")?.[1];
  if(session&&/^[a-f0-9-]{20,}$/i.test(session))return `browser:${session}`;
  return null;
}
export function error(status:number,code:string,message:string,details?:unknown){return Response.json({error:{code,message,details}},{status})}
export function validateWrite(req:Request){const type=req.headers.get("content-type")||"";if(!type.includes("application/json"))return error(415,"UNSUPPORTED_MEDIA_TYPE","Content-Type must be application/json");const origin=req.headers.get("origin");if(origin&&origin!==new URL(req.url).origin)return error(403,"ORIGIN_MISMATCH","Write origin was rejected");return null}
