@echo off
REM ===========================================
REM CURRENCY TO CURRENCY - INDEXING FIX SCRIPT (Windows)
REM ===========================================

echo 🚀 Currency to Currency - Indexing Fix Script
echo ==============================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Please run this script from the root of your currency project
    pause
    exit /b 1
)

echo ℹ️  Starting indexing diagnostics and fixes...

REM Step 1: Generate fresh sitemaps
echo.
echo 📝 Step 1: Generating fresh sitemaps...
if exist "generate_sitemap.cjs" (
    node generate_sitemap.cjs
    if %errorlevel% equ 0 (
        echo ✅ Sitemaps generated successfully
    ) else (
        echo ❌ Failed to generate sitemaps
        pause
        exit /b 1
    )
) else (
    echo ⚠️  generate_sitemap.cjs not found, skipping sitemap generation
)

REM Step 2: Verify local sitemap files
echo.
echo 🔍 Step 2: Verifying local sitemap files...

if exist "public\sitemap.xml" (
    echo ✅ Main sitemap exists
) else (
    echo ❌ Main sitemap not found
)

if exist "public\sitemap-blog.xml" (
    echo ✅ Blog sitemap exists
) else (
    echo ❌ Blog sitemap not found
)

if exist "public\sitemap-index.xml" (
    echo ✅ Sitemap index exists
) else (
    echo ❌ Sitemap index not found
)

if exist "public\robots.txt" (
    echo ✅ Robots.txt exists
) else (
    echo ❌ Robots.txt not found
)

REM Step 3: Test live sitemap URLs
echo.
echo 🌐 Step 3: Testing live sitemap accessibility...
echo ℹ️  Testing main sitemap: https://currencytocurrency.app/sitemap.xml
echo ℹ️  Testing blog sitemap: https://currencytocurrency.app/sitemap-blog.xml
echo ℹ️  Testing sitemap index: https://currencytocurrency.app/sitemap-index.xml
echo ℹ️  Testing robots.txt: https://currencytocurrency.app/robots.txt
echo.
echo ⚠️  Manual verification required - check these URLs in your browser

REM Step 4: Check for deployment platform
echo.
echo 🚀 Step 4: Detecting deployment platform...

if exist "netlify.toml" (
    echo ℹ️  Netlify deployment detected
    echo    To fix caching issues:
    echo    1. Go to Netlify dashboard
    echo    2. Site settings ^> Build ^& deploy ^> Post processing
    echo    3. Clear cache and redeploy
) else if exist "vercel.json" (
    echo ℹ️  Vercel deployment detected
    echo    To redeploy: vercel --prod
) else if exist ".github\workflows" (
    echo ℹ️  GitHub Actions deployment detected
    echo    Push changes to trigger new deployment
) else (
    echo ℹ️  Deployment platform not detected
)

REM Step 5: Build project
echo.
echo 🔨 Step 5: Building project...

if exist "package.json" (
    echo ℹ️  Running build command...
    npm run build
    
    if %errorlevel% equ 0 (
        echo ✅ Build completed successfully
        
        REM Check if sitemaps are in build output
        if exist "dist" (
            if exist "dist\sitemap.xml" (
                echo ✅ Sitemap found in build output
            ) else (
                echo ⚠️  Sitemap not found in build output
                echo ℹ️  Copying sitemaps to build directory...
                copy "public\sitemap*.xml" "dist\" >nul 2>&1
                copy "public\robots.txt" "dist\" >nul 2>&1
            )
        )
    ) else (
        echo ❌ Build failed
    )
)

REM Step 6: Generate deployment checklist
echo.
echo 📋 Step 6: Deployment Checklist
echo ================================

echo.
echo ✅ BEFORE DEPLOYMENT:
echo    □ Sitemaps generated and valid
echo    □ Build completed successfully
echo    □ All files in correct directories

echo.
echo 🚀 DEPLOYMENT ACTIONS:
echo    □ Deploy to production
echo    □ Clear CDN/cache if applicable
echo    □ Verify live URLs are accessible

echo.
echo 🔍 AFTER DEPLOYMENT:
echo    □ Test all sitemap URLs
echo    □ Submit to Google Search Console
echo    □ Submit to Bing Webmaster Tools
echo    □ Monitor indexing progress

REM Step 7: Generate Google Search Console commands
echo.
echo 📊 Step 7: Search Console Setup
echo ===============================

echo.
echo 🔗 URLs to submit to Google Search Console:
echo    https://currencytocurrency.app/sitemap-index.xml
echo    https://currencytocurrency.app/sitemap.xml
echo    https://currencytocurrency.app/sitemap-blog.xml

echo.
echo 📝 Pages to request indexing for:
echo    https://currencytocurrency.app/
echo    https://currencytocurrency.app/blog/
echo    https://currencytocurrency.app/convert/
echo    https://currencytocurrency.app/charts/

REM Step 8: Final recommendations
echo.
echo 🎯 NEXT STEPS:
echo ==============
echo 1. 🚀 Deploy the updated sitemaps
echo 2. 🔍 Verify live URLs are working
echo 3. 📊 Submit sitemaps to Google Search Console
echo 4. ⏰ Wait 24-48 hours for crawling
echo 5. 📈 Monitor indexing progress

echo.
echo 🆘 IF ISSUES PERSIST:
echo    - Check server logs for errors
echo    - Verify CDN/cache settings
echo    - Use Google's URL Inspection Tool
echo    - Check for any redirect issues

echo.
echo ✅ Indexing fix script completed!
echo 📧 For support: Check INDEXING_ISSUES_ANALYSIS.md

echo.
pause
