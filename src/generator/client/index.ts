import { join } from 'path';
import { z } from 'zod';

import { type AppSchema } from '../../schemas/index.js';
import { initTsMorphProject } from '../utils.js';
import { generateSidebarLinks } from './navigation.js';
import { generatePages } from './pages.js';
import { generateRoutes } from './routing.js';
import { generateSources } from './sources.js';

export async function generateClient(
  appConfig: z.infer<typeof AppSchema>,
  outDir: string
) {
  const clientOutDir = join(outDir, 'apps', 'client');
  const project = initTsMorphProject(clientOutDir);

  await generateSources(project, appConfig.sources, clientOutDir);
  await generatePages(project, appConfig.pages, clientOutDir);
  await generateRoutes(project, appConfig.pages, clientOutDir);
  await generateSidebarLinks(project, appConfig.pages, clientOutDir);

  await project.save();
}
