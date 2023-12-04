import { exec } from 'child_process';
import { readFile } from 'fs/promises';
import os from 'os';
import { promisify } from 'util';

const execAsync = promisify(exec);
// todo 之後修改SDK蒐集event的資訊
const getOsVersion = async () => {
  try {
    const osType = os.type();
    let data;
    if (osType === 'Linux') {
      const data = await readFile('/etc/os-release', 'utf8');
      // Parse and return relevant info from data
      return data;
    } else if (osType === 'Darwin') {
      // macOS
      const { stdout } = await execAsync('sw_vers');
      return stdout;
    } else if (osType === 'Windows_NT') {
      // Windows
      const { stdout } = await execAsync('wmic os get Caption, Version');
      return stdout;
    } else {
      return 'Unknown OS';
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return 'Error fetching OS version';
  }
};

getOsVersion().then(versionInfo => console.log(versionInfo));
