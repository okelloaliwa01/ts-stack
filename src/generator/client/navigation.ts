import { Project, VariableDeclarationKind } from 'ts-morph';
import { z } from 'zod';
import { PageSchema } from '../../schemas/index.js';
import path from 'path';

export async function generateSidebarLinks(
  project: Project,
  pages: z.infer<typeof PageSchema>[],
  outDir: string
) {
  const icons = Array.from(new Set(pages.map(({ icon }) => icon)));
  const navigationItems = pages.map(({ name, icon }) => ({
    path: name,
    icon,
    params: '',
  }));

  const sidebarFile = project.getSourceFile(
    path.join(outDir, 'src', 'components', 'app-sidebar.tsx')
  );

  sidebarFile.addImportDeclaration({
    namedImports: icons,
    moduleSpecifier: 'lucide-react',
  });

  sidebarFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: 'navigation',
        initializer: (writer) => {
          writer.write('[');
          navigationItems.forEach((item) => {
            writer.write(
              `{ path: '${item.path}', icon: ${item.icon}, params: '${item.params}' },`
            );
          });
          writer.write(']');
        },
      },
    ],
  });
}
