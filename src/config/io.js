import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export const recodexCfgFileName = '.recodex-solution.json';

/**
 * Save configuration to a file called '.recodex-solution.json' in the given directory.
 * This function is blocking.
 * @param {string} The direcotry
 * @param {object} Configuration of the solution
 * @param {boolean} Add the file to .gitignore (if in git repo)
 * @return {void}
 */
export const saveConfig = (dir, cfg, ignore = true) => {
  const fileName = recodexCfgFileName;
  // make sure that this file is not added to the git repository (if user uses some)
  if (ignore && isGitRepo(dir, fileName) && isIgnoredByGit(dir, fileName) === false) {
    addToGitignore(dir, fileName);
  }

  const serializedCfg = JSON.stringify(cfg);
  return fs.writeFileSync(path.resolve(dir, fileName), serializedCfg);
};

/**
 * This function is blocking.
 * @param {string} Directory name
 * @return {boolean} User has git installed (and in PATH) and directory is a git repository
 */
export const isGitRepo = (dir) => {
  try {
    const out = execSync('git rev-parse --is-inside-work-tree', {
      cwd: dir,
      stdio: [ 'pipe', 'pipe', 'ignore' ] // do not print out error messages
    }).toString().trim();
    return out === 'true';
  } catch (err) {
    return false;
  }
};

/**
 * Add a file to the gitignore file.
 * This function is blocking.
 */
export const addToGitignore = (dir, fileName = recodexCfgFileName) => {
  const gitignore = path.resolve(dir, '.gitignore');
  const data = `
# ReCodEx information -- remove from .gitignore if you really want to commit
# your access token to the people who have access to the repository
${fileName}`;
  fs.appendFileSync(gitignore, data);
};

export const isIgnoredByGit = (dir, filePath = recodexCfgFileName) => {
  // --ignored = show also ignored files, --porcelain = machine readable format
  const out = execSync(`git status ${filePath} --ignored --porcelain`, { cwd: dir }).toString().trim();
  return out.substr(0, 3) === '!! '; // ignored files yield '!! <file name>' as output
};

/**
 * Load submissions' configuration from a file.
 * @param {string} Directory of the submission
 * @return {SubmissionConfig} Submission configuration
 */
export const loadConfig = (dir) => {
  //
};
