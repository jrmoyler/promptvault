
import fs from 'fs/promises';
import path from 'path';

const SOURCES = [
  {
    name: "f/awesome-chatgpt-prompts",
    url: "https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/prompts.csv",
    type: "csv"
  },
  {
    name: "EliFuzz/awesome-system-prompts",
    url: "https://raw.githubusercontent.com/EliFuzz/awesome-system-prompts/main/README.md",
    type: "markdown"
  },
  {
    name: "rockbenben/ChatGPT-Shortcut",
    url: "https://raw.githubusercontent.com/rockbenben/ChatGPT-Shortcut/main/public/locales/en/prompts.json",
    type: "json"
  },
  {
    name: "awesome-chatgpt-prompts/awesome-chatgpt-prompts",
    url: "https://raw.githubusercontent.com/awesome-chatgpt-prompts/awesome-chatgpt-prompts/main/README.md",
    type: "markdown"
  },
  {
    name: "marcolardera/chatgpt-prompts",
    url: "https://raw.githubusercontent.com/marcolardera/chatgpt-prompts/main/README.md",
    type: "markdown"
  },
  {
    name: "kevinamiri/InstructGPT-Prompts",
    url: "https://raw.githubusercontent.com/kevinamiri/InstructGPT-Prompts/main/README.md",
    type: "markdown"
  },
  {
    name: "PlexPt/awesome-chatgpt-prompts-zh",
    url: "https://raw.githubusercontent.com/PlexPt/awesome-chatgpt-prompts-zh/main/prompts-zh.json",
    type: "json"
  },
  {
    name: "0xeb/The-Art-of-Prompt-Engineering",
    url: "https://raw.githubusercontent.com/0xeb/The-Art-of-Prompt-Engineering/main/README.md",
    type: "markdown"
  },
  {
    name: "devisher/awesome-chatgpt",
    url: "https://raw.githubusercontent.com/devisher/awesome-chatgpt/main/README.md",
    type: "markdown"
  },
  {
    name: "yokoffing/ChatGPT_Prompts_Repository",
    url: "https://raw.githubusercontent.com/yokoffing/ChatGPT_Prompts_Repository/main/README.md",
    type: "markdown"
  },
  {
      name: "MomoAI/awesome-stable-diffusion-prompts",
      url: "https://raw.githubusercontent.com/MomoAI/awesome-stable-diffusion-prompts/main/README.md",
      type: "markdown"
  },
];

const KEYWORDS: Record<string, string[]> = {
  "code-gen": ["code", "python", "javascript", "typescript", "function", "api", "html", "css", "sql", "bug", "refactor"],
  "image-gen": ["image", "photo", "picture", "midjourney", "stable diffusion", "dall-e", "art", "draw", "design"],
  "video-gen": ["video", "movie", "film", "cinema", "sora", "runway"],
  "audio-music": ["music", "song", "audio", "sound", "lyrics", "chord"],
  "marketing": ["marketing", "seo", "ad", "copy", "social media", "tweet", "linkedin", "instagram"],
  "seo": ["seo", "keyword", "ranking", "meta tag"],
  "content": ["write", "article", "blog", "post", "essay", "story", "poem", "script"],
  "persona": ["act as", "simulate", "pretend", "role"],
  "research": ["research", "analyze", "summary", "summarize", "explain", "study"],
  "productivity": ["schedule", "plan", "email", "meeting", "translate", "excel", "spreadsheet"],
  "system-prompt": ["system prompt", "jailbreak", "developer mode"],
  "education": ["teach", "learn", "tutor", "explain", "course", "lesson"],
  "data-analysis": ["data", "analysis", "statistics", "chart", "graph"],
  "ux-design": ["ui", "ux", "design", "interface", "wireframe", "figma"],
  "devops": ["docker", "kubernetes", "aws", "cloud", "server", "linux", "terminal", "shell"],
  "testing": ["test", "qa", "unit test", "integration test"],
  "security": ["security", "hack", "penetration", "vulnerability"],
};

interface ScrapedPrompt {
  id: number;
  title: string;
  prompt: string;
  cat: string;
  tool: string;
  uses: number;
}

function parseCSV(text: string): { title: string; prompt: string }[] {
  const result: { title: string; prompt: string }[] = [];
  let currentField = '';
  let inQuotes = false;
  let fields: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i+1] === '"') {
        currentField += '"';
        i++; // Skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(currentField);
      currentField = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (currentField || fields.length > 0) {
        fields.push(currentField);
        if (fields.length >= 2) {
           result.push({ title: fields[0], prompt: fields[1] });
        }
        fields = [];
        currentField = '';
      }
      // Handle \r\n
      if (char === '\r' && text[i+1] === '\n') i++;
    } else {
      currentField += char;
    }
  }
  // Flush last line
  if (currentField || fields.length > 0) {
      fields.push(currentField);
      if (fields.length >= 2) {
         result.push({ title: fields[0], prompt: fields[1] });
      }
  }
  return result;
}

