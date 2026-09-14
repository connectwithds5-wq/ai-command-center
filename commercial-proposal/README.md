# Commercial Proposal Automation

BOW/BOQ upload → client details → AI draft → in-browser review/edit → approval → DOCX/PDF export.

## UI workflow
1. Upload PDF/XLSX/XLS/DOCX BOW/BOQ.
2. Enter client/project/reference/date/prepared-by/currency/VAT details.
3. Generate proposal.
4. Review the Word-like preview. Text and BOQ cells are editable.
5. Save corrections and approve.
6. Only after approval, download Word and PDF.

## AI rules
The generation API instructs Gemini not to invent quantities, rates, specifications, timelines, warranties, payment terms or client facts. Missing data is marked `Not specified`.

## Template basis
The current master proposal supplied in the conversation is used as the structural reference: Cover, Executive Communication, Executive Summary, Proposed Solution Overview, Detailed Proposed Solution, Implementation Plan, Assumptions, Training & Handover, After Sales Support, Conclusion, Priced BOQ, Optional Items and Terms & Conditions.

The supplied client proposal PDF is intentionally **not committed to this public repository** because it contains client/company information. A production version should store an approved blank/master template privately.

## Vercel setup
Set the Vercel project root to `commercial-proposal/` and add:
- `GEMINI_API_KEY` — Gemini API key.

Deploying this directory gives `/` as the proposal UI and `/api/generate` + `/api/export` as serverless endpoints.

## Next production step
Replace the simplified export layout with the private master template renderer so the approved Word/PDF matches the company's exact branding, header/footer, logo, table styling and pagination.
