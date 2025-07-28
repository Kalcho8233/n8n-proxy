const aliasMap = {
  onboarding: "https://n8n.srv925690.hstgr.cloud/webhook/AIOnboardingAssistant",
  onboardingTest: "https://n8n.srv925690.hstgr.cloud/webhook-test/AIOnboardingAssistant",
};

export default async function handler(req, res) {
  // ✅ CORS headers (разрешават мобилни GPT заявки)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, target, User-Agent");

  // ✅ Обработка на предварителни (OPTIONS) заявки
  if (req.method === "OPTIONS") {
    return res.status(204).end(); // No Content
  }

  let target = req.query.target;

  if (!target) {
    return res.status(400).json({ error: "Missing target URL" });
  }

  // ✅ Превод от alias към пълен URL
  if (aliasMap[target]) {
    target = aliasMap[target];
  } else if (!target.startsWith("https://")) {
    return res.status(400).json({ error: "Invalid target. Must be a full URL or known alias." });
  }

  // ❗️Вече не трябва да проверяваме метода тук — направено горе
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

    const text = await response.text();

    try {
      const json = JSON.parse(text);
      return res.status(response.status).json(json);
    } catch (err) {
      return res.status(response.status).send(text); // fallback if not JSON
    }

  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).json({ error: "Proxy error", details: error.message });
  }
}
