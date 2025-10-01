# Configuration Guide

The yaml configuration file is the core of Scaffolder. It describes the data schemas, data sources, and pages in your
application. Scaffolder uses this config to generate a fully working monorepo.

## Schemas

Schemas define the shape of your data.

Scaffolder will use them to generate:

- Zod schemas for runtime validation (shared between client and server)
- Database tables with Drizzle
- API endpoints in the Hono server

Example:

```yaml
schemas:
  post:
    id: number
    title: string
    description: string
    content: string
    footnote: string
```

This generates:

- packages/schemas/post.ts with a Zod schema
- A Drizzle table definition for post
- API endpoints for CRUD operations

## Sources

Sources describe where data comes from in your app. Each source references a schema that its data must conform to.
Scaffolder generates React Query hooks to fetch data from each source.

Example (local source referencing post):

```yaml
sources:
  localPosts:
    type: local
    schema: post
```

Now you can use localPosts in your pages:

```yaml
pages:
  - name: Local
    icon: List
    components:
      - type: list
        source: localPosts
        items:
          components:
            - type: card
              header:
                title: item.title
                description: item.description
              content:
                text: item.content
              footer:
                text: item.footnote
```

### Source Types

#### Inline

Define a static collection of items directly in your config. Scaffolder generates a static JavaScript object and exposes
it via React Query hooks.

#### Local

Generate a Drizzle table and Hono server endpoints. The React Query hooks will call those endpoints for CRUD operations.

#### Remote

Reference an external API. Scaffolder generates React Query hooks to fetch data from that API.

## Pages

Pages describe the UI structure of your app. Each page is a collection of components (lists, cards, buttons, text, etc.),
optionally bound to sources.

Example with a list of posts:

```yaml
pages:
  - name: Local
    icon: List
    components:
      - type: list
        source: localPosts
        items:
          components:
            - type: card
              header:
                title: item.title
                description: item.description
              content:
                text: item.content
              footer:
                text: item.footnote
```

Scaffolder will generate a React Router route for /local and render this component tree.