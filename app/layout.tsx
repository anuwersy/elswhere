import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
const geistSans=Geist({variable:"--font-geist-sans",subsets:["latin"]});
const geistMono=Geist_Mono({variable:"--font-geist-mono",subsets:["latin"]});
export const metadata:Metadata={
  title:"FOCUS — Personal Execution Tracker",
  description:"Plan the right work, execute with clarity, and understand your workload.",
  metadataBase:new URL("https://focus.local"),
  openGraph:{title:"FOCUS — Do the work that matters",description:"Personal execution, intelligently prioritized.",images:["/og.png"]},
  twitter:{card:"summary_large_image",title:"FOCUS — Do the work that matters",description:"Personal execution, intelligently prioritized.",images:["/og.png"]}
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>}
