# Marketing Skills System - Technical Architecture

## Overview

An 18-skill AI-powered marketing system built on Claude Code's skill framework. The system uses a three-layer architecture with state management, dependency tracking, cascading updates, and compound learning via swipe-files.

**Design Philosophy:**
- **Layer 1 (Strategy)**: Senior Brand Manager tasks - decisions about what to say and to whom
- **Layer 2 (Execution)**: Junior/Intermediate Marketer tasks - creating actual marketing materials
- **Layer 3 (Review)**: Quality assurance - reviewing and improving content

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           ORCHESTRATOR                                   │
│                     (State Management & Routing)                         │
│                                                                          │
│  • Evaluates system state after each skill execution                     │
│  • Routes users to appropriate skills based on goals                     │
│  • Logs updates and triggers cascade effects                             │
│  • Maintains documentation and state consistency                         │
│  • Captures learnings in skill swipe-files (compound learning)           │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│   LAYER 1: STRATEGY │  │  LAYER 2: EXECUTION │  │   LAYER 3: REVIEW   │
│   (Senior Tasks)    │  │  (Junior Tasks)     │  │   (QA)              │
├─────────────────────┤  ├─────────────────────┤  ├─────────────────────┤
│                     │  │ Content Creation    │  │                     │
│ 1. competitor-      │  │  • seo-content      │  │ • copy-review       │
│    analysis         │  │  • case-study       │  │                     │
│ 2. customer-        │  │                     │  │ Reviews any Layer 2 │
│    research     ────┼─▶│ Copywriting         │  │ output for brand    │
│ 3. market-          │  │  • positioning-     │  │ voice consistency,  │
│    positioning      │  │    angles           │  │ clarity, and        │
│ 4. growth-model     │  │  • direct-response  │  │ conversion          │
│ 5. value-           │  │  • ad-copy          │  │                     │
│    proposition      │  │                     │  │                     │
│ 6. brand-strategy   │  │ Distribution        │  │                     │
│ 7. brand-voice  ────┼─▶│  • content-atomizer │  │                     │
│                     │  │  • email-sequences  │  │                     │
│ Outputs:            │  │  • newsletter       │  │                     │
│ source-of-truth/    │  │                     │  │                     │
│                     │  │ Research            │  │                     │
│                     │  │  • keyword-research │  │                     │
│                     │  │                     │  │                     │
│                     │  │ Lead Generation     │  │                     │
│                     │  │  • lead-magnet      │  │                     │
│                     │  │                     │  │                     │
│                     │  │ Outputs: campaigns/ │  │                     │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

---

## Directory Structure

```
project-root/
├── .claude/
│   └── skills/                    # Skill definitions (18 skills)
│       ├── orchestrator/
│       │   ├── SKILL.md           # Central hub skill
│       │   └── references/        # Compound learning system
│       │       ├── legends.md     # Expert frameworks
│       │       ├── swipe-file.md  # Successful examples
│       │       └── learnings.md   # Campaign insights
│       ├── competitor-analysis/
│       │   ├── SKILL.md
│       │   └── references/
│       │       ├── legends.md
│       │       ├── swipe-file.md
│       │       └── learnings.md
│       └── [16 more skills]/
│           ├── SKILL.md
│           └── references/
│               ├── legends.md
│               ├── swipe-file.md
│               └── learnings.md
│
├── .marketing-system/             # State management
│   ├── state.json                 # Current state of all skills
│   ├── update-log.json            # Chronological change log
│   └── changelog.md               # Human-readable history
│
├── source-of-truth/               # Persistent strategy docs
│   ├── competitor-analysis.json   # Structured data
│   ├── competitor-analysis.md     # Human-readable
│   ├── customer-research.json
│   ├── customer-research.md
│   └── [etc.]
│
└── campaigns/                     # Campaign workspaces
    └── [campaign-name]/
        ├── campaign-brief.md
        ├── positioning-angles.md
        └── content/
            ├── blog-posts/
            ├── social/
            ├── emails/
            └── lead-magnet/
```

---

## Skill Specification

Each skill follows the Claude Code skill standard with a references folder for compound learning:

