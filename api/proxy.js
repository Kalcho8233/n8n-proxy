export default async function handler(req, res) {
  const target = req.query.target;

  if (!target) {
    return res.status(400).json({ error: "Missing 'target' query parameter" });
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
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Proxy request failed", details: error.message });
  }
}
