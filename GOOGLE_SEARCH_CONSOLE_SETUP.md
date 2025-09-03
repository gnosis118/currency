# Google Search Console Setup Guide for currencytocurrency.app

## Step 1: Access Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console/)
2. Sign in with your Google account
3. Click "Add Property"

## Step 2: Add Your Website
1. Select "URL prefix" option
2. Enter: `https://currencytocurrency.app`
3. Click "Continue"

## Step 3: Verify Domain Ownership
Choose one of these verification methods:

### Method 1: HTML File Upload (Recommended)
1. Download the verification file from GSC
2. Upload it to your website's root directory (`/public/` folder)
3. Ensure it's accessible at: `https://currencytocurrency.app/google-verification.html`
4. Click "Verify" in GSC

### Method 2: HTML Meta Tag
1. Copy the meta tag from GSC
2. Add it to your `index.html` file in the `<head>` section
3. Click "Verify" in GSC

### Method 3: Google Analytics (if you have it)
1. If you have Google Analytics installed, select this option
2. Click "Verify"

## Step 4: Submit Your Sitemap
1. In GSC, go to "Sitemaps" in the left sidebar
2. Click "Add a new sitemap"
3. Enter: `sitemap.xml`
4. Click "Submit"

Also submit these additional sitemaps:
- `sitemap-index.xml`
- `sitemap-blog.xml`
- `sitemap-images.xml`

## Step 5: Request Indexing for Key Pages
1. Go to "URL Inspection" tool
2. Enter these URLs one by one and click "Request Indexing":
   - `https://currencytocurrency.app/`
   - `https://currencytocurrency.app/convert`
   - `https://currencytocurrency.app/charts`
   - `https://currencytocurrency.app/alerts`
   - `https://currencytocurrency.app/travel`
   - `https://currencytocurrency.app/blog`
   - `https://currencytocurrency.app/convert/usd-to-eur`
   - `https://currencytocurrency.app/convert/gbp-to-usd`
   - `https://currencytocurrency.app/convert/eur-to-gbp`

## Step 6: Monitor Coverage Reports
1. Check "Coverage" reports daily for the first week
2. Look for any crawl errors or indexing issues
3. Monitor "Performance" to see when pages start appearing in search results

## Step 7: Set Up Email Notifications
1. Go to "Settings" → "Users and permissions"
2. Add your email for notifications
3. Enable notifications for:
   - Critical issues
   - New crawl errors
   - Manual actions

## Expected Timeline
- **Day 1-2**: GSC setup and sitemap submission
- **Day 3-7**: Initial crawling and indexing begins
- **Day 7-14**: Pages start appearing in search results
- **Day 14+**: Full indexing of all pages

## Troubleshooting
If pages aren't being indexed:
1. Check for crawl errors in GSC
2. Ensure robots.txt allows crawling
3. Verify sitemap is accessible
4. Check for duplicate content issues
5. Ensure pages have unique, valuable content

## Next Steps After GSC Setup
1. Submit to Bing Webmaster Tools
2. Create social media profiles
3. Build initial backlinks
4. Monitor and optimize based on GSC data
