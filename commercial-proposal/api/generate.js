import formidable from 'formidable';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import XLSX from 'xlsx';
import mammoth from 'mammoth';

export const config = { api: { bodyParser: false } };

function parseForm(req) {
  return new Promise((resolve,reject)=>{ const form=formidable({multiples:false,maxFileSize:25*1024*1024}); form.parse(req,(err,fields,files)=>err?reject(err):resolve({fields,files})); });
}
function textFromFile(file){
  const p=file.filepath || file.path;
  const ext=(file.originalFilename||'').toLowerCase().split('.').pop();
  if(ext==='pdf') return pdfParse(fs.readFileSync(p)).then(x=>x.text);
  if(ext==='xlsx'||ext==='xls'){const wb=XLSX.readFile(p);return Promise.resolve(wb.SheetNames.map(n=>'SHEET: '+n+'\n'+XLSX.utils.sheet_to_csv(wb.Sheets[n])).join('\n\n'));}
  if(ext==='docx') return mammoth.extractRawText({path:p}).then(x=>x.value);
  throw new Error('Unsupported file type');
}
function clean(v){return Array.isArray(v)?v[0]:v}
export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'POST only'});
  if(!process.env.GEMINI_API_KEY)return res.status(500).json({error:'GEMINI_API_KEY is not configured'});
  try{
    const {fields,files}=await parseForm(req); const file=Array.isArray(files.file)?files.file[0]:files.file; if(!file)throw new Error('BOW file missing');
    const details=JSON.parse(clean(fields.details)||'{}'); const bow=await textFromFile(file);
    const prompt=`You are a senior techno-commercial proposal writer. Build a proposal strictly from the supplied BOW/BOQ and user-entered project details. Never invent quantities, rates, specifications, brands, timelines, warranties, payment terms or client facts. If data is absent, say "Not specified". Preserve commercial numbers exactly as extracted. Return ONLY valid JSON with these keys: executive_communication, executive_summary, solution_matrix (array of objects with Solution Area, Deployment, Main Solution), detailed_solution, implementation_plan (array of objects with Phase, Activity, Duration), assumptions, training_handover, after_sales_support, conclusion, boq (array of objects with SL.No, Item, Description, Qty, Rate, Amount), optional_items (same keys), grand_total, currency, terms_conditions. Use professional English. Base the section order and tone on this approved template structure: Cover; Executive Communication; Executive Summary; Proposed Solution Overview; Detailed Proposed Solution; Implementation Plan; Implementation Assumptions; Training & Handover; After Sales Support; Conclusion; Priced Bill of Quantity; Optional Items; Terms and Conditions. User details: ${JSON.stringify(details)}\nBOW/BOQ:\n${bow.slice(0,180000)}`;
    const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key='+encodeURIComponent(process.env.GEMINI_API_KEY),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{responseMimeType:'application/json',temperature:0.1}})});
    if(!r.ok)throw new Error('Gemini API '+r.status+' '+(await r.text()).slice(0,400));
    const j=await r.json(); const raw=j.candidates?.[0]?.content?.parts?.[0]?.text; if(!raw)throw new Error('No proposal returned');
    const proposal=JSON.parse(raw); Object.assign(proposal,details); return res.status(200).json(proposal);
  }catch(e){return res.status(500).json({error:e.message||String(e)});}
}
