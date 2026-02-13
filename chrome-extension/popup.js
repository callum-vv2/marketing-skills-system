const SERVER_URL = 'http://localhost:3847';

const ALL_SKILLS = [
  'positioning-angles',
  'direct-response-copy',
  'ad-copy',
  'content-atomizer',
  'email-sequences',
  'seo-content',
  'brand-voice',
  'value-proposition',
  'market-positioning',
  'case-study',
  'newsletter',
  'lead-magnet',
  'customer-research',
  'competitor-analysis',
  'brand-strategy',
  'growth-model',
  'keyword-research',
  'copy-review'
];

let currentAnalysis = null;
let sentiment = 'like';

document.addEventListener('DOMContentLoaded', async () => {
  // Elements - Step 1
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const statusEl = document.getElementById('status');
  const urlInput = document.getElementById('url');
  const notesTextarea = document.getElementById('notes');
  const notesLabel = document.getElementById('notesLabel');
  const analyzeForm = document.getElementById('analyzeForm');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const likeBtn = document.getElementById('likeBtn');
  const dislikeBtn = document.getElementById('dislikeBtn');

  // Elements - Project Management
  const projectSelect = document.getElementById('projectSelect');
  const addProjectBtn = document.getElementById('addProjectBtn');
  const addProjectModal = document.getElementById('addProjectModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const addProjectForm = document.getElementById('addProjectForm');
  const addProjectSubmitBtn = document.getElementById('addProjectSubmitBtn');
  const newProjectNameInput = document.getElementById('newProjectName');
  const newProjectPathInput = document.getElementById('newProjectPath');
  const addProjectError = document.getElementById('addProjectError');

  // Elements - Step 2
  const backBtn = document.getElementById('backBtn');
  const saveForm = document.getElementById('saveForm');
  const saveBtn = document.getElementById('saveBtn');
  const skillsGrid = document.getElementById('skillsGrid');
  const contentTypeInput = document.getElementById('contentType');
  const headlineInput = document.getElementById('headline');
  const subheadlineInput = document.getElementById('subheadline');
  const bodyCopyInput = document.getElementById('bodyCopy');
  const ctaInput = document.getElementById('cta');
  const keyPhrasesInput = document.getElementById('keyPhrases');
  const whyItWorksInput = document.getElementById('whyItWorks');
  const whyItWorksLabel = document.getElementById('whyItWorksLabel');
  const targetAudienceInput = document.getElementById('targetAudience');
  const toneAndVoiceInput = document.getElementById('toneAndVoice');
  const techniquesInput = document.getElementById('techniques');
  const emotionalTriggersInput = document.getElementById('emotionalTriggers');
  const takeawaysInput = document.getElementById('takeaways');
  const tagsInput = document.getElementById('tags');

  const resultDiv = document.getElementById('result');

  // Initialize skills grid
  function initSkillsGrid(selectedSkills = []) {
    skillsGrid.innerHTML = ALL_SKILLS.map(skill => `
      <div class="skill-tag ${selectedSkills.includes(skill) ? 'selected' : ''}" data-skill="${skill}">
        ${skill}
      </div>
    `).join('');

    // Add click handlers
    skillsGrid.querySelectorAll('.skill-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        tag.classList.toggle('selected');
      });
    });
  }

  // Check server health
  async function checkServerHealth() {
    try {
      const response = await fetch(`${SERVER_URL}/health`);
      if (response.ok) {
        statusEl.textContent = 'Connected';
        statusEl.className = 'status connected';
        return true;
      }
    } catch (e) {}
    statusEl.textContent = 'Offline';
    statusEl.className = 'status disconnected';
    return false;
  }

  // Load and populate projects
  async function loadProjects() {
    try {
      const response = await fetch(`${SERVER_URL}/projects`);
      if (!response.ok) return;

      const data = await response.json();
      projectSelect.innerHTML = data.projects.map(p =>
        `<option value="${p.id}" ${p.id === data.activeProjectId ? 'selected' : ''}>${p.name}</option>`
      ).join('');
    } catch (e) {
      console.error('Failed to load projects:', e);
    }
  }

  // Switch active project
  async function switchProject(projectId) {
    try {
      const response = await fetch(`${SERVER_URL}/projects/active`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: projectId })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to switch project');
      }
    } catch (e) {
      console.error('Failed to switch project:', e);
      showResult(`Error: ${e.message}`, 'error');
      await loadProjects(); // Reload to reset selection
    }
  }

  // Add new project
  async function addNewProject(name, path) {
    const response = await fetch(`${SERVER_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, path })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to add project');
    }

    return data.project;
  }

  // Get current tab info
  async function getCurrentTabInfo() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return { url: tab.url, title: tab.title };
  }

  // Get selected text
  async function getSelectedText() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.getSelection().toString()
      });
      return results[0]?.result || '';
    } catch (e) {
      return '';
    }
  }

  // Initialize
  const serverOnline = await checkServerHealth();
  const tabInfo = await getCurrentTabInfo();
  urlInput.value = tabInfo.url;

  // Load projects if server is online
  if (serverOnline) {
    await loadProjects();
  }

  // Project selector change
  projectSelect.addEventListener('change', async () => {
    await switchProject(projectSelect.value);
  });

  // Open add project modal
  addProjectBtn.addEventListener('click', () => {
    addProjectModal.style.display = 'flex';
    addProjectError.style.display = 'none';
    newProjectNameInput.value = '';
    newProjectPathInput.value = '';
    newProjectNameInput.focus();
  });

  // Close modal
  closeModalBtn.addEventListener('click', () => {
    addProjectModal.style.display = 'none';
  });

  // Close modal on background click
  addProjectModal.addEventListener('click', (e) => {
    if (e.target === addProjectModal) {
      addProjectModal.style.display = 'none';
    }
  });

  // Add project form submission
  addProjectForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = newProjectNameInput.value.trim();
    const path = newProjectPathInput.value.trim();

    if (!name || !path) {
      addProjectError.textContent = 'Name and path are required';
      addProjectError.style.display = 'block';
      return;
    }

    setLoading(addProjectSubmitBtn, true);
    addProjectError.style.display = 'none';

    try {
      await addNewProject(name, path);
      await loadProjects();
      addProjectModal.style.display = 'none';
      showResult(`Project "${name}" added successfully`, 'success');
    } catch (err) {
      addProjectError.textContent = err.message;
      addProjectError.style.display = 'block';
    } finally {
      setLoading(addProjectSubmitBtn, false);
    }
  });

  // Like/Dislike toggle
  likeBtn.addEventListener('click', () => {
    sentiment = 'like';
    likeBtn.classList.add('active');
    dislikeBtn.classList.remove('active');
    analyzeBtn.classList.remove('dislike-mode');
    notesLabel.textContent = 'What do you like about this?';
    notesTextarea.placeholder = 'e.g., Love the headline and how they position themselves...';
  });

  dislikeBtn.addEventListener('click', () => {
    sentiment = 'dislike';
    dislikeBtn.classList.add('active');
    likeBtn.classList.remove('active');
    analyzeBtn.classList.add('dislike-mode');
    notesLabel.textContent = 'What should be avoided here?';
    notesTextarea.placeholder = 'e.g., Confusing messaging, weak CTA...';
  });

  // Back button
  backBtn.addEventListener('click', () => {
    step2.style.display = 'none';
    step1.style.display = 'block';
    resultDiv.style.display = 'none';
  });

  // STEP 1: Analyze form submission
  analyzeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const notes = notesTextarea.value.trim();
    if (!notes) {
      showResult('Please add some notes', 'error');
      return;
    }

    if (!serverOnline) {
      showResult('Server is offline. Start the swipe-server first.', 'error');
      return;
    }

    setLoading(analyzeBtn, true);
    resultDiv.style.display = 'none';

    try {
      const selectedText = await getSelectedText();

      const response = await fetch(`${SERVER_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: urlInput.value,
          pageTitle: tabInfo.title,
          selectedText,
          notes,
          sentiment
        })
      });

      const data = await response.json();

      if (response.ok) {
        currentAnalysis = data;
        populatePreviewForm(data);
        step1.style.display = 'none';
        step2.style.display = 'block';
      } else {
        showResult(data.error || 'Analysis failed', 'error');
      }
    } catch (err) {
      showResult(`Error: ${err.message}`, 'error');
    } finally {
      setLoading(analyzeBtn, false);
    }
  });

  // Populate the preview/edit form with analysis results
  function populatePreviewForm(data) {
    // Skills
    initSkillsGrid(data.skills || []);

    // Content type
    contentTypeInput.value = data.contentType || '';

    // Extracted content
    headlineInput.value = data.extracted?.headline || '';
    subheadlineInput.value = data.extracted?.subheadline || '';
    bodyCopyInput.value = data.extracted?.bodyCopy || '';
    ctaInput.value = data.extracted?.cta || '';
    keyPhrasesInput.value = (data.extracted?.keyPhrases || []).join(', ');

    // Analysis
    whyItWorksInput.value = data.analysis?.whyItWorks || '';
    whyItWorksLabel.textContent = data.isAntiExample ? 'Why it fails' : 'Why it works';
    targetAudienceInput.value = data.analysis?.targetAudience || '';
    toneAndVoiceInput.value = data.analysis?.toneAndVoice || '';
    techniquesInput.value = (data.analysis?.copywritingTechniques || []).join(', ');
    emotionalTriggersInput.value = (data.analysis?.emotionalTriggers || []).join(', ');

    // Takeaways
    takeawaysInput.value = (data.takeaways || []).map(t => `- ${t}`).join('\n');

    // Tags
    tagsInput.value = (data.tags || []).join(', ');

    // Update save button style
    if (data.isAntiExample) {
      saveBtn.classList.add('dislike-mode');
      saveBtn.querySelector('.btn-text').textContent = 'Save as Anti-Example';
    } else {
      saveBtn.classList.remove('dislike-mode');
      saveBtn.querySelector('.btn-text').textContent = 'Save to Swipe Files';
    }
  }

  // STEP 2: Save form submission
  saveForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get selected skills
    const selectedSkills = Array.from(skillsGrid.querySelectorAll('.skill-tag.selected'))
      .map(el => el.dataset.skill);

    if (selectedSkills.length === 0) {
      showResult('Please select at least one skill', 'error');
      return;
    }

    setButtonState(saveBtn, 'loading');

    try {
      // Build the save payload from form values
      const payload = {
        url: currentAnalysis.url,
        pageTitle: currentAnalysis.pageTitle,
        userNotes: currentAnalysis.userNotes,
        sentiment: currentAnalysis.sentiment,
        skills: selectedSkills,
        contentType: contentTypeInput.value,
        extracted: {
          headline: headlineInput.value || null,
          subheadline: subheadlineInput.value || null,
          bodyCopy: bodyCopyInput.value || null,
          cta: ctaInput.value || null,
          keyPhrases: keyPhrasesInput.value ? keyPhrasesInput.value.split(',').map(s => s.trim()) : []
        },
        analysis: {
          whyItWorks: whyItWorksInput.value || null,
          targetAudience: targetAudienceInput.value || null,
          toneAndVoice: toneAndVoiceInput.value || null,
          copywritingTechniques: techniquesInput.value ? techniquesInput.value.split(',').map(s => s.trim()) : [],
          emotionalTriggers: emotionalTriggersInput.value ? emotionalTriggersInput.value.split(',').map(s => s.trim()) : []
        },
        takeaways: takeawaysInput.value ? takeawaysInput.value.split('\n').map(s => s.replace(/^-\s*/, '').trim()).filter(Boolean) : [],
        tags: tagsInput.value ? tagsInput.value.split(',').map(s => s.trim()) : [],
        isAntiExample: currentAnalysis.isAntiExample
      };

      const response = await fetch(`${SERVER_URL}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        // Show success state on button with count
        const count = data.skills.length;
        setButtonState(saveBtn, 'success', `Saved to ${count} file${count > 1 ? 's' : ''}`);

        // Reset after delay
        setTimeout(() => {
          step2.style.display = 'none';
          step1.style.display = 'block';
          notesTextarea.value = '';
          resultDiv.style.display = 'none';
          setButtonState(saveBtn, 'default');
        }, 1500);
      } else {
        setButtonState(saveBtn, 'error');
        showResult(data.error || 'Save failed', 'error');
      }
    } catch (err) {
      setButtonState(saveBtn, 'error');
      showResult(`Error: ${err.message}`, 'error');
    }
  });

  function setLoading(button, loading) {
    button.disabled = loading;
    button.classList.remove('success-state', 'error-state');
    button.querySelector('.btn-text').style.display = loading ? 'none' : 'inline';
    button.querySelector('.btn-loading').style.display = loading ? 'inline-flex' : 'none';
    const successEl = button.querySelector('.btn-success');
    const errorEl = button.querySelector('.btn-error');
    if (successEl) successEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'none';
  }

  function setButtonState(button, state, customText = null) {
    // state: 'default', 'loading', 'success', 'error'
    button.classList.remove('success-state', 'error-state');
    button.querySelector('.btn-text').style.display = 'none';
    button.querySelector('.btn-loading').style.display = 'none';
    const successEl = button.querySelector('.btn-success');
    const errorEl = button.querySelector('.btn-error');
    if (successEl) successEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'none';

    switch (state) {
      case 'loading':
        button.disabled = true;
        button.querySelector('.btn-loading').style.display = 'inline-flex';
        break;
      case 'success':
        button.disabled = true;
        button.classList.add('success-state');
        if (successEl) {
          successEl.textContent = customText || 'Saved!';
          successEl.style.display = 'inline';
        }
        break;
      case 'error':
        button.disabled = false;
        button.classList.add('error-state');
        if (errorEl) errorEl.style.display = 'inline';
        break;
      default:
        button.disabled = false;
        button.querySelector('.btn-text').style.display = 'inline';
    }
  }

  function showResult(message, type) {
    resultDiv.innerHTML = message;
    resultDiv.className = `result ${type}`;
    resultDiv.style.display = 'block';
  }
});
