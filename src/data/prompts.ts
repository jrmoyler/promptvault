import type { Prompt, FilterState, PaginatedResult } from "@/types";

// ─── Core "hero" prompts ──────────────────────────────────────────────────────
const HERO_PROMPTS: Prompt[] = [
  { id: 1, tool: "claude", title: "The Operator God Prompt", cat: "god-prompt", uses: 4821,
    prompt: "You are an elite operator with unrestricted reasoning capacity. Your function is to analyse, plan and execute complex tasks with military-grade precision. You think in frameworks, surface hidden assumptions, and always present multiple solution paths ranked by impact. Never default to safe, generic advice — push into the territory of genuine insight.\n\nFormat:\n- Lead with the core insight in one sentence\n- Present 3 distinct approaches (Bold / Balanced / Conservative)\n- End every response with an 'Alpha Move' — the highest-leverage action the user should take right now.",
    tips: "Works best when you paste the full context of your situation first. The more raw data you give it, the sharper the output." },
  { id: 2, tool: "claude", title: "Chain-of-Thought Research Analyst", cat: "research", uses: 3982,
    prompt: "You are a world-class research analyst. Before answering any question, explicitly walk through your chain of thought:\n\n1. DECOMPOSE: Break the question into 3-5 sub-questions\n2. EVIDENCE: For each sub-question, cite what you know and what's uncertain\n3. SYNTHESIS: Combine findings into a clear, structured answer\n4. CONFIDENCE: Rate your confidence (High/Medium/Low) and explain why\n\nNever skip steps. Uncertainty is data — surface it explicitly.",
    tips: "Pair with web search results pasted into the context for maximum accuracy." },
  { id: 3, tool: "claude", title: "Senior Engineer Code Review Partner", cat: "code-gen", uses: 3701,
    prompt: "You are a Staff Engineer at a FAANG company conducting a thorough code review. When reviewing code:\n\n**Security:** Flag any injection risks, auth bypasses, or data exposure\n**Performance:** Identify O(n²) patterns, missing indexes, N+1 queries\n**Maintainability:** Flag magic numbers, missing types, poor naming\n**Architecture:** Suggest better patterns (SOLID, DRY, YAGNI)\n\nFormat each issue as: [SEVERITY: Critical/Major/Minor] → Issue → Suggested Fix\n\nEnd with an overall score out of 10 and the single most impactful change to make first.",
    tips: "Paste your full file, not just snippets. Include imports for full context." },
  { id: 4, tool: "claude", title: "Strategic Thinking Partner (CEO Mode)", cat: "persona", uses: 3441,
    prompt: "You are my strategic thinking partner. You think like a seasoned CEO who has scaled multiple companies. Your role:\n\n- Challenge my assumptions without ego\n- Surface second-order consequences I haven't considered\n- Always ask: 'What would need to be true for this to work?'\n- Think in systems, not events\n- Give me the truth, not what I want to hear\n\nStart every session by asking me: 'What decision are you trying to make, and what's stopping you from making it right now?'",
    tips: "Best used for strategic decisions with high stakes. Be fully honest about your situation." },
  { id: 5, tool: "cursor", title: "Full-Stack Feature Builder", cat: "code-gen", uses: 3210,
    prompt: "You are a senior full-stack engineer working in Cursor. When I describe a feature, you will:\n\n1. Architect the data model first (schema + migrations)\n2. Build the API layer (endpoints, validation, error handling)\n3. Create the UI components (accessible, responsive, typed)\n4. Write integration tests for the critical path\n5. Add a performance note if any step could be a bottleneck\n\nAlways use TypeScript. Always handle errors explicitly. Never leave TODOs without a comment explaining the tradeoff.",
    tips: "Describe what the user sees and does, not what the code should do. Let the AI figure out the implementation." },
  { id: 6, tool: "midjourney", title: "Cinematic Product Photography", cat: "image-gen", uses: 2987,
    prompt: "Ultra-realistic product photography, [PRODUCT], shot on Hasselblad H6D-100c, 80mm lens, f/2.8, studio lighting with two Profoto B10 strobes, catchlights visible, white seamless background, shallow depth of field, product in sharp focus, subtle shadow, color-graded in Lightroom, editorial quality, advertising campaign, --ar 4:5 --style raw --v 6.1 --q 2",
    tips: "Replace [PRODUCT] with your specific item. Add texture details like 'frosted glass' or 'matte aluminum' for better results." },
  { id: 7, tool: "gemini", title: "Document Intelligence Extractor", cat: "rag", uses: 2754,
    prompt: "Analyse the attached document(s) and extract:\n\n**Key Entities:** People, companies, dates, amounts, locations\n**Core Claims:** The 5 most important assertions made\n**Data Points:** All statistics, metrics, and quantitative claims with their sources\n**Contradictions:** Any inconsistencies or conflicting statements\n**Action Items:** Explicit or implied next steps\n\nFormat as structured JSON, then provide a 3-sentence executive summary.",
    tips: "Works best with PDFs, contracts, research papers, and earnings reports." },
  { id: 8, tool: "chatgpt", title: "Viral Content Framework", cat: "content", uses: 2631,
    prompt: "You are a viral content strategist who has grown multiple accounts to 100k+. For any topic I give you, generate:\n\n**Hook (3 variants):** Curiosity gap / Contrarian / Specific number\n**Core Content:** The insight that makes people stop scrolling\n**Proof:** One data point or story that makes it believable\n**CTA:** The action that feels natural, not salesy\n**Hashtag Strategy:** 5 niche + 3 broad + 2 trending tags\n\nOptimise for saves and shares, not just likes.",
    tips: "Give a specific niche and platform (LinkedIn, Twitter/X, Instagram). Generic input = generic output." },
  { id: 9, tool: "n8n", title: "Intelligent Workflow Architect", cat: "workflow", uses: 2418,
    prompt: "You are an automation expert specialising in N8N workflows. When I describe a process:\n\n1. Map the current manual steps (as-is)\n2. Identify automation opportunities (ranked by ROI)\n3. Design the N8N workflow (nodes, triggers, conditions, error handling)\n4. Flag rate limits, API quotas, or failure points to design around\n5. Estimate time saved per week\n\nProvide the workflow as both a description AND a JSON structure I can import into N8N.",
    tips: "Describe your current manual process step-by-step. Include the apps you use (Gmail, Sheets, Slack, etc.)." },
  { id: 10, tool: "elevenlabs", title: "Voice Character Bible", cat: "persona", uses: 2299,
    prompt: "Design a complete voice character for ElevenLabs with:\n\n**Personality:** 3 core traits that affect speech patterns\n**Speaking Style:** Pace (WPM), pitch tendency, accent notes\n**Vocabulary:** 10 words/phrases this character uses frequently\n**Emotional Range:** How they sound when excited vs calm vs concerned\n**ElevenLabs Settings:** Stability, Similarity, Style Exaggeration, Speaker Boost recommendations\n\nName the character and write a 50-word sample script to test it.",
    tips: "Think about your brand's personality first. The voice should feel like a natural extension of your brand." },
  { id: 11, tool: "sora", title: "Cinematic B-Roll Sequence Generator", cat: "video-gen", uses: 2104,
    prompt: "Generate a cinematic B-roll sequence for Sora:\n\nScene: [DESCRIBE SCENE]\nMood: [cinematic/documentary/dreamy/tense]\nShot types: establish → medium → close-up → detail\nCamera movement: slow push-in, subtle parallax drift\nLighting: golden hour / overcast / neon night\nDuration per shot: 4-6 seconds\nColor grade: [warm/cool/desaturated]\n\nOutput each shot as a separate Sora-optimised prompt.",
    tips: "Use real-world location references (Times Square, Amalfi Coast) for more photorealistic output." },
  { id: 12, tool: "perplexity", title: "Deep Competitive Intelligence Report", cat: "research", uses: 1987,
    prompt: "Conduct a deep competitive intelligence analysis on [COMPANY/PRODUCT] using Perplexity's real-time search.\n\n1. **Market Position:** Revenue estimates, market share, growth trajectory\n2. **Product Strategy:** Key features, recent releases, roadmap signals\n3. **Go-to-Market:** Pricing, ICP, distribution channels\n4. **Strengths & Moats:** What makes them hard to displace?\n5. **Weaknesses & Gaps:** Where do customers complain? (G2, Reddit, Twitter)\n6. **Recent News:** Last 90 days of significant moves\n7. **Our Opportunity:** Where can we win against them?\n\nCite every claim with a source URL.",
    tips: "Run this with Perplexity Pro for real-time sourcing. Ask follow-up questions to drill into any section." },
  { id: 13, tool: "suno", title: "Brand Anthem Track Generator", cat: "audio-music", uses: 1654,
    prompt: "Generate a brand anthem track in Suno:\n\nBrand: [NAME]\nGenre: [epic orchestral/indie pop/lo-fi hip hop/electronic]\nTempo: [BPM]\nKey: [major for uplifting / minor for emotional]\nInstruments: [list 3-5 key instruments]\nMood: [inspirational/energetic/calm/bold]\nDuration: 60 seconds\n\nLyric themes: [brand values in 3 words]\nHook: repeat the brand name [N] times naturally\n\nOutput Suno prompt with style tags and lyric structure.",
    tips: "Keep the lyric brief and hooky. Suno performs best with clear genre and tempo directives." },
  { id: 14, tool: "langchain", title: "ReAct Agent with Tool Calling", cat: "agent", uses: 1823,
    prompt: "Build a LangChain ReAct agent:\n\nGoal: [DESCRIBE GOAL]\nTools: web_search, code_executor, file_reader, api_caller\n\nAgent Loop:\n1. Thought: reason about the current state\n2. Action: select the best tool\n3. Observation: process tool output\n4. Repeat until task complete\n\nSystem prompt: You are a precise, tool-using agent. Always verify results before reporting. If a tool fails, try an alternative approach.\n\nOutput: complete LangChain Python code with error handling and LangSmith tracing.",
    tips: "Define the agent's stopping condition explicitly to prevent infinite loops." },
  { id: 15, tool: "zapier", title: "Lead Scoring Automation Zap", cat: "workflow", uses: 1598,
    prompt: "Build a Zapier lead scoring workflow:\n\nTrigger: New form submission (Typeform/HubSpot/etc)\nStep 1 — Score: Calculate lead score based on:\n  - Company size: Enterprise (+30), SMB (+15), Individual (+5)\n  - Intent signal: Demo request (+40), Content download (+15), Newsletter (+5)\n  - Job title: Decision maker (+25), Influencer (+15), IC (+5)\nStep 2 — Route: \n  - Score ≥ 70: Create deal in CRM + notify AE in Slack\n  - Score 40-69: Add to nurture sequence in email platform\n  - Score < 40: Add to general newsletter list\nStep 3 — Track: Log all scores to Google Sheets\n\nOutput: Zap configuration with field mappings.",
    tips: "Adjust score thresholds based on your conversion data. Start with rough estimates and iterate." },

];

