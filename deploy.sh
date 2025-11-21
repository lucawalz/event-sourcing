#!/bin/bash

# Simple deployment script for GitHub Pages

echo "Building presentation..."
npm run build

echo "Build complete! Files are in ./dist"
echo ""
echo "To deploy to GitHub Pages:"
echo "1. Go to your GitHub repository settings"
echo "2. Navigate to Pages section"
echo "3. Select 'GitHub Actions' as the source"
echo "4. Push this code to the main branch"
echo "5. The workflow will automatically deploy"
