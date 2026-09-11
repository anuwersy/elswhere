import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./radar.css";
import "./live-roles.css";
const geistSans=Geist({variable:"--font-geist-sans",subsets:["latin"]});
const geistMono=Geist_Mono({variable:"--font-geist-mono",subsets:["latin"]});
export const metadata:Metadata={
  title:"Asia Role Radar — Private Job Search",
  description:"Discover and assess senior AI and technology transformation roles across Asia.",
  metadataBase:new URL("https://asia-role-radar.local"),
  openGraph:{title:"Asia Role Radar",description:"Private, evidence-led job search across Asia.",images:["/og.png"]},
  twitter:{card:"summary_large_image",title:"Asia Role Radar",description:"Private, evidence-led job search across Asia.",images:["/og.png"]}
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>}