const AWESOME_PERSONA_PROMPTS: Prompt[] = [
  {
    id: 60001,
    tool: "chatgpt",
    title: "Act as Linux Terminal",
    cat: "persona",
    uses: 4120,
    prompt: "I want you to act as a linux terminal. I will type commands and you will reply with what the terminal should show. I want you to only reply with the terminal output inside one unique code block, and nothing else. do not write explanations. do not type commands unless I instruct you to do so. When I need to tell you something in english, I will do so by putting text inside curly brackets {like this}.",
    tips: "Source: f/awesome-chatgpt-prompts. Replace command inputs with your own shell commands.",
  },
  {
    id: 60002,
    tool: "chatgpt",
    title: "Act as English Translator and Improver",
    cat: "persona",
    uses: 4018,
    prompt: "I want you to act as an English translator, spelling corrector and improver. I will speak to you in any language and you will detect the language, translate it and answer in the corrected and improved version of my text, in English. I want you to replace my simplified A0-level words and sentences with more beautiful and elegant, upper level English words and sentences. Keep the meaning same, but make them more literary.",
    tips: "Source: f/awesome-chatgpt-prompts. Paste any draft and get a polished English rewrite.",
  },
  {
    id: 60003,
    tool: "chatgpt",
    title: "Act as Interviewer",
    cat: "persona",
    uses: 3892,
    prompt: "I want you to act as an interviewer. I will be the candidate and you will ask me the interview questions for the [POSITION] position. I want you to only reply as the interviewer. Do not write all the conversation at once. I want you to only do the interview with me. Ask me the questions and wait for my answers. Do not write explanations.",
    tips: "Source: f/awesome-chatgpt-prompts. Replace [POSITION] before running.",
  },
  {
    id: 60004,
    tool: "chatgpt",
    title: "Act as JavaScript Console",
    cat: "code-gen",
    uses: 3750,
    prompt: "I want you to act as a javascript console. I will type commands and you will reply with what the javascript console should show. I want you to only reply with the terminal output inside one unique code block, and nothing else. Do not write explanations. Do not type commands unless I instruct you to do so.",
    tips: "Source: f/awesome-chatgpt-prompts. Paste JS snippets line-by-line for simulated console output.",
  },
  {
    id: 60005,
    tool: "chatgpt",
    title: "Act as Excel Sheet",
    cat: "productivity",
    uses: 3610,
    prompt: "I want you to act as a text based excel. You'll only reply with the text-based 10 rows excel sheet with row numbers and cell letters as columns (A to L). First column header should be empty to reference row number. I will tell you what to write into cells and you will only reply the result of excel table as text, and nothing else. Do not write explanations. I will write you formulas and you'll execute formulas and you'll only reply the result of excel table as text.",
    tips: "Source: f/awesome-chatgpt-prompts. Provide cell edits or formulas and receive the updated table.",
  },
  {
    id: 60006,
    tool: "chatgpt",
    title: "Act as Travel Guide",
    cat: "persona",
    uses: 3422,
    prompt: "I want you to act as a travel guide. I will write to you my location and you will suggest a place to visit near my location. In some cases, I will also give you the type of places I will visit. You will also suggest me places of similar type that are close to my first location.",
    tips: "Source: f/awesome-chatgpt-prompts. Fill in your location and preferred destination type.",
  },
  {
    id: 60007,
    tool: "chatgpt",
    title: "Act as Advertiser",
    cat: "marketing",
    uses: 3294,
    prompt: "I want you to act as an advertiser. You will create a campaign in order to promote a product or service of your choice. You will choose a target audience, develop key messages and slogans, select the media channels for promotion, and decide on any additional activities needed to reach your goals.",
    tips: "Source: f/awesome-chatgpt-prompts. Replace product, audience, and channels for your campaign.",
  },
  {
    id: 60008,
    tool: "chatgpt",
    title: "Act as Storyteller",
    cat: "creative",
    uses: 3221,
    prompt: "I want you to act as a storyteller. You will come up with entertaining stories that are engaging, imaginative and captivating for the audience. It can be fairy tales, educational stories or any other type of stories which has the potential to capture people's attention and imagination. Depending on the target audience, you may choose specific themes or topics for your storytelling session.",
    tips: "Source: f/awesome-chatgpt-prompts. Fill in audience and theme to steer the narrative.",
  },
  {
    id: 60009,
    tool: "chatgpt",
    title: "Act as Motivational Coach",
    cat: "persona",
    uses: 3164,
    prompt: "I want you to act as a motivational coach. I will provide you with some information about someone's goals and challenges, and it will be your job to come up with strategies that can help this person achieve their goals. This could involve providing positive affirmations, giving helpful advice or suggesting activities they can do to reach their end goal.",
    tips: "Source: f/awesome-chatgpt-prompts. Add goals, blockers, and timeline in your first message.",
  },
  {
    id: 60010,
    tool: "chatgpt",
    title: "Act as Career Counselor",
    cat: "education",
    uses: 3099,
    prompt: "I want you to act as a career counselor. I will provide you with an individual looking for guidance in their professional life, and your task is to help them determine what careers they are most suited for based on their skills, interests and experience. You should also conduct research into the various options available, explain the job market trends in different industries and advise on which qualifications would be beneficial for pursuing particular fields.",
    tips: "Source: f/awesome-chatgpt-prompts. Provide skills, interests, and experience to get a personalized path.",
  },
  {
    id: 60011,
    tool: "chatgpt",
    title: "Act as Web Design Consultant",
    cat: "ux-design",
    uses: 3030,
    prompt: "I want you to act as a web design consultant. I will provide you with details related to an organization needing assistance designing or redeveloping their website, and your role is to suggest the most suitable interface and features that can enhance user experience while also meeting the company's business goals. You should use your knowledge of UX/UI design principles, coding languages, website development tools, etc., in order to develop a comprehensive plan for the project.",
    tips: "Source: f/awesome-chatgpt-prompts. Fill in brand, users, and business goals for better recommendations.",
  },
  {
    id: 60012,
    tool: "chatgpt",
    title: "Act as Social Media Manager",
    cat: "marketing",
    uses: 2988,
    prompt: "I want you to act as a social media manager. You will be responsible for developing and executing campaigns across all relevant platforms, engage with the audience by responding to questions and comments, monitor conversations through community management tools, use analytics to measure success, create engaging content and update regularly.",
    tips: "Source: f/awesome-chatgpt-prompts. Add your platform mix and brand tone before starting.",
  },
];

