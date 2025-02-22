#!/usr/bin/env node
import packageJson from './package.json' with { type: 'json' };
import cp from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

console.log(`Version ${packageJson.version}`);

const folderName = process.argv.slice(2)[0];
const sourcePath = path.resolve(import.meta.dirname, 'template');
const targetPath = path.join(process.cwd(), folderName);
fs.mkdirSync(targetPath, { recursive: true });
fs.cpSync(sourcePath, targetPath, { recursive: true });
process.chdir(targetPath);
const packageName = path.basename(targetPath);
console.info(`Setting package name to ${packageName}...`);
cp.execSync(`npm pkg set name='${packageName}'`);
console.info(`Installing dependencies...`);
cp.execSync(`npm install`);
console.info(`Dependencies installed`);
console.info(`Initializing git repository...`);
fs.writeFileSync(path.join(targetPath, '.gitignore'), 'node_modules\n');
cp.execSync('git init');
console.info('Git repository initialized');
console.info('Creating initial commit...');
cp.execSync('git add .');
cp.execSync('git commit -m "initial commit"');
console.info('Initial commit created');
