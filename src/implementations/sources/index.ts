import type { SourceFile } from 'ts-morph';

import type { SourceConfig } from '../../schemas/index.js';
import inline from './inline.js';
import local from './local.js';
import remote from './remote.js';

export const sourcesImpl: Record<
  'inline' | 'remote' | 'local',
  {
    addImports: (
      file: SourceFile,
      sourceName: string,
      sourceConfig: SourceConfig
    ) => void;
    render: (
      file: SourceFile,
      sourceName: string,
      sourceConfig: SourceConfig
    ) => void;
  }
> = {
  inline,
  remote,
  local,
};