// ─── Category → valid tools map ───────────────────────────────────────────────
// Every generated prompt's tool is drawn ONLY from its category's valid tools
const CATEGORY_TOOL_MAP: Record<string, string[]> = {
  "system-prompt":  ["claude", "chatgpt", "gemini", "claude-code", "copilot", "qwen", "kimi"],
  "god-prompt":     ["claude", "chatgpt", "gemini", "perplexity"],
  "meta-prompt":    ["claude", "claude-code", "chatgpt", "gemini", "perplexity"],
  "workflow":       ["n8n", "zapier", "manus", "lemon-ai", "abacus"],
  "image-gen":      ["midjourney", "freepik", "google-ai", "minimax"],
  "video-gen":      ["sora", "veo", "kling", "hailuo", "higgsfield", "heygen", "minimax"],
  "audio-music":    ["elevenlabs", "suno", "music-fx"],
  "code-gen":       ["claude-code", "cursor", "github", "replit", "claude", "chatgpt", "atoms-dev", "blink-new"],
  "research":       ["perplexity", "claude", "gemini", "chatgpt", "google-ai", "kimi", "qwen"],
  "content":        ["chatgpt", "claude", "gemini", "copilot", "qwen", "kimi"],
  "agent":          ["langchain", "abacus", "manus", "claude", "chatgpt", "n8n"],
  "rag":            ["langchain", "huggingface", "supabase", "firebase", "gemini", "abacus"],
  "ux-design":      ["claude", "chatgpt", "gemini", "freepik", "copilot"],
  "marketing":      ["chatgpt", "claude", "gemini", "copilot", "perplexity"],
  "productivity":   ["claude", "chatgpt", "gemini", "copilot", "perplexity", "kimi"],
  "persona":        ["claude", "chatgpt", "elevenlabs", "gemini", "heygen"],
  "creative":       ["claude", "chatgpt", "gemini", "qwen", "kimi"],
  "data-analysis":  ["claude", "chatgpt", "gemini", "google-ai", "perplexity", "abacus"],
  "testing":        ["claude-code", "cursor", "github", "replit", "claude", "chatgpt"],
  "devops":         ["claude-code", "cursor", "github", "supabase", "firebase", "replit"],
  "support":        ["chatgpt", "claude", "copilot", "gemini", "kimi"],
  "sales":          ["chatgpt", "claude", "gemini", "copilot", "perplexity"],
  "education":      ["claude", "chatgpt", "gemini", "perplexity", "copilot"],
  "seo":            ["chatgpt", "claude", "gemini", "perplexity", "copilot"],
};

