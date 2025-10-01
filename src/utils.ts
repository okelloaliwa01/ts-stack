import { CodeBlockWriter, type SourceFile } from 'ts-morph';
import { z } from 'zod';

import { componentsImpl } from './implementations/components/index.js';
import {
  type AppSchema,
  type ComponentConfig,
  PageSchema,
} from './schemas/index.js';

export function getAppComponents(
  appConfig: z.infer<typeof AppSchema>
): ComponentConfig[] {
  return Array.from(
    new Set(appConfig.pages.flatMap((p) => getPageComponents(p)))
  );
}

export function getPageComponents(
  pageConfig: z.infer<typeof PageSchema>
): ComponentConfig[] {
  return Array.from(
    new Set([
      ...pageConfig.components,
      ...pageConfig.components.flatMap((c) => getComponentComponents(c)),
    ])
  );
}

export function getComponentComponents(
  componentConfig: ComponentConfig
): ComponentConfig[] {
  return componentsImpl[componentConfig.type].getComponents(componentConfig);
}

export function renderComponents(
  file: SourceFile,
  writer: CodeBlockWriter,
  components: ComponentConfig[],
  accessibleProps: string[] = []
) {
  writer.indent(() => {
    for (const component of components) {
      componentsImpl[component.type].render(
        file,
        writer,
        component,
        accessibleProps
      );
      writer.newLine();
    }
  });
}

export function importComponents(
  file: SourceFile,
  components: ComponentConfig[]
) {
  for (const component of components) {
    componentsImpl[component.type].addImports(file, component);
  }
}

export function extendImportDeclaration(
  file: SourceFile,
  moduleSpecifier: string,
  namedImports: string[]
) {
  const existingImportDeclaration = file.getImportDeclaration(
    (importDeclaration) =>
      importDeclaration.getModuleSpecifierValue() === moduleSpecifier
  );

  if (!existingImportDeclaration) {
    file.addImportDeclaration({
      namedImports,
      moduleSpecifier,
    });
  } else {
    const existing = existingImportDeclaration
      .getNamedImports()
      .map((namedImport) => namedImport.getName());

    for (const namedImport of namedImports) {
      if (!existing.includes(namedImport)) {
        existingImportDeclaration.addNamedImport(namedImport);
      }
    }
  }
}

export function toSentenceCase(s?: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}

export function extractFromProps(accessibleProps: string[], s: string) {
  return accessibleProps.some((ap) => s.startsWith(`${ap}.`)) ? `{${s}}` : s;
}
