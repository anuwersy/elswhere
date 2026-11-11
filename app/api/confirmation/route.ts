import { NextResponse } from "next/server";

function pdfFor(city: string, type: string) {
  const lines = [`RANDOM DAY`, `${type}`, `7 HOUR ${city.toUpperCase()} ITINERARY`, `10:00  OPEN THE FIRST ENVELOPE`, `11:00  A LOCAL DETAIL WORTH NOTICING`, `13:00  LUNCH, CHOSEN FOR YOU`, `15:00  THE PLOT TWIST`, `17:00  THE FINAL ENVELOPE`, ``, `Clementine + Jacob`];
  const stream = `BT /F1 16 Tf 60 740 Td ${lines.map((line, i) => `(${line.replace(/[()]/g, "")}) Tj 0 -${i === 0 ? 28 : 22} Td`).join(" ")} ET`;
  const objects = [`1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj`, `2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj`, `3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>endobj`, `4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj`, `5 0 obj<</Length ${stream.length}>>stream\n${stream}\nendstream endobj`];
  let pdf = "%PDF-1.4\n"; const offsets = [0]; for (const object of objects) { offsets.push(pdf.length); pdf += `${object}\n`; } const xref = pdf.length; pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, "0")} 00000 n \n`).join("")}trailer<</Size ${objects.length + 1}/Root 1 0 R>>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf).toString("base64");
}

export async function POST(request: Request) {
  const { email, city = "Hong Kong", type = "A random day" } = await request.json() as { email?: string; city?: string; type?: string };
  if (!email || !String(email).includes("@")) return NextResponse.json({ ok: false, error: "A valid email is required." }, { status: 400 });
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL ?? "RANDOM DAY <hello@randomday.city>", to: [email], subject: "Your RANDOM DAY invitation is sealed ✳", html: `<div style="font-family:Arial;max-width:600px"><h1>Your day is waiting.</h1><p>Thank you for choosing RANDOM DAY. Your <b>${type}</b> in <b>${city}</b> has been sealed.</p><p>Your 7-hour itinerary is attached. Keep it close. Open only when the time is right.</p><p style="font-family:cursive;font-size:28px">Clementine & Jacob</p></div>`, attachments: [{ filename: "random-day-itinerary.pdf", content: pdfFor(city, type) }] }) });
    if (!response.ok) return NextResponse.json({ ok: false, error: "Email provider rejected the message." }, { status: 502 });
    return NextResponse.json({ ok: true, sent: true });
  }
  return NextResponse.json({ ok: true, sent: false, demo: true, message: "Demo complete. Configure RESEND_API_KEY to send the email." });
}
