const aliasMap = {
  onboarding: "https://n8n.srv925690.hstgr.cloud/webhook/AIOnboardingAssistant",
  onboardingTest: "https://n8n.srv925690.hstgr.cloud/webhook-test/AIOnboardingAssistant",
};

export default async function handler(req, res) {
  let target = req.query.target;

  if (!target) {
    return res.status(400).json({ error: "Missing target URL" });
  }

  // Convert alias to actual URL
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
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Proxy error", details: error.message });
  }
}
