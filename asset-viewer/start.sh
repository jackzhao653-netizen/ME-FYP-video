#!/bin/bash
# FYP Asset Viewer — backend:3457 frontend:5179
# Properly daemonized so it survives LobbyOps/terminal exit

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

PIDFILE="$DIR/.asset-viewer.pid"
LOGFILE="$DIR/.asset-viewer.log"

# Kill any existing instances
if [ -f "$PIDFILE" ]; then
  old_pid=$(cat "$PIDFILE")
  if kill -0 "$old_pid" 2>/dev/null; then
    echo "Killing old asset-viewer (pid $old_pid)..."
    kill "$old_pid" 2>/dev/null
    sleep 1
    kill -9 "$old_pid" 2>/dev/null
  fi
  rm -f "$PIDFILE"
fi

# Also kill any orphaned processes on our ports
for port in 3457 5179; do
  pids=$(lsof -ti :$port 2>/dev/null)
  if [ -n "$pids" ]; then
    echo "Killing orphaned processes on port $port: $pids"
    echo "$pids" | xargs kill 2>/dev/null
    sleep 1
  fi
done

# Start daemonized
echo "Starting asset-viewer..."
nohup npm run dev > "$LOGFILE" 2>&1 &
echo $! > "$PIDFILE"
echo "Asset viewer started (pid $!, log: $LOGFILE)"

# Wait a moment and verify
sleep 3
if kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  echo "✅ Running — Web: http://$(hostname -I 2>/dev/null | awk '{print $1}' || echo '192.168.1.101'):5179"
else
  echo "❌ Failed to start. Check $LOGFILE"
  cat "$LOGFILE" | tail -20
  exit 1
fi
