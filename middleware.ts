import {NextResponse} from "next/server";

/** Forward Vercel Passport's verified subject to the existing API identity contract. */
export async function middleware(request:Request){
  if(typeof process!=="undefined"&&process.env.VERCEL){
    try{
      const {getIdentity}=await import("@vercel/passport");
      const identity=await getIdentity({headers:request.headers});
      if(identity?.subject){
        const headers=new Headers(request.headers);
        headers.set("oai-authenticated-user-id",identity.subject);
        return NextResponse.next({request:{headers}});
      }
    }catch{/* The API will return AUTH_REQUIRED when Passport is unavailable. */}
  }
  return NextResponse.next();
}

export const config={matcher:["/api/:path*"]};
