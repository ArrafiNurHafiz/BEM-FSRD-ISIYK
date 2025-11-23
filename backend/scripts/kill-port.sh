#!/bin/bash
# Script to kill process on port 5000

PORT=5000

echo "Mencari proses di port $PORT..."

# Find process using port
PID=$(lsof -ti:$PORT 2>/dev/null || fuser $PORT/tcp 2>/dev/null | awk '{print $1}')

if [ -z "$PID" ]; then
    echo "Tidak ada proses yang menggunakan port $PORT"
    exit 0
fi

echo "Menemukan proses dengan PID: $PID"
echo "Menghentikan proses..."

kill $PID

sleep 1

# Check if still running
if lsof -ti:$PORT > /dev/null 2>&1; then
    echo "Proses masih berjalan, menggunakan force kill..."
    kill -9 $PID
fi

echo "✅ Port $PORT sudah bebas"
echo "Sekarang Anda bisa menjalankan: npm run dev"

