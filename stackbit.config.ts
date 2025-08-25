import { defineStackbitConfig, type SiteMapEntry } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  nodeVersion: '18',
  ssgName: 'custom',
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ['src/content'],
      models: [
        {
          name: 'Page',
          type: 'page',
          urlPath: '/{slug}',
          filePath: 'src/content/pages/{slug}.md',
          fields: [
            { name: 'title', type: 'string', required: true },
            { name: 'slug', type: 'string', required: false },
            { name: 'description', type: 'text', required: false }
          ]
        },
        {
          name: 'Post',
          type: 'page',
          urlPath: '/blog/{slug}',
          filePath: 'src/content/blog/{slug}.md',
          fields: [
            { name: 'title', type: 'string', required: true },
            { name: 'slug', type: 'string', required: false },
            { name: 'date', type: 'date', required: false },
            { name: 'updated', type: 'date', required: false },
            { name: 'author', type: 'string', required: false },
            { name: 'tags', type: 'list', items: { type: 'string' }, required: false },
            { name: 'category', type: 'string', required: false },
            { name: 'cover', type: 'string', required: false },
            { name: 'published', type: 'boolean', required: false, default: true },
            { name: 'readingTime', type: 'string', required: false }
          ]
        }
      ]
    })
  ],
  modelExtensions: [
    { name: 'Page', type: 'page', urlPath: '/{slug}' },
    { name: 'Post', type: 'page', urlPath: '/blog/{slug}' }
  ],
  siteMap: ({ documents, models }) => {
    const pageModels = models.filter((m) => m.type === 'page');
    const entries: SiteMapEntry[] = documents
      .filter((d) => pageModels.some((m) => m.name === d.modelName))
      .map((document) => ({
        stableId: document.id,
        urlPath: document.urlPath || '/',
        document,
        isHomePage: false
      }));
    return entries;
  }
});

