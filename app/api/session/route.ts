export async function GET(req:Request){
  const cookie=req.headers.get("cookie")||"";
  const existing=cookie.split(";").map(part=>part.trim().split("=")).find(([name])=>name==="radar_session")?.[1];
  if(existing&&/^[a-f0-9-]{20,}$/i.test(existing))return Response.json({ok:true});
  const session=crypto.randomUUID();
  return Response.json({ok:true},{headers:{"set-cookie":`radar_session=${session}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=31536000`}});
}
