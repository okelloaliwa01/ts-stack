import { join } from 'path';
import { Project, VariableDeclarationKind } from 'ts-morph';
import { z } from 'zod';

import { AppSchema, SourceSchema } from '../../schemas/index.js';
import { toSentenceCase } from '../../utils.js';

function generateRouter(
  project: Project,
  sourceName: string,
  sourceConfig: z.infer<typeof SourceSchema>,
  outDir: string
) {
  const routeFile = project.createSourceFile(
    join(outDir, 'src', 'routes', `${sourceName}.ts`),
    '',
    { overwrite: true }
  );

  routeFile.addImportDeclarations([
    { namedImports: ['Hono'], moduleSpecifier: 'hono' },
    { namedImports: ['zValidator'], moduleSpecifier: '@hono/zod-validator' },
    { namedImports: ['db'], moduleSpecifier: '../db/index.js' },
    {
      namedImports: [
        `${sourceName} as ${sourceName}Table`,
        `${sourceName}InsertSchema`,
        `${sourceName}UpdateSchema`,
      ],
      moduleSpecifier: `../db/${sourceName}.js`,
    },
  ]);

  routeFile.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: sourceName,
        initializer: (writer) => {
          writer.write(`new Hono()`);
          writer.write(`
            .get(
              '/',
              async (c) => c.json({ data: await db.query.${sourceName}.findMany() }, 200)
            )
            .post(
              '/',
              zValidator('form', ${sourceName}InsertSchema),
              async (c) => {
                const payload = c.req.valid('form');
                await db.insert(${sourceName}Table).values(payload)
                return c.json({ ok: true }, 201)
              }
            )
            .patch(
              '/:id',
              zValidator('form', ${sourceName}UpdateSchema),
              (c) => c.json({ ok: true }, 200)
            )
          `);
        },
      },
    ],
  });
}

export async function generateRouters(
  project: Project,
  appConfig: z.infer<typeof AppSchema>,
  outDir: string
) {
  const mainFile = project.getSourceFile(join(outDir, 'src', 'index.ts'));
  const typesFile = project.createSourceFile(
    join(outDir, 'src', 'types.ts'),
    '',
    { overwrite: true }
  );
  const honoAppConst = mainFile.getVariableDeclarationOrThrow('app');

  const routes: string[] = [];
  for (const [sourceName, sourceConfig] of Object.entries(
    appConfig.sources
  ).filter(([_, sourceConfig]) => sourceConfig.type === 'local')) {
    mainFile.addImportDeclaration({
      moduleSpecifier: `./routes/${sourceName}.js`,
      namedImports: [`${sourceName}`],
    });

    generateRouter(project, sourceName, sourceConfig, outDir);
    routes.push(`.route('/${sourceName}', ${sourceName})`);

    typesFile.addImportDeclaration({
      namedImports: [sourceName],
      moduleSpecifier: `./routes/${sourceName}.js`,
    });

    typesFile.addTypeAlias({
      isExported: true,
      name: toSentenceCase(sourceName),
      type: `typeof ${sourceName}`,
    });
  }

  const initializerText = honoAppConst.getInitializerOrThrow().getText();
  honoAppConst.setInitializer([initializerText, ...routes].join('\n'));
}
