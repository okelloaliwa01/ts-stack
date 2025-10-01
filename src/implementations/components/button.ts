import { CodeBlockWriter, type SourceFile } from 'ts-morph';
import { extendImportDeclaration, extractFromProps } from '../../utils.js';
import type { ButtonConfig } from '../../schemas/components/button.js';

function addImports(file: SourceFile) {
  const namedImports: string[] = [];
  namedImports.push('Button');

  const moduleSpecifier = '@/components/ui/button';
  extendImportDeclaration(file, moduleSpecifier, namedImports);
}

function addSetupStatements(writer: CodeBlockWriter, config: ButtonConfig) {
  return;
}

function render(
  file: SourceFile,
  writer: CodeBlockWriter,
  config: ButtonConfig,
  accessibleProps: string[] = []
) {
  const { text, variant, size, disabled } = config;
  writer.write(`
    <Button variant="${variant}" size="${size}" disabled={${disabled}}>
      ${extractFromProps(accessibleProps, text)}
    </Button>
  `);
}

function getComponents(config: ButtonConfig) {
  return [];
}

export default { addImports, addSetupStatements, render, getComponents };
