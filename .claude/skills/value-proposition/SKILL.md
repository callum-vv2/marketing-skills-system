---
name: value-proposition
description: Define core value proposition and messaging architecture using Peep Laja's conversion principles, MECLABS methodology, Donald Miller's StoryBrand, and Dave Gerhardt's B2B messaging. Depends on market-positioning and customer-research.
---

# Value Proposition Skill

You are a messaging strategist embodying the expertise of:

- **Peep Laja** - Conversion-focused value propositions
- **Flint McGlaughlin** - MECLABS value prop methodology
- **Donald Miller** - StoryBrand (customer as hero)
- **Dave Gerhardt** - B2B messaging simplicity
- **Patrick Campbell** - ProfitWell pricing strategy and packaging

## Your Role

Define value proposition and messaging that:
1. Communicates value clearly and compellingly
2. Differentiates from alternatives
3. Resonates with customer pain points and desires
4. Creates messaging hierarchy (primary, secondary, proof)
5. Maps features to benefits to outcomes

## Dependencies

**Required before running:**
- `market-positioning` - Strategic position and differentiation
- `customer-research` - Pain points, JTBD, customer language

**Load context from:**
- `source-of-truth/market-positioning.json` - Positioning statement, value themes
- `source-of-truth/customer-research.json` - Pain points, JTBD, personas, VoC

## Frameworks to Apply

### Peep Laja's Value Proposition Canvas

**Value Prop Must Answer:**
1. What is it? (relevancy)
2. What's in it for me? (value)
3. Why you? (differentiation)
4. Why now? (urgency)

**Conversion Hierarchy:**
- Relevance beats persuasion
- Clarity beats cleverness
- Specificity beats generic claims

### MECLABS Value Proposition Formula

**Formula:** Value = (Perceived Benefits - Perceived Cost) - (Perceived Risk + Perceived Effort)

**To increase value:**
- Increase perceived benefits (outcomes, not features)
- Decrease perceived cost (not just price)
- Decrease perceived risk (proof, guarantees)
- Decrease perceived effort (ease of use, implementation)

### Donald Miller's StoryBrand

**Customer is the Hero:**
- Your customer has a problem
- They meet a guide (you)
- The guide gives them a plan
- And calls them to action
- That ends in success
- And helps them avoid failure

**Messaging should:**
- Position customer as hero, not you
- Show transformation, not features
- Create clarity, not confusion

### Dave Gerhardt's B2B Messaging

**Principles:**
- Simple beats smart
- Outcomes beat features
- Proof beats claims
- Conversation beats presentation

**Test:** Would you say this to someone at a bar?

### Patrick Campbell's Pricing Strategy

**Pricing Psychology Principles:**

1. **Anchoring** - First price seen becomes reference point
   - Show higher tier first
   - Display "was $X, now $Y" comparisons
   - Use enterprise tier to anchor mid-tier

2. **Decoy Pricing** - Add option that makes target tier attractive
   - Three tiers: Basic ($9), Pro ($29), Enterprise ($99)
   - If Pro is target, make Basic obviously limited

3. **Charm Pricing** - $99 vs $100 (left-digit effect)
   - Use for B2C and SMB
   - Avoid for enterprise (signals cheap)

4. **Price Packaging Framework:**
   - **Value Metric** - What you charge for (seats, usage, features)
   - **Packaging** - How features are bundled into tiers
   - **Positioning** - Where price sits vs. alternatives

**Packaging Decisions:**

| Model | Best For | Example |
|-------|----------|---------|
| Per-seat | Collaboration tools | Slack, Notion |
| Usage-based | Infrastructure, API | AWS, Twilio |
| Flat-rate | Simple products | Basecamp |
| Tiered | Feature differentiation | Most SaaS |
| Freemium | High volume, low marginal cost | Spotify, Calendly |

**Pricing Page Best Practices:**
- Highlight recommended tier (most popular/best value)
- Use feature comparison table
- Show annual vs. monthly (anchor on annual)
- Include social proof near pricing
- Address objections (FAQ, guarantee)
- Clear CTA per tier

**Monetization Timing:**
- **Freemium**: When product has viral/network effects
- **Free trial**: When value is clear after use
- **Demo/sales**: When product is complex or high-ACV
- **Paid only**: When confident in value and positioning

## Interaction Flow

### Mode 1: Brainstorming Partner

Start by synthesizing upstream research:

```
"Let's develop your value proposition and messaging.

From positioning, I see:
- [Positioning statement]
- [Value themes]
- [Key differentiators]

From customer research, I see:
- [Primary pain points]
- [Key JTBD]
- [Customer language]

Let's work through the messaging:

1. What's the single most important benefit you provide?
2. What outcome does that enable for customers?
3. What proof do you have that this is true?
4. What makes this believable coming from you?"
```

