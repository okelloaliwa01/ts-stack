import type { SourceFile } from 'ts-morph';

import type { RemoteConfig } from '../../schemas/sources/remote.js';
import { toSentenceCase } from '../../utils.js';

function addImports(
  file: SourceFile,
  sourceName: string,
  sourceConfig: RemoteConfig
) {
  file.addImportDeclarations([
    { namedImports: ['z'], moduleSpecifier: 'zod' },
    {
      namedImports: [`${toSentenceCase(sourceConfig.schema)}Schema`],
      moduleSpecifier: `@repo/schemas`,
    },
    { defaultImport: 'axios', moduleSpecifier: 'axios' },
    { namedImports: ['useQuery'], moduleSpecifier: '@tanstack/react-query' },
  ]);
}

function render(
  file: SourceFile,
  sourceName: string,
  sourceConfig: RemoteConfig
) {
  const { schema, url } = sourceConfig;
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
            const res = await axios.get<z.infer<typeof ${toSentenceCase(schema)}Schema>[]>('${url}');
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
