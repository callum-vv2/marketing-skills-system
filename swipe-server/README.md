# Swipe File Server

Local server that receives content from the Chrome extension and saves it to your marketing skill swipe files.

## Setup

1. **Install dependencies:**
   ```bash
   cd swipe-server
   npm install
   ```

2. **Configure API key:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Anthropic API key.

3. **Start the server:**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:3847`

## Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/skills` | GET | List available skills |
| `/contribute` | POST | Save content to swipe files |

## How It Works

1. Chrome extension sends content (URL, notes, selected text)
2. Server uses Claude to classify which skills the content is relevant to
3. Content is written to each relevant skill's `swipe-file.md`

## Multi-Skill Routing

The AI analyzes your notes to determine ALL relevant skills. For example:

- "Love the positioning and copy" → `positioning-angles` + `direct-response-copy`
- "Great LinkedIn ad hook" → `ad-copy` + `positioning-angles` + `content-atomizer`
- "Email with amazing storytelling" → `email-sequences` + `direct-response-copy`

## Fallback

If the API is unavailable, the server uses rule-based classification based on:
- URL domain (YouTube, LinkedIn, Twitter, etc.)
- Keywords in your notes (copy, ad, email, hook, etc.)
