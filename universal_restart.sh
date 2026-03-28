#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"$SCRIPT_DIR/universal_stop.sh"; sleep 2; "$SCRIPT_DIR/universal_start.sh"
