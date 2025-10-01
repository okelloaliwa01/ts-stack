import path from 'path';
import { JsxElement, Project, SyntaxKind } from 'ts-morph';
import { z } from 'zod';

import { PageSchema } from '../../schemas/index.js';

export async function generateRoutes(
  project: Project,
  pages: z.infer<typeof PageSchema>[],
  outDir: string
) {
  const mainFile = project.getSourceFile(path.join(outDir, 'src', 'main.tsx'));

  mainFile.insertStatements(
    4,
    pages.map(
      (page) =>
        `const ${page.name}Page = lazy(() => import('@/pages/${page.name}'));`
    )
  );

  (
    mainFile
      .getDescendantsOfKind(SyntaxKind.JsxElement)
      .find(
        (el: JsxElement) =>
          el.getOpeningElement().getTagNameNode().getText() === 'Routes'
      )
      .getDescendantsOfKind(SyntaxKind.JsxElement)
      .find(
        (el: JsxElement) =>
          el.getOpeningElement().getTagNameNode().getText() === 'Route'
      ) as JsxElement
  ).setBodyText((writer) => {
    for (const page of pages) {
      writer.write(
        `<Route path="${page.name}" element={<${page.name}Page />} />`
      );
    }
  });
}