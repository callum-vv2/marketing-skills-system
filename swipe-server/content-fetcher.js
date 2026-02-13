// Fetches and extracts content from URLs

/**
 * Fetch content from a URL and extract relevant text
 */
export async function fetchPageContent(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      console.warn(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }

    const html = await response.text();
    return parseHtmlContent(html, url);

  } catch (error) {
    console.warn(`Error fetching ${url}:`, error.message);
    return null;
  }
}

/**
 * Parse HTML and extract meaningful content
 */
function parseHtmlContent(html, url) {
  // Extract metadata
  const title = extractMeta(html, 'og:title') || extractTag(html, 'title');
  const description = extractMeta(html, 'og:description') || extractMeta(html, 'description');
  const image = extractMeta(html, 'og:image');

  // Determine content type from URL
  const contentType = inferContentType(url);

  // Extract main content based on type
  let mainContent = '';

  if (contentType === 'YouTube Video') {
    // For YouTube, extract video description and any visible transcript hints
    mainContent = extractYouTubeContent(html);
  } else if (contentType.includes('Post')) {
    // For social posts, try to extract the post content
    mainContent = extractSocialContent(html);
  } else {
    // For articles/pages, extract body text
    mainContent = extractArticleContent(html);
  }

  return {
    title: cleanText(title),
    description: cleanText(description),
    image,
    contentType,
    mainContent: cleanText(mainContent),
    rawHtml: html.substring(0, 50000), // Keep first 50k chars for AI processing
  };
}

/**
 * Extract meta tag content
 */
function extractMeta(html, property) {
  // Try og: property
  let match = html.match(new RegExp(`<meta[^>]*property=["']og:${property}["'][^>]*content=["']([^"']+)["']`, 'i'));
  if (match) return match[1];

  // Try name property
  match = html.match(new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']+)["']`, 'i'));
  if (match) return match[1];

  // Try content first, then property (different order)
  match = html.match(new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:${property}["']`, 'i'));
  if (match) return match[1];

  return null;
}

/**
 * Extract tag content
 */
function extractTag(html, tag) {
  const match = html.match(new RegExp(`<${tag}[^>]*>([^<]+)</${tag}>`, 'i'));
  return match ? match[1] : null;
}

/**
 * Extract YouTube-specific content
 */
function extractYouTubeContent(html) {
  const parts = [];

  // Try to get video description from JSON-LD or meta
  const descMatch = html.match(/"description"\s*:\s*"([^"]+)"/);
  if (descMatch) {
    parts.push('Video Description: ' + descMatch[1].replace(/\\n/g, '\n'));
  }

  // Try to get channel name
  const channelMatch = html.match(/"ownerChannelName"\s*:\s*"([^"]+)"/);
  if (channelMatch) {
    parts.push('Channel: ' + channelMatch[1]);
  }

  // Try to get view count
  const viewMatch = html.match(/"viewCount"\s*:\s*"(\d+)"/);
  if (viewMatch) {
    parts.push('Views: ' + parseInt(viewMatch[1]).toLocaleString());
  }

  return parts.join('\n\n');
}

/**
 * Extract social media post content
 */
function extractSocialContent(html) {
  const parts = [];

  // LinkedIn post content
  let match = html.match(/<div[^>]*class="[^"]*feed-shared-update-v2__description[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  if (match) {
    parts.push(stripTags(match[1]));
  }

  // Twitter/X post content
  match = html.match(/<div[^>]*data-testid="tweetText"[^>]*>([\s\S]*?)<\/div>/i);
  if (match) {
    parts.push(stripTags(match[1]));
  }

  // Generic article content as fallback
  if (parts.length === 0) {
    const articleContent = extractArticleContent(html);
    if (articleContent) parts.push(articleContent);
  }

  return parts.join('\n\n');
}

/**
 * Extract article/page main content
 */
function extractArticleContent(html) {
  // Remove scripts and styles
  let content = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '');

  // Try to find article or main content
  let match = content.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (match) {
    return stripTags(match[1]);
  }

  match = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (match) {
    return stripTags(match[1]);
  }

  // Try common content divs
  match = content.match(/<div[^>]*class="[^"]*(?:content|post|article|entry)[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  if (match) {
    return stripTags(match[1]);
  }

  // Fallback: extract all paragraph text
  const paragraphs = [];
  const pMatches = content.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi);
  for (const m of pMatches) {
    const text = stripTags(m[1]).trim();
    if (text.length > 50) { // Only meaningful paragraphs
      paragraphs.push(text);
    }
  }

  return paragraphs.slice(0, 10).join('\n\n'); // First 10 paragraphs
}

/**
 * Strip HTML tags
 */
function stripTags(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Clean text
 */
function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Infer content type from URL
 */
function inferContentType(url) {
  const urlLower = url.toLowerCase();

  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
    return 'YouTube Video';
  }
  if (urlLower.includes('linkedin.com')) {
    return 'LinkedIn Post';
  }
  if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) {
    return 'Twitter/X Post';
  }
  if (urlLower.includes('facebook.com') || urlLower.includes('fb.com')) {
    return 'Facebook Post';
  }
  if (urlLower.includes('instagram.com')) {
    return 'Instagram Post';
  }
  if (urlLower.includes('tiktok.com')) {
    return 'TikTok Video';
  }
  if (urlLower.includes('medium.com') || urlLower.includes('substack.com')) {
    return 'Article';
  }
  if (urlLower.includes('/blog/') || urlLower.includes('/posts/') || urlLower.includes('/article/')) {
    return 'Blog Post';
  }
  if (urlLower.includes('/landing') || urlLower.includes('/lp/')) {
    return 'Landing Page';
  }

  return 'Web Page';
}
