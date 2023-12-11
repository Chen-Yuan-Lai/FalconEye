import yaml from 'js-yaml';
import { writeFile, mkdir } from 'fs/promises';

const writeYamlFile = async filePath => {
  const config = {
    name: 'Build and upload source map',
    on: {
      push: {
        branches: ['main'],
      },
      pull_request: {
        branches: ['main'],
      },
    },
    jobs: {
      'build-and-upload-source-map': {
        'runs-on': 'ubuntu-latest',
        steps: [
          {
            name: 'Setup Node',
            uses: 'actions/setup-node@v4',
            with: {
              'node-version': 20,
              cache: 'npm',
            },
          },
          { run: 'npm i esbuild' },
          {
            name: 'Build Source Map',
            run: `npx esbuild ${filePath} --bundle --sourcemap --format=esm --platform=node --outfile=./bundle.js`,
          },
          {
            name: 'Upload Source Map',
            env: {
              USER_KEY: '${{ secrets.USER_KEY }}',
              CLIENT_TOKEN: '${{ secrets.CLIENT_TOKEN }}',
            },
            run: `curl -X POST http://handsomelai.shop/api/1.0/sourceMap \\
              -H "Content-Type: multipart/form-data" \\
              -F "map=./bundle.js.map;type=application/octet-stream" \\
              -F "userKey=\${USER_KEY}" \\
              -F "clientToken=\${CLIENT_TOKEN}"`,
          },
        ],
      },
    },
  };

  const yamlStr = yaml.dump(config);

  await mkdir('./.github/workflows', { recursive: true });
  await writeFile('./.github/workflows/sendSourceMap.yaml', yamlStr);
};

export default writeYamlFile;
