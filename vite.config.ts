import vinext from "vinext";
import {defineConfig} from "vite";
import {nitro} from "nitro/vite";
import tailwindcss from "@tailwindcss/vite";
import hostingConfig from "./.openai/hosting.json";
import {sites} from "@openai/sites-vite-plugin";

const PLACEHOLDER_DATABASE_ID="00000000-0000-4000-8000-000000000000";
const {d1,r2}=hostingConfig;
const isCodexSeatbeltSandbox=process.env.CODEX_SANDBOX==="seatbelt";
const localVars:Record<string,string>=process.env.OPENAI_MODEL?{OPENAI_MODEL:process.env.OPENAI_MODEL}:{};
const localBindingConfig={main:"./worker/index.ts",vars:localVars,compatibility_flags:["nodejs_compat"],d1_databases:d1?[{binding:d1,database_name:"asia-role-radar",database_id:PLACEHOLDER_DATABASE_ID}]:[],r2_buckets:r2?[{binding:r2,bucket_name:"asia-role-radar"}]:[]};

export default defineConfig(async()=>{
 process.env.WRANGLER_WRITE_LOGS??="false";
 process.env.WRANGLER_LOG_PATH??=".wrangler/logs";
 process.env.MINIFLARE_REGISTRY_PATH??=".wrangler/registry";
 const isVercel=process.env.NITRO_PRESET==="vercel"||process.env.VERCEL==="1";
 if(isVercel)return {server:isCodexSeatbeltSandbox?{watch:{useFsEvents:false,usePolling:true}}:undefined,plugins:[vinext(),tailwindcss(),nitro({runtimeConfig:{openaiApiKey:"",openaiModel:"gpt-5-mini",nitro:{envPrefix:""}}})]};
 const {cloudflare}=await import("@cloudflare/vite-plugin");
 return {server:isCodexSeatbeltSandbox?{watch:{useFsEvents:false,usePolling:true}}:undefined,plugins:[vinext(),sites(),cloudflare({viteEnvironment:{name:"rsc",childEnvironments:["ssr"]},config:localBindingConfig})]};
});
