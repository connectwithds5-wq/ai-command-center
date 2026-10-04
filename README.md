# AI Command Center V3

V3 adds true one-tap RUN NOW using a Cloudflare Worker relay.

## 1. Create Cloudflare Worker
Create a Worker in Cloudflare and paste `worker.js`.

## 2. Add secret
In Worker Settings → Variables and Secrets, add:

Name: `GH_TOKEN`
Type: Secret
Value: a GitHub fine-grained PAT with **Actions: Read and write** on these five repositories:
- connectwithds5-wq/toon_kids_automation
- connectwithds5-wq/think-fast-daily-automation
- connectwithds5-wq/what-if-daily-automation
- connectwithds5-wq/factverse-ai-automation
- connectwithds5-wq/hindi-emotional-reels-automation

Do NOT put this token in index.html or GitHub Pages.

## 3. Deploy
Copy the Worker URL, for example:
`https://ai-command-center-relay.<account>.workers.dev`

## 4. Update index.html
Replace:
`https://REPLACE-WITH-YOUR-WORKER-URL.workers.dev`

with your actual Worker URL.

Then upload the updated `index.html` to the `ai-command-center` GitHub Pages repo.

The RUN NOW button will then trigger the workflow without leaving the dashboard.

## Integrated automations
The dashboard currently monitors and can manually trigger:
- Toon Kids
- Think Fast Daily
- What If Daily
- FactVerse AI
- Auto Social Post
- Hindi Emotional Reels

Hindi Emotional Reels uses `.github/workflows/daily-reel.yml` and appears as a live automation card with recent runs and a RUN NOW action.

## AI Engine Stack — V9

The Command Center now includes the AI stack already forked under the Darjid314 account:

| Engine | Role |
|---|---|
| n8n | Workflow automation |
| Dify | AI applications and visual workflows |
| Browser Use | AI browser/RPA |
| LangGraph | Stateful agent orchestration |
| CrewAI | Multi-agent execution |
| OpenHands | Autonomous coding |
| smolagents | Lightweight agents |
| LlamaIndex | RAG / knowledge layer |
| Mem0 | Long-term AI memory |
| Open WebUI | Central AI interface |

### Target architecture

Open WebUI → Dify → LangGraph → CrewAI/smolagents → Browser Use → n8n → GitHub Actions / business automations.

LlamaIndex and Mem0 provide shared knowledge and memory. OpenHands is kept as the development agent.

### Security

- Never put GitHub PATs, API keys, OAuth secrets or model keys in index.html.
- Keep secrets in Cloudflare Worker / GitHub Actions / Vercel server-side environment variables.
- Browser automation should use dedicated accounts and least-privilege credentials.
- Production device changes should require explicit approval and verification.

### Implementation order

1. Command Center UI
2. n8n workflow gateway
3. Dify AI workflow gateway
4. LangGraph/CrewAI agent layer
5. Browser Use execution layer
6. LlamaIndex + Mem0 knowledge/memory
7. OpenHands development automation
8. Connect existing proposal, tender, email, content and analytics automations


## n8n Gateway

An importable workflow is included at `integrations/n8n/ai-command-center-gateway.json`.

1. Import this JSON into the n8n instance you control.
2. Activate the workflow and copy its production webhook URL.
3. Add that URL as the Cloudflare Worker secret `N8N_WEBHOOK_URL`.
4. The Command Center can then send approved commands through the Worker without exposing the n8n URL in the browser.

Supported gateway commands: `health`, `proposal`, `tender`, `email`, `content`, `video`, `analytics`.

The gateway is intentionally inactive on import and should be tested with `health` before connecting production workflows.