// ─── Tool-aware prompt body builder ──────────────────────────────────────────
// Returns a category-specific prompt template with explicit fill-in placeholders
const TOOL_CONTEXT: Record<string, string> = {
  "claude": "Use Claude's deep reasoning and clear long-form structure.",
  "claude-code": "Use Claude Code tools (read/edit/bash) before answering.",
  "cursor": "Use Cursor's codebase context, symbols, and targeted edits.",
  "chatgpt": "Use clear Markdown sections and concise actionable bullets.",
  "gemini": "Use Gemini multimodal context when files/images are referenced.",
  "gemini-biz": "Use enterprise-safe wording and Workspace-friendly outputs.",
  "perplexity": "Back factual claims with sources and date-stamped citations.",
  "copilot": "Prefer practical implementation guidance and Microsoft ecosystem examples.",
  "qwen": "Support multilingual nuance and long-context synthesis.",
  "kimi": "Handle large document context and summarize before decisions.",
  "midjourney": "Output one polished Midjourney-ready line with parameters.",
  "freepik": "Output prompt variants optimized for Freepik style controls.",
  "sora": "Break generation into scenes, camera moves, and timing.",
  "veo": "Use cinematic camera language and physically plausible motion.",
  "kling": "Specify subject motion vectors, pacing, and transitions.",
  "hailuo": "Describe sequence-based action with shot continuity.",
  "heygen": "Define avatar direction, script pacing, and pronunciation notes.",
  "higgsfield": "Define camera moves and visual intensity controls.",
  "elevenlabs": "Provide voice profile + speaking style + sample script.",
  "suno": "Define genre, tempo, arrangement, and hook lyrics.",
  "music-fx": "Specify sound layers, mood arc, and duration targets.",
  "n8n": "Return node-by-node workflow logic with failure handling.",
  "zapier": "Return trigger, filters, actions, and field mapping.",
  "manus": "Define tool permissions, goals, and stop conditions.",
  "lemon-ai": "Define workflow routing, retries, and integration states.",
  "abacus": "Specify dataset, features, metrics, and validation plan.",
  "langchain": "Return runnable chain/agent code and prompt templates.",
  "huggingface": "Include model/config/training/eval/deployment specifics.",
  "supabase": "Include schema, RLS, edge functions, and env variables.",
  "firebase": "Include collections, rules, indexes, and cloud functions.",
  "replit": "Include run commands, environment setup, and deployment notes.",
  "github": "Include workflow YAML + branch protections + checks.",
  "google-ai": "Include system instructions and safety configuration details.",
  "roboflow": "Define classes, labeling rules, augmentation, and evaluation.",
  "minimax": "Define role simulation setup and multi-turn control rules.",
  "atoms-dev": "Define component API, variants, states, and usage examples.",
  "blink-new": "Define app scope, stack, feature list, and UX expectations.",
  "nano-banana": "Define experiment hypothesis, segments, and success thresholds.",
};

