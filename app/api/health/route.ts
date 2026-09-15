import {runtimeEnv} from "../../../lib/server-store";

export async function GET(){
  const env=runtimeEnv() as Record<string,unknown>;
  const processEnv=typeof process!=="undefined"?process.env as Record<string,unknown>:{};
  return Response.json({
    openaiApiKeyConfigured:typeof env.OPENAI_API_KEY==="string"&&env.OPENAI_API_KEY.length>0,
    openaiModelConfigured:typeof env.OPENAI_MODEL==="string"&&env.OPENAI_MODEL.length>0,
    processOpenaiApiKeyConfigured:typeof processEnv.OPENAI_API_KEY==="string"&&processEnv.OPENAI_API_KEY.length>0,
    processOpenaiModelConfigured:typeof processEnv.OPENAI_MODEL==="string"&&processEnv.OPENAI_MODEL.length>0,
  });
}
