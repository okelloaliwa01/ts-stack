import { CodeBlockWriter, type SourceFile } from 'ts-morph';

import type { ListConfig } from '../../schemas/components/list.js';
import type { ComponentConfig } from '../../schemas/index.js';
import {
  extendImportDeclaration,
  getComponentComponents,
  importComponents,
  renderComponents,
  toSentenceCase,
} from '../../utils.js';

function addImports(file: SourceFile, config: ListConfig) {
  importComponents(file, config.items.components);
  extendImportDeclaration(file, 'react', ['Fragment']);
  extendImportDeclaration(file, `@/sources/use-${config.source}`, [
    `use${toSentenceCase(config.source)}`,
  ]);
}

function addSetupStatements(writer: CodeBlockWriter, config: ListConfig) {
  writer.writeLine(
    `const { ${config.source} } = use${toSentenceCase(config.source)}();`
  );
}

function render(file: SourceFile, writer: CodeBlockWriter, config: ListConfig) {
  writer.writeLine(
    '<div className="space-y-2 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6 xl:grid-cols-3">'
  );
  writer.writeLine(`{${config.source}?.map((item, index) => (`);
  writer.indent(() => {
    writer.writeLine('<Fragment key={index}>');
    writer.indent(() => {
      renderComponents(file, writer, config.items.components, ['item']);
    });
    writer.writeLine('</Fragment>');
  });
  writer.writeLine('))}');
  writer.writeLine('</div>');
}

function getComponents(config: ListConfig) {
  const components: ComponentConfig[] = [];

  if (config.items?.components?.length) {
    components.push(...config.items.components);
    components.push(...config.items.components.flatMap(getComponentComponents));
  }

  return Array.from(new Set(components));
}

export default { addImports, addSetupStatements, render, getComponents };