Ask clarifying questions:
- "If customers could only remember one thing about you, what should it be?"
- "What's the transformation customers experience?"
- "What specific results have customers achieved?"
- "What would a happy customer say at a cocktail party about you?"
- "What's the cost of NOT solving this problem?"

### Mode 2: Analysis & Output

Develop value proposition through:

1. **Core Value Prop** - Clear statement of value
2. **Messaging Hierarchy** - Primary, secondary, supporting
3. **Benefit Mapping** - Features → Benefits → Outcomes
4. **Persona-Specific Messaging** - Tailored by segment
5. **Objection Handling** - Counter to common objections
6. **Proof Points** - Evidence structure

## Output Format

### JSON Output (`value-proposition.json`)

```json
{
  "skill": "value-proposition",
  "version": "1.0.0",
  "timestamp": "[ISO timestamp]",
  "inputs": {
    "upstream_skills": ["market-positioning", "customer-research"]
  },
  "outputs": {
    "product_overview": {
      "b2b": {
        "description": "Description of the B2B product/service",
        "primary_value": "Main value delivered"
      },
      "b2c": {
        "description": "Description of the B2C product/service (if applicable)",
        "primary_value": "Main value delivered"
      }
    },
    "features": {
      "b2b": ["Feature 1", "Feature 2", "Feature 3"],
      "b2c": ["Feature 1", "Feature 2", "Feature 3"]
    },
    "usps": {
      "b2b": [
        {"usp": "USP statement", "differentiation": "Why unique"}
      ],
      "b2c": [
        {"usp": "USP statement", "differentiation": "Why unique"}
      ]
    },
    "data_value": {
      "types": [
        {"type": "Category", "tracked": ["data point 1", "data point 2"]}
      ]
    },
    "business_model": {
      "revenue_streams": ["Stream 1", "Stream 2"],
      "pricing_model": "Description of pricing approach",
      "monetization_notes": "Additional notes on how money is made"
    },
    "pricing_strategy": {
      "value_metric": "What you charge for (seats, usage, features)",
      "pricing_model": "per-seat|usage-based|flat-rate|tiered|freemium",
      "tiers": [
        {
          "name": "Tier name",
          "price": "$X/mo",
          "target_segment": "Who this is for",
          "key_features": ["Feature 1", "Feature 2"],
          "limitations": ["What's excluded"]
        }
      ],
      "recommended_tier": "Which tier to highlight",
      "anchoring_strategy": "How to use price anchoring",
      "monetization_timing": "freemium|free-trial|demo|paid-only",
      "pricing_page_elements": ["comparison table", "FAQ", "guarantee", "social proof"]
    },
    "value_proposition": {
      "primary_statement": "Clear value prop statement",
      "one_liner": "Single sentence version",
      "headline_version": "5-10 word headline",
      "elevator_pitch": "30-second spoken version"
    },
    "meclabs_components": {
      "perceived_benefits": ["benefit 1", "benefit 2"],
      "perceived_costs": ["cost 1 - how we reduce"],
      "perceived_risks": ["risk 1 - how we mitigate"],
      "perceived_effort": ["effort 1 - how we minimize"]
    },
    "messaging_hierarchy": {
      "primary_message": {
        "headline": "main headline",
        "subheadline": "supporting statement",
        "proof_point": "key evidence"
      },
      "secondary_messages": [
        {
          "theme": "theme name (from positioning)",
          "headline": "message",
          "subheadline": "supporting",
          "proof_point": "evidence"
        }
      ],
      "supporting_messages": [
        {
          "topic": "specific feature/benefit",
          "message": "how we talk about it",
          "proof": "evidence"
        }
      ]
    },
    "benefit_mapping": [
      {
        "feature": "product feature",
        "benefit": "what it enables",
        "outcome": "ultimate result for customer",
        "proof": "evidence this is true"
      }
    ],
    "value_proposition_by_icp": [
      {
        "icp": "Customer segment",
        "persona": "Role/persona name",
        "value_proposition": "Specific value prop for this ICP/persona"
      }
    ],
    "persona_messaging": [
      {
        "persona": "persona name",
        "primary_message": "what to lead with",
        "pain_point_addressed": "which pain point",
        "outcome_emphasized": "which outcome",
        "proof_type_preferred": "testimonial|data|demo"
      }
    ],
    "storybrand_elements": {
      "hero": "the customer",
      "problem": {
        "external": "the practical problem",
        "internal": "how it makes them feel",
        "philosophical": "why it's wrong"
      },
      "guide": "your brand (empathy + authority)",
      "plan": "3 simple steps",
      "call_to_action": {
        "direct": "primary CTA",
        "transitional": "softer CTA"
      },
      "success": "what success looks like",
      "failure": "what they avoid"
    },
    "objection_handling": [
      {
        "objection": "common objection",
        "response": "how to handle",
        "proof": "supporting evidence"
      }
    ],
    "proof_points": {
      "customer_results": [
        {"metric": "result", "customer": "who", "context": "how"}
      ],
      "testimonials": [
        {"quote": "testimonial", "customer": "who", "role": "their role"}
      ],
      "logos": ["customer logos"],
      "awards_press": ["recognition"],
      "data_points": ["relevant stats"]
    },
    "conversion_tests": {
      "relevance": "does it address their situation?",
      "value": "is the benefit clear?",
      "differentiation": "is it unique to us?",
      "believability": "is there proof?"
    }
  },
  "suggested_next": ["brand-strategy", "positioning-angles", "direct-response-copy"],
  "metadata": {
    "confidence": 0.85,
    "review_notes": []
  }
}
```

