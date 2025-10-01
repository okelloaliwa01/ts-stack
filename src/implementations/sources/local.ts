import type { SourceFile } from 'ts-morph';

import type { LocalConfig } from '../../schemas/sources/local.js';
import { toSentenceCase } from '../../utils.js';

function addImports(
  file: SourceFile,
  sourceName: string,
  sourceConfig: LocalConfig
) {
  file.addImportDeclarations([
    { namedImports: ['z'], moduleSpecifier: 'zod' },
    {
      namedImports: [`${toSentenceCase(sourceConfig.schema)}Schema`],
      moduleSpecifier: `@repo/schemas`,
    },
    { namedImports: ['useQuery'], moduleSpecifier: '@tanstack/react-query' },
    { namedImports: ['hc'], moduleSpecifier: 'hono/client' },
    {
      namedImports: [toSentenceCase(sourceName)],
      moduleSpecifier: '@repo/server/types',
    },
  ]);
}

function render(
  file: SourceFile,
  sourceName: string,
  sourceConfig: LocalConfig
) {
  const { schema } = sourceConfig;
  file.addFunction({
    name: `use${toSentenceCase(sourceName)}`,
    isExported: true,
    returnType: `{ ${sourceName}: z.infer<typeof ${toSentenceCase(schema)}Schema>[]; isLoading: false; error: null } | { ${sourceName}: null; isLoading: true; error: null } | { ${sourceName}: null; isLoading: false; error: Error }`,
    statements: (writer) => {
      writer.write(`
        const { data, isLoading, error } = useQuery({
          retry: false,
          queryKey: ['${toSentenceCase(sourceName)}'],
          queryFn: async () => {
            const client = hc<${toSentenceCase(sourceName)}>('http://localhost:3000/${sourceName}');
            const res = await (await client.index.$get()).json();
            return { ${sourceName}: res.data };
          },
          staleTime: 1000 * 60 * 5,
        });

        if (error) return { ${sourceName}: null, isLoading: false, error };

        if (isLoading) return { ${sourceName}: null, isLoading: true, error: null };

        return { ${sourceName}: data!.${sourceName}, isLoading: false, error: null };
      `);
    },
  });
}

export default { addImports, render };
