import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import fs from 'fs-extra';
import path from 'path';
import { z } from 'zod';

import type { AppSchema } from '../schemas/index.js';
import { generateClient } from './client/index.js';
import { generateSchemas } from './schemas/index.js';
import { generateServer } from './server/index.js';

export async function generateProject(
  appConfig: z.infer<typeof AppSchema>,
  outDir: string
) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const templateDir = path.resolve(__dirname, '../../template');
  await fs.copy(templateDir, outDir, {
    filter: (src: string) => {
      const relative = path.relative(templateDir, src);
      return !relative.includes('node_modules') && !relative.includes('.turbo');
    },
  });

  await fs.writeFile(
    path.join(outDir, 'apps', 'server', '.env'),
    'DB_FILE_NAME=file:local.db\n'
  );

  await generateSchemas(appConfig.schemas, outDir);
  await generateClient(appConfig, outDir);
  await generateServer(appConfig, outDir);

  fs.removeSync(path.join(outDir, 'node_modules'));

  execSync('npm install', { cwd: outDir, stdio: 'inherit' });
  execSync('npm run format', { cwd: outDir, stdio: 'inherit' });
  execSync('npm run lint', { cwd: outDir, stdio: 'inherit' });
}
