# Project 8: L'Oréal Chatbot

L’Oréal is exploring the power of AI, and your job is to showcase what's possible. Your task is to build a chatbot that helps users discover and understand L’Oréal’s extensive range of products—makeup, skincare, haircare, and fragrances—as well as provide personalized routines and recommendations.

## 🚀 Launch via GitHub Codespaces

1. In the GitHub repo, click the **Code** button and select **Open with Codespaces → New codespace**.
2. Once your codespace is ready, open the `index.html` file via the live preview.

## ☁️ Cloudflare Note

When deploying through Cloudflare, make sure your API request body (in `script.js`) includes a `messages` array and handle the response by extracting `data.choices[0].message.content`.

## 🔒 Secure API Key With Cloudflare Worker

Use Cloudflare so your OpenAI API key is never exposed in the browser.

1. Create a Worker in Cloudflare dashboard or with Wrangler.
2. Copy the code from `cloudflare-worker.js` (or `RESOURCE_cloudflare-worker.js`) into your Worker.
3. Add your key in Cloudflare:
	- Dashboard: Worker -> Settings -> Variables and Secrets -> Add secret
	- Name: `OPENAI_API_KEY`
4. Deploy your Worker.
5. Copy the Worker URL, for example: `https://your-worker-name.your-subdomain.workers.dev`
6. Open `script.js` and replace:
	- `PASTE_YOUR_CLOUDFLARE_WORKER_URL_HERE`
	- with your deployed Worker URL.

### Optional Wrangler Commands

If you use Wrangler CLI:

```bash
wrangler login
wrangler deploy cloudflare-worker.js --name loreal-chatbot-worker
wrangler secret put OPENAI_API_KEY
```

After deployment, test your chatbot in the browser and confirm responses still appear from `data.choices[0].message.content`.

Enjoy building your L’Oréal beauty assistant! 💄

## 🔤 Typography Reference (Monotype)

For brand-aligned typography direction, review Monotype resources focused on luxury and global branding:

- Global branding fonts: https://www.monotype.com/resources/global-branding-fonts
- Brand fonts: https://www.monotype.com/resources/tags/brand
- Case studies index: https://www.monotype.com/resources/case-studies

In this project, the UI uses a high-contrast black/gold palette with elegant headline typography and clean body text to reflect premium beauty-brand styling.
