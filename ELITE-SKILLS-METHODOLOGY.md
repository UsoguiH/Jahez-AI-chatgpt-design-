# The Elite Methodology for Engineering Claude Skills

> A reverse-engineering of what separates a top-0.1% `SKILL.md` from the
> thousands of mediocre ones. This is not a tutorial. It assumes you already
> know what a Skill is. It documents the *mechanics*, *mental models*, and
> *advanced patterns* that production teams use to make skills that win.

---

## 0. The One Idea That Governs Everything

A Skill is **not a prompt**. A prompt is something Claude reads. A Skill is a
**conditional capability injection** — a unit of expertise that the model
*decides to load*, *under uncertainty*, *in competition with every other tool
and skill available*, and *while juggling the user's actual task*.

That means a Skill has **two distinct customers**, and 90% of skill authors only
write for one of them:

1. **The router** — the cheap, fast decision Claude makes about *whether this
   skill is even relevant right now*. It sees only your metadata.
2. **The executor** — Claude *after* it has committed to the skill, now trying
   to produce a correct artifact. It sees the body.

Elite skills are engineered for **both customers separately**, because they have
**opposite design constraints**:

| | Router (metadata) | Executor (body) |
|---|---|---|
| Goal | Maximize correct activation, minimize false activation | Maximize correct execution |
| Optimize for | Recall + precision of *triggering* | Fidelity + determinism of *output* |
| Failure mode | Skill never fires / fires when irrelevant | Skill fires but produces garbage |
| Currency | Trigger words & boundaries | Procedures, constraints, examples |
| Length pressure | Brutally short | Long but disciplined |

Internalize this split and you are already ahead of 99% of authors, who write
one undifferentiated blob and wonder why their skill "doesn't trigger" or
"triggers but ignores the instructions."

---

## 1. How Claude Actually Interprets a `SKILL.md` — The Internal Model

You cannot engineer a system you don't understand mechanically. Here is the
real loading model (progressive disclosure), and why each stage matters.

### Stage 1 — Metadata is *always resident*
At session start, Claude ingests **only the frontmatter** of every installed
skill — primarily `name` and `description`. This lives in the context window
*permanently*, competing for attention with the system prompt, tools, and the
conversation. **The body is not loaded.** Claude does not "know" what your skill
does beyond the description.

> Consequence: the `description` is not documentation. It is a **retrieval key
> and a routing contract.** It is the single highest-leverage string in the
> entire skill. If it's wrong, nothing downstream matters because the body is
> never read.

### Stage 2 — Activation loads the body
When Claude judges the description relevant to the live task, it loads the
`SKILL.md` body into context. This is a *commitment*: tokens are now spent, and
Claude will read the body as **authoritative instructions for how to proceed**.

> Consequence: the body is read in an "I have decided to do this" state, not an
> "is this relevant?" state. Stop re-justifying when to use the skill in the
> body — that decision is already made. Spend the body on *how*.

### Stage 3 — Bundled resources load on demand
Referenced files (scripts, templates, reference docs, schemas) are pulled in
*only when the body points Claude to them*, or executed without ever entering
context. This is the escape hatch for the context-window tax (Section 4).

### The interpretation bias you must exploit
Claude treats `SKILL.md` content with a **procedural, compliance-oriented**
bias — closer to how it treats a tool spec or a runbook than to how it treats
chat. Imperative, testable, ordered instructions are followed with high
fidelity. Vague aspirational prose ("write clean, idiomatic code") is treated as
soft flavor and silently dropped under load. **Specificity is obedience.**

---

## 2. The Optimal Architecture of an Elite `SKILL.md`

The canonical high-performance shape. Every section earns its place; each exists
to solve a *specific* failure mode.

```markdown
---
name: <kebab-case, literal, searchable>
description: <WHAT it does + WHEN to use it + trigger surface. 3rd person.>
---

# <Skill Title>

## Purpose / Outcome
One or two lines: the artifact or end-state this skill guarantees.

## When to use / When NOT to use
Explicit positive triggers and explicit negative boundaries.

## Core procedure
The deterministic, ordered workflow. The spine of the skill.

## Rules & constraints
Hard invariants. Non-negotiables. The "never/always" list.

## Reference / resources
Pointers to bundled files, schemas, scripts (progressive disclosure).

## Examples
Input → reasoning → output. Especially the hard/edge cases.
```

