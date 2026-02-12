# Marketing Skills System

An 18-skill AI-powered marketing system built on Claude Code's skill framework. Uses a three-layer architecture with compound learning.

## Architecture

| Layer | Skills | Purpose |
|-------|--------|---------|
| **Layer 1: Strategy** | 7 skills | Senior Brand Manager decisions |
| **Layer 2: Execution** | 10 skills | Creating marketing materials |
| **Layer 3: Review** | 1 skill | Quality assurance |

## Quick Start

```bash
# Navigate to project
cd your-project

# Start Claude Code
claude

# Initialize with orchestrator
/orchestrator
```

## Skills Overview

### Layer 1: Strategic Foundation
- `competitor-analysis` - Map competitive landscape
- `customer-research` - Define ICP, personas, JTBD
- `market-positioning` - Strategic positioning
- `growth-model` - GTM strategy
- `value-proposition` - Core messaging
- `brand-strategy` - Brand identity
- `brand-voice` - Voice guidelines

### Layer 2: Execution Engine
- `seo-content` - Blog posts, guides
- `case-study` - Customer success stories
- `positioning-angles` - Headlines, hooks
- `direct-response-copy` - Landing pages
- `ad-copy` - Platform-specific ads
- `content-atomizer` - Social media posts
- `email-sequences` - Email campaigns
- `newsletter` - Newsletter content
- `keyword-research` - SEO keywords
- `lead-magnet` - Downloadable resources

### Layer 3: Review
- `copy-review` - Quality control

## Compound Learning

Each skill has a `references/` folder:
- `legends.md` - Expert frameworks
- `swipe-file.md` - Successful examples
- `learnings.md` - Campaign insights

Use `/orchestrator learn [skill]` to capture successful content.

## Customization

Fork this repo and customize:
1. Edit `references/legends.md` for your industry experts
2. Modify `SKILL.md` files for your workflows
3. Build your swipe-file over time

See [ARCHITECTURE.md](ARCHITECTURE.md) for full technical documentation.

---

Built for [Claude Code](https://claude.ai/claude-code)
