# Prompt Architect — Pattern Library

Reference for Phase 3 (Architecture Selection). Patterns are composable: pick
one **core pattern**, then attach **modules** as the task demands. The
selection matrix at the bottom maps task classes to defaults.

---

## Core Patterns

### 1. Specification-Driven (SPEC)

The prompt reads like an engineering spec: inputs, processing rules, output
schema, edge cases. Minimal prose, maximal precision.

- **Best for:** extraction, transformation, data processing, anything whose
  output feeds another system.
- **Skeleton:** Context → Input definition → Processing rules (numbered) →
  Output schema (literal skeleton) → Edge-case table.
- **Failure it prevents:** format drift, silent guessing on malformed input.

### 2. Role–Context–Task Stack (RCT)

A functional role with capability implications, followed by the situation,
then the operative task. The classic stack, used deliberately, not by reflex.

- **Best for:** advisory output, domain-heavy generation (legal, medical,
  technical writing) where the role meaningfully changes the prior.
- **Rule:** the role must change behavior. "You are an expert" changes
  nothing; "You are a reviewer for a systems-programming journal; reject
  unsubstantiated performance claims" changes everything.
- **Failure it prevents:** generic, hedged, audience-blind output.

### 3. Reasoning Scaffold (SCAFFOLD)

The prompt prescribes the *shape of deliberation* before the answer: what to
enumerate, what to compare, what trade-offs to weigh, what to check.

- **Best for:** analysis, decision support, debugging, evaluation, anything
  where a wrong-but-confident answer is the main risk.
- **Skeleton:** Task → "Before answering, work through: (a)… (b)… (c)…" →
  commitment step ("then state your single recommendation and its strongest
  counterargument").
- **Failure it prevents:** premature commitment, shallow single-pass answers.

### 4. Exemplar-Anchored (FEWSHOT)

One to three minimal input→output pairs carry the specification; instructions
only cover what the examples cannot show.

- **Best for:** tone matching, niche formats, classification with fuzzy
  boundaries, style transfer.
- **Rules:** examples must span the variation that matters (include one
  boundary case); keep them minimal — every token in an example is a rule
  the model will infer, intended or not.
- **Failure it prevents:** abstract format descriptions the model interprets
  differently than the user imagined.

### 5. Self-Critique Loop (CRITIC)

The prompt instructs the model to draft, then audit its draft against
explicit criteria, then output only the corrected result.

- **Best for:** high-stakes single-shot output (published copy, customer
  communication, code without a test loop), rubric-heavy tasks.
- **Skeleton:** Task → criteria list → "Draft internally, audit the draft
  against each criterion, fix violations, output only the final version."
- **Failure it prevents:** criteria acknowledged but not applied.

### 6. Agentic Decomposition (AGENT)

For prompts that drive multi-step or tool-using execution: phases with entry
and exit conditions, state to carry between steps, and stop conditions.

- **Best for:** prompts destined for agents, long workflows, research tasks,
  anything with intermediate artifacts.
- **Skeleton:** Goal → Phase list (each with: objective, inputs, done-when) →
  global stop/escalation conditions → final deliverable definition.
- **Failure it prevents:** runaway scope, skipped verification, lost state.

### 7. Persona-Free Direct (DIRECT)

No role, no framing — just an unambiguous task and output contract. The
strongest choice more often than intuition suggests.

- **Best for:** simple transformations, short factual tasks, cases where any
  added framing only adds noise.
- **Failure it prevents:** over-engineering; framing-induced drift.

---

## Composable Modules

Attach to any core pattern:

| Module | What it adds | Attach when |
|---|---|---|
| **Output Contract** | Literal schema/skeleton + length bounds | Output feeds a system or strict format matters |
| **Uncertainty Policy** | What to do when unsure: flag, abstain, or ask | Factual accuracy matters more than fluency |
| **Refusal Boundary** | Explicit out-of-scope definition + the exact fallback output | Prompt will face inputs it must not handle |
| **Evaluation Rubric** | Numbered criteria the output must satisfy, phrased checkably | Quality is multi-dimensional or subjective |
| **Delimiter Discipline** | XML-style tags around injected documents/code/user data | Prompt embeds long or untrusted content |
| **Parameter Block** | Up-front list of `{{PLACEHOLDERS}}` with fill-in guidance | Prompt is a reusable template |
| **Progressive Disclosure** | "Ask up to N clarifying questions before starting if X is missing" | Executing context will have a human in the loop |

---

## Selection Matrix

| Task class | Default core | Common modules |
|---|---|---|
| Extraction / parsing | SPEC | Output Contract, Refusal Boundary |
| Transformation (rewrite, translate, reformat) | DIRECT or FEWSHOT | Output Contract |
| Domain generation (copy, docs, legal, technical) | RCT | Evaluation Rubric, CRITIC as wrapper |
| Analysis / decision support | SCAFFOLD | Uncertainty Policy |
| Classification / labeling | FEWSHOT | Output Contract, Refusal Boundary |
| Evaluation / review / judging | SCAFFOLD + Evaluation Rubric | CRITIC |
| Agent / workflow prompts | AGENT | Delimiter Discipline, Refusal Boundary |
| Reusable template for a team | any + Parameter Block | Progressive Disclosure |

---

## Composition Rules

1. **One core pattern per prompt.** If the task seems to need two, the task
   should usually be split into two prompts (say so in Architecture Notes).
2. **Modules must not contradict the core.** E.g. Progressive Disclosure is
   incompatible with a fully-automated SPEC pipeline prompt.
3. **Order of layers is fixed** (see Phase 4 in SKILL.md); modules slot into
   their corresponding layer, they don't append to the end.
4. **Budget rule:** each added module must prevent a *named* failure mode for
   this specific task. If you can't name the failure, drop the module.
