export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const aliasMap = {
    onboarding: "https://n8n.srv925690.hstgr.cloud/webhook/AIOnboardingAssistant",
    onboardingTest: "https://n8n.srv925690.hstgr.cloud/webhook-test/AIOnboardingAssistant",
  };

  let target = req.query.target;

  if (!target) {
    return res.status(400).json({ error: "Missing target URL" });
  }

  if (aliasMap[target]) {
    target = aliasMap[target];
  } else if (!target.startsWith("https://")) {
    return res.status(400).json({ error: "Invalid target. Must be a full URL or known alias." });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "OmniNex-GPT-Proxy"
      },
      body: JSON.stringify(req.body),
    });

    const text = await response.text(); // handle plain text responses too
    return res.status(response.status).send(text);
  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).json({ error: "Proxy error", details: error.message });
  }
}
