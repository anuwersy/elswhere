import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./radar.css";
import "./workflow-fixes.css";
import "./live-roles.css";
import "./repair-accessibility.css";
const geistSans=Geist({variable:"--font-geist-sans",subsets:["latin"]});
const geistMono=Geist_Mono({variable:"--font-geist-mono",subsets:["latin"]});
export const metadata:Metadata={
  title:"Asia Role Radar — CV-first Career Intelligence",
  description:"Turn your CV into grounded career directions, focused Asia market scans and evidence-led job matches.",
  metadataBase:new URL("https://asia-role-radar-jacob.fluffy-berry-7452.chatgpt.site"),
  openGraph:{title:"Asia Role Radar",description:"CV-first, evidence-led career intelligence across Asia.",images:["/og.png"]},
  twitter:{card:"summary_large_image",title:"Asia Role Radar",description:"CV-first, evidence-led career intelligence across Asia.",images:["/og.png"]}
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>}
