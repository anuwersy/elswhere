import {runtimeEnv} from "../../../lib/server-store";

export async function GET(){
  const env=runtimeEnv() as Record<string,string|undefined>;
  if(!env.OPENAI_API_KEY)return Response.json({configured:false}, {status:503});
  try{
    const response=await fetch("https://api.openai.com/v1/models",{headers:{Authorization:`Bearer ${env.OPENAI_API_KEY}`}});
    return Response.json({configured:true,status:response.status,ok:response.ok});
  }catch(error){
    return Response.json({configured:true,error:error instanceof Error?error.message:"request failed"},{status:502});
  }
}