### The section hierarchy and *why each exists*

1. **Frontmatter (`name`, `description`)** — *Solves the routing problem.* The
   only thing the router sees. Engineered in Section 3.

2. **Purpose / Outcome** — *Solves goal drift.* Anchors Claude to the
   *end-state* so that when instructions underspecify a case, it can reason from
   the objective instead of hallucinating one. One sentence. Outcome, not
   activity ("produces a migration-safe SQL diff," not "helps with databases").

3. **When to use / When NOT to use** — *Solves over- and under-triggering and
   scope creep.* The negative boundaries are the part amateurs omit and experts
   obsess over. "Do NOT use for X; use skill Y instead" is what prevents your
   skill from bleeding into adjacent territory and producing confident-but-wrong
   work.

4. **Core procedure** — *Solves inconsistency.* A numbered, ordered, imperative
   workflow. This is where determinism is manufactured. If two runs on the same
   input can diverge, this section is underspecified.

5. **Rules & constraints** — *Solves the silent-violation problem.* Invariants
   that must hold regardless of path. Stated as hard ALWAYS/NEVER directives,
   not preferences. Kept *separate* from the procedure so they apply globally
   and aren't lost inside step 7 of 12.

6. **Reference / resources** — *Solves the context-tax problem.* Offloads
   heavy detail (full schemas, long style guides, lookup tables, code) to files
   loaded on demand. Keeps the always-relevant spine cheap.

7. **Examples** — *Solves the interpretation-gap problem.* One worked example
   constrains behavior more than ten paragraphs of description. Elite skills
   show the *hard* case and the *reasoning*, not the trivial happy path.

> The ordering is deliberate: **identity → routing → goal → procedure →
> invariants → escape hatches → demonstration.** It mirrors the order Claude
> needs information as it moves from "should I?" to "how exactly?"

---

## 3. Engineering the `description` — The Highest-Leverage 1KB You Will Write

This is where elite and average skills are decided. The description must do
three jobs in one or two sentences, in the **third person**:

