import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { analyzeContent } from './classifier.js';
import { writeToSwipeFiles } from './file-writer.js';
import { fetchPageContent } from './content-fetcher.js';
import {
  getProjects,
  addProject,
  removeProject,
  setActiveProject,
  getActiveProject
} from './project-manager.js';

dotenv.config();

const app = express();
const PORT = 3847;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get available skills
app.get('/skills', (req, res) => {
  const skills = [
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
  res.json({ skills });
});

// ========== PROJECT MANAGEMENT ==========

// Get all projects
app.get('/projects', async (req, res) => {
  try {
    const data = await getProjects();
    res.json(data);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add a new project
app.post('/projects', async (req, res) => {
  try {
    const { name, path } = req.body;

    if (!name || !path) {
      return res.status(400).json({ error: 'Name and path are required' });
    }

    const project = await addProject(name, path);
    console.log(`\n✓ Added project: ${name} (${path})`);
    res.json({ success: true, project });
  } catch (error) {
    console.error('Add project error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Remove a project
app.delete('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await removeProject(id);
    console.log(`\n✓ Removed project: ${id}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Remove project error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Set active project
app.put('/projects/active', async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    const project = await setActiveProject(id);
    console.log(`\n✓ Switched to project: ${project.name}`);
    res.json({ success: true, project });
  } catch (error) {
    console.error('Set active project error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get active project
app.get('/projects/active', async (req, res) => {
  try {
    const project = await getActiveProject();
    res.json({ project });
  } catch (error) {
    console.error('Get active project error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * STEP 1: Analyze - Fetch page, run AI analysis, return results for preview/edit
 */
app.post('/analyze', async (req, res) => {
  try {
    const { url, pageTitle, selectedText, notes, sentiment = 'like' } = req.body;

    if (!url || !notes) {
      return res.status(400).json({ error: 'URL and notes are required' });
    }

    const isAntiExample = sentiment === 'dislike';
    console.log(`\n🔍 Analyzing ${isAntiExample ? 'anti-example' : 'example'}...`);
    console.log(`   URL: ${url}`);
    console.log(`   Notes: ${notes.substring(0, 80)}...`);

    // Fetch page content
    console.log(`   Fetching page content...`);
    const pageContent = await fetchPageContent(url);
    if (pageContent) {
      console.log(`   ✓ Fetched: ${pageContent.contentType} - "${pageContent.title?.substring(0, 40)}..."`);
    } else {
      console.log(`   ⚠ Could not fetch page content`);
    }

    // Run AI analysis
    console.log(`   Running AI analysis...`);
    const analysis = await analyzeContent({
      url,
      pageTitle: pageTitle || pageContent?.title,
      selectedText,
      notes,
      sentiment,
      pageContent
    });

    console.log(`   ✓ Analysis complete`);
    console.log(`   Skills: ${analysis.skills.join(', ')}`);

    // Return full analysis for preview/edit
    res.json({
      success: true,
      url,
      pageTitle: pageTitle || pageContent?.title || new URL(url).hostname,
      userNotes: notes,
      sentiment,
      ...analysis
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: error.message || 'Failed to analyze content'
    });
  }
});

/**
 * STEP 2: Save - Take (potentially edited) analysis and save to swipe files
 */
app.post('/save', async (req, res) => {
  try {
    const {
      url,
      pageTitle,
      userNotes,
      sentiment,
      skills,
      contentType,
      extracted,
      analysis,
      takeaways,
      tags,
      isAntiExample
    } = req.body;

    if (!url || !skills || skills.length === 0) {
      return res.status(400).json({ error: 'URL and at least one skill are required' });
    }

    console.log(`\n💾 Saving to swipe files...`);
    console.log(`   URL: ${url}`);
    console.log(`   Skills: ${skills.join(', ')}`);

    // Write to swipe files with full metadata
    const results = await writeToSwipeFiles({
      url,
      pageTitle: pageTitle || new URL(url).hostname,
      userNotes,
      skills,
      contentType,
      extracted,
      analysis,
      takeaways,
      tags,
      isAntiExample: isAntiExample || sentiment === 'dislike'
    });

    console.log(`   ✓ Saved to ${results.length} swipe files`);

    res.json({
      success: true,
      skills: results,
      message: `${isAntiExample ? 'Anti-example' : 'Example'} saved to ${results.length} swipe file(s)`
    });

  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({
      error: error.message || 'Failed to save content'
    });
  }
});

/**
 * Legacy: Combined analyze + save (for backward compatibility)
 */
app.post('/contribute', async (req, res) => {
  try {
    const { url, pageTitle, selectedText, notes, sentiment = 'like' } = req.body;

    if (!url || !notes) {
      return res.status(400).json({ error: 'URL and notes are required' });
    }

    // Fetch and analyze
    const pageContent = await fetchPageContent(url);
    const analysis = await analyzeContent({
      url,
      pageTitle: pageTitle || pageContent?.title,
      selectedText,
      notes,
      sentiment,
      pageContent
    });

    // Save immediately
    const results = await writeToSwipeFiles({
      url,
      pageTitle: pageTitle || pageContent?.title || new URL(url).hostname,
      userNotes: notes,
      skills: analysis.skills,
      contentType: analysis.contentType,
      extracted: analysis.extracted,
      analysis: analysis.analysis,
      takeaways: analysis.takeaways,
      tags: analysis.tags,
      isAntiExample: analysis.isAntiExample
    });

    res.json({
      success: true,
      skills: results,
      message: `${analysis.isAntiExample ? 'Anti-example' : 'Example'} saved to ${results.length} swipe file(s)`
    });

  } catch (error) {
    console.error('Contribute error:', error);
    res.status(500).json({
      error: error.message || 'Failed to process contribution'
    });
  }
});

app.listen(PORT, async () => {
  const activeProject = await getActiveProject();
  console.log(`\n🚀 Swipe File Server running on http://localhost:${PORT}`);
  console.log(`\n   Active Project: ${activeProject.name} (${activeProject.path})`);
  console.log(`\n   Endpoints:`);
  console.log(`   POST /analyze  - Analyze URL, return preview (Step 1)`);
  console.log(`   POST /save     - Save edited analysis (Step 2)`);
  console.log(`   POST /contribute - Legacy: analyze + save in one step`);
  console.log(`   GET  /health   - Health check`);
  console.log(`   GET  /skills   - List available skills`);
  console.log(`   GET  /projects - List all projects`);
  console.log(`   POST /projects - Add a new project`);
  console.log(`   DELETE /projects/:id - Remove a project`);
  console.log(`   PUT  /projects/active - Set active project`);
  console.log(`\n   Waiting for requests from Chrome extension...\n`);
});
