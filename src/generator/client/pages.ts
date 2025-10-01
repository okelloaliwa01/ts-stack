import path from 'path';
import { Project } from 'ts-morph';
import { z } from 'zod';

import { componentsImpl } from '../../implementations/components/index.js';
import { PageSchema } from '../../schemas/index.js';
import {
  getPageComponents,
  importComponents,
  renderComponents,
} from '../../utils.js';

export async function generatePage(
  project: Project,
  pageConfig: z.infer<typeof PageSchema>,
  outDir: string
) {
  const file = project.createSourceFile(
    path.join(outDir, 'src/pages', `${pageConfig.name}.tsx`),
    '',
    { overwrite: true }
  );

  importComponents(file, pageConfig.components);

  file.addFunction({
    name: pageConfig.name,
    isDefaultExport: true,
    statements: (writer) => {
      for (const componentConfig of getPageComponents(pageConfig)) {
        componentsImpl[componentConfig.type].addSetupStatements(
          writer,
          componentConfig
        );
      }
      writer.write('return (');
      writer.indent(() => {
        writer.write('<div className="p-4">');
        renderComponents(file, writer, pageConfig.components);
        writer.write('</div>');
      });
      writer.write(');');
    },
  });
}

export async function generatePages(
  project: Project,
  pagesConfig: z.infer<typeof PageSchema>[],
  outDir: string
) {
  for (const page of pagesConfig) {
    await generatePage(project, page, outDir);
  }
}
