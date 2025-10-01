import { join } from 'path';
import { Project } from 'ts-morph';

export function initTsMorphProject(projectDir: string) {
  const project = new Project({
    tsConfigFilePath: join(projectDir, 'tsconfig.json'),
  });

  // Adds copied files to the ts-morph project to work with
  project.addSourceFilesAtPaths(join(projectDir, 'src/**/*.tsx'));
  project.addSourceFilesAtPaths(join(projectDir, 'src/**/*.ts'));

  return project;
}
