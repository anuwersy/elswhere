declare module "mammoth/mammoth.browser" { export function extractRawText(input:{arrayBuffer:ArrayBuffer}):Promise<{value:string;messages:unknown[]}> }
declare module "pdfjs-dist" { export function getDocument(input:unknown):{promise:Promise<{numPages:number;getPage(page:number):Promise<{getTextContent():Promise<{items:unknown[]}>}>}>} }
declare module "cloudflare:workers" { export const env:{DB:D1Database;[key:string]:unknown} }
