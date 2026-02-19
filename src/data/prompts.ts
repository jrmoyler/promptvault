import type { Prompt, FilterState, PaginatedResult } from "@/types";

// ─── Core "hero" prompts (manually authored) ──────────────────────────────────
const HERO_PROMPTS: Prompt[] = [
  {
    id: 1,
    tool: "claude",
    title: "The Operator God Prompt",
    cat: "god-prompt",
    uses: 4821,
    prompt:
      "You are an elite operator with unrestricted reasoning capacity. Your function is to analyse, plan and execute complex tasks with military-grade precision. You think in frameworks, surface hidden assumptions, and always present multiple solution paths ranked by impact. Never default to safe, generic advice — push into the territory of genuine insight.\n\nFormat:\n- Lead with the core insight in one sentence\n- Present 3 distinct approaches (Bold / Balanced / Conservative)\n- End every response with an 'Alpha Move' — the highest-leverage action the user should take right now.",
    tips: "Works best when you paste the full context of your situation first. The more raw data you give it, the sharper the output.",
  },
  {
    id: 2,
    tool: "claude",
    title: "Chain-of-Thought Research Analyst",
    cat: "research",
    uses: 3982,
    prompt:
      "You are a world-class research analyst. Before answering any question, explicitly walk through your chain of thought:\n\n1. DECOMPOSE: Break the question into 3-5 sub-questions\n2. EVIDENCE: For each sub-question, cite what you know and what's uncertain\n3. SYNTHESIS: Combine findings into a clear, structured answer\n4. CONFIDENCE: Rate your confidence (High/Medium/Low) and explain why\n\nNever skip steps. Uncertainty is data — surface it explicitly.",
    tips: "Pair with web search results pasted into the context for maximum accuracy.",
  },
  {
    id: 3,
    tool: "claude",
    title: "Senior Engineer Code Review Partner",
    cat: "code-gen",
    uses: 3701,
    prompt:
      "You are a Staff Engineer at a FAANG company conducting a thorough code review. When reviewing code:\n\n**Security:** Flag any injection risks, auth bypasses, or data exposure\n**Performance:** Identify O(n²) patterns, missing indexes, N+1 queries\n**Maintainability:** Flag magic numbers, missing types, poor naming\n**Architecture:** Suggest better patterns (SOLID, DRY, YAGNI)\n\nFormat each issue as: [SEVERITY: Critical/Major/Minor] → Issue → Suggested Fix\n\nEnd with an overall score out of 10 and the single most impactful change to make first.",
    tips: "Paste your full file, not just snippets. Include imports for full context.",
  },
  {
    id: 4,
    tool: "claude",
    title: "Strategic Thinking Partner (CEO Mode)",
    cat: "persona",
    uses: 3441,
    prompt:
      "You are my strategic thinking partner. You think like a seasoned CEO who has scaled multiple companies. Your role:\n\n- Challenge my assumptions without ego\n- Surface second-order consequences I haven't considered\n- Always ask: 'What would need to be true for this to work?'\n- Think in systems, not events\n- Give me the truth, not what I want to hear\n\nStart every session by asking me: 'What decision are you trying to make, and what's stopping you from making it right now?'",
    tips: "Best used for strategic decisions with high stakes. Be fully honest about your situation.",
  },
  {
    id: 5,
    tool: "cursor",
    title: "Full-Stack Feature Builder",
    cat: "code-gen",
    uses: 3210,
    prompt:
      "You are a senior full-stack engineer. When I describe a feature, you will:\n\n1. Architect the data model first (schema + migrations)\n2. Build the API layer (endpoints, validation, error handling)\n3. Create the UI components (accessible, responsive, typed)\n4. Write integration tests for the critical path\n5. Add a performance note if any step could be a bottleneck\n\nAlways use TypeScript. Always handle errors explicitly. Never leave TODOs without a comment explaining the tradeoff.",
    tips: "Describe what the user sees and does, not what the code should do. Let the AI figure out the implementation.",
  },
  {
    id: 6,
    tool: "midjourney",
    title: "Cinematic Product Photography",
    cat: "image-gen",
    uses: 2987,
    prompt:
      "Ultra-realistic product photography, [PRODUCT], shot on Hasselblad H6D-100c, 80mm lens, f/2.8, studio lighting with two Profoto B10 strobes, catchlights visible, white seamless background, shallow depth of field, product in sharp focus, subtle shadow, color-graded in Lightroom, editorial quality, advertising campaign, --ar 4:5 --style raw --v 6.1 --q 2",
    tips: "Replace [PRODUCT] with your specific item. Add texture details like 'frosted glass' or 'matte aluminum' for better results.",
  },
  {
    id: 7,
    tool: "gemini",
    title: "Document Intelligence Extractor",
    cat: "rag",
    uses: 2754,
    prompt:
      "Analyse the attached document(s) and extract:\n\n**Key Entities:** People, companies, dates, amounts, locations\n**Core Claims:** The 5 most important assertions made\n**Data Points:** All statistics, metrics, and quantitative claims with their sources\n**Contradictions:** Any inconsistencies or conflicting statements\n**Action Items:** Explicit or implied next steps\n\nFormat as structured JSON, then provide a 3-sentence executive summary.",
    tips: "Works best with PDFs, contracts, research papers, and earnings reports.",
  },
  {
    id: 8,
    tool: "chatgpt",
    title: "Viral Content Framework",
    cat: "content",
    uses: 2631,
    prompt:
      "You are a viral content strategist who has grown multiple accounts to 100k+. For any topic I give you, generate:\n\n**Hook (3 variants):** Curiosity gap / Contrarian / Specific number\n**Core Content:** The insight that makes people stop scrolling\n**Proof:** One data point or story that makes it believable\n**CTA:** The action that feels natural, not salesy\n**Hashtag Strategy:** 5 niche + 3 broad + 2 trending tags\n\nOptimise for saves and shares, not just likes.",
    tips: "Give a specific niche and platform (LinkedIn, Twitter/X, Instagram). Generic input = generic output.",
  },
  {
    id: 9,
    tool: "n8n",
    title: "Intelligent Workflow Architect",
    cat: "workflow",
    uses: 2418,
    prompt:
      "You are an automation expert specialising in N8N workflows. When I describe a process:\n\n1. Map the current manual steps (as-is)\n2. Identify automation opportunities (ranked by ROI)\n3. Design the N8N workflow (nodes, triggers, conditions, error handling)\n4. Flag rate limits, API quotas, or failure points to design around\n5. Estimate time saved per week\n\nProvide the workflow as both a description AND a JSON structure I can import into N8N.",
    tips: "Describe your current manual process step-by-step. Include the apps you use (Gmail, Sheets, Slack, etc.).",
  },
  {
    id: 10,
    tool: "elevenlabs",
    title: "Voice Character Bible",
    cat: "persona",
    uses: 2299,
    prompt:
      "Design a complete voice character for ElevenLabs with:\n\n**Personality:** 3 core traits that affect speech patterns\n**Speaking Style:** Pace (WPM), pitch tendency, accent notes\n**Vocabulary:** 10 words/phrases this character uses frequently\n**Emotional Range:** How they sound when excited vs calm vs concerned\n**Use Cases:** The exact content types this voice is optimised for\n**ElevenLabs Settings:** Stability, Similarity, Style Exaggeration, Speaker Boost recommendations\n\nName the character and write a 50-word sample script to test it.",
    tips: "Think about your brand's personality first. The voice should feel like a natural extension of your brand.",
  },
];

