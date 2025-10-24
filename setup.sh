#!/bin/bash

# Fetisch-Dating-Platform Setup Script
# This script sets up the development environment

set -e  # Exit on error

echo "🚀 Setting up Fetisch-Dating-Platform..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 is not installed${NC}"
        echo "   Please install $1 first"
        exit 1
    else
        echo -e "${GREEN}✓ $1 found${NC}"
    fi
}

check_command node
check_command npm
check_command docker
check_command docker-compose

echo ""

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${RED}❌ Node.js version 20 or higher required${NC}"
    echo "   Current version: $(node -v)"
    exit 1
fi
echo -e "${GREEN}✓ Node.js version $(node -v)${NC}"

echo ""

# Copy .env.example to .env
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env and add your configuration${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists, skipping...${NC}"
fi

echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

echo ""

# Start Docker services
echo "🐳 Starting Docker services (PostgreSQL, Redis)..."
docker-compose up -d postgres redis
echo "   Waiting for services to be ready..."
sleep 5
echo -e "${GREEN}✓ Docker services started${NC}"

echo ""

# Run migrations
echo "🗄️  Running database migrations..."
if npm run db:migrate; then
    echo -e "${GREEN}✓ Database migrations completed${NC}"
else
    echo -e "${RED}❌ Database migrations failed${NC}"
    echo "   You may need to check your database configuration in .env"
fi

echo ""

# Seed data (optional)
read -p "Do you want to seed the database with sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    if npm run db:seed; then
        echo -e "${GREEN}✓ Database seeded${NC}"
    else
        echo -e "${YELLOW}⚠️  Database seeding failed or partially completed${NC}"
    fi
fi

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "📚 Next steps:"
echo "   1. Edit .env file with your configuration"
echo "   2. Start the development server:"
echo "      ${YELLOW}npm run dev${NC}"
echo ""
echo "   3. Access the services:"
echo "      - API: http://localhost:3000"
echo "      - Web: http://localhost:3001"
echo "      - Database UI (Adminer): http://localhost:8080"
echo "      - Redis UI: http://localhost:8081"
echo ""
echo "   4. View logs:"
echo "      ${YELLOW}docker-compose logs -f${NC}"
echo ""
echo "Happy coding! 🎉"
