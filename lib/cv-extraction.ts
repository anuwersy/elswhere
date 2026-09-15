export type CVFileMeta={name:string;size:number;type:string};
export class CVExtractionError extends Error{constructor(public code:"FILE_TOO_LARGE"|"UNSUPPORTED_FILE"|"PDF_LOAD_FAILED"|"PDF_PAGE_LIMIT"|"PDF_IMAGE_ONLY"|"TEXT_DECODE_FAILED",message:string){super(message)}}
type PdfDoc={numPages:number;getPage(n:number):Promise<{getTextContent():Promise<{items:Array<{str?:string}>}>}>};
type PdfLoader=(data:Uint8Array)=>Promise<PdfDoc>;

export async function extractPdf(data:ArrayBuffer,load:PdfLoader){
 let pdf:PdfDoc;try{pdf=await load(new Uint8Array(data))}catch{throw new CVExtractionError("PDF_LOAD_FAILED","This PDF could not be opened. It may be corrupt, encrypted, or the PDF worker failed to load.")}
 if(pdf.numPages>20)throw new CVExtractionError("PDF_PAGE_LIMIT","The PDF exceeds the 20-page limit.");
 let text="";for(let i=1;i<=pdf.numPages;i++){const page=await pdf.getPage(i);const content=await page.getTextContent();text+=content.items.map(x=>x.str||"").join(" ")+"\n"}
 if(text.trim().length<40)throw new CVExtractionError("PDF_IMAGE_ONLY","No extractable text was found. Upload a text-based PDF or paste the CV text.");
 return text.slice(0,40000);
}

export async function extractCVFile(file:File):Promise<{text:string;meta:CVFileMeta}>{
 if(file.size>5*1024*1024)throw new CVExtractionError("FILE_TOO_LARGE","The file exceeds the 5 MB limit.");
 const lower=file.name.toLowerCase();let text="";
 if(lower.endsWith(".txt")){try{text=new TextDecoder("utf-8",{fatal:true}).decode(await file.arrayBuffer())}catch{throw new CVExtractionError("TEXT_DECODE_FAILED","The text file is not valid UTF-8.")}}
 else if(lower.endsWith(".docx")){const mammoth=await import("mammoth/mammoth.browser");text=(await mammoth.extractRawText({arrayBuffer:await file.arrayBuffer()})).value}
 else if(lower.endsWith(".pdf")){const pdfjs=await import("pdfjs-dist");const {default:workerUrl}=await import("pdfjs-dist/build/pdf.worker.min.mjs?worker&url");pdfjs.GlobalWorkerOptions.workerSrc=workerUrl;text=await extractPdf(await file.arrayBuffer(),data=>pdfjs.getDocument({data}).promise as Promise<PdfDoc>)}
 else throw new CVExtractionError("UNSUPPORTED_FILE","Choose a DOCX, PDF or TXT file.");
 return {text:text.slice(0,40000),meta:{name:file.name,size:file.size,type:file.type||lower.split(".").pop()?.toUpperCase()||"Unknown"}};
}
