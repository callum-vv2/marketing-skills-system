import OpenAI from 'openai';

// Lazy initialization - client created on first use after dotenv loads
let openai = null;

function getOpenAI() {
  if (!openai) {
    openai = new OpenAI();
  }
  return openai;
}

const SKILLS = [
  'competitor-analysis',
  'customer-research',
  'market-positioning',
  'growth-model',
  'value-proposition',
  'brand-strategy',
  'brand-voice',
  'keyword-research',
  'positioning-angles',
  'seo-content',
  'direct-response-copy',
  'content-atomizer',
  'email-sequences',
  'newsletter',
  'lead-magnet',
  'case-study',
  'ad-copy',
  'copy-review'
];

const SKILL_DESCRIPTIONS = `
- competitor-analysis: Competitive intelligence, competitor tactics, market landscape insights
- customer-research: Customer insights, ICP examples, pain points, Jobs-to-be-Done
- market-positioning: Positioning strategies, differentiation, category creation
- growth-model: Growth loops, GTM strategies, acquisition channels, PLG patterns
- value-proposition: Value props, benefit statements, outcome messaging
- brand-strategy: Brand identity, brand personality, brand architecture
- brand-voice: Tone of voice examples, writing style, personality in copy
- keyword-research: SEO strategies, keyword targeting, search intent
- positioning-angles: Headlines, hooks, angles, messaging frameworks
- seo-content: Blog posts, long-form content, content structure, SEO writing
- direct-response-copy: Landing pages, sales pages, conversion copy, CTAs
- content-atomizer: Social media posts, content repurposing, short-form content
- email-sequences: Email campaigns, sequences, subject lines, email copy
- newsletter: Newsletter format, curation, newsletter writing
- lead-magnet: Lead magnets, gated content, resource design
- case-study: Customer stories, success stories, proof points
- ad-copy: Paid ads, Facebook ads, Google ads, LinkedIn ads
- copy-review: Copy critique examples, before/after, editing principles
`;

/**
 * Deep analysis of content - extracts rich metadata
 */
export async function analyzeContent({ url, pageTitle, selectedText, notes, sentiment, pageContent }) {
  const isAntiExample = sentiment === 'dislike';

  const prompt = `You are an expert marketing content analyzer. Analyze this content in depth and extract comprehensive metadata.

AVAILABLE SKILLS TO CLASSIFY INTO:
${SKILL_DESCRIPTIONS}

CONTENT DETAILS:
- URL: ${url}
- Page Title: ${pageTitle || 'Not available'}
- Content Type: ${pageContent?.contentType || 'Unknown'}
- Page Description: ${pageContent?.description || 'Not available'}
- User Selected Text: ${selectedText || 'None'}
- User Notes: "${notes}"
- Sentiment: ${isAntiExample ? 'DISLIKE (anti-example - what to avoid)' : 'LIKE (positive example)'}

PAGE CONTENT:
${pageContent?.mainContent?.substring(0, 6000) || 'Content not available'}

---

INSTRUCTIONS:
Perform a deep analysis based on what the user ${isAntiExample ? 'wants to avoid' : 'liked'}. Extract as much relevant metadata as possible.

Respond with JSON in this exact format:
{
  "skills": ["skill-1", "skill-2"],
  "contentType": "Specific type (e.g., 'Landing page hero', 'LinkedIn carousel post', 'Email subject line')",

  "extracted": {
    "headline": "The main headline or hook if present",
    "subheadline": "Supporting headline if present",
    "bodyCopy": "The main body copy or messaging",
    "cta": "Call-to-action text if present",
    "keyPhrases": ["Notable phrases", "that stand out"]
  },

  "analysis": {
    "whyItWorks": "Detailed explanation of ${isAntiExample ? 'why this fails/should be avoided' : 'why this is effective'}",
    "targetAudience": "Who this seems to be targeting",
    "emotionalTriggers": ["Emotions or desires being triggered"],
    "copywritingTechniques": ["Specific techniques used (e.g., 'social proof', 'urgency', 'specificity')"],
    "toneAndVoice": "Description of the tone (e.g., 'Conversational and confident', 'Professional but approachable')",
    "structure": "How the content is structured"
  },

  "takeaways": [
    "Key lesson 1 to remember",
    "Key lesson 2 to remember"
  ],

  "tags": ["relevant", "tags", "for", "categorization"]
}

Be thorough. If a field doesn't apply, use null. Focus especially on what the user mentioned in their notes.`;

  try {
    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const text = response.choices[0].message.content.trim();
    let result;

    try {
      result = JSON.parse(text);
    } catch {
      console.warn('Could not parse AI response, using fallback');
      return fallbackAnalysis({ url, notes, selectedText, pageContent, sentiment });
    }

    // Validate and clean up skills
    const validSkills = (result.skills || []).filter(s => SKILLS.includes(s));
    if (validSkills.length === 0) {
      validSkills.push('positioning-angles');
    }

    return {
      skills: validSkills,
      contentType: result.contentType || pageContent?.contentType || 'Web Page',
      extracted: {
        headline: result.extracted?.headline || null,
        subheadline: result.extracted?.subheadline || null,
        bodyCopy: result.extracted?.bodyCopy || selectedText || null,
        cta: result.extracted?.cta || null,
        keyPhrases: result.extracted?.keyPhrases || []
      },
      analysis: {
        whyItWorks: result.analysis?.whyItWorks || notes,
        targetAudience: result.analysis?.targetAudience || null,
        emotionalTriggers: result.analysis?.emotionalTriggers || [],
        copywritingTechniques: result.analysis?.copywritingTechniques || [],
        toneAndVoice: result.analysis?.toneAndVoice || null,
        structure: result.analysis?.structure || null
      },
      takeaways: result.takeaways || [],
      tags: result.tags || [],
      isAntiExample
    };

  } catch (error) {
    console.error('Analysis error:', error.message);
    return fallbackAnalysis({ url, notes, selectedText, pageContent, sentiment });
  }
}