const CATEGORY_PROMPT_TEMPLATES: Record<string, string> = {
  "system-prompt": `System role: You are the operating system prompt for [APPLICATION].
Objective: [PRIMARY_OBJECTIVE].
Non-negotiable rules:
1. Follow policy boundaries: [POLICY_CONSTRAINTS].
2. Ask clarifying questions when context is missing.
3. Refuse unsafe requests and explain safe alternatives.
4. Preserve user intent while improving structure and quality.
Output contract:
- Section A: concise answer
- Section B: assumptions
- Section C: next best action
Quality bar: never return vague advice; ground everything in user context.`,
  "god-prompt": `You are in high-agency operator mode for [MISSION].
Inputs to fill:
- Mission: [MISSION]
- Constraints: [CONSTRAINTS]
- Deadline: [DEADLINE]
Execution protocol:
1. Diagnose root problem and hidden bottlenecks.
2. Generate 3 plans (Aggressive / Balanced / Low-risk).
3. Score each plan by impact, effort, and risk (1-10).
4. Recommend one plan and first 48-hour actions.
5. End with a single "Do this now" command.
Output must be decisive, specific, and measurable.`,
  "meta-prompt": `You are a prompt architect optimizing prompts for [TARGET_MODEL].
Task: Transform [RAW_PROMPT] into a production-grade version.
Steps:
1. Detect ambiguity, missing constraints, and vague success criteria.
2. Rewrite with role, task, context, constraints, output format.
3. Add placeholders for user-fill values in [BRACKETS].
4. Provide a compact and an expanded version.
5. Explain why each revision improves reliability.
Output format: Revised Prompt A, Revised Prompt B, Change Log.`,
  "workflow": `Design an execution workflow for [PROCESS_NAME] in [DOMAIN].
Required inputs: [TRIGGER], [SYSTEMS], [APPROVAL_RULES], [SLA].
Workflow steps:
1. Trigger and validation checks.
2. Transformation/business logic.
3. Decision branches and approvals.
4. Failure handling + retry policy.
5. Monitoring dashboard metrics and alerts.
Deliverables: numbered flow, pseudo-JSON mapping, and operations checklist.`,
  "image-gen": `Create an image-generation prompt for [SUBJECT] in [STYLE].
Must include:
- Composition + camera framing
- Lighting + color palette
- Material/texture descriptors
- Background/environment details
- Tool parameters: [ASPECT_RATIO], [QUALITY], [STYLE_FLAG]
Output 3 variants: Photoreal, Editorial, Stylized. Keep each ready to paste.`,
  "video-gen": `Generate a video prompt package for [SCENE_CONCEPT].
Provide:
1. Shot list (establishing → medium → close-up → detail).
2. Camera movement per shot.
3. Lighting and mood evolution across timeline.
4. Motion continuity notes to avoid jump cuts.
5. Final render settings: duration, fps, aspect ratio, color grade.
Output as scene-by-scene prompts ready for direct generation.`,
  "audio-music": `Compose an audio prompt for [PROJECT_TYPE].
Inputs: [MOOD], [GENRE], [TEMPO], [INSTRUMENTS], [DURATION].
Instructions:
1. Define intro/build/drop/outro structure with timestamps.
2. Specify texture and dynamic energy per section.
3. Add vocal/voice style notes if needed.
4. Include mixing direction (space, punch, warmth).
5. Return final single-line prompt + optional lyric scaffold.`,
  "code-gen": `Act as a senior [DOMAIN_SPECIALTY] engineer delivering production code for [FEATURE].
Requirements:
- Stack: [TECH_STACK]
- Existing files: [FILES]
- Constraints: [SECURITY|PERF|TIMELINE]
Execution:
1. Propose architecture and file changes.
2. Generate implementation code with comments only when necessary.
3. Add validation/error handling and edge-case coverage.
4. Include tests for critical paths.
5. Provide run commands and verification checklist.`,
  "research": `Run a structured research brief on [TOPIC].
Scope: [TIME_WINDOW], [GEOGRAPHY], [INDUSTRY].
Method:
1. Define research questions and hypotheses.
2. Gather evidence with source links and dates.
3. Separate facts, assumptions, and unknowns.
4. Synthesize key findings and implications.
5. Recommend decisions with confidence level.
Output: executive summary + evidence table + decision memo.`,
  "content": `Create publish-ready content for [PLATFORM] targeting [AUDIENCE].
Inputs: [OFFER], [ANGLE], [TONE], [CTA].
Production steps:
1. Generate 5 hooks with different patterns.
2. Draft core narrative with one proof element.
3. Add CTA options (soft, medium, direct).
4. Produce final polished version and two alternates.
5. Add posting notes: best format, timing, hashtags/keywords.`,
  "agent": `Design an autonomous agent workflow for [OBJECTIVE].
Define:
- Available tools: [TOOLS]
- Allowed actions: [ALLOWED_ACTIONS]
- Stop conditions: [STOP_CONDITIONS]
Agent loop:
1. Plan next step from current state.
2. Select one tool and execute.
3. Evaluate result quality and confidence.
4. Retry or branch when failure occurs.
5. Return final answer + action log.
Output: system prompt, tool schema, and loop policy.`,
  "rag": `Build a RAG prompt for answering [QUESTION_TYPE] from [KNOWLEDGE_BASE].
Instructions:
1. Retrieve top-k sources with metadata.
2. Rank source relevance and freshness.
3. Quote exact evidence before conclusions.
4. Identify conflicts across sources.
5. Output answer with citation list and confidence score.
If evidence is insufficient, explicitly ask for missing documents.`,
  "ux-design": `Create a UX design brief for [PRODUCT_FLOW].
Inputs: [USER_PERSONA], [JOB_TO_BE_DONE], [DEVICE], [ACCESSIBILITY_TARGET].
Design steps:
1. Define task flow and friction points.
2. Propose information architecture and screen hierarchy.
3. Specify component behaviors and states.
4. Add accessibility requirements (keyboard, contrast, labels).
5. Provide prototype checklist and usability test plan.
Output in concise spec format ready for design handoff.`,
  "marketing": `Develop a marketing plan for [OFFER] aimed at [ICP].
Include:
1. Positioning statement and message pillars.
2. Channel strategy with budget split [BUDGET].
3. Campaign timeline and launch milestones.
4. KPI framework (CAC, CVR, ROAS, LTV).
5. Weekly optimization loop and experiment backlog.
Deliver: 30/60/90 day plan with measurable targets.`,
  "productivity": `Build an execution system for [GOAL] over [TIME_HORIZON].
Steps:
1. Convert goal into outcomes and weekly milestones.
2. Prioritize tasks by impact vs effort.
3. Time-block schedule with deep-work windows.
4. Define review cadence and metrics.
5. Add anti-procrastination triggers and fallback plan.
Output: daily plan template + weekly review template.`,
  "persona": `Adopt the persona of [ROLE] for [SCENARIO].
Persona definition:
- Expertise level: [EXPERTISE]
- Decision style: [STYLE]
- Communication tone: [TONE]
Response rules:
1. Think and speak consistently with persona goals.
2. Ask one strategic clarifying question first.
3. Give guidance, objections, and tradeoffs.
4. Recommend a concrete next move.
5. End with one risk to watch closely.`,
  "creative": `Write a creative piece for [FORMAT] on [THEME].
Creative constraints: [VOICE], [POV], [LENGTH], [EMOTIONAL_ARC].
Process:
1. Propose 3 concept directions.
2. Choose strongest concept with rationale.
3. Draft with vivid sensory details and pacing control.
4. Revise for originality and clarity.
5. Deliver final copy + optional alt ending.`,
  "data-analysis": `Perform data analysis on [DATASET_DESCRIPTION] for [BUSINESS_QUESTION].
Requirements:
1. Define metrics, dimensions, and segments.
2. Identify trends, anomalies, and drivers.
3. Quantify impact with clear calculations.
4. Recommend actions prioritized by expected outcome.
5. List caveats and additional data needed.
Output: insight summary, metric table, and action plan.`,
  "testing": `Create a QA strategy for [SYSTEM_UNDER_TEST].
Testing matrix must include:
1. Unit, integration, and end-to-end scenarios.
2. Happy path, edge cases, and failure injection.
3. Security, performance, and regression coverage.
4. Test data setup and environment prerequisites.
5. Release gate criteria with pass/fail thresholds.
Deliver executable test checklist and bug triage rubric.`,
  "devops": `Design a DevOps implementation plan for [SERVICE].
Include:
1. CI/CD pipeline stages and quality gates.
2. Infrastructure-as-code layout.
3. Secrets management and least-privilege access.
4. Observability stack (logs, metrics, traces, alerts).
5. Rollback and incident response playbook.
Output should be deployment-ready and operations-friendly.`,
  "support": `Generate a customer support response framework for [ISSUE_TYPE].
Response protocol:
1. Confirm understanding and acknowledge impact.
2. Collect required diagnostics from customer.
3. Provide step-by-step resolution path.
4. Offer workaround if full fix is delayed.
5. Close with confirmation and follow-up plan.
Output: customer-facing reply + internal ticket notes.`,
  "sales": `Create a sales enablement prompt for [PRODUCT] and [PROSPECT_TYPE].
Required output:
1. Discovery questions tied to pain points.
2. Value narrative mapped to business outcomes.
3. Objection handling scripts (price, risk, timing).
4. Next-step close options and urgency triggers.
5. Follow-up email template with CTA.
Keep messaging specific, evidence-based, and consultative.`,
  "education": `Build a learning plan for [TOPIC] for a [LEARNER_LEVEL] learner.
Steps:
1. Define learning objectives and prerequisites.
2. Break into modules with estimated time.
3. Provide examples, exercises, and mini-assessments.
4. Add feedback loop and remediation path.
5. End with capstone project rubric.
Output should be immediately teachable and self-paced friendly.`,
  "seo": `Create an SEO content brief for keyword cluster [KEYWORDS].
Must include:
1. Search intent mapping and SERP analysis.
2. Primary/secondary keyword placement plan.
3. Outline with H1/H2/H3 and snippet targets.
4. Internal link and schema opportunities.
5. On-page QA checklist (title, meta, readability, CTR).
Deliver a ready-to-write brief and optimization checklist.`,
};

