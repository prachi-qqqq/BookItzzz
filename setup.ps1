# Quick Start Script
# Run this to set up BookItzzz locally

Write-Host "🚀 BookItzzz Quick Start" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env created. Please update with your credentials." -ForegroundColor Green
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Install dependencies
Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies installed" -ForegroundColor Green

# Start Docker services
Write-Host ""
Write-Host "🐳 Starting Docker services (Postgres, Redis, MailDev)..." -ForegroundColor Yellow
docker-compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Docker Compose failed. Make sure Docker is running." -ForegroundColor Red
    Write-Host "You can skip this step if using external databases." -ForegroundColor Yellow
} else {
    Write-Host "✅ Docker services started" -ForegroundColor Green
    Write-Host "   - Postgres: localhost:5432" -ForegroundColor Gray
    Write-Host "   - Redis: localhost:6379" -ForegroundColor Gray
    Write-Host "   - MailDev UI: http://localhost:1080" -ForegroundColor Gray
}

# Wait a bit for services to be ready
Write-Host ""
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Generate Prisma client
Write-Host ""
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Yellow
npm run prisma:generate

# Run migrations
Write-Host ""
Write-Host "🗄️  Running database migrations..." -ForegroundColor Yellow
npm run prisma:migrate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Migration failed. Check your DATABASE_URL in .env" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Migrations complete" -ForegroundColor Green

# Seed database
Write-Host ""
Write-Host "🌱 Seeding database with sample data..." -ForegroundColor Yellow
npm run seed

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Seeding failed but continuing..." -ForegroundColor Yellow
} else {
    Write-Host "✅ Database seeded" -ForegroundColor Green
    Write-Host ""
    Write-Host "📧 Demo Users:" -ForegroundColor Cyan
    Write-Host "   Admin: admin@example.com / password123" -ForegroundColor Gray
    Write-Host "   Librarian: librarian@example.com / password123" -ForegroundColor Gray
    Write-Host "   Member: member0@example.com / password123" -ForegroundColor Gray
}

# Done
Write-Host ""
Write-Host "✨ Setup complete! Start the dev server:" -ForegroundColor Green
Write-Host ""
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "Then visit http://localhost:3000" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   README.md - Getting started" -ForegroundColor Gray
Write-Host "   docs/openapi.yaml - API reference" -ForegroundColor Gray
Write-Host "   docs/deployment.md - Production deployment" -ForegroundColor Gray
Write-Host ""
