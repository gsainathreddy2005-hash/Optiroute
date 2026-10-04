#!/usr/bin/env bash
# Render.com build script — installs backend deps + builds React frontend
set -o errexit

echo "=== Installing Python dependencies ==="
pip install -r backend/requirements.txt

echo "=== Building React frontend ==="
cd frontend
npm install
npm run build
cd ..

echo "=== Build complete ==="
