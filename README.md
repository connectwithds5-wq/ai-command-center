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