```
skill-name/
├── SKILL.md                       # Required: Main skill file
└── references/                    # Compound learning system
    ├── legends.md                 # Expert frameworks (fork to customize)
    ├── swipe-file.md              # Successful examples (grows over time)
    └── learnings.md               # Campaign insights & patterns
```

### SKILL.md Structure

```yaml
---
name: skill-name                   # Kebab-case identifier
description: Brief description     # Used for skill discovery
---

# Skill Title

[Skill instructions, frameworks, interaction patterns, output formats]
```

### Skill Components

| Component | Purpose |
|-----------|---------|
| **Legends** | Expert frameworks embedded (e.g., Porter's 5 Forces, Dunford positioning) |
| **Dependencies** | Upstream skills that must complete first |
| **Interaction Flow** | Mode 1: Brainstorming partner, Mode 2: Output generation |
| **Output Schema** | JSON (machine-readable) + Markdown (human-readable) |
| **Downstream** | Skills that consume this skill's output |

### References Folder (Compound Learning)

| File | Purpose | How it grows |
|------|---------|--------------|
| **legends.md** | Expert frameworks and methodologies | Fork and customize per project |
| **swipe-file.md** | Successful examples from campaigns | `/orchestrator learn [skill]` |
| **learnings.md** | Insights about what works/doesn't | Add after campaign analysis |

---

## Dependency Graph

```
                    competitor-analysis
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
      customer-research   market-positioning   growth-model
              │            │            │
              ├────────────┼────────────┤
              │            │            │
              ▼            ▼            ▼
         value-proposition ◄───────────┘
              │
              ▼
         brand-strategy
              │
              ▼
         brand-voice ──────────┬─────────────┬──────────────┐
              │                │             │              │
              ▼                ▼             ▼              ▼
         seo-content    direct-response   email-sequences  newsletter
              │           copy                │
              ▼                               ▼
         content-atomizer              lead-magnet
```

### Dependency Rules

1. A skill cannot run until all upstream dependencies are `complete`
2. When a skill is updated, all downstream skills are marked `stale`
3. The orchestrator enforces dependency order

---

## State Management

### state.json Schema

```json
{
  "system_version": "1.0.0",
  "last_evaluated": "2024-02-12T10:30:00Z",
  "skills": {
    "skill-name": {
      "status": "not_started|in_progress|complete|stale|needs_review",
      "version": "1.0",
      "last_updated": "ISO timestamp",
      "output_files": ["skill-name.json", "skill-name.md"],
      "quality_score": 0.0-1.0,
      "upstream_dependencies": ["skill-1", "skill-2"],
      "downstream_consumers": ["skill-3", "skill-4"]
    }
  },
  "active_campaign": "campaign-name|null",
  "update_log_summary": {
    "total_updates": 0,
    "last_update": "description"
  }
}
```

### Status Lifecycle

```
not_started ──▶ in_progress ──▶ complete
                                   │
                                   ▼
                    (upstream updated)
                                   │
                                   ▼
                                stale ──▶ needs_review ──▶ complete
```

### Cascade Logic

When `competitor-analysis` is updated:

```
competitor-analysis (updated)
    │
    ├──▶ customer-research (stale)
    │       │
    │       └──▶ value-proposition (stale)
    │               │
    │               └──▶ brand-strategy (stale)
    │                       │
    │                       └──▶ brand-voice (stale)
    │                               │
    │                               └──▶ [all execution skills] (stale)
    │
    └──▶ market-positioning (stale)
            │
            └──▶ [downstream cascade continues]
```

---

## Output Standards

### JSON Output

All skills produce structured JSON for machine consumption:

```json
{
  "skill": "skill-name",
  "version": "1.0.0",
  "timestamp": "ISO timestamp",
  "inputs": {
    "upstream_skills": ["list", "of", "dependencies"],
    "user_inputs": {}
  },
  "outputs": {
    "primary": {},
    "variants": []
  },
  "suggested_next": ["downstream-skill-1", "downstream-skill-2"],
  "metadata": {
    "confidence": 0.85,
    "review_notes": []
  }
}
```

### Markdown Output

Human-readable documentation with consistent structure:

```markdown
# [Document Title]

*Generated: [date]*
*Version: [version]*

## Executive Summary
[Overview]

## [Sections based on skill type]
[Content]

## Next Steps
[Downstream skills and actions]

---
*This document is part of the Marketing System.*
```

---

## Orchestrator Commands

| Command | Function |
|---------|----------|
| `/orchestrator` | Evaluate current state, recommend next action |
| `/orchestrator evaluate` | Full state analysis with dependency check |
| `/orchestrator update: [msg]` | Log strategic update, trigger cascade |
| `/orchestrator status` | Complete system status report |
| `/orchestrator campaign "[name]"` | Create campaign workspace, load context |
| `/orchestrator learn [skill]` | Add successful example to skill's swipe-file |

### Goal-Based Routing

The orchestrator interprets natural language goals:

| User Says | Routes To |
|-----------|-----------|
| "I need blog posts" | keyword-research → seo-content |
| "I need landing page copy" | direct-response-copy |
| "Who is my customer?" | customer-research |
| "New competitor appeared" | competitor-analysis (update mode) |
| "Launch new feature" | Creates campaign → positioning-angles → content skills |

---

## Interaction Model

### Two-Mode Operation

Each skill operates in two modes:

**Mode 1: Brainstorming Partner**
- Asks clarifying questions
- Analyzes inputs against frameworks
- Suggests options with trade-offs
- Helps make decisions

**Mode 2: Output Finalizer**
- Produces structured documentation
- Creates ready-to-use outputs
- Saves to appropriate locations
- Updates system state

### Depth Control

Users control interaction depth:

| Depth | Command | Behavior |
|-------|---------|----------|
| Shallow | `/skill generate` | Automatic decisions, fast output |
| Medium | `/skill` | Key decision points only |
| Deep | `/skill explore` | Full collaborative session |

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Runtime | Claude Code CLI |
| Skill Format | Markdown with YAML frontmatter |
| State Storage | JSON files |
| Documentation | Markdown |
| Version Control | Git-compatible structure |

---

## Extension Points

### Adding New Skills

1. Create `skill-name/SKILL.md` in `.claude/skills/`
2. Follow YAML frontmatter spec
3. Define dependencies and downstream consumers
4. Add to `state.json` schema
5. Update orchestrator routing table

### Custom Frameworks

Skills embed expert frameworks via prompt engineering:
- Reference specific methodologies (Porter, Dunford, Schwartz, etc.)
- Include decision trees and templates
- Provide example outputs

### Integration Points

| Integration | Method |
|-------------|--------|
| CMS | Export markdown to content systems |
| Email tools | Export sequences to ESP |
| Analytics | Track via state.json versioning |
| Notion | Sync source-of-truth folder |

---

## Security & Privacy

- All processing happens locally via Claude Code
- No data leaves the local environment unless explicitly shared
- Credentials and secrets should not be stored in source-of-truth files
- Git-ignore `.marketing-system/` if state contains sensitive data

---

## Performance Considerations

- Skills load context from upstream outputs (file reads)
- Large campaigns may accumulate many files
- State.json grows with update history
- Consider archiving completed campaigns

---

## Getting Started

```bash
# Navigate to project
cd /path/to/project

# Start Claude Code
claude

# Initialize with orchestrator
/orchestrator

# Follow guided workflow
# Start with competitor-analysis for fresh projects
```

---

## Skill Reference

### Layer 1: Strategic Foundation (7 skills)
*Senior Brand Manager Tasks*

| Skill | Dependencies | Outputs |
|-------|--------------|---------|
| competitor-analysis | None | Competitive matrix, positioning map |
| customer-research | competitor-analysis | ICP, personas, JTBD, VoC |
| market-positioning | competitor-analysis, customer-research | Position statement, category strategy |
| growth-model | competitor-analysis, customer-research | GTM model, growth loops, metrics |
| value-proposition | market-positioning, customer-research | Value prop, messaging hierarchy |
| brand-strategy | market-positioning, value-proposition | Brand identity, personality, story |
| brand-voice | brand-strategy, customer-research | Voice guidelines, vocabulary |

### Layer 2: Execution Engine (10 skills)
*Junior/Intermediate Marketer Tasks*

| Skill | Category | Dependencies | Outputs |
|-------|----------|--------------|---------|
| seo-content | Content | keyword-research, brand-voice, positioning-angles | Blog posts, guides |
| case-study | Content | brand-voice, customer-research | Customer success stories, testimonials |
| positioning-angles | Copywriting | market-positioning, value-proposition | Messaging angles, headlines |
| direct-response-copy | Copywriting | brand-voice, positioning-angles | Landing pages, sales pages |
| ad-copy | Copywriting | brand-voice, positioning-angles | Platform-specific ads |
| content-atomizer | Distribution | seo-content, brand-voice | Social posts, threads |
| email-sequences | Distribution | brand-voice, value-proposition, growth-model | Email campaigns |
| newsletter | Distribution | content-atomizer, brand-voice | Newsletter issues |
| keyword-research | Research | customer-research | Keywords, topic clusters |
| lead-magnet | Lead Gen | keyword-research, growth-model, value-proposition | Lead magnets |

### Layer 3: Review & Optimization (1 skill)
*Quality Assurance*

| Skill | Dependencies | Outputs |
|-------|--------------|---------|
| copy-review | brand-voice | Reviewed copy, suggestions, before/after |

### Orchestrator

| Skill | Dependencies | Outputs |
|-------|--------------|---------|
| orchestrator | All | state.json, routing, learn mode |

---

## Legends & Frameworks Embedded

| Domain | Experts Referenced |
|--------|-------------------|
| Competitive Strategy | Michael Porter, Hamilton Helmer, Ben Thompson |
| Positioning | April Dunford, Al Ries, Andy Raskin, Christopher Lochhead |
| Customer Research | Clayton Christensen (JTBD), Joanna Wiebe, Eugene Schwartz |
| Growth | Brian Balfour, Wes Bush, David Sacks |
| Brand | David Ogilvy, Marty Neumeier, Seth Godin |
| Copywriting | Gary Halbert, Eugene Schwartz, Joe Sugarman, Claude Hopkins |
| Content | Brian Dean, Gary Vaynerchuk, Ann Handley |
| Email | Andre Chaperon, Ben Settle, Val Geisler |

---

## Compound Learning System

The system improves over time by capturing successful examples in swipe-files.

### How It Works

1. **Run a campaign** using execution skills
2. **Identify winners** - content that performed well
3. **Capture the example** using `/orchestrator learn [skill-name]`
4. **Swipe-file grows** with proven examples
5. **Future outputs** reference successful patterns

### Swipe-File Structure

```markdown
# Swipe File: [Skill Name]

## High-Performing Examples

### Example: [Campaign/Content Name]
**Date:** 2024-02-15
**Type:** [Content type]
**Performance:** [Metrics that made it successful]

**The Content:**
[Actual copy/content]

**Why It Worked:**
- [Analysis point 1]
- [Analysis point 2]

**Tags:** #hook-type #audience #technique
```

### Fork-Friendly Design

To customize for a specific project:

1. Clone the skills folder to your project
2. Edit `references/legends.md` to add industry-specific experts
3. Edit `SKILL.md` to customize frameworks
4. Build your project's swipe-file over time

No complex configuration - just edit the markdown files directly.

---

## Extended Skills (Future)

These skills are documented but not yet built. Add when needed:

| Category | Skills | When to Add |
|----------|--------|-------------|
| Content | video-scripts, webinar-content | Video marketing campaigns |
| Copywriting | product-copy, microcopy | Product pages, UI copy |
| Sales | sales-deck, battle-cards, proposals | Sales team materials |
| Distribution | social-calendar | Social media systematization |
| Lead Gen | quiz-funnel | Lead segmentation needs |
| PR | press-release, media-pitch | PR campaigns |
| Review | seo-audit, content-performance | Optimization phase |

---

*Version 2.0 | 18 Core Skills | Built for Claude Code Skill Framework*
