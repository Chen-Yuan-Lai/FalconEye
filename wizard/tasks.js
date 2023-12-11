import fs from 'fs/promises';
import ora from 'ora';
import chalk from 'chalk';
import esbuild from 'esbuild';
import sendSourceMap from './sendSourceMap.js';
import writeYamlFile from './actionScripts/createGitHubAction.js';
import validate from './validate.js';

const nextLine = async num => {
  for (let i = 0; i < num; i++) {
    console.log(chalk.bold('|'));
    await new Promise(resolve => setTimeout(resolve, 50));
  }
};

const isValid = async (userKey, clientToken) => {
  try {
    await validate(userKey, clientToken);
    return true;
  } catch (err) {
    return false;
  }
};
const isUpload = async (map, userKey, clientToken) => {
  try {
    await sendSourceMap(map, userKey, clientToken);
    return true;
  } catch (err) {
    return false;
  }
};

const runTasks = async answers => {
  const { path, userKey, clientToken, noGit, hasGit } = answers;
  console.log(
    chalk.bold(`
  ==================================
  ||                              ||
  ||  Let's start configuration~  ||
  ||                              ||
  ==================================
  `)
  );

  console.log(`✨ ${chalk.bold('1) Validating user key & client token')}`);
  const spinner = ora('Processing').start();

  await new Promise(resolve => setTimeout(resolve, 500));
  if (await isValid(userKey, clientToken)) {
    spinner.succeed(chalk.green('Operation successful.'));
  } else {
    spinner.fail(chalk.red('Operation failed.'));
    throw new Error('Please enter correct user key or client token');
  }
  await nextLine(3);

  console.log(`✨ ${chalk.bold('2) Building source map')}`);
  spinner.start();
  await esbuild.build({
    entryPoints: [path],
    bundle: true,
    sourcemap: true,
    format: 'esm',
    platform: 'node',
    outfile: './bundle.js',
  });
  spinner.succeed(chalk.green('Operation successful.'));
  await nextLine(3);
  console.log(`✨ ${chalk.bold('3) Uploading source map')}`);
  spinner.start();

  const map = await fs.readFile('./bundle.js.map', 'utf8');
  if (await isUpload(map, userKey, clientToken)) {
    spinner.succeed(chalk.green('Operation successful.'));
  } else {
    spinner.fail(chalk.red('Operation failed.'));
    throw new Error('something wrong in uploading');
  }
  await nextLine(3);

  if (!noGit && hasGit) {
    console.log(`✨ ${chalk.bold('4) build auto uploading workflow')}`);
    spinner.start();
    await writeYamlFile(path);
    spinner.succeed(chalk.green('Operation successful.'));
  }
  await nextLine(3);
  console.log(`✨ ${chalk.bold('5) Deleting unnecessary files')}`);
  spinner.start();
  await fs.unlink('./bundle.js');
  await fs.unlink('./bundle.js.map');
  spinner.succeed(chalk.green('Operation successful.'));

  console.log(chalk.bold('configuration completed! Bye~'));
};

export default runTasks;
