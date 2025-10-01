#!/usr/bin/env node
import { readFileSync } from 'node:fs';

import { Command } from 'commander';
import path from 'path';
import yaml from 'yaml';
import { z } from 'zod';

import { generateProject } from './generator/index.js';
import { AppSchema } from './schemas/index.js';

const program = new Command();

program
  .name('scaffold')
  .description('Generate a React + shadcn + Hono + Drizzle project from YAML')
  .argument('<yamlFile>', 'Path to YAML configuration file')
  .argument('<outputDir>', 'Directory where project will be generated')
  .action(async (yamlFile, outputDir) => {
    const configPath = path.resolve(process.cwd(), yamlFile);
    const outPath = path.resolve(process.cwd(), outputDir);

    const raw = readFileSync(configPath, 'utf8');
    const config = AppSchema.safeParse(yaml.parse(raw));

    if (config.error) {
      console.log(z.prettifyError(config.error));
    } else {
      await generateProject(config.data, outPath);
      console.log(`✅ Project generated at ${outPath}`);
    }
  });

program.parse(process.argv);
