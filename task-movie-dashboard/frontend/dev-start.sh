#!/bin/bash

# Kill any existing Next.js processes
echo "Stopping existing Next.js processes..."
pkill -f "next dev" || true

# Clear Next.js cache
echo "Clearing Next.js cache..."
rm -rf .next

# Clear node_modules cache (optional)
# echo "Clearing node_modules cache..."
# rm -rf node_modules/.cache

# Start development server
echo "Starting Next.js development server..."
npm run dev