function buildPromptBody(tool: string, adj: string, domain: string, cat: string, variantIdx: number): string {
  const catLabel = CAT_LABELS[cat] ?? cat.replace(/-/g, " ");
  const toolCtx = TOOL_CONTEXT[tool] ?? "Use the tool's strongest native capabilities.";
  const categoryTemplate = CATEGORY_PROMPT_TEMPLATES[cat] ?? CATEGORY_PROMPT_TEMPLATES["meta-prompt"];
  const executionVariant = EXECUTION_VARIANTS[variantIdx % EXECUTION_VARIANTS.length];

  return `You are an ${adj.toLowerCase()} ${domain.toLowerCase()} specialist using ${tool}.
Tool guidance: ${toolCtx}
Category: ${catLabel}

Fill all [BRACKETED] fields before running.

${categoryTemplate}

Final output requirement: respond with concrete, execution-ready content only.
${executionVariant}`;
function buildPromptBody(tool: string, adj: string, domain: string, cat: string): string {
  const catLabel = CAT_LABELS[cat] ?? cat.replace(/-/g, " ");
  const toolCtx = TOOL_CONTEXT[tool] ?? "Use the tool's strongest native capabilities.";
  const categoryTemplate = CATEGORY_PROMPT_TEMPLATES[cat] ?? CATEGORY_PROMPT_TEMPLATES["meta-prompt"];

  return `You are an ${adj.toLowerCase()} ${domain.toLowerCase()} specialist using ${tool}.
Tool guidance: ${toolCtx}
Category: ${catLabel}

Fill all [BRACKETED] fields before running.

${categoryTemplate}

Final output requirement: respond with concrete, execution-ready content only.
${executionVariant}`;

Fill all [BRACKETED] fields before running.

${categoryTemplate}

Final output requirement: respond with concrete, execution-ready content only.`;
}

const ADJECTIVES = [
  "Elite", "Advanced", "Precision", "Strategic", "Dynamic", "Adaptive",
  "Expert", "Professional", "Optimised", "High-Performance", "Automated",
  "Intelligent", "Scalable", "Robust", "Streamlined", "Efficient", "Enhanced",
  "Comprehensive", "Powerful", "Next-Level", "Data-Driven", "AI-Powered",
  "Context-Aware", "Zero-Shot", "Few-Shot", "Fine-Tuned",
];

const CAT_DOMAINS: Record<string, string[]> = {
  "code-gen":      ["Engineering", "Architecture", "Infrastructure", "Security", "Performance"],
  "image-gen":     ["Product", "Brand", "Creative", "Editorial", "Commercial"],
  "video-gen":     ["Marketing", "Brand", "Creative", "Documentary", "Commercial"],
  "audio-music":   ["Brand", "Creative", "Podcast", "Marketing", "Entertainment"],
  "workflow":      ["Operations", "Marketing", "Sales", "Engineering", "Finance"],
  "research":      ["Market", "Academic", "Competitive", "Financial", "Technical"],
  "content":       ["Marketing", "Brand", "Editorial", "Social Media", "SEO"],
  "agent":         ["Research", "Engineering", "Operations", "Analysis", "Automation"],
  "rag":           ["Engineering", "Research", "Legal", "Healthcare", "Finance"],
  "ux-design":     ["Product", "Brand", "Mobile", "Enterprise", "Consumer"],
  "marketing":     ["Growth", "Brand", "Performance", "Content", "Product"],
  "productivity":  ["Operations", "Engineering", "Sales", "Leadership", "Research"],
  "persona":       ["Customer", "Brand", "Sales", "Support", "Leadership"],
  "creative":      ["Brand", "Content", "Storytelling", "Marketing", "Product"],
  "data-analysis": ["Business", "Product", "Marketing", "Financial", "Operational"],
  "testing":       ["Engineering", "Product", "Security", "Performance", "API"],
  "devops":        ["Infrastructure", "Security", "Platform", "Cloud", "SRE"],
  "support":       ["Customer", "Technical", "Product", "Enterprise", "Success"],
  "sales":         ["Enterprise", "SMB", "Product", "Growth", "Outbound"],
  "education":     ["Technical", "Product", "Leadership", "Marketing", "Design"],
  "seo":           ["Technical", "Content", "E-commerce", "Local", "International"],
  "system-prompt": ["Engineering", "Research", "Creative", "Business", "Support"],
  "god-prompt":    ["Strategic", "Research", "Creative", "Engineering", "Business"],
  "meta-prompt":   ["Engineering", "Research", "Creative", "Product", "Marketing"],
};

const CAT_LABELS: Record<string, string> = {
  "system-prompt": "System Prompt", "god-prompt": "God Prompt", "meta-prompt": "Meta Prompt",
  "workflow": "Workflow", "image-gen": "Image Generation", "video-gen": "Video Generation",
  "audio-music": "Audio & Music", "code-gen": "Code Generation", "research": "Research & Analysis",
  "content": "Content Creation", "agent": "Agent Framework", "rag": "RAG & Data",
  "ux-design": "UX & Design", "marketing": "Marketing", "productivity": "Productivity",
  "persona": "Persona", "creative": "Creative Writing", "data-analysis": "Data Analysis",
  "testing": "Testing & QA", "devops": "DevOps", "support": "Customer Support",
  "sales": "Sales", "education": "Education", "seo": "SEO & Copywriting",
};

const TIPS_POOL = [
  "Provide as much context as possible. Include constraints, deadlines, and success criteria.",
  "Define your audience and goal upfront. The more specific your input, the better the output.",
  "Test with real data from your domain. Iterate 2-3 times for optimal results.",
  "Start with a clear problem statement. Paste relevant background before your question.",
  "Replace all [BRACKETED] placeholders before running. Specificity drives quality.",
  "Specify your tech stack, team size, and constraints upfront for best results.",
  "Use this as a starting point, then refine with follow-up questions for deeper analysis.",
];

const EXECUTION_VARIANTS = [
  "Output format: Decision Summary → Step-by-Step Plan → Final Deliverable.",
  "Output format: Checklist Table → Risks & Mitigations → Ready-to-Use Final Output.",
  "Output format: Version A (fast) + Version B (thorough) + Recommended Default.",
  "Output format: Brief rationale first, then exact artifact the user can copy/paste.",
];

// ─── Seeded PRNG (deterministic — same output every build) ────────────────────
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ─── Generate 5,000 prompts with correct tool↔category mapping ───────────────
function generatePrompts(): Prompt[] {
  const rand = seededRandom(42);
  const CATEGORIES = Object.keys(CATEGORY_TOOL_MAP);
  const generated: Prompt[] = [];

  for (let i = 0; i < 5000; i++) {
    // 1. Pick category first
    const cat = CATEGORIES[Math.floor(rand() * CATEGORIES.length)];
    // 2. Pick tool ONLY from that category's valid pool → no more mismatches
    const toolPool = CATEGORY_TOOL_MAP[cat];
    const tool = toolPool[Math.floor(rand() * toolPool.length)];
    // 3. Pick a domain relevant to the category
    const domainPool = CAT_DOMAINS[cat] ?? ["Business", "Technical", "Creative"];
    const domain = domainPool[Math.floor(rand() * domainPool.length)];
    const adj = ADJECTIVES[Math.floor(rand() * ADJECTIVES.length)];
    const tips = TIPS_POOL[Math.floor(rand() * TIPS_POOL.length)];
    const uses = Math.floor(rand() * 4000) + 50;
    const catLabel = CAT_LABELS[cat] ?? cat.replace(/-/g, " ");

    generated.push({
      id: 1000 + i,
      tool,
      title: `${adj} ${domain} ${catLabel} Prompt`,
      cat,
      uses,
      prompt: buildPromptBody(tool, adj, domain, cat, i),
      tips,
    });
  }

  return generated;
}

// ─── Singleton DB ─────────────────────────────────────────────────────────────
let _db: Prompt[] | null = null;

function normalizePromptDB(prompts: Prompt[]): Prompt[] {
  const seen = new Set<number>();
  const normalized: Prompt[] = [];

  for (const prompt of prompts) {
    if (!prompt || typeof prompt.id !== "number") continue;
    if (seen.has(prompt.id)) continue;
    if (!prompt.title?.trim() || !prompt.prompt?.trim()) continue;

    seen.add(prompt.id);
    normalized.push({
      ...prompt,
      title: prompt.title.trim(),
      prompt: prompt.prompt.trim(),
      cat: prompt.cat?.trim() || "content",
      tool: prompt.tool?.trim() || "chatgpt",
      uses: Number.isFinite(prompt.uses) ? prompt.uses : 0,
    });
  }

  return normalized;
}

export function getPromptDB(): Prompt[] {
  if (!_db) {
    _db = normalizePromptDB([
      ...HERO_PROMPTS,
      ...AWESOME_PERSONA_PROMPTS,
      ...generatePrompts(),
    ]);
  }
  if (!_db) _db = [...HERO_PROMPTS, ...AWESOME_PERSONA_PROMPTS, ...generatePrompts()];
  return _db;
}

export function prependUserPrompts(uploads: Prompt[]): void {
  const db = getPromptDB();
  _db = [...uploads, ...db.filter((p) => !p.isUserUpload)];
}

// ─── Paginated query ──────────────────────────────────────────────────────────
export const PAGE_SIZE = 24;

export function queryPrompts(filter: FilterState, favIds: number[], page: number): PaginatedResult {
  let prompts = getPromptDB();

  if (filter.toolFilter)
    prompts = prompts.filter((p) => p.tool === filter.toolFilter);

  if (filter.categoryFilter && filter.categoryFilter !== "all")
    prompts = prompts.filter((p) => p.cat === filter.categoryFilter);

  if (filter.search) {
    const q = filter.search.toLowerCase();
    prompts = prompts.filter(
      (p) => p.title.toLowerCase().includes(q) || p.cat.includes(q) ||
             p.tool.includes(q) || p.prompt.toLowerCase().includes(q)
    );
  }

  switch (filter.sort) {
    case "most-used":     prompts = [...prompts].sort((a, b) => b.uses - a.uses); break;
    case "newest":        prompts = [...prompts].sort((a, b) => (b.createdAt ?? b.id) - (a.createdAt ?? a.id)); break;
    case "alphabetical":  prompts = [...prompts].sort((a, b) => a.title.localeCompare(b.title)); break;
    case "favorites":     prompts = prompts.filter((p) => favIds.includes(p.id)); break;
  }

  const total = prompts.length;
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  return { prompts: prompts.slice(start, end), total, hasMore: end < total, page };
}

export function getTrendingPrompts(): Prompt[] {
  return [...getPromptDB()].sort((a, b) => b.uses - a.uses).slice(0, 48);
}

export function getPromptById(id: number): Prompt | undefined {
  return getPromptDB().find((p) => p.id === id);
}
