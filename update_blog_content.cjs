const fs = require('fs');

// Function to extract content from markdown file (everything after the --- separator)
function extractContentFromMarkdown(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const parts = content.split('---');
  if (parts.length >= 3) {
    // Return everything after the second --- (the actual content)
    return parts.slice(2).join('---').trim();
  }
  return content;
}

// Read the current blogPosts.ts file
let blogPostsContent = fs.readFileSync('src/data/blogPosts.ts', 'utf8');

// Extract content from expanded articles
const freelancerContent = extractContentFromMarkdown('article_1_freelancer_currency.md');
const nomadContent = extractContentFromMarkdown('article_2_digital_nomad_currency.md');

// Function to escape backticks and other special characters for template literals
function escapeForTemplate(str) {
  return str.replace(/`/g, '\\`').replace(/\${/g, '\\${');
}

// Update freelancer article content
const freelancerContentEscaped = escapeForTemplate(freelancerContent);
const freelancerRegex = /(title: "Currency Exchange for Freelancers[^}]+content: `)[^`]+(`[^}]+})/s;
blogPostsContent = blogPostsContent.replace(freelancerRegex, `$1${freelancerContentEscaped}$2`);

// Update digital nomad article content  
const nomadContentEscaped = escapeForTemplate(nomadContent);
const nomadRegex = /(title: "Digital Nomad Currency Management[^}]+content: `)[^`]+(`[^}]+})/s;
blogPostsContent = blogPostsContent.replace(nomadRegex, `$1${nomadContentEscaped}$2`);

// Write the updated content back to the file
fs.writeFileSync('src/data/blogPosts.ts', blogPostsContent);

console.log('Blog posts content updated successfully!');