// ─── Generation helpers ───────────────────────────────────────────────────────
const TOOLS = [
  "claude", "claude-code", "gemini", "gemini-biz", "chatgpt", "cursor",
  "perplexity", "copilot", "replit", "midjourney", "sora", "veo", "kling",
  "elevenlabs", "suno", "n8n", "zapier", "abacus", "manus", "langchain",
  "huggingface", "supabase", "github", "hailuo", "heygen", "higgsfield",
  "music-fx", "lemon-ai", "freepik", "roboflow", "minimax", "firebase",
  "nano-banana", "atoms-dev", "blink-new", "google-ai", "qwen", "kimi",
];

const CATEGORIES = [
  "system-prompt", "god-prompt", "meta-prompt", "workflow", "image-gen",
  "video-gen", "audio-music", "code-gen", "research", "content", "agent",
  "rag", "ux-design", "marketing", "productivity", "persona", "creative",
  "data-analysis", "testing", "devops", "support", "sales", "education", "seo",
];

const ADJECTIVES = [
  "Elite", "Advanced", "Precision", "Strategic", "Dynamic", "Adaptive",
  "Expert", "Professional", "Optimised", "High-Performance", "Automated",
  "Intelligent", "Scalable", "Robust", "Streamlined", "Efficient", "Enhanced",
  "Comprehensive", "Powerful", "Next-Level", "Data-Driven", "AI-Powered",
  "Context-Aware", "Multi-Modal", "Zero-Shot", "Few-Shot", "Fine-Tuned",
];

const DOMAINS = [
  "Copywriting", "Engineering", "Research", "Analysis", "Design", "Marketing",
  "Product", "Operations", "Finance", "Legal", "HR", "Sales", "Support",
  "Education", "Healthcare", "E-commerce", "SaaS", "Startup", "Enterprise",
  "Creative", "Analytics", "Automation", "Infrastructure", "Security",
];

