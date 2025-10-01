# ts-stack

This project came into existence because I got tired of looking for template repositories, creating and configuring
projects from scratch, setting up directory structures and monorepos and configuring linting and code style each time I
started a new project.

It is a strongly opinionated generator, which uses technologies that I would typically use when working on a fullstack
TypeScript project. Hopefully that's a good thing. Some of these technologies are already strongly established in the
web ecosystem like [`react`](https://react.dev), [`react-query`](https://tanstack.com/query/docs),
[`vite`](https://vite.dev) and [`tailwind`](https://tailwindcss.com). Some of them are relatively new and fresh but are
already gaining popularity and seem promising like [`shadcn`](https://www.shadcn.io), [`hono`](https://hono.dev), 
[`drizzle`](https://orm.drizzle.team) and [`turborepo`](https://turborepo.com).

This project is aimed at developers who, like me, want to be able to quickly *scaffold* a new project and get to work.
It can also be used by less technical people, who want to get a fully working web app without much coding.

> **Disclaimer**
> 
> The project is under development so you can expect new features and changes to its core.

## Benefits of the tool

### Fully typed and validated

Both the generator and the generated projects use TypeScript end to end. The generator uses zod to validate the yaml
configs. The generated projects include runtime validation with zod, which ensures predictability and correctness.

### Full ownership of the generated code

You can extend and modify the generated projects however you want. You can setup your own build and deployment pipelines
and choose your infrastructure.

### No runtime overhead

Converting the yaml config into files happens at generation time, so there is no runtime overhead compared to regular
TypeScript projects.

### Follows best practices

As mentioned before, the generated projects use established tools and methodologies. They also follow best practices for
project and directory structure, code and components reuse, caching, API and database modeling and more.

## How to generate a project

Check out the configuration guide [here](./GUIDE.md) to create your yaml config or pick an example from
[here](./examples).

Then run the following command:

```shell
npx ts-stack example.yaml my-generated-project
```

After that you can go into the generated project's directory and start the project with `npm run dev`

## What do you get in the generated project

- React 19 + Vite frontend with shadcn UI components and Tailwind
- Hono server with Drizzle ORM for Postgres or SQLite
- Zod schemas for validation, used across client and server
- React Query hooks generated automatically for your data sources
- Turborepo monorepo structure with shared ESLint and TypeScript configs
- CLI built with Commander, ts-morph, and fs-extra

## Planned features

- More types inside schemas
- Form generation inferred from schemas
- Relations in schemas