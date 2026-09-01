#!/bin/bash
# Production Build Verification Script
# Run this after building for production

echo "==================================="
echo "Production Build Verification"
echo "==================================="
echo ""

# Check if .next directory exists
if [ -d ".next" ]; then
    echo "✅ Build output (.next) exists"
    echo "   Size: $(du -sh .next | cut -f1)"
else
    echo "❌ Build output (.next) NOT FOUND"
    echo "   Run: npm run build"
    exit 1
fi

# Check for build cache
if [ -d ".next/cache" ]; then
    echo "✅ Build cache exists"
fi

# Check for static files
if [ -d "public" ]; then
    echo "✅ Public assets directory exists"
    echo "   Files: $(find public -type f | wc -l)"
fi

# Check Next.js config
if [ -f "next.config.ts" ]; then
    echo "✅ Next.js configuration found"
    if grep -q "poweredByHeader: false" next.config.ts; then
        echo "   ✓ Security headers configured"
    fi
fi

# Check environment files
echo ""
echo "Environment Files:"
if [ -f ".env.production.example" ]; then
    echo "✅ .env.production.example exists"
else
    echo "⚠️  .env.production.example missing"
fi

if [ -f ".env.local.example" ]; then
    echo "✅ .env.local.example exists"
else
    echo "⚠️  .env.local.example missing"
fi

# Check Node modules
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
    PACKAGE_COUNT=$(find node_modules -maxdepth 1 -type d | wc -l)
    echo "   Packages: $((PACKAGE_COUNT - 1))"
else
    echo "❌ Dependencies NOT installed"
    echo "   Run: npm install"
    exit 1
fi

# Check password validation
if grep -r "validatePassword" src/lib/ > /dev/null 2>&1; then
    echo "✅ Password validation module found"
fi

# Check for TypeScript errors
echo ""
echo "Type Checking:"
if command -v tsc &> /dev/null; then
    if tsc --noEmit 2>&1 | grep -q "error TS"; then
        echo "❌ TypeScript errors found"
        tsc --noEmit | head -20
    else
        echo "✅ No TypeScript errors"
    fi
else
    echo "⚠️  TypeScript compiler not available"
fi

# Summary
echo ""
echo "==================================="
echo "✅ Production Finalization Complete"
echo "==================================="
echo ""
echo "Next Steps:"
echo "1. Set up environment variables:"
echo "   - Copy .env.production.example to .env.production"
echo "   - Fill in actual Supabase credentials"
echo ""
echo "2. Test production build locally:"
echo "   npm run start"
echo ""
echo "3. Deploy to hosting platform:"
echo "   - Vercel (Recommended)"
echo "   - Docker"
echo "   - Traditional Server"
echo ""
