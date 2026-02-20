
import { getPromptDB } from "../src/data/prompts";
import type { Prompt } from "../src/types";

async function auditPrompts() {
  console.log("Starting Audit...");
  const db = getPromptDB();
  console.log(`Total prompts: ${db.length}`);

  let metaDescriptionCount = 0;
  let generativeMismatchCount = 0;
  let codeOnlyCount = 0;
  const violations: { id: number; title: string; prompt: string; issue: string }[] = [];

  const metaPatterns = [
    /\b(?:create|generate|write|craft)\b.{0,40}\bprompt\b/i,
    /^Use this prompt to/i,
    /^A prompt for/i,
    /^Here is a prompt/i,
  ];

  const generativeCategories = ["image-gen", "video-gen", "audio-music"];

  for (const p of db) {
    let issue = "";

    // Check 1: Meta-descriptions
    if (metaPatterns.some((pattern) => pattern.test(p.prompt))) {
      issue = "Contains meta-description";
      metaDescriptionCount++;
    }

    // Check 2: Generative Mismatch (starts with "Generate" but is for a generative tool)
    if (!issue && generativeCategories.includes(p.cat)) {
      // If it starts with "Generate" or similar instruction instead of being a description
      if (/^(?:generate|create|make|produce)\b/i.test(p.prompt)) {
         // Exception: "Generate a [something] image" might be okay for ChatGPT, but not for Midjourney.
         // But the user wants "Copy-Paste" ready prompts.
         // If I paste "Generate a cat image" into Midjourney, it might work if MJ V6 handles natural language,
         // but "A cat image" is better.
         // However, "Generate a video prompt package..." is definitely meta.
         issue = "Generative prompt starts with instruction";
         generativeMismatchCount++;
      }
    }

    // Check 3: Code comments only (heuristic: starts with // or # and short, or just code blocks without context?)
    // "Eliminate any cards that contain nothing but code-comments or meta-instructions."
    if (!issue) {
      const lines = p.prompt.split('\n');
      const isCodeComment = lines.every(line => line.trim().startsWith('//') || line.trim().startsWith('#'));
      if (isCodeComment) {
        issue = "Code comments only";
        codeOnlyCount++;
      }
    }

    if (issue) {
      violations.push({ id: p.id, title: p.title, prompt: p.prompt, issue });
    }
  }

  console.log("\n--- Audit Results ---");
  console.log(`Meta-description violations: ${metaDescriptionCount}`);
  console.log(`Generative mismatch violations: ${generativeMismatchCount}`);
  console.log(`Code-only violations: ${codeOnlyCount}`);
  console.log(`Total violations: ${violations.length}`);
  console.log(`Violation rate: ${((violations.length / db.length) * 100).toFixed(2)}%`);

  if (violations.length > 0) {
    console.log("\n--- Sample Violations ---");
    violations.slice(0, 5).forEach((v) => {
      console.log(`[${v.issue}] ID: ${v.id}, Title: ${v.title}`);
      console.log(`Prompt: ${v.prompt.substring(0, 100)}...`);
      console.log("-".repeat(20));
    });
  }
}

auditPrompts().catch(console.error);
