import { defineStackbitConfig } from '@stackbit/types';

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  ssgName: 'custom',
  nodeVersion: '18',
  devCommand: 'npm run dev',
  experimental: {
    ssg: {
      name: 'vite',
      logPatterns: {
        up: ['Local:', 'ready in']
      },
      directoryChangeCommand: 'npm run dev'
    }
  },
  contentSources: [
    {
      name: 'local',
      type: 'file',
      rootPath: __dirname,
      contentDirs: ['src/content'],
      models: [
        {
          name: 'BlogPost',
          type: 'page',
          urlPath: '/blog/{slug}',
          filePath: 'src/content/blog/{slug}.md',
          fields: [
            { name: 'title', type: 'string', required: true },
            { name: 'slug', type: 'slug', required: true },
            { name: 'excerpt', type: 'text', required: true },
            { name: 'publishDate', type: 'date', required: true },
            { name: 'readTime', type: 'string' },
            { name: 'category', type: 'enum', options: ['Trading', 'Currency', 'Travel', 'Business', 'Technology', 'Finance'] },
            { name: 'featured', type: 'boolean' },
            { name: 'image', type: 'image', required: true },
            { name: 'tags', type: 'list', items: { type: 'string' } },
            { name: 'metaDescription', type: 'text', required: true },
            { name: 'author', type: 'string' },
            { name: 'content', type: 'markdown', required: true }
          ]
        },
        {
          name: 'Page',
          type: 'page',
          urlPath: '/{slug}',
          filePath: 'src/content/pages/{slug}.md',
          fields: [
            { name: 'title', type: 'string', required: true },
            { name: 'content', type: 'markdown', required: true }
          ]
        }
      ]
    }
  ]
});

