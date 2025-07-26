# GPT to n8n Proxy

This lightweight Vercel proxy lets you send POST requests from a GPT to an external n8n webhook.

## Usage

Send a POST request to:

```
https://YOUR-VERCEL-URL.vercel.app/proxy?target=https://your-n8n-url/webhook/your-endpoint
```

Replace `YOUR-VERCEL-URL` and `your-n8n-url` accordingly.

## Example

```
POST https://gpt-to-n8n.vercel.app/proxy?target=https://n8n.example.com/webhook/AIOnboardingAssistant
Content-Type: application/json

{
  "email": "test@example.com",
  "assistantPurpose": "automation setup"
}
```

The proxy forwards the body to the n8n webhook and returns the response.