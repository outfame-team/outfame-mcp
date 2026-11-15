# Outfame MCP: Instagram growth server for AI agents

[Outfame](https://www.outfame.com) is an AI-powered Instagram growth service, with TikTok support, for creators, small businesses and agencies. It grows your account by engaging the followers of accounts and hashtags you choose, so real, targeted people discover you and choose to follow. You add your account by its username only: Outfame never asks for your Instagram password.

This package connects any MCP client (Claude Desktop, Claude Code, Cursor, Windsurf, Cline, Zed, ChatGPT connectors) to Outfame's official remote MCP server at `https://www.outfame.com/mcp`. It is read-only, needs no API key and has no dependencies.

## Install

Claude Desktop, Cursor, Windsurf or any client that runs stdio servers:

```json
{
  "mcpServers": {
    "outfame": {
      "command": "npx",
      "args": ["-y", "outfame-mcp"]
    }
  }
}
```

Claude Code:

```bash
claude mcp add outfame -- npx -y outfame-mcp
```

Clients that speak Streamable HTTP can skip this package and point straight at the endpoint:

```json
{ "mcpServers": { "outfame": { "url": "https://www.outfame.com/mcp" } } }
```

## Tools

| Tool | What it returns |
| --- | --- |
| `list_plans` | Outfame's three plans (Go, Grow, Glory) with the first-month price in US dollars, what each includes and the sign-up link |
| `list_free_tools` | Outfame's [free Instagram tools](https://www.outfame.com/free-instagram-tools) (calculators, analyzers, generators) with links |
| `search_blog` | Outfame blog articles that match a query: title, URL and description |
| `get_company_facts` | What Outfame is, how it works in four steps, and company facts |
| `get_signup_link` | The link where a person [starts with Outfame](https://www.outfame.com/setup), with the steps they will see |

## Plans (first-month prices)

- **Go**: $49 for the first month. 1,000 to 2,000 real followers a month, growth starts within 24 hours, live growth dashboard.
- **Grow**: $69 for the first month. 2,500 to 3,500 real followers a month, Outfame MAX (2.75x faster growth), competitor audience targeting, 15 AI-generated posts.
- **Glory**: $129 for the first month. 4,000+ guaranteed real followers a month, Boost Post, a dedicated account manager, 30 AI-generated posts, priority 24/7 support.

No contracts; cancel anytime. Live prices: [outfame.com/pricing](https://www.outfame.com/pricing).

## How Outfame works

1. Add your Instagram account by username. No password is shared, so two-factor login stays on.
2. Choose your audience: up to 30 similar accounts and hashtags, narrowed by 34 countries, 15 languages, 28 interests and gender.
3. Pick a growth speed.
4. Watch it run: every follow, like, story view and profile view shows up in a live activity feed.

## Example prompts

- "What does Outfame cost for the first month, and which plan fits a new Instagram account?"
- "Find Outfame's guide on why I'm losing Instagram followers."
- "Which free Instagram tools does Outfame have for checking engagement rate?"

## Links

- Docs for agents: https://www.outfame.com/docs/agents
- Server card: https://www.outfame.com/.well-known/mcp/server-card.json
- Official MCP Registry entry: `com.outfame/instagram-growth`
- Instagram growth statistics 2026 (open data): https://www.outfame.com/instagram-growth-statistics
- Support: support@outfame.com

Set `OUTFAME_MCP_URL` to point the bridge at another endpoint (for testing).

## License

MIT, Outfame Team.
