import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECTS_FILE = path.join(__dirname, 'projects.json');

// Default project (current Commercial folder)
const DEFAULT_PROJECT = {
  id: 'commercial',
  name: 'Commercial',
  path: path.join(__dirname, '..')
};

let projectsData = null;

/**
 * Load projects from file, initialize if doesn't exist
 */
export async function loadProjects() {
  try {
    const data = await fs.readFile(PROJECTS_FILE, 'utf-8');
    projectsData = JSON.parse(data);
  } catch (error) {
    // File doesn't exist, create with default
    projectsData = {
      projects: [DEFAULT_PROJECT],
      activeProjectId: DEFAULT_PROJECT.id
    };
    await saveProjects();
  }
  return projectsData;
}

/**
 * Save projects to file
 */
export async function saveProjects() {
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(projectsData, null, 2));
}

/**
 * Get all projects
 */
export async function getProjects() {
  if (!projectsData) await loadProjects();
  return {
    projects: projectsData.projects,
    activeProjectId: projectsData.activeProjectId
  };
}

/**
 * Add a new project
 */
export async function addProject(name, projectPath) {
  if (!projectsData) await loadProjects();

  // Validate path
  const validation = await validateProjectPath(projectPath);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Generate ID from name
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // Check for duplicate ID
  if (projectsData.projects.some(p => p.id === id)) {
    throw new Error(`A project with ID "${id}" already exists`);
  }

  // Check for duplicate path
  const normalizedPath = path.resolve(projectPath);
  if (projectsData.projects.some(p => path.resolve(p.path) === normalizedPath)) {
    throw new Error('A project with this path already exists');
  }

  const newProject = {
    id,
    name,
    path: normalizedPath
  };

  projectsData.projects.push(newProject);
  projectsData.activeProjectId = id; // Auto-select new project
  await saveProjects();

  return newProject;
}

/**
 * Remove a project
 */
export async function removeProject(id) {
  if (!projectsData) await loadProjects();

  const index = projectsData.projects.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Project "${id}" not found`);
  }

  // Don't allow removing the last project
  if (projectsData.projects.length === 1) {
    throw new Error('Cannot remove the last project');
  }

  projectsData.projects.splice(index, 1);

  // If we removed the active project, switch to first available
  if (projectsData.activeProjectId === id) {
    projectsData.activeProjectId = projectsData.projects[0].id;
  }

  await saveProjects();
  return { success: true };
}

/**
 * Set the active project
 */
export async function setActiveProject(id) {
  if (!projectsData) await loadProjects();

  const project = projectsData.projects.find(p => p.id === id);
  if (!project) {
    throw new Error(`Project "${id}" not found`);
  }

  projectsData.activeProjectId = id;
  await saveProjects();

  return project;
}

/**
 * Get the active project
 */
export async function getActiveProject() {
  if (!projectsData) await loadProjects();

  const project = projectsData.projects.find(p => p.id === projectsData.activeProjectId);
  if (!project) {
    // Fallback to first project
    return projectsData.projects[0];
  }
  return project;
}

/**
 * Get the active project's path
 */
export async function getActiveProjectPath() {
  const project = await getActiveProject();
  return project.path;
}

/**
 * Validate that a path is a valid project (has .claude/skills/)
 */
export async function validateProjectPath(projectPath) {
  try {
    // Check path exists
    const resolvedPath = path.resolve(projectPath);
    await fs.access(resolvedPath);

    // Check for .claude/skills directory
    const skillsPath = path.join(resolvedPath, '.claude', 'skills');
    await fs.access(skillsPath);

    // Check that at least one skill folder exists
    const contents = await fs.readdir(skillsPath);
    const skillFolders = contents.filter(name => !name.startsWith('.'));

    if (skillFolders.length === 0) {
      return {
        valid: false,
        error: 'No skill folders found in .claude/skills/'
      };
    }

    return { valid: true, skillCount: skillFolders.length };

  } catch (error) {
    if (error.code === 'ENOENT') {
      return {
        valid: false,
        error: 'Path does not exist or missing .claude/skills/ directory'
      };
    }
    return {
      valid: false,
      error: `Validation error: ${error.message}`
    };
  }
}

// Initialize on import
loadProjects().catch(console.error);
