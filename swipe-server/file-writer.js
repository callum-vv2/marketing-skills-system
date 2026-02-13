import fs from 'fs/promises';
import path from 'path';
import { getActiveProjectPath } from './project-manager.js';

export async function writeToSwipeFiles({
  url,
  pageTitle,
  userNotes,
  skills,
  contentType,
  extracted,
  analysis,
  takeaways,
  tags,
  isAntiExample = false
}) {
  const writtenSkills = [];
  const date = new Date().toISOString().split('T')[0];

  // Get the active project's path dynamically
  const projectPath = await getActiveProjectPath();
  const skillsBase = path.join(projectPath, '.claude', 'skills');

  for (const skill of skills) {
    try {
      const swipeFilePath = path.join(skillsBase, skill, 'references', 'swipe-file.md');

      // Check if file exists
      try {
        await fs.access(swipeFilePath);
      } catch {
        console.warn(`   ⚠ Swipe file not found for ${skill}, skipping`);
        continue;
      }

      // Read current content
      const currentContent = await fs.readFile(swipeFilePath, 'utf-8');

      // Create new entry with rich metadata
      const newEntry = formatRichEntry({
        pageTitle: pageTitle || new URL(url).hostname,
        date,
        url,
        contentType,
        userNotes,
        extracted,
        analysis,
        takeaways,
        tags,
        skill,
        isAntiExample
      });

      // Find insertion point
      const insertionMarker = '## High-Performing Examples';
      const antiExamplesMarker = '## Anti-Examples (What to Avoid)';

      let updatedContent;

      if (isAntiExample) {
        if (currentContent.includes(antiExamplesMarker)) {
          const markerIndex = currentContent.indexOf(antiExamplesMarker);
          const lineEnd = currentContent.indexOf('\n', markerIndex);
          const beforeMarker = currentContent.substring(0, lineEnd + 1);
          const afterMarker = currentContent.substring(lineEnd + 1);
          const placeholderPattern = /\n\*No anti-examples yet\.[^*]*\*\n?/;
          const cleanedAfter = afterMarker.replace(placeholderPattern, '\n');
          updatedContent = beforeMarker + '\n' + newEntry + '\n' + cleanedAfter;
        } else {
          const templateMarker = '## Template for New Entries';
          if (currentContent.includes(templateMarker)) {
            const templateIndex = currentContent.indexOf(templateMarker);
            updatedContent = currentContent.substring(0, templateIndex) +
              `${antiExamplesMarker}\n\n${newEntry}\n\n` +
              currentContent.substring(templateIndex);
          } else {
            updatedContent = currentContent + `\n\n${antiExamplesMarker}\n\n${newEntry}`;
          }
        }
      } else {
        const markerIndex = currentContent.indexOf(insertionMarker);
        if (markerIndex === -1) {
          updatedContent = currentContent + '\n\n' + newEntry;
        } else {
          const lineEnd = currentContent.indexOf('\n', markerIndex);
          const beforeMarker = currentContent.substring(0, lineEnd + 1);
          const afterMarker = currentContent.substring(lineEnd + 1);
          const placeholderPattern = /\n\*No examples yet\.[^*]*\*\n?/;
          const cleanedAfter = afterMarker.replace(placeholderPattern, '\n');
          updatedContent = beforeMarker + '\n' + newEntry + '\n' + cleanedAfter;
        }
      }

      await fs.writeFile(swipeFilePath, updatedContent);
      writtenSkills.push(skill);

    } catch (error) {
      console.error(`   ✗ Error writing to ${skill}:`, error.message);
    }
  }

  return writtenSkills;
}

function formatRichEntry({
  pageTitle,
  date,
  url,
  contentType,
  userNotes,
  extracted,
  analysis,
  takeaways,
  tags,
  skill,
  isAntiExample
}) {
  const emoji = isAntiExample ? '🚫' : '✅';
  const entryType = isAntiExample ? 'Anti-Example' : 'Example';

  let entry = `### ${emoji} ${entryType}: ${pageTitle}
**Date:** ${date}
**Source:** ${url}
**Type:** ${contentType || 'Web Page'}
`;

  // User's notes
  entry += `
**${isAntiExample ? 'Why to avoid' : 'Why I saved this'}:**
${userNotes || 'No notes provided'}
`;

  // Extracted content section
  if (extracted) {
    entry += `
#### Extracted Content
`;
    if (extracted.headline) {
      entry += `**Headline:** ${extracted.headline}\n`;
    }
    if (extracted.subheadline) {
      entry += `**Subheadline:** ${extracted.subheadline}\n`;
    }
    if (extracted.cta) {
      entry += `**CTA:** ${extracted.cta}\n`;
    }
    if (extracted.bodyCopy) {
      entry += `
**Body Copy:**
\`\`\`
${extracted.bodyCopy.substring(0, 2000)}${extracted.bodyCopy.length > 2000 ? '\n[...truncated]' : ''}
\`\`\`
`;
    }
    if (extracted.keyPhrases && extracted.keyPhrases.length > 0) {
      entry += `**Key Phrases:** ${extracted.keyPhrases.map(p => `"${p}"`).join(', ')}\n`;
    }
  }

  // Analysis section
  if (analysis) {
    entry += `
#### Analysis
`;
    if (analysis.whyItWorks) {
      entry += `**${isAntiExample ? 'Why it fails' : 'Why it works'}:**
${analysis.whyItWorks}

`;
    }
    if (analysis.targetAudience) {
      entry += `**Target Audience:** ${analysis.targetAudience}\n`;
    }
    if (analysis.toneAndVoice) {
      entry += `**Tone & Voice:** ${analysis.toneAndVoice}\n`;
    }
    if (analysis.structure) {
      entry += `**Structure:** ${analysis.structure}\n`;
    }
    if (analysis.emotionalTriggers && analysis.emotionalTriggers.length > 0) {
      entry += `**Emotional Triggers:** ${analysis.emotionalTriggers.join(', ')}\n`;
    }
    if (analysis.copywritingTechniques && analysis.copywritingTechniques.length > 0) {
      entry += `**Techniques Used:** ${analysis.copywritingTechniques.join(', ')}\n`;
    }
  }

  // Takeaways
  if (takeaways && takeaways.length > 0) {
    entry += `
#### Key Takeaways
${takeaways.map(t => `- ${t}`).join('\n')}
`;
  }

  // Tags
  const allTags = [
    skill,
    ...(tags || []),
    isAntiExample ? 'anti-example' : 'good-example',
    'swipe-file-collector'
  ];
  entry += `
**Tags:** ${allTags.map(t => `#${t.toLowerCase().replace(/\s+/g, '-')}`).join(' ')}

---
`;

  return entry;
}
