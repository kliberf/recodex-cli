import { expect } from 'chai';
import { resolve } from 'path';
import { existsSync, unlinkSync, readFileSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import touch from 'touch';

import {
  recodexCfgFileName,
  saveConfig,
  isGitRepo,
  addToGitignore,
  isIgnoredByGit
} from '../../src/config/io';

describe('git manipulation', () => {
  it('must recognize git repo', () => {
    const root = resolve(__dirname, '../../');
    expect(isGitRepo(root)).to.equal(true);
  });

  it('must recognize non-repo', () => {
    expect(isGitRepo(tmpdir())).to.equal(false); // OS temp dir won't be ever in a repo
  });

  it('must find out that a file is NOT ignored by the .gitignore', () => {
    const dir = resolve(__dirname, '../../');
    const fileName = 'README.md';
    expect(isIgnoredByGit(dir, fileName)).to.equal(false);
  });

  it('must find out that a file is ignored by the .gitignore', () => {
    const dir = resolve(__dirname, '../..');
    const fileName = 'x.log';
    const filePath = resolve(dir, fileName);
    const fileExisted = existsSync(filePath);

    try {
      if (!fileExisted) {
        touch.sync(filePath);
      }

      // all *.log are inored according to .gitignore of this repo
      expect(isIgnoredByGit(dir, fileName)).to.equal(true);
    } finally {
      if (!fileExisted) {
        unlinkSync(filePath);
      }
    }
  });

  it('must add file ignoring to the .gitignore', () => {
    const dir = resolve(__dirname, '../..');
    const gitignorePath = resolve(dir, '.gitignore');
    const oldGitignore = readFileSync(gitignorePath).toString();
    let randomNotIgnoredName = 'a.txt';
    while (isIgnoredByGit(dir, randomNotIgnoredName)) {
      randomNotIgnoredName = 'a' + randomNotIgnoredName;
    }

    try {
      touch.sync(randomNotIgnoredName);
      addToGitignore(dir, randomNotIgnoredName);
      expect(isIgnoredByGit(dir, randomNotIgnoredName)).to.equal(true);
    } finally {
      unlinkSync(randomNotIgnoredName);
      writeFileSync(gitignorePath, oldGitignore);
    }
  });
});
