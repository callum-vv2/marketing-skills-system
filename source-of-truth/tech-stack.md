# Tech Stack Overview

> This document captures all marketing-relevant tools available across ventures. Skills reference this document to provide tool-specific guidance.

*Last updated: 2026-02-12*

---

## Tool Categories

### Advertising Platforms

| Tool | Ventures Using | Type | Notes |
|------|----------------|------|-------|
| **Google Ads** | NextPlay, PadelPlay, Podcas | Search, Display, YouTube | Primary paid search platform |
| **META Ads** | NextPlay, PadelPlay, Podcas | Facebook, Instagram | Primary social advertising |
| **TikTok Ads** | PadelPlay, Podcas | Short-form video | Emerging platform for B2C |

**Platform-Specific Considerations:**
- Google Ads: Best for intent-driven search campaigns, remarketing
- META Ads: Best for awareness, lookalike audiences, B2C engagement
- TikTok Ads: Best for younger demographics, viral potential, B2C

---

### Email Marketing

| Tool | Ventures Using | Account Owner | Notes |
|------|----------------|---------------|-------|
| **Mailblue** | Fancard | Laura Du Ry | Primary email tool for Fancard |
| **Mailchimp** | ClubOS, PadelPlay, ve2ventures | - | Multi-venture usage |
| **Mailerlite** | NextPlay | Tom van den Beukel | NextPlay dedicated |
| **Resend** | Podcas | Gerald Ng | Transactional email |

**Tool Capabilities:**
- **Mailblue**: Automation, sequences, tagging, landing pages
- **Mailchimp**: Automation, templates, audience management, basic analytics
- **Mailerlite**: Simple automation, landing pages, pop-ups
- **Resend**: Developer-focused transactional email API

**For Fancard specifically:** Use Mailblue for all email marketing activities.

---

### Analytics & Tracking

| Tool | Ventures Using | Type | Notes |
|------|----------------|------|-------|
| **GA4** | Fancard, Freshbed, NextPlay, PadelPlay, Podcas | Website + Product | Primary analytics |
| **PostHog** | Podcas | Product Analytics | Session recording, funnels |
| **Firebase** | Podcas | Mobile Analytics | App-specific tracking |
| **HEX** | PadelPlay | Data Analysis | SQL-based reporting |
| **Google Search Console** | ClubOS, Podcas | SEO Analytics | Search performance |
| **Google Play Console** | Podcas | App Analytics | Android app metrics |

**Analytics Stack by Venture:**

| Venture | Primary Analytics | Secondary |
|---------|------------------|-----------|
| Fancard | GA4 | - |
| Podcas | GA4 | PostHog, Firebase, GSC, Play Console |
| PadelPlay | GA4 | HEX |
| NextPlay | GA4 | - |
| ClubOS | - | GSC |

**For Fancard specifically:** Use GA4 for all website and event tracking.

---

### Sales Tools

| Tool | Ventures Using | Type | Notes |
|------|----------------|------|-------|
| **Sales Navigator** | ve2ventures | LinkedIn prospecting | Lead research, outreach |
| **Phantombuster** | ve2ventures | Automation | LinkedIn automation, scraping |

**Sales Stack Notes:**
- Sales Navigator for research and direct outreach
- Phantombuster for scaled prospecting automation

---

### Website & Design

| Tool | Ventures Using | Type | Notes |
|------|----------------|------|-------|
| **Framer** | - | Website development | Modern site builder |
| **Figma Make** | Fancard, NextPlay | Website development | Figma-to-code |
| **Figma** | ve2ventures | Design | UI/UX design |
| **GoDaddy** | ClubOS, FLY-FUT, Fancard, NextPlay | Hosting | Domain and hosting |
| **Figjam** | ve2ventures | Whiteboard | Collaboration |

**For Fancard specifically:**
- Website built with Figma Make
- Hosted on GoDaddy

---

### Content & Communication

| Tool | Ventures Using | Type | Notes |
|------|----------------|------|-------|
| **Frame.io** | ve2ventures | Content creation | Video review/collaboration |
| **Slack** | ve2ventures | Communication | Team messaging |
| **Notion** | ve2ventures | Documentation | Knowledge base |
| **Adobe** | - | Creative Suite | Design, video |

---

### Link Tracking

| Tool | Ventures Using | Account Owner | Notes |
|------|----------------|---------------|-------|
| **Rebrandly** | PadelPlay, Podcas | Ege | Branded short links |

---

## Fancard-Specific Tech Stack

For Fancard marketing activities, use these tools:

| Category | Tool | Purpose |
|----------|------|---------|
| Email Marketing | **Mailblue** | Sequences, newsletters, automation |
| Analytics | **GA4** | Website tracking, conversion tracking |
| Ads | **Google Ads, META Ads** | Paid acquisition |
| Website | **Figma Make** | Landing pages, site updates |
| Hosting | **GoDaddy** | Domain, hosting |
| Design | **Figma** | Creative assets |
| Video | **Frame.io** | Video review |
| Links | *Not currently using Rebrandly* | Consider for campaign tracking |

---

## Integration Notes

### Email + Analytics
- Ensure UTM parameters on all email links for GA4 tracking
- Set up email conversion goals in GA4

### Ads + Analytics
- Google Ads should be linked to GA4 for conversion import
- META Pixel should be installed for conversion tracking
- Consider server-side tracking for iOS14+ accuracy

### Content + Distribution
- All content should have tracking links (consider Rebrandly)
- Frame.io for video asset review before distribution

---

## Tool Access by Team

| Tool | People with Access |
|------|-------------------|
| Rebrandly | Tom van den Beukel |
| PostHog | Tom van den Beukel |
| Firebase | Tom van den Beukel |
| Resend | Tom van den Beukel |
| Mailblue | Laura Du Ry (owner) |
| Mailerlite | Tom van den Beukel (owner) |

---

## Recommendations

### Missing Tools to Consider

| Need | Recommended Tool | Why |
|------|------------------|-----|
| Link tracking for Fancard | Rebrandly | Campaign attribution |
| CRM | HubSpot / Pipedrive | Sales pipeline management |
| Social scheduling | Buffer / Later | Content distribution |
| SEO tools | Ahrefs / SEMrush | Keyword research, rank tracking |
| Heatmaps | Hotjar / PostHog | UX insights |

### Integration Priorities

1. **High:** GA4 ↔ Google Ads conversion tracking
2. **High:** META Pixel installation and event tracking
3. **Medium:** Mailblue ↔ GA4 email tracking
4. **Medium:** UTM standardization across all channels

---

*This document should be updated when tools are added or changed. Reference this in skills that need tool-specific guidance.*
