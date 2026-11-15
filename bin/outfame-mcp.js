#!/usr/bin/env node
// Outfame MCP: stdio bridge to Outfame's remote MCP server (Streamable HTTP).
// Lets any stdio-only MCP client (Claude Desktop, Cursor, Windsurf, Cline...) use
// https://www.outfame.com/mcp. Read-only, no authentication, no dependencies.
"use strict";

const ENDPOINT = process.env.OUTFAME_MCP_URL || "https://www.outfame.com/mcp";
const VERSION = require("../package.json").version;
let sessionId = null;
let protocolVersion = null;
let queue = Promise.resolve();
let buffer = "";

function write(msg) {
  process.stdout.write(JSON.stringify(msg) + "\n");
}

function errorFor(msg, text) {
  if (msg && msg.id !== undefined && msg.id !== null) {
    write({ jsonrpc: "2.0", id: msg.id, error: { code: -32603, message: text } });
  }
}

function parseSse(text) {
  const out = [];
  for (const block of text.split(/\r?\n\r?\n/)) {
    const data = block
      .split(/\r?\n/)
      .filter((l) => l.startsWith("data:"))
      .map((l) => l.slice(5).trimStart())
      .join("\n");
    if (data) {
      try { out.push(JSON.parse(data)); } catch (_) { /* ignore keep-alives */ }
    }
  }
  return out;
}

async function forward(msg) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
    "User-Agent": `outfame-mcp/${VERSION}`,
  };
  if (sessionId) headers["Mcp-Session-Id"] = sessionId;
  if (protocolVersion) headers["MCP-Protocol-Version"] = protocolVersion;
  let res;
  try {
    res = await fetch(ENDPOINT, { method: "POST", headers, body: JSON.stringify(msg) });
  } catch (e) {
    return errorFor(msg, `Outfame MCP endpoint unreachable: ${e.message}`);
  }
  const sid = res.headers.get("mcp-session-id");
  if (sid) sessionId = sid;
  if (res.status === 202 || res.status === 204) return;
  const body = await res.text();
  if (!res.ok) return errorFor(msg, `Outfame MCP endpoint answered HTTP ${res.status}`);
  const type = res.headers.get("content-type") || "";
  const replies = type.includes("text/event-stream") ? parseSse(body) : body ? [JSON.parse(body)] : [];
  for (const r of [].concat(...replies)) {
    if (r && r.result && r.result.protocolVersion) protocolVersion = r.result.protocolVersion;
    write(r);
  }
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  let nl;
  while ((nl = buffer.indexOf("\n")) >= 0) {
    const line = buffer.slice(0, nl).trim();
    buffer = buffer.slice(nl + 1);
    if (!line) continue;
    let msg;
    try { msg = JSON.parse(line); } catch (_) {
      write({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } });
      continue;
    }
    queue = queue.then(() => forward(msg)).catch((e) => errorFor(msg, e.message));
  }
});
process.stdin.on("end", () => { queue.then(() => process.exit(0)); });