1. **WHAT** the skill does (capability)
2. **WHEN** to use it (trigger conditions, in the user's vocabulary)
3. **BOUNDARY** — implicitly or explicitly, what it is *not* for

### The trigger-surface technique
Claude matches the live task against the description semantically. So the
description must contain the **words, synonyms, file types, and situations** a
user would actually present. You are deliberately widening the *correct* match
surface while keeping the *incorrect* one narrow.

**Weak:** `Helps with PDFs.`
**Average:** `Extracts text and tables from PDF files.`
**Elite:** `Extracts text, tables, and form-field data from PDF documents.
Use when the user uploads or references a .pdf, asks to parse, scrape, or pull
structured data out of a PDF, fill a PDF form, or convert PDF content to
markdown/CSV/JSON. Not for generating or editing PDF visual layout.`

Notice: capability + a *list of phrasings the user might actually use* +
file-extension anchors + an explicit negative boundary.

### Rules for descriptions
- **Third person, declarative.** ("Generates…", not "I will help you…" or "You
  should use this…")
- **Lead with the noun/verb of the capability**, then the triggers.
- **Front-load the most discriminating words.** Routing attention is highest at
  the start.
- **Include negative space** when adjacent skills exist ("Not for X").
- **Keep it tight** — typically a few hundred characters; treat ~1024 as a hard
  ceiling, not a target. Long descriptions dilute the match signal.
- **Use the user's words, not yours.** If users say "invoice," don't only say
  "financial document."

---

## 4. The Context-Economy Principle (Progressive Disclosure as a Weapon)

Every token in the resident metadata is paid *every session, forever*. Every
token in the body is paid *every activation*. This creates a hard optimization:

> **Keep the always-loaded surface minimal; push depth into on-demand layers.**

The three-tier discipline:

- **Tier 1 (metadata):** ruthless. Name + description only. Bytes matter.
- **Tier 2 (`SKILL.md` body):** the *decision-relevant spine*. The procedure,
  the invariants, the routing of deeper resources. Target leanness — if it
  sprawls past a few hundred lines, you are loading a manual when you needed a
  map. A long body burns budget *every time* the skill fires.
- **Tier 3 (bundled files):** unbounded depth, zero resident cost. Full
  reference schemas, exhaustive enumerations, style bibles, and especially
  **executable scripts**.

### The deterministic-offload pattern (advanced)
For any sub-task that has a *correct algorithmic answer* — parsing, validation,
formatting, math, file transforms — **do not ask Claude to do it in prose. Ship
a script and have the skill invoke it.** This is the single biggest accuracy
multiplier available:

- The skill body says *when* and *how* to run the tool.
- The tool produces the deterministic result.
- Claude orchestrates and interprets.

You convert a probabilistic token-generation problem into a deterministic
function call. Elite skills are often *thin reasoning layers wrapping reliable
tools*, not giant prose instructions trying to make the model compute by hand.

---

## 5. Manufacturing Determinism (Reliability Patterns)

Reliability = *same correct behavior across runs, phrasings, and models.* Where
it comes from:

1. **Numbered, ordered procedures over prose.** A list of steps executes far
   more consistently than a paragraph describing the same steps. Order implies
   sequence; prose implies suggestion.

2. **Imperative mood, second-person-implicit.** "Run the validator. If it fails,
   stop and report." Not "It's a good idea to validate."

3. **ALWAYS / NEVER for invariants.** Reserve these tokens for true hard
   constraints so they retain force. Diluting them across preferences destroys
   their signal.

4. **Decision tables / explicit branching.** When behavior depends on input
   type, enumerate the cases. "If X → do A. If Y → do B. Else → do C." Ambiguity
   in the spec becomes variance in the output.

5. **Stop conditions and failure handling.** Specify what to do when a
   precondition fails *explicitly*. Unhandled branches are where skills
   improvise and drift. "If the file is missing, do not guess — report and
   halt."

6. **Checklists and self-verification gates.** End the procedure with a
   verification step the model must perform before declaring done ("Confirm: all
   three outputs present; schema validates; no TODOs left"). This catches the
   model's own lapses.

7. **Idempotent, restartable steps.** Design the procedure so re-running is safe.
   This makes recovery from partial failure reliable rather than corrupting.

8. **Pin the format with a literal template, not a description of a format.**
   Show the exact skeleton to fill, including delimiters and section markers.

---

## 6. Manufacturing Accuracy (Correctness Patterns)

Accuracy = *the output is right*, not merely consistent. Where it comes from:

1. **Worked examples carrying the reasoning, not just the answer.** Show
   input → the intermediate reasoning → output. The model imitates the *process*
   it sees, so demonstrate the process you want, especially on edge cases.

2. **Negative examples.** Show a *wrong* output and label *why* it's wrong.
   Contrastive examples eliminate entire failure classes that positive examples
   alone leave open.

3. **Ground truth in bundled references, not in the prose.** When accuracy
   depends on facts (API shapes, config keys, enum values), put the canonical
   source in a Tier-3 file the skill reads, instead of restating facts the model
   might paraphrase incorrectly.

4. **Constrain the search space before generating.** Tell the model to gather
   specifics (read the actual file, inspect the real schema, run the query)
   *before* producing the artifact. Generation grounded in freshly-read reality
   beats generation from the model's prior.

5. **Force tool use for anything verifiable.** If correctness can be *checked*,
   the skill should *check it* (compile, lint, test, schema-validate, run) and
   loop on failure. "Generate then verify" beats "generate and hope."

6. **Disambiguate the model's known confusions.** If a domain has notorious
   foot-guns (timezones, off-by-one, unit conversions, a confusing API), call
   them out explicitly with the correct handling. You are pre-patching known
   failure modes.

7. **Separate gathering from deciding from producing.** A three-phase shape —
   *collect facts → reason over them → emit artifact* — yields more accurate
   results than interleaving, because it prevents premature commitment to an
   answer before the evidence is in.

---

## 7. The Anti-Patterns That Quietly Destroy Skill Performance

Each of these is common, plausible-looking, and *measurably* harmful.

1. **Treating the description as a title.** The #1 killer. A vague description
   means the body is never loaded. Effort spent on a brilliant body behind a
   weak description is wasted entirely.

2. **No negative boundaries.** Without "do NOT use for…", the skill over-fires
   into adjacent tasks and produces confident, wrong work that's worse than no
   skill at all.

3. **The mega-skill.** One skill trying to cover five loosely related jobs. Its
   description becomes unmatchable (too broad to discriminate), its body becomes
   a bloated tax. **Split by trigger.** One skill = one coherent activation
   condition. Composability beats monoliths.

4. **Prose where a procedure belongs.** Aspirational paragraphs ("handle errors
   gracefully") are dropped under load. Convert intent into testable steps.

5. **Restating the activation decision inside the body.** Wastes tokens
   re-deciding what's already decided. The body is for *how*, not *whether*.

6. **First/second-person, chatty descriptions.** "I can help you…" degrades
   routing. Descriptions are specs, not greetings.

7. **Dumping reference material into the body.** Loading a 2,000-line style
   guide on every activation. Push it to Tier 3 and reference it.

8. **Examples that only show the happy path.** They teach nothing the model
   didn't already do correctly. Spend example budget on the hard cases.

9. **Soft constraints for hard requirements.** "Try to keep it under 80 chars"
   when you mean "MUST." The model will trade away soft constraints under
   pressure.

10. **Asking the model to compute what a script should.** Hand-rolled parsing,
    arithmetic, or formatting in prose is a reliability leak. Offload it.

11. **Stale, untested skills.** A skill is software. If its referenced files,
    APIs, or assumptions drift, it silently rots. Version it, test it on real
    inputs, and treat regressions as bugs.

12. **Over-stuffing trigger words to game routing.** Keyword soup in the
    description widens *false* activation too. Precision matters as much as
    recall.

---

## 8. The Author's Workflow — How Elites Actually Build Them

Skills are engineered empirically, not written once and shipped.

1. **Start from observed failure.** Build a skill for a task Claude *currently*
   does inconsistently or wrong. If the base model already nails it, a skill
   adds tax for no gain.

2. **Write the description first, and test routing in isolation.** Before
   writing the body, confirm the skill *activates* on the real phrasings users
   use — and *doesn't* on adjacent ones. Routing is the gate; validate it first.

3. **Draft the body as the minimal procedure that fixes the failure.** Add only
   what's load-bearing. Resist the urge to document the whole domain.

4. **Build an eval set of real inputs**, including the edge and adversarial
   cases. Run the skill against them.

5. **Diff failures → patch the spec.** Each failure maps to a missing rule,
   branch, example, or offloaded tool. Add the *minimum* that fixes it. This
   tight loop is the actual source of elite quality — not inspiration.

6. **Prune relentlessly.** After it works, remove every line that doesn't change
   behavior when deleted. Leanness *is* performance, because of the context tax.

7. **Re-test across phrasings and model versions.** Robustness to paraphrase and
   to model updates is the mark of a production skill versus a demo.

---

## 9. The Compressed Checklist

Routing layer:
- [ ] `name` is literal, kebab-case, searchable
- [ ] `description` states WHAT + WHEN + boundary, third person
- [ ] Real user phrasings / file types present in the description
- [ ] Explicit negative scope when adjacent skills exist
- [ ] Description is tight (hundreds of chars, not thousands)

Execution layer:
- [ ] Purpose/Outcome anchors the end-state in one line
- [ ] Procedure is numbered, ordered, imperative
- [ ] Hard invariants isolated as ALWAYS/NEVER
- [ ] Every input branch and failure mode handled explicitly
- [ ] A self-verification / stop gate before "done"
- [ ] Output format pinned by a literal template
- [ ] At least one *hard-case* worked example with reasoning
- [ ] Contrastive (wrong-output) example for the main failure mode

Economy layer:
- [ ] Heavy reference/enumerations offloaded to Tier-3 files
- [ ] Deterministic sub-tasks done by bundled scripts, not prose
- [ ] Body pruned to load-bearing lines only

Process layer:
- [ ] Built against a real, observed failure
- [ ] Validated on an eval set incl. edge/adversarial cases
- [ ] Robust across paraphrase and model version

---

### The single sentence to remember
**Engineer the metadata to win the routing decision, engineer the body to make
correctness deterministic, and offload everything verifiable to tools and
files — then prune until only the load-bearing tokens remain.**
