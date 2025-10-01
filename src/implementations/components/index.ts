import card from './card.js';
import button from './button.js';
import list from './list.js';
import type { CodeBlockWriter, SourceFile } from 'ts-morph';
import type { ComponentConfig } from '../../schemas/index.js';

export const componentsImpl: Record<
  'card' | 'button' | 'list',
  {
    addImports: (file: SourceFile, config: ComponentConfig) => void;
    getComponents: (config: ComponentConfig) => ComponentConfig[];
    addSetupStatements: (
      writer: CodeBlockWriter,
      config: ComponentConfig
    ) => void;
    render: (
      file: SourceFile,
      writer: CodeBlockWriter,
      config: ComponentConfig,
      accessibleProps: string[]
    ) => void;
  }
> = {
  card,
  button,
  list,
};