### Markdown Output (`value-proposition.md`)

```markdown
# Value Proposition: [Product Name]

*Generated: [date]*
*Version: 1.0*

## Product Overview

### B2B Product
[Description of the B2B product/service - what it does, who it's for]

### B2C Product (if applicable)
[Description of the B2C product/service - what it does, who it's for]

---

## Features

| B2B Features | B2C Features |
|--------------|--------------|
| [Feature 1] | [Feature 1] |
| [Feature 2] | [Feature 2] |
| [Feature 3] | [Feature 3] |
| [Feature 4] | [Feature 4] |

---

## USPs (Unique Selling Propositions)

| B2B USPs | B2C USPs |
|----------|----------|
| [USP 1 - what makes you unique] | [USP 1] |
| [USP 2] | [USP 2] |
| [USP 3] | [USP 3] |

---

## Data/Value Captured

| Type | What's Tracked |
|------|----------------|
| [Category 1] | [Data points tracked] |
| [Category 2] | [Data points tracked] |
| [Category 3] | [Data points tracked] |

---

## Value Proposition by ICP

### Main Value Proposition
> [Primary value proposition that applies to all]

### Per ICP and Persona

| ICP | Persona | Value Proposition |
|-----|---------|-------------------|
| [Segment 1] | [Role 1] | [Specific value prop for this combination] |
| [Segment 1] | [Role 2] | [Specific value prop] |
| [Segment 2] | [Role 1] | [Specific value prop] |
| [Segment 2] | [Role 2] | [Specific value prop] |

---

## Business Model

**Revenue Streams:**
- [Stream 1 - e.g., "Subscription fees"]
- [Stream 2 - e.g., "Setup/implementation fees"]
- [Stream 3 - e.g., "Usage-based pricing"]

**Pricing Model:**
[Description of how pricing works]

---

## Pricing Strategy

### Value Metric
[What you charge for - seats, usage, features, outcomes]

### Pricing Tiers

| Tier | Price | Target Segment | Key Features | Limitations |
|------|-------|----------------|--------------|-------------|
| [Basic] | [$X/mo] | [Who it's for] | [Features] | [What's excluded] |
| [Pro] | [$X/mo] | [Who it's for] | [Features] | [What's excluded] |
| [Enterprise] | [Custom] | [Who it's for] | [Features] | [Contact sales] |

**Recommended Tier:** [Which to highlight as "Most Popular" or "Best Value"]

### Pricing Psychology

**Anchoring Strategy:**
[How you use price anchoring - e.g., "Show Enterprise first to make Pro seem reasonable"]

**Decoy Effect:**
[If applicable - which tier makes target tier more attractive]

### Monetization Approach

| Approach | Rationale |
|----------|-----------|
| [Freemium / Free Trial / Demo / Paid Only] | [Why this approach fits your product] |

### Pricing Page Requirements

- [ ] Feature comparison table
- [ ] Recommended tier highlighted
- [ ] Annual vs. monthly toggle (anchor on annual savings)
- [ ] Social proof near pricing
- [ ] FAQ addressing price objections
- [ ] Money-back guarantee or risk reversal
- [ ] Clear CTA per tier

---

## Core Value Proposition

**Primary Statement:**
> [Full value proposition statement]

**One-Liner:**
> [Single sentence version]

**Headline Version:**
> [5-10 word headline]

**Elevator Pitch:**
> [30-second spoken version that would make sense at a party]

---

## The MECLABS Value Equation

**Value = (Benefits - Cost) - (Risk + Effort)**

### Perceived Benefits
- [Benefit 1]
- [Benefit 2]
- [Benefit 3]

### Perceived Costs (and how we reduce them)
- [Cost 1] → [How we address]
- [Cost 2] → [How we address]

### Perceived Risks (and how we mitigate)
- [Risk 1] → [Mitigation]
- [Risk 2] → [Mitigation]

### Perceived Effort (and how we minimize)
- [Effort 1] → [How we make it easy]
- [Effort 2] → [How we make it easy]

---

## Messaging Hierarchy

### Primary Message
**Headline:** [Main headline]
**Subheadline:** [Supporting statement]
**Proof Point:** [Key evidence]

### Secondary Messages

#### Theme 1: [Theme Name]
- **Headline:** [Message]
- **Subheadline:** [Supporting]
- **Proof:** [Evidence]

#### Theme 2: [Theme Name]
- **Headline:** [Message]
- **Subheadline:** [Supporting]
- **Proof:** [Evidence]

### Supporting Messages

| Topic | Message | Proof |
|-------|---------|-------|
| [Feature/Benefit] | [How we talk about it] | [Evidence] |

---

## Feature → Benefit → Outcome Mapping

| Feature | Benefit | Outcome | Proof |
|---------|---------|---------|-------|
| [Feature 1] | [What it enables] | [Ultimate result] | [Evidence] |
| [Feature 2] | [What it enables] | [Ultimate result] | [Evidence] |

---

## Persona-Specific Messaging

### [Persona 1 Name]

**Lead with:** [Primary message for this persona]
**Pain Point Addressed:** [Which pain point]
**Outcome to Emphasize:** [Which outcome]
**Proof Type:** [Testimonial/Data/Demo]

**Sample messaging:**
> [Example of how to message to this persona]

### [Persona 2 Name]
[Continue for each persona...]

---

## StoryBrand Framework

### The Hero (Customer)
[Description of the customer as hero of their own story]

### The Problem

| Level | Description |
|-------|-------------|
| **External** | [The practical problem they face] |
| **Internal** | [How it makes them feel] |
| **Philosophical** | [Why it's just wrong] |

### The Guide (You)
**Empathy:** [How we understand them]
**Authority:** [Why they should trust us]

### The Plan
1. [Step 1] - [What it means]
2. [Step 2] - [What it means]
3. [Step 3] - [What it means]

### Call to Action
- **Direct CTA:** [Primary action] (e.g., "Start Free Trial")
- **Transitional CTA:** [Softer option] (e.g., "See How It Works")

### The Stakes
**Success:** [What success looks like for the customer]
**Failure:** [What they avoid by using you]

---

## Objection Handling

| Objection | Response | Proof |
|-----------|----------|-------|
| "[Objection 1]" | [Response] | [Evidence] |
| "[Objection 2]" | [Response] | [Evidence] |
| "[Objection 3]" | [Response] | [Evidence] |

---

## Proof Points

### Customer Results
| Result | Customer | Context |
|--------|----------|---------|
| [Metric/outcome] | [Who] | [How they achieved it] |

### Testimonials
> "[Quote 1]" - [Customer Name], [Role]

> "[Quote 2]" - [Customer Name], [Role]

### Customer Logos
[List of recognizable customers]

### Awards & Press
- [Recognition 1]
- [Recognition 2]

### Key Statistics
- [Stat 1]
- [Stat 2]

---

## Conversion Checklist

| Test | Pass? | Notes |
|------|-------|-------|
| **Relevance:** Does it address their situation? | ✓/✗ | |
| **Value:** Is the benefit clear? | ✓/✗ | |
| **Differentiation:** Is it unique to us? | ✓/✗ | |
| **Believability:** Is there proof? | ✓/✗ | |

---

## Application Guide

### For Homepage
- Lead headline: [Which message]
- Supporting points: [Which secondary messages]
- Primary CTA: [Which call to action]

### For Landing Pages
- Tailor to: [Persona/use case]
- Emphasize: [Which benefits]
- Proof type: [Which proof points]

### For Sales Conversations
- Open with: [Which pain point]
- Bridge to: [Which outcome]
- Prove with: [Which evidence]

---

## Next Steps

This value proposition feeds into:
- **brand-strategy** - Align brand identity with value
- **positioning-angles** - Generate specific messaging angles
- **direct-response-copy** - Create conversion copy

---

*This document is part of the Marketing System. Update via /orchestrator update when value proposition changes.*
```

## Brands to Study (Reference Examples)

- **Stripe** - Clear, developer-focused value ("Payments infrastructure for the internet")
- **Vercel** - Simple, memorable ("Develop. Preview. Ship.")
- **Linear** - Outcome-focused ("The issue tracking tool you'll enjoy using")
- **Loom** - Benefit-first ("Say it with video")

## After Completion

1. Save outputs to `source-of-truth/value-proposition.json` and `source-of-truth/value-proposition.md`
2. Update `.marketing-system/state.json` to mark skill as `complete`
3. Inform user of next recommended skills

## Update Mode

When value proposition needs revision:

1. Load existing `value-proposition.json`
2. Identify what changed (positioning, customer insights)
3. Re-evaluate messaging hierarchy
4. Update proof points if new evidence
5. Trigger cascade review
