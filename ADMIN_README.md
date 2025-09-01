# 🎯 Admin Interface Setup

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the admin server:**
   ```bash
   npm run admin
   ```

3. **Access the admin interface:**
   - Open: http://localhost:8081/admin/
   - Or visit: http://localhost:3000/admin (redirects to admin)

## How to Use

### Creating a New Blog Post

1. Go to http://localhost:8081/admin/
2. Click "New Blog Post"
3. Fill in the details:
   - **Title**: Your blog post title
   - **Slug**: Leave empty to auto-generate from title
   - **Cover Image**: Optional - upload an image
   - **Body**: Write your blog post in Markdown
   - **Published**: Check to publish immediately

4. Click "Publish" to save

### Editing Existing Posts

1. Go to http://localhost:8081/admin/
2. Click on any existing blog post
3. Make your changes
4. Click "Publish" to save

### Markdown Tips

- Use `# Heading` for titles
- Use `## Subheading` for sections
- Use `**bold**` for emphasis
- Use `[link text](url)` for links
- Use `![alt text](image-url)` for images

## File Structure

- Blog posts are saved to: `src/content/blog/`
- Images are saved to: `public/images/uploads/`
- Admin config: `public/admin/config.yml`

## Troubleshooting

### If admin doesn't load:
1. Make sure you're running `npm run admin`
2. Check that port 8081 is available
3. Try refreshing the page

### If you can't save posts:
1. Make sure you have write permissions to the project folder
2. Check that the blog directory exists: `src/content/blog/`

### If images don't upload:
1. Make sure the uploads directory exists: `public/images/uploads/`
2. Check file permissions

## Development vs Production

- **Development**: Admin works locally with `npm run admin`
- **Production**: Admin is disabled for security (only works locally)

## Commands

```bash
# Start admin only
npm run admin

# Start both dev server and admin
npm run admin:dev

# Start just the dev server
npm run dev
```
