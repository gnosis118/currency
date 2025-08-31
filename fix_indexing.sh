#!/bin/bash

# ===========================================
# CURRENCY TO CURRENCY - INDEXING FIX SCRIPT
# ===========================================

echo "🚀 Currency to Currency - Indexing Fix Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the root of your currency project"
    exit 1
fi

print_info "Starting indexing diagnostics and fixes..."

# Step 1: Generate fresh sitemaps
echo ""
echo "📝 Step 1: Generating fresh sitemaps..."
if [ -f "generate_sitemap.cjs" ]; then
    node generate_sitemap.cjs
    if [ $? -eq 0 ]; then
        print_status "Sitemaps generated successfully"
    else
        print_error "Failed to generate sitemaps"
        exit 1
    fi
else
    print_warning "generate_sitemap.cjs not found, skipping sitemap generation"
fi

# Step 2: Verify local sitemap files
echo ""
echo "🔍 Step 2: Verifying local sitemap files..."

check_sitemap() {
    local file=$1
    local name=$2
    
    if [ -f "$file" ]; then
        local lines=$(wc -l < "$file")
        local urls=$(grep -c "<loc>" "$file" 2>/dev/null || echo "0")
        print_status "$name exists: $lines lines, $urls URLs"
        
        # Check if file is valid XML
        if command -v xmllint >/dev/null 2>&1; then
            if xmllint --noout "$file" 2>/dev/null; then
                print_status "$name is valid XML"
            else
                print_error "$name has XML syntax errors"
            fi
        fi
    else
        print_error "$name not found"
    fi
}

check_sitemap "public/sitemap.xml" "Main sitemap"
check_sitemap "public/sitemap-blog.xml" "Blog sitemap"
check_sitemap "public/sitemap-index.xml" "Sitemap index"
check_sitemap "public/robots.txt" "Robots.txt"

# Step 3: Test live sitemap URLs
echo ""
echo "🌐 Step 3: Testing live sitemap accessibility..."

test_url() {
    local url=$1
    local name=$2
    
    print_info "Testing $name: $url"
    
    if command -v curl >/dev/null 2>&1; then
        local status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
        if [ "$status" = "200" ]; then
            print_status "$name is accessible (HTTP $status)"
            
            # Check content length
            local content_length=$(curl -s "$url" | wc -c)
            print_info "Content length: $content_length bytes"
            
            # Check if it contains URLs
            local url_count=$(curl -s "$url" | grep -c "<loc>" 2>/dev/null || echo "0")
            if [ "$url_count" -gt 0 ]; then
                print_status "Contains $url_count URLs"
            else
                print_warning "No URLs found in sitemap"
            fi
        else
            print_error "$name returned HTTP $status"
        fi
    else
        print_warning "curl not available, skipping URL tests"
    fi
}

test_url "https://currencytocurrency.app/sitemap.xml" "Main sitemap"
test_url "https://currencytocurrency.app/sitemap-blog.xml" "Blog sitemap"
test_url "https://currencytocurrency.app/sitemap-index.xml" "Sitemap index"
test_url "https://currencytocurrency.app/robots.txt" "Robots.txt"

# Step 4: Check for deployment platform
echo ""
echo "🚀 Step 4: Detecting deployment platform..."

if [ -f "netlify.toml" ] || [ -f ".netlify" ]; then
    print_info "Netlify deployment detected"
    echo "   To fix caching issues:"
    echo "   1. Go to Netlify dashboard"
    echo "   2. Site settings > Build & deploy > Post processing"
    echo "   3. Clear cache and redeploy"
    echo "   4. Or use: netlify deploy --prod --dir=dist"
elif [ -f "vercel.json" ] || [ -d ".vercel" ]; then
    print_info "Vercel deployment detected"
    echo "   To redeploy: vercel --prod"
elif [ -d ".github/workflows" ]; then
    print_info "GitHub Actions deployment detected"
    echo "   Push changes to trigger new deployment"
else
    print_info "Deployment platform not detected"
fi

# Step 5: Build and prepare for deployment
echo ""
echo "🔨 Step 5: Building project..."

if [ -f "package.json" ]; then
    print_info "Running build command..."
    npm run build
    
    if [ $? -eq 0 ]; then
        print_status "Build completed successfully"
        
        # Check if sitemaps are in build output
        if [ -d "dist" ]; then
            if [ -f "dist/sitemap.xml" ]; then
                print_status "Sitemap found in build output"
            else
                print_warning "Sitemap not found in build output"
                print_info "Copying sitemaps to build directory..."
                cp public/sitemap*.xml dist/ 2>/dev/null || true
                cp public/robots.txt dist/ 2>/dev/null || true
            fi
        fi
    else
        print_error "Build failed"
    fi
fi

# Step 6: Generate deployment checklist
echo ""
echo "📋 Step 6: Deployment Checklist"
echo "================================"

echo ""
echo "✅ BEFORE DEPLOYMENT:"
echo "   □ Sitemaps generated and valid"
echo "   □ Build completed successfully"
echo "   □ All files in correct directories"

echo ""
echo "🚀 DEPLOYMENT ACTIONS:"
echo "   □ Deploy to production"
echo "   □ Clear CDN/cache if applicable"
echo "   □ Verify live URLs are accessible"

echo ""
echo "🔍 AFTER DEPLOYMENT:"
echo "   □ Test all sitemap URLs"
echo "   □ Submit to Google Search Console"
echo "   □ Submit to Bing Webmaster Tools"
echo "   □ Monitor indexing progress"

# Step 7: Generate Google Search Console commands
echo ""
echo "📊 Step 7: Search Console Setup"
echo "==============================="

echo ""
echo "🔗 URLs to submit to Google Search Console:"
echo "   https://currencytocurrency.app/sitemap-index.xml"
echo "   https://currencytocurrency.app/sitemap.xml"
echo "   https://currencytocurrency.app/sitemap-blog.xml"

echo ""
echo "📝 Pages to request indexing for:"
echo "   https://currencytocurrency.app/"
echo "   https://currencytocurrency.app/blog/"
echo "   https://currencytocurrency.app/convert/"
echo "   https://currencytocurrency.app/charts/"

# Step 8: Final recommendations
echo ""
echo "🎯 NEXT STEPS:"
echo "=============="
echo "1. 🚀 Deploy the updated sitemaps"
echo "2. 🔍 Verify live URLs are working"
echo "3. 📊 Submit sitemaps to Google Search Console"
echo "4. ⏰ Wait 24-48 hours for crawling"
echo "5. 📈 Monitor indexing progress"

echo ""
echo "🆘 IF ISSUES PERSIST:"
echo "   - Check server logs for errors"
echo "   - Verify CDN/cache settings"
echo "   - Use Google's URL Inspection Tool"
echo "   - Check for any redirect issues"

echo ""
print_status "Indexing fix script completed!"
echo "📧 For support: Check INDEXING_ISSUES_ANALYSIS.md"
