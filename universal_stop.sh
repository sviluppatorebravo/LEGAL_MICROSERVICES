#!/bin/bash
RED='\033[0;31m'; GREEN='\033[0;32m'; NC='\033[0m'
echo -e "${RED}Stopping LEGAL (Gestione Legale)...${NC}"
for pidfile in /tmp/legal-*.pid; do [ -f "$pidfile" ] && { kill $(cat "$pidfile") 2>/dev/null && echo -e "${GREEN}[OK] Stopped PID $(cat $pidfile)${NC}" || true; rm -f "$pidfile"; }; done
echo -e "${GREEN}All stopped.${NC}"
