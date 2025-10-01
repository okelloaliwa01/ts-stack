import { Project, VariableDeclarationKind } from 'ts-morph';
import { z } from 'zod';
import { AppSchema, SchemaSchema } from '../../schemas/index.js';
import path from 'path';
import { join } from 'path';
import { toSentenceCase } from '../../utils.js';
import { initTsMorphProject } from '../utils.js';

async function generateSchema(
  project: Project,
  schemaName: string,
  schemaConfig: z.infer<typeof SchemaSchema>,
  outDir: string
) {
  const file = project.createSourceFile(
    path.join(outDir, 'src', `${schemaName}.ts`),
    '',
    { overwrite: true }
  );

  file.addImportDeclaration({ namedImports: ['z'], moduleSpecifier: 'zod' });

  file.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: `${toSentenceCase(schemaName)}Schema`,
        initializer: (writer) => {
          writer.write(`z.object({`);
          for (const [name, type] of Object.entries(schemaConfig)) {
            writer.write(`${name}: z.${type}(),`);
          }
          writer.write(`})`);
        },
      },
    ],
  });
}

export async function generateSchemas(
  schemasConfig: z.infer<typeof AppSchema>['schemas'],
  outDir: string
) {
  const schemasOutDir = join(outDir, 'packages', 'schemas');
  const project = initTsMorphProject(schemasOutDir);

  const indexFile = project.createSourceFile(
    path.join(schemasOutDir, 'index.ts'),
    '',
    { overwrite: true }
  );

  for (const [schemaName, schemaConfig] of Object.entries(schemasConfig)) {
    await generateSchema(project, schemaName, schemaConfig, schemasOutDir);
    indexFile.addExportDeclaration({
      moduleSpecifier: `./src/${schemaName}.js`,
    });
  }

  await project.save();
}