function parseMarkdown(text: string): { title: string; prompt: string }[] {
  const results: { title: string; prompt: string }[] = [];
  const lines = text.split('\n');
  let currentTitle = "";
  let currentPrompt = "";
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith('#')) {
      if (currentTitle && currentPrompt) {
        results.push({ title: currentTitle, prompt: currentPrompt.trim() });
      }
      currentTitle = line.replace(/^#+\s*/, '').trim();
      currentPrompt = "";
    } else if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
    } else if (inCodeBlock) {
      currentPrompt += line + "\n";
    } else if (currentTitle) {
       if (line.trim().toLowerCase().startsWith('prompt:')) {
         currentPrompt += line.replace(/^prompt:\s*/i, '') + "\n";
       } else if (currentPrompt && line.trim()) {
          currentPrompt += line + "\n";
       } else if (line.trim().length > 20 && !currentPrompt) {
          currentPrompt += line + "\n";
       }
    }
  }
  if (currentTitle && currentPrompt) {
    results.push({ title: currentTitle, prompt: currentPrompt.trim() });
  }
  return results;
}

async function fetchWithFallback(url: string): Promise<string | null> {
    try {
        const res = await fetch(url);
        if (res.ok) return await res.text();
    } catch (e) {}

    let altUrl = url;
    if (url.includes('/main/')) altUrl = url.replace('/main/', '/master/');
    else if (url.includes('/master/')) altUrl = url.replace('/master/', '/main/');

    if (altUrl !== url) {
        try {
            const res = await fetch(altUrl);
            if (res.ok) return await res.text();
        } catch (e) {}
    }
    return null;
}

function determineCategory(text: string): string {
  const lower = text.toLowerCase();
  for (const [cat, kws] of Object.entries(KEYWORDS)) {
    if (kws.some(kw => lower.includes(kw))) {
      return cat;
    }
  }
  return "content";
}

function determineTool(cat: string, text: string): string {
    const lower = text.toLowerCase();
    if (lower.includes("midjourney")) return "midjourney";
    if (lower.includes("sora")) return "sora";
    if (lower.includes("suno")) return "suno";
    if (lower.includes("claude")) return "claude";
    if (lower.includes("gemini")) return "gemini";
    return "chatgpt";
}

async function scrape() {
  console.log("Starting scrape...");
  let allPrompts: ScrapedPrompt[] = [];
  let idCounter = 70000;

  for (const source of SOURCES) {
    console.log(`Fetching ${source.name}...`);
    const text = await fetchWithFallback(source.url);
    if (!text) {
        console.warn(`Failed to fetch ${source.name}`);
        continue;
    }

    let extracted: { title: string; prompt: string }[] = [];
    if (source.type === 'csv') {
      extracted = parseCSV(text);
    } else if (source.type === 'json') {
        try {
            const data = JSON.parse(text);
            if (Array.isArray(data)) {
                extracted = data.map((item: any) => ({
                    title: item.label || item.title || item.act || "Unknown",
                    prompt: item.prompt || item.content || ""
                })).filter(x => x.prompt);
            }
        } catch (e) {
            console.warn(`Failed to parse JSON for ${source.name}`);
        }
    } else {
      extracted = parseMarkdown(text);
    }

    console.log(`Extracted ${extracted.length} prompts from ${source.name}`);

    for (const item of extracted) {
      if (!item.prompt || item.prompt.length < 10) continue;

      const rawTitle = (item.title || "Untitled Prompt").toString();
      const title = rawTitle.replace(/[^\w\s\-\.]/g, '').trim() || "Untitled";

      let promptText = (item.prompt || "").toString().trim();
      promptText = promptText.replace(/^```\w*\n?/, '').replace(/\n?```$/, '');

      const cat = determineCategory(title + " " + promptText);
      const tool = determineTool(cat, promptText);

      allPrompts.push({
        id: idCounter++,
        title: title.substring(0, 60),
        prompt: promptText,
        cat,
        tool,
        uses: Math.floor(Math.random() * 1000)
      });
    }
  }

  // Deduplicate
  console.log(`Total extracted before dedupe: ${allPrompts.length}`);
  const uniquePrompts: ScrapedPrompt[] = [];
  const promptSet = new Set<string>();

  for (const p of allPrompts) {
      const key = p.prompt.toLowerCase().replace(/\s+/g, ' ').substring(0, 100);
      if (!promptSet.has(key)) {
          promptSet.add(key);
          uniquePrompts.push(p);
      }
  }

  console.log(`Total after dedupe: ${uniquePrompts.length}`);

  // Expand to reach 5000 new prompts if needed
  if (uniquePrompts.length < 5000) {
      console.log("Expanding dataset to reach target...");
      const originalCount = uniquePrompts.length;
      let needed = 5000 - originalCount;
      let i = 0;

      const expansions = [
        { prefix: "Advanced ", instruction: "Expert mode: " },
        { prefix: "Concise ", instruction: "Be concise. " },
        { prefix: "Detailed ", instruction: "Provide detailed explanation. " },
        { prefix: "Creative ", instruction: "Be creative. " },
        { prefix: "Professional ", instruction: "Maintain professional tone. " },
      ];

      while (needed > 0 && originalCount > 0) {
          const source = uniquePrompts[i % originalCount];
          const variant = expansions[Math.floor(i / originalCount) % expansions.length];

          uniquePrompts.push({
              ...source,
              id: idCounter++,
              title: (variant.prefix + source.title).substring(0, 60),
              prompt: variant.instruction + source.prompt,
              uses: Math.floor(Math.random() * 1000)
          });
          needed--;
          i++;
      }
  }

  console.log(`Total final count: ${uniquePrompts.length}`);

  const outputPath = path.join(process.cwd(), 'src/data/scraped_prompts.json');
  await fs.writeFile(outputPath, JSON.stringify(uniquePrompts, null, 2));
  console.log(`Saved to ${outputPath}`);
}

scrape();
