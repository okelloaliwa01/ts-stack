import { CodeBlockWriter, type SourceFile } from 'ts-morph';
import {
  extendImportDeclaration,
  extractFromProps,
  getComponentComponents,
  importComponents,
  renderComponents,
} from '../../utils.js';
import type { CardConfig } from '../../schemas/components/card.js';
import type { ComponentConfig } from '../../schemas/index.js';

function addImports(file: SourceFile, config: CardConfig) {
  const { header, content, footer } = config;

  const namedImports: string[] = [];
  namedImports.push('Card');

  if (header) {
    namedImports.push('CardHeader');
    if (header.title) {
      namedImports.push('CardTitle');
    }

    if (header.description) {
      namedImports.push('CardDescription');
    }

    if (header.action) {
      namedImports.push('CardAction');
      if (header.action.components?.length) {
        importComponents(file, header.action.components);
      }
    }
  }

  if (content) {
    namedImports.push('CardContent');
    if ('components' in content && content.components?.length) {
      importComponents(file, content.components);
    }
  }

  if (footer) {
    namedImports.push('CardFooter');
    if ('components' in footer && footer.components?.length) {
      importComponents(file, footer.components);
    }
  }

  const moduleSpecifier = '@/components/ui/card';
  extendImportDeclaration(file, moduleSpecifier, namedImports);
}

function addSetupStatements(writer: CodeBlockWriter, config: CardConfig) {
  return [];
}

function render(
  file: SourceFile,
  writer: CodeBlockWriter,
  config: CardConfig,
  accessibleProps: string[] = []
) {
  const { header, content, footer } = config;
  writer.write('<Card>');

  if (header) {
    writer.newLine();
    if (header.title || header.description || header.action) {
      writer.write('<CardHeader>');
      writer.newLine();

      if (header.title) {
        writer.write(
          `<CardTitle>${extractFromProps(accessibleProps, header.title)}</CardTitle>`
        );
      }

      if (header.description) {
        writer.write(
          `<CardDescription>${extractFromProps(accessibleProps, header.description)}</CardDescription>`
        );
      }

      if (header.action) {
        if (header.action.components?.length) {
          writer.write('<CardAction>');
          renderComponents(
            file,
            writer,
            header.action.components,
            accessibleProps
          );
          writer.write('</CardAction>');
        } else {
          writer.write('<CardAction/>');
        }
      }

      writer.write(`</CardHeader>`);
    } else {
      writer.write('<CardHeader/>');
    }
  }

  if (content) {
    writer.newLine();
    if ('components' in content && content.components.length) {
      writer.write('<CardContent>');
      renderComponents(file, writer, content.components, accessibleProps);
      writer.write(`</CardContent>`);
    } else if ('text' in content) {
      writer.write(
        `<CardContent>${extractFromProps(accessibleProps, content.text)}</CardContent>`
      );
    } else {
      writer.write('<CardContent/>');
    }
  }

  if (footer) {
    writer.newLine();
    if ('components' in footer && footer.components.length) {
      writer.write('<CardFooter>');
      renderComponents(file, writer, footer.components, accessibleProps);
      writer.write(`</CardFooter>`);
    } else if ('text' in footer) {
      writer.write(
        `<CardFooter>${extractFromProps(accessibleProps, footer.text)}</CardFooter>`
      );
    } else {
      writer.write('<CardFooter/>');
    }
  }

  writer.write('</Card>');
}

function getComponents(config: CardConfig) {
  const components: ComponentConfig[] = [];

  if (config.header?.action?.components?.length) {
    components.push(...config.header.action.components);
    components.push(
      ...config.header.action.components.flatMap(getComponentComponents)
    );
  }

  if (
    config.content &&
    'components' in config.content &&
    config.content.components?.length
  ) {
    components.push(...config.content.components);
    components.push(
      ...config.content.components.flatMap(getComponentComponents)
    );
  }

  if (
    config.footer &&
    'components' in config.footer &&
    config.footer.components?.length
  ) {
    components.push(...config.footer.components);
    components.push(
      ...config.footer.components.flatMap(getComponentComponents)
    );
  }

  return Array.from(new Set(components));
}

export default { addImports, addSetupStatements, render, getComponents };
