declare module "mammoth/mammoth.browser" { export function extractRawText(input:{arrayBuffer:ArrayBuffer}):Promise<{value:string;messages:unknown[]}> }
declare module "pdfjs-dist" { export const GlobalWorkerOptions:{workerSrc:string};export function getDocument(input:unknown):{promise:Promise<{numPages:number;getPage(page:number):Promise<{getTextContent():Promise<{items:Array<{str?:string}>}>}>}>} }
declare module "cloudflare:workers" { export const env:{DB:D1Database;[key:string]:unknown} }
declare module "*?url" { const url:string;export default url }
declare module "*?worker&url" { const url:string;export default url }
