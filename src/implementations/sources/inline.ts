import type { SourceFile } from 'ts-morph';

import type { InlineConfig } from '../../schemas/sources/inline.js';
import { toSentenceCase } from '../../utils.js';

function addImports(
  file: SourceFile,
  sourceName: string,
  sourceConfig: InlineConfig
) {
  file.addImportDeclarations([
    { namedImports: ['z'], moduleSpecifier: 'zod' },
    {
      namedImports: [`${toSentenceCase(sourceConfig.schema)}Schema`],
      moduleSpecifier: `@repo/schemas`,
    },
  ]);
}

function render(
  file: SourceFile,
  sourceName: string,
  sourceConfig: InlineConfig
) {
  file.addFunction({
    name: `use${toSentenceCase(sourceName)}`,
    isExported: true,
    returnType: `{ ${sourceName}: z.infer<typeof ${toSentenceCase(sourceConfig.schema)}Schema>[] }`,
    statements: (writer) => {
      writer.write(
        `return { ${sourceName}: ${JSON.stringify(sourceConfig.items)} }`
      );
    },
  });
}

export default { addImports, render };