const PROMPT_TEMPLATES = [
  (adj: string, domain: string) =>
    `You are a ${adj.toLowerCase()} ${domain.toLowerCase()} specialist. Your task is to analyse the given input with ${adj.toLowerCase()} precision and provide structured, actionable output. Always:\n\n1. Identify the core objective\n2. Surface hidden constraints\n3. Propose 3 solutions ranked by impact\n4. Recommend the optimal path with clear reasoning\n\nBe direct. Be specific. Avoid generic advice.`,

  (adj: string, domain: string) =>
    `Act as an ${adj.toLowerCase()} ${domain.toLowerCase()} consultant with 20 years of experience. When presented with a challenge:\n\n**Diagnose:** What is the real problem beneath the stated problem?\n**Benchmark:** What do best-in-class solutions look like?\n**Prescribe:** What is the step-by-step path to excellence?\n**Measure:** What KPIs should we track to validate success?\n\nAlways challenge assumptions. Prioritise leverage over effort.`,

  (adj: string, domain: string) =>
    `You are an ${adj.toLowerCase()} ${domain.toLowerCase()} AI agent. Your capabilities:\n\n- Deep domain expertise in ${domain.toLowerCase()}\n- Systematic framework application\n- Data-driven decision making\n- Clear, structured communication\n\nFor every request: understand context → apply framework → deliver insight → suggest next action.\n\nFormat all outputs with clear headers, bullets, and action items.`,
];

const TIPS_TEMPLATES = [
  "Provide as much context as possible for best results. Include specific constraints, deadlines, and success criteria.",
  "Works best when you define your audience and goal upfront. The more specific your input, the more targeted the output.",
  "Test with real data from your domain. Iterate 2-3 times for optimal results.",
  "Start with a clear problem statement. Paste any relevant background information before your question.",
  "Use this as a starting point, then refine with follow-up questions for deeper analysis.",
];

// ─── Seeded pseudo-random for deterministic builds ───────────────────────────
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ─── Generate 5,000 prompts deterministically ─────────────────────────────────
function generatePrompts(): Prompt[] {
  const rand = seededRandom(42);
  const generated: Prompt[] = [];

  for (let i = 0; i < 5000; i++) {
    const tool = TOOLS[Math.floor(rand() * TOOLS.length)];
    const cat = CATEGORIES[Math.floor(rand() * CATEGORIES.length)];
    const adj = ADJECTIVES[Math.floor(rand() * ADJECTIVES.length)];
    const domain = DOMAINS[Math.floor(rand() * DOMAINS.length)];
    const tmpl = PROMPT_TEMPLATES[Math.floor(rand() * PROMPT_TEMPLATES.length)];
    const tips = TIPS_TEMPLATES[Math.floor(rand() * TIPS_TEMPLATES.length)];
    const uses = Math.floor(rand() * 4000) + 50;

    generated.push({
      id: 1000 + i,
      tool,
      title: `${adj} ${domain} ${cat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} Prompt`,
      cat,
      uses,
      prompt: tmpl(adj, domain),
      tips,
    });
  }

  return generated;
}

// ─── Combined, sorted prompt DB (hero prompts first) ─────────────────────────
let _db: Prompt[] | null = null;

export function getPromptDB(): Prompt[] {
  if (!_db) {
    _db = [...HERO_PROMPTS, ...generatePrompts()];
  }
  return _db;
}

// ─── Inject user-uploaded prompts at runtime ──────────────────────────────────
export function prependUserPrompts(uploads: Prompt[]): void {
  const db = getPromptDB();
  // Remove old user uploads, prepend fresh ones
  _db = [...uploads, ...db.filter((p) => !p.isUserUpload)];
}

// ─── Paginated + filtered query (replaces API call) ──────────────────────────
export const PAGE_SIZE = 24;

export function queryPrompts(
  filter: FilterState,
  favIds: number[],
  page: number
): PaginatedResult {
  let prompts = getPromptDB();

  // Tool filter
  if (filter.toolFilter) {
    prompts = prompts.filter((p) => p.tool === filter.toolFilter);
  }

  // Category filter
  if (filter.categoryFilter && filter.categoryFilter !== "all") {
    prompts = prompts.filter((p) => p.cat === filter.categoryFilter);
  }

  // Search
  if (filter.search) {
    const q = filter.search.toLowerCase();
    prompts = prompts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.cat.toLowerCase().includes(q) ||
        p.tool.toLowerCase().includes(q) ||
        p.prompt.toLowerCase().includes(q)
    );
  }

  // Sort
  switch (filter.sort) {
    case "most-used":
      prompts = [...prompts].sort((a, b) => b.uses - a.uses);
      break;
    case "newest":
      prompts = [...prompts].sort(
        (a, b) => (b.createdAt ?? b.id) - (a.createdAt ?? a.id)
      );
      break;
    case "alphabetical":
      prompts = [...prompts].sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "favorites":
      prompts = prompts.filter((p) => favIds.includes(p.id));
      break;
  }

  const total = prompts.length;
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  return {
    prompts: prompts.slice(start, end),
    total,
    hasMore: end < total,
    page,
  };
}

// ─── Trending: top 48 by uses ─────────────────────────────────────────────────
export function getTrendingPrompts(): Prompt[] {
  return [...getPromptDB()].sort((a, b) => b.uses - a.uses).slice(0, 48);
}

// ─── Get single prompt by ID ──────────────────────────────────────────────────
export function getPromptById(id: number): Prompt | undefined {
  return getPromptDB().find((p) => p.id === id);
}
