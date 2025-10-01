import path from 'path';
import { Project } from 'ts-morph';

import { sourcesImpl } from '../../implementations/sources/index.js';
import { type SourceConfig } from '../../schemas/index.js';

async function generateSource(
  project: Project,
  sourceName: string,
  sourceConfig: SourceConfig,
  outDir: string
) {
  const file = project.createSourceFile(
    path.join(outDir, 'src/sources', `use-${sourceName}.ts`),
    '',
    { overwrite: true }
  );

  sourcesImpl[sourceConfig.type].addImports(file, sourceName, sourceConfig);
  sourcesImpl[sourceConfig.type].render(file, sourceName, sourceConfig);
}

export async function generateSources(
  project: Project,
  sourcesConfig: Record<string, SourceConfig>,
  outDir: string
) {
  for (const [sourceName, sourceConfig] of Object.entries(sourcesConfig)) {
    await generateSource(project, sourceName, sourceConfig, outDir);
  }
}
