#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
source "$SCRIPT_DIR/../telegram_notify.sh"
echo -e "${BLUE}  LEGAL (Gestione Legale) - Startup${NC}"
if [ -f .env ]; then export $(grep -v '^#' .env | xargs); echo -e "${GREEN}[OK] .env loaded${NC}"; fi
start_service() { local name=$1 project=$2 port=$3; echo -e "${YELLOW}[...] Starting $name on port $port${NC}"; local pid=$(ss -tlnp "sport = :$port" 2>/dev/null | grep -oP 'pid=\K[0-9]+' | head -1); if [ -n "$pid" ]; then kill "$pid" 2>/dev/null || true; sleep 1; fi; cd "$SCRIPT_DIR/src/$project"; mkdir -p logs data; nohup dotnet run --configuration Release --urls "http://0.0.0.0:$port" > "logs/${name}.log" 2>&1 &; echo $! > "/tmp/legal-${name}.pid"; cd "$SCRIPT_DIR"; echo -e "${GREEN}[OK] $name started${NC}"; }
start_service "gateway" "LEGAL.Gateway" 5220
start_service "auth" "LEGAL.Auth.Api" 5221
start_service "contratti" "LEGAL.Contratti.Api" 5222
start_service "ip" "LEGAL.IP.Api" 5223
start_service "scadenze" "LEGAL.Scadenze.Api" 5224
start_service "compliance" "LEGAL.Compliance.Api" 5225
start_service "contenzioso" "LEGAL.Contenzioso.Api" 5226
start_service "ai" "LEGAL.AI.Api" 5227
start_service "analisi-rischio" "LEGAL.AnalisiRischio.Api" 5228
start_service "analisi-contratti" "LEGAL.AnalisiContratti.Api" 5229
start_service "modello231" "LEGAL.Modello231.Api" 5230
echo -e "${YELLOW}[...] Starting Web UI on port 3200${NC}"
cd "$SCRIPT_DIR/legal-web"
if [ ! -d "node_modules" ]; then npm install; fi
nohup npm run dev > logs/web.log 2>&1 &
echo $! > /tmp/legal-web.pid
cd "$SCRIPT_DIR"
echo -e "${GREEN}[OK] Web UI started${NC}"
echo -e "${GREEN}  Gateway: http://localhost:5220${NC}"
echo -e "${GREEN}  Web UI:  http://localhost:3200${NC}"
IP=$(get_local_ip); WG=$(get_wireguard_ip)
send_telegram "LEGAL (Gestione Legale) avviato - Gateway: http://${IP}:5220 Web: http://${IP}:3200" 2>/dev/null || true
