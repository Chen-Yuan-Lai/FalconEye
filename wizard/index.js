import fs from 'fs/promises';
import { exec as execCallback } from 'child_process';
import { promisify } from 'util';
import { input, select } from '@inquirer/prompts';
import runTasks from './tasks.js';

const exec = promisify(execCallback);

// Function to check of .git directory exists
const isGitRepository = async () => {
  try {
    await fs.access('.git');
    return true;
  } catch {
    try {
      const { stdout } = await exec('git rev-parse --is-inside-work-tree');
      return stdout.trim() === 'true';
    } catch {
      return false;
    }
  }
};

const isFileExists = async filePath => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const wizard = async () => {
  try {
    const isGitRepo = await isGitRepository();
    const answers = {};
    if (!isGitRepo) {
      answers.noGit = await select({
        message: `You don't have a git repository. Do you want to continue?`,
        default: false,
        choices: [
          { name: 'yes', value: true },
          { name: 'no', value: false },
        ],
      });
    } else {
      answers.hasGit = await select({
        message: `It seems you have a git repository. Do you want to configure github action to upload source map automatically?`,
        default: false,
        choices: [
          { name: 'yes', value: true },
          { name: 'no', value: false },
        ],
      });
    }
    if (answers.noGit && !answers.noGit) {
      console.log('Byeeeeee!');
      process.exit();
    }

    answers.path = await input({
      message: '1. enter the path of your entry file',
      validate: async filePath => {
        if (!(await isFileExists(filePath))) {
          return 'not a valid path';
        }

        const pathArr = filePath.split('.');
        const fileExtension = pathArr[pathArr.length - 1];

        if (fileExtension !== 'js') {
          return 'not a valid file';
        }

        return true;
      },
    });

    answers.userKey = await input({
      message: '2. Enter your user key',
      validate: input => {
        if (input === '') {
          return "user key can't be empty";
        }
        return true;
      },
    });

    answers.clientToken = await input({
      message: '3. Enter your client token of your project',
      validate: input => {
        if (input === '') {
          return "client token can't be empty";
        }
        return true;
      },
    });

    // run tasks
    await runTasks(answers);
  } catch (err) {
    if (err.message === 'User force closed the prompt with 0 null') {
      console.log(chalk.blue.bgRed.bold('Byeee!'));
      process.exit();
    }
    console.error(err);
    process.exit();
  }
};

await wizard();
