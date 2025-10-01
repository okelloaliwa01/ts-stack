import { join } from 'path';
import { Project, VariableDeclarationKind } from 'ts-morph';
import { z } from 'zod';

import {
  type AppSchema,
  SchemaSchema,
  SourceSchema,
} from '../../schemas/index.js';

const implementations = {
  sqlite: {
    number: 'int().primaryKey({ autoIncrement: true })',
    string: 'text().notNull()',
  },
};

function generateTable(
  project: Project,
  schemas: Record<string, z.infer<typeof SchemaSchema>>,
  sourceName: string,
  sourceSchema: z.infer<typeof SourceSchema>,
  outDir: string
) {
  const tableFile = project.createSourceFile(
    join(outDir, 'src', 'db', `${sourceName}.ts`),
    '',
    { overwrite: true }
  );

  tableFile.addImportDeclarations([
    {
      moduleSpecifier: 'drizzle-orm/sqlite-core',
      namedImports: ['int', 'text', 'sqliteTable'],
    },
    {
      moduleSpecifier: 'drizzle-zod',
      namedImports: ['createInsertSchema', 'createUpdateSchema'],
    },
  ]);

  tableFile.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: `${sourceName}`,
        initializer: (writer) => {
          writer.write(`sqliteTable('${sourceName}', {`);
          for (const [name, type] of Object.entries(
            schemas[sourceSchema.schema]
          )) {
            writer.write(`${name}: ${implementations.sqlite[type]},`);
          }
          writer.write(`});`);
        },
      },
    ],
  });

  tableFile.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: `${sourceName}InsertSchema`,
        initializer: (writer) => {
          writer.write(`createInsertSchema(${sourceName});`);
        },
      },
    ],
  });

  tableFile.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: `${sourceName}UpdateSchema`,
        initializer: (writer) => {
          writer.write(`createUpdateSchema(${sourceName});`);
        },
      },
    ],
  });
}

export async function generateDatabase(
  project: Project,
  appConfig: z.infer<typeof AppSchema>,
  outDir: string
) {
  const dbMainFile = project.createSourceFile(
    join(outDir, 'src', 'db', 'index.ts'),
    '',
    { overwrite: true }
  );

  const sources = Object.entries(appConfig.sources).filter(
    ([_, sourceConfig]) => sourceConfig.type === 'local'
  );

  dbMainFile.addImportDeclarations([
    { moduleSpecifier: '@libsql/client', namedImports: ['createClient'] },
    { moduleSpecifier: 'drizzle-orm/libsql', namedImports: ['drizzle'] },
    ...sources.map(([sourceName]) => ({
      moduleSpecifier: `./${sourceName}.ts`,
      namespaceImport: sourceName,
    })),
  ]);

  dbMainFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: 'client',
        initializer: (writer) => {
          writer.write('createClient({ url: process.env.DB_FILE_NAME! });');
        },
      },
    ],
  });

  dbMainFile.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: 'db',
        initializer: (writer) => {
          writer.write(
            `drizzle({ client, schema: {${sources.map(([sourceName]) => `...${sourceName}`)}} })`
          );
        },
      },
    ],
  });

  for (const [sourceName, sourceSchema] of sources) {
    generateTable(project, appConfig.schemas, sourceName, sourceSchema, outDir);
  }
}
