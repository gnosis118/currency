const fs = require('fs');

// Read the exact PDF content
const pdfContent = fs.readFileSync('/home/ubuntu/currency/pdf_content_exact.md', 'utf8');

// Read the current blogPosts.ts file
let blogPostsContent = fs.readFileSync('/home/ubuntu/currency/src/data/blogPosts.ts', 'utf8');

// Find the forex broker post and replace its content
const startMarker = "content: `*Last Updated: January 11, 2025";
const endMarker = "**Methodology Version:** 15-Factor Analysis v3.2`,";

const startIndex = blogPostsContent.indexOf(startMarker);
const endIndex = blogPostsContent.indexOf(endMarker) + endMarker.length;

if (startIndex !== -1 && endIndex !== -1) {
    const beforeContent = blogPostsContent.substring(0, startIndex);
    const afterContent = blogPostsContent.substring(endIndex);
    
    // Create the new content section with exact PDF content
    const newContentSection = `content: \`${pdfContent.trim()}\`,`;
    
    // Combine everything
    const updatedContent = beforeContent + newContentSection + afterContent;
    
    // Write the updated file
    fs.writeFileSync('/home/ubuntu/currency/src/data/blogPosts.ts', updatedContent);
    console.log('✅ Successfully updated forex broker content with exact PDF content!');
} else {
    console.log('❌ Could not find the content markers to replace');
    console.log('Start index:', startIndex);
    console.log('End index:', endIndex);
}

