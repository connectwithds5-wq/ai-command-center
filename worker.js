const ALLOWED = {
  "toon_kids_automation": "toon_kids_daily.yml",
  "think-fast-daily-automation": "think-fast-daily.yml",
  "what-if-daily-automation": "what_if_daily.yml",
  "factverse-ai-automation": "factverse.yml"
};

const OWNER = "connectwithds5-wq";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

function json(data, status=200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders()
    }
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {status:204, headers:corsHeaders()});
    }

    if (request.method !== "POST") {
      return json({error:"POST only"},405);
    }

    if (!env.GH_TOKEN) {
      return json({error:"GH_TOKEN secret is not configured"},500);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({error:"Invalid JSON"},400);
    }

    const repo = body?.repo;
    const workflow = body?.workflow;

    if (!repo || !workflow) {
      return json({error:"repo and workflow are required"},400);
    }

    if (!ALLOWED[repo] || ALLOWED[repo] !== workflow) {
      return json({error:"Workflow not allowed"},403);
    }

    const url =
      `https://api.github.com/repos/${OWNER}/${repo}/actions/workflows/${workflow}/dispatches`;

    const gh = await fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${env.GH_TOKEN}`,
        "X-GitHub-Api-Version": "2026-03-10",
        "User-Agent": "ai-command-center-v3"
      },
      body: JSON.stringify({ref:"main"})
    });

    if (!gh.ok) {
      const text = await gh.text();
      return json({error:`GitHub API ${gh.status}`,details:text.slice(0,500)},gh.status);
    }

    return json({ok:true,repo,workflow});
  }
};
