const fs = require('fs');

// Read the new content
const newContent = fs.readFileSync('/home/ubuntu/currency/new_forex_content.md', 'utf8');

// Read the current blogPosts.ts file
let blogPostsContent = fs.readFileSync('/home/ubuntu/currency/src/data/blogPosts.ts', 'utf8');

// Extract just the content part (without the title)
const contentOnly = newContent.split('\n').slice(2).join('\n'); // Skip the title line

// Find the forex broker post and replace its content
const startMarker = "content: `The foreign exchange market, with over $7.5 trillion";
const endMarker = "Remember that successful forex trading requires much more than selecting the right broker. Developing market knowledge, technical analysis skills, and disciplined risk management is essential for long-term success.`,";

const startIndex = blogPostsContent.indexOf(startMarker);
const endIndex = blogPostsContent.indexOf(endMarker) + endMarker.length;

if (startIndex !== -1 && endIndex !== -1) {
    const beforeContent = blogPostsContent.substring(0, startIndex);
    const afterContent = blogPostsContent.substring(endIndex);
    
    // Create the new content section
    const newContentSection = `content: \`${contentOnly.trim()}\`,`;
    
    // Combine everything
    const updatedContent = beforeContent + newContentSection + afterContent;
    
    // Write the updated file
    fs.writeFileSync('/home/ubuntu/currency/src/data/blogPosts.ts', updatedContent);
    console.log('✅ Successfully updated forex broker content!');
} else {
    console.log('❌ Could not find the content markers to replace');
    console.log('Start index:', startIndex);
    console.log('End index:', endIndex);
}