/**
 * Fallback analysis without API
 */
function fallbackAnalysis({ url, notes, selectedText, pageContent, sentiment }) {
  const skills = inferSkillsFromContent({ url, notes });

  return {
    skills,
    contentType: pageContent?.contentType || inferContentType(url),
    extracted: {
      headline: null,
      subheadline: null,
      bodyCopy: selectedText || pageContent?.mainContent?.substring(0, 500) || null,
      cta: null,
      keyPhrases: []
    },
    analysis: {
      whyItWorks: notes,
      targetAudience: null,
      emotionalTriggers: [],
      copywritingTechniques: [],
      toneAndVoice: null,
      structure: null
    },
    takeaways: [],
    tags: [],
    isAntiExample: sentiment === 'dislike'
  };
}

/**
 * Infer skills from URL and notes (fallback)
 */
function inferSkillsFromContent({ url, notes }) {
  const skills = [];
  const urlLower = url.toLowerCase();
  const notesLower = notes.toLowerCase();

  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
    skills.push('content-atomizer', 'seo-content');
  }
  if (urlLower.includes('linkedin.com')) {
    skills.push('content-atomizer', 'positioning-angles');
  }
  if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) {
    skills.push('content-atomizer', 'positioning-angles');
  }
  if (urlLower.includes('facebook.com') || urlLower.includes('fb.com')) {
    skills.push('ad-copy', 'content-atomizer');
  }

  if (notesLower.includes('position') || notesLower.includes('angle') || notesLower.includes('hook') || notesLower.includes('headline')) {
    skills.push('positioning-angles');
  }
  if (notesLower.includes('copy') || notesLower.includes('landing') || notesLower.includes('sales')) {
    skills.push('direct-response-copy');
  }
  if (notesLower.includes('ad') || notesLower.includes('advert')) {
    skills.push('ad-copy');
  }
  if (notesLower.includes('email')) {
    skills.push('email-sequences');
  }
  if (notesLower.includes('blog') || notesLower.includes('article') || notesLower.includes('seo')) {
    skills.push('seo-content');
  }
  if (notesLower.includes('case study') || notesLower.includes('customer story')) {
    skills.push('case-study');
  }
  if (notesLower.includes('brand') || notesLower.includes('voice') || notesLower.includes('tone')) {
    skills.push('brand-voice');
  }
  if (notesLower.includes('value prop')) {
    skills.push('value-proposition');
  }

  const unique = [...new Set(skills)];
  return unique.length > 0 ? unique : ['positioning-angles'];
}

function inferContentType(url) {
  const urlLower = url.toLowerCase();

  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) return 'YouTube Video';
  if (urlLower.includes('linkedin.com')) return 'LinkedIn Post';
  if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) return 'Twitter/X Post';
  if (urlLower.includes('facebook.com')) return 'Facebook Post';
  if (urlLower.includes('instagram.com')) return 'Instagram Post';

  return 'Web Page';
}

// Backward compatibility
export async function classifyAndExtract(params) {
  return analyzeContent(params);
}

export async function classifyContent(params) {
  const result = await analyzeContent(params);
  return result.skills;
}
