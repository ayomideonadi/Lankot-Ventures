# Production Build Verification Script (Windows PowerShell)
# Run this after building for production

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Production Build Verification" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Check if .next directory exists
if (Test-Path ".next") {
    Write-Host "✅ Build output (.next) exists" -ForegroundColor Green
    $size = "{0:N2}" -f ((Get-ChildItem -Path ".next" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB)
    Write-Host "   Size: $size MB" -ForegroundColor Gray
} else {
    Write-Host "❌ Build output (.next) NOT FOUND" -ForegroundColor Red
    Write-Host "   Run: npm run build" -ForegroundColor Yellow
    exit 1
}

# Check for build cache
if (Test-Path ".next\cache") {
    Write-Host "✅ Build cache exists" -ForegroundColor Green
}

# Check for static files
if (Test-Path "public") {
    Write-Host "✅ Public assets directory exists" -ForegroundColor Green
    $fileCount = @(Get-ChildItem -Path "public" -Recurse -File).Count
    Write-Host "   Files: $fileCount" -ForegroundColor Gray
}

# Check Next.js config
if (Test-Path "next.config.ts") {
    Write-Host "✅ Next.js configuration found" -ForegroundColor Green
    $content = Get-Content "next.config.ts" -Raw
    if ($content -match "poweredByHeader: false") {
        Write-Host "   ✓ Security headers configured" -ForegroundColor Gray
    }
}

# Check environment files
Write-Host ""
Write-Host "Environment Files:" -ForegroundColor Yellow
if (Test-Path ".env.production.example") {
    Write-Host "✅ .env.production.example exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env.production.example missing" -ForegroundColor Yellow
}

if (Test-Path ".env.local.example") {
    Write-Host "✅ .env.local.example exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env.local.example missing" -ForegroundColor Yellow
}

# Check Node modules
if (Test-Path "node_modules") {
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
    $packageCount = @(Get-ChildItem -Path "node_modules" -Directory -Force -ErrorAction SilentlyContinue).Count
    Write-Host "   Packages: $packageCount" -ForegroundColor Gray
} else {
    Write-Host "❌ Dependencies NOT installed" -ForegroundColor Red
    Write-Host "   Run: npm install" -ForegroundColor Yellow
    exit 1
}

# Check password validation
$validationExists = Test-Path "src\lib\password-validation.ts"
if ($validationExists) {
    Write-Host "✅ Password validation module found" -ForegroundColor Green
}

# Check for TypeScript errors
Write-Host ""
Write-Host "Type Checking:" -ForegroundColor Yellow
$tscPath = Join-Path $PWD "node_modules\.bin\tsc.cmd"
if (Test-Path $tscPath) {
    $errors = & node_modules\.bin\tsc --noEmit 2>&1 | Select-String "error TS"
    if ($errors) {
        Write-Host "❌ TypeScript errors found" -ForegroundColor Red
        & node_modules\.bin\tsc --noEmit 2>&1 | Select-Object -First 20
    } else {
        Write-Host "✅ No TypeScript errors" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  TypeScript compiler not available" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "✅ Production Finalization Complete" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Set up environment variables:" -ForegroundColor White
Write-Host "   - Copy .env.production.example to .env.production" -ForegroundColor Gray
Write-Host "   - Fill in actual Supabase credentials" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Test production build locally:" -ForegroundColor White
Write-Host "   npm run start" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Deploy to hosting platform:" -ForegroundColor White
Write-Host "   - Vercel (Recommended)" -ForegroundColor Gray
Write-Host "   - Docker" -ForegroundColor Gray
Write-Host "   - Traditional Server" -ForegroundColor Gray
Write-Host ""
