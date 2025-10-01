import { join } from 'path';
import { z } from 'zod';

import type { AppSchema } from '../../schemas/index.js';
import { initTsMorphProject } from '../utils.js';
import { generateDatabase } from './database.js';
import { generateRouters } from './routes.js';

export async function generateServer(
  appConfig: z.infer<typeof AppSchema>,
  outDir: string
) {
  const serverOutDir = join(outDir, 'apps', 'server');
  const project = initTsMorphProject(serverOutDir);

  await generateRouters(project, appConfig, serverOutDir);
  await generateDatabase(project, appConfig, serverOutDir);

  await project.save();
}
