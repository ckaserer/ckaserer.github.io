---
name: write-blog-post
description: Drafts a new blog post for ckaserer.dev's /blog section (Astro Content Collections, src/content/blog/) in Clemens's own first-person voice, with a consistent structure, a length cap, and explicit highlighting of the one takeaway a reader should walk away with. Grounded in reader-communication research (see references/communication-research.md). Use when asked to write, draft, or outline a blog post, or to review an existing draft/post for structure, clarity, or length.
allowed-tools: Read Write Edit Bash(wc *) Bash(npm *) Bash(find *) Grep AskUserQuestion
metadata:
  owner: '@ckaserer'
---

# Write Blog Post

Every post should be recognizable as the same voice and shape — a reader who's read one post should know what to expect from the next. This skill exists so that consistency doesn't depend on remembering the rules each time.

Posts are real content — `/blog` is a live Astro Content Collection (see `docs/adr/2026-09-13-blog-in-same-repo-content-collections.md`), not a staging area. **Location:** `src/content/blog/<slug>.md`. **Schema:** `src/content.config.ts` — `title`, `description`, `pubDate`, `updatedDate?`, `tags` (array), `draft` (boolean, default `false`).

Not ready to publish yet? Set `draft: true` — the post renders in `npm run dev` but is excluded from the production build (`src/pages/blog/index.astro` filters on `!data.draft` when `import.meta.env.PROD`). That's the mechanism for a work-in-progress post; don't invent a separate drafts folder.

## Phase 1 — Before writing: find the one thing

Per McEnerney (University of Chicago Writing Program): writing is valuable to the *reader*, not just organized or clear. Establish three things before drafting — ask the user if any aren't already obvious from their prompt, don't guess:

1. **Who is this for, and what do they already know?** Sets the jargon floor — undefined jargon assumes the reader shares context they don't have (Pinker's "curse of knowledge").
2. **What's the one idea a reader should walk away with?** If there are three points, there's no point (Heath & Heath's "Simple" — the first of the *Made to Stick* principles).
3. **Why should the reader specifically care?** Not "why I wrote this" — what's in it for them.

## Phase 2 — Structure (same shape every time)

1. **Title** — concrete and specific, states the payoff. "Why I stopped self-hosting DNS" beats "Some thoughts on DNS." Compare the existing posts' titles for the house style.
2. **Lead (1–3 sentences)** — state the core takeaway immediately, don't wind up to it. Readers scan web content in an F-pattern and read at most ~20–28% of the words on a page (Nielsen Norman Group eye-tracking research) — if the point isn't in the first two lines, most readers never see it.
3. **Takeaway callout** — one bolded line or blockquote near the top, stating the single sentence a reader should remember even if they read nothing else. This is the direct answer to "what should I focus on." (The existing posts do this with a bolded **Do / Don't / Check** triplet per section — reuse that pattern when it fits, or a single bolded sentence otherwise.)
4. **Body** — short sections, each with a subheading that leads with the informative word, not "Introduction" or "Overview" — scanners fixate on the first word or two of a line (same NNG research). One idea per paragraph, 2–5 sentences max — smaller chunks reduce the load on a reader's limited working memory (Sweller's cognitive load theory).
5. **Sentence craft** — known/context information at the start of a sentence, the point you want emphasized at the end, where readers naturally place stress (Gopen & Swan, "The Science of Scientific Writing"). Active voice. First person throughout — this is Clemens's perspective, not a neutral summary: "I built", "I learned", never "one might conclude" or a passive construction that hides who did what.
6. **Closing (1–2 sentences)** — restate the Phase 2.3 takeaway in different words. No new information in the close.

## Phase 3 — Length cap

| Target | Word count (body, excl. frontmatter) | ~Reading time |
|---|---|---|
| Soft target | 600–900 words | 2.5–4 min |
| Hard ceiling | 1,200 words | ~5 min |

Grounded in Brysbaert's 2019 meta-analysis of 190 reading-speed studies (238 wpm average adult silent reading speed for non-fiction, *Journal of Memory and Language*) combined with the NNG scanning finding above, and calibrated to the two posts already published (~1,000–1,100 words each) — a post should be finishable, not skimmed-and-abandoned.

If a draft runs over 1,200 words: **cut a whole section, don't compress every sentence** — Zinsser's rule that "every word that serves no function... is the enemy of clear writing" applies at the paragraph level too. If the material genuinely needs more room, split it into a second post (the existing "Lessons Learned Facilitating GitHub Copilot Enablement Workshops" post frames itself as the first in a series for exactly this reason) — one idea per post is the same "Simple" principle from Phase 1, applied at the post level.

Check with:
```bash
wc -w src/content/blog/<slug>.md   # includes frontmatter; subtract ~30-60 words for it
```

**Do not target 1,500–3,000 words.** That range comes from SEO/content-marketing blog posts optimizing for search ranking, not from the reader-communication research this skill is built on — and it directly conflicts with the cap above. This is a personal blog, not a lead-gen site.

## Phase 4 — Polish checklist

Run before calling a draft done. Each item traces to a specific source, not a style preference:

- [ ] No paragraph longer than 5 sentences (Sweller — chunking)
- [ ] Every subheading's first word is the informative one (NNG scanning)
- [ ] No jargon without a first-use definition (Pinker — curse of knowledge)
- [ ] No filler — "in order to" → "to", "utilize" → "use", "the fact that" → cut. Read the draft aloud once; if you trip over a sentence, rewrite it (Zinsser's read-aloud test)
- [ ] First person throughout, active voice
- [ ] The takeaway callout and the closing line say the same thing in different words — a reader who reads only those two lines still gets the post
- [ ] Word count is within the Phase 3 cap

## Phase 5 — Frontmatter

Match `src/content.config.ts` exactly — extra fields aren't rejected by the schema but existing fields are what the layout and index page actually read:

```yaml
---
title: "..."
description: "..."          # 1-2 sentences; shown on /blog index under the title
pubDate: YYYY-MM-DD
tags: ["...", "..."]        # lowercase, matches existing tag style (see other posts)
draft: false                # true while work-in-progress; excluded from prod build
---
```

## Workflow

1. Phase 1 — clarify audience / one idea / reader payoff (ask if not already clear)
2. Draft to `src/content/blog/<slug>.md` following the Phase 2 structure and Phase 5 frontmatter; use `draft: true` if not ready to publish
3. Run the Phase 4 checklist and the Phase 3 word count
4. Validate: `npm run build:full` — the schema in `content.config.ts` will reject malformed frontmatter (wrong date format, missing required field) at build time
5. Read the whole draft back to the user (or have them read it aloud) before treating it as final; if `draft: false`, run `npm run dev` and check `/blog/<slug>` renders as expected
6. This skill does not open a PR automatically. If the user wants the post committed, use the `worktree-workflow` skill — normal branch/PR rules apply, same as any other change in this repo

## Hard rules

- Never invent facts, experiences, or opinions the user hasn't confirmed — this is Clemens's personal perspective, not generic marketing copy
- Never optimize toward SEO word-count targets — see Phase 3
- Don't add a call-to-action or sales pitch unless the user explicitly asks for one — the job of a personal post is the idea, not conversion
- Don't touch `content.config.ts`, `BlogPost.astro`, or the blog routes for a content-only post — a new post is just a new Markdown file; if the schema itself needs to change, that's a separate decision (see the `adr` skill)

## Why these rules

Full citations and links: `references/communication-research.md`.

| Rule | Source |
|---|---|
| Lead with the takeaway, use a callout | Nielsen Norman Group (F-pattern scanning); McEnerney (reader value) |
| One idea per post/paragraph | Heath & Heath, *Made to Stick* (Simple); Sweller (cognitive load) |
| Context-first, emphasis-last sentences | Gopen & Swan, "The Science of Scientific Writing" |
| Define jargon on first use | Pinker, *The Sense of Style* (curse of knowledge) |
| Cut clutter, read aloud | Zinsser, *On Writing Well* |
| 600–1,200 word cap | Brysbaert (2019 reading-rate meta-analysis) + NNG scanning data, calibrated to existing published posts |
| Plain, active, reader-first language | U.S. Federal Plain Language Guidelines |
