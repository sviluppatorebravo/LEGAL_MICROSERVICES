# Regole di Coordinamento Team Agenti

## Regole Generali
1. Non modificare servizi esterni (NOTIFICATION_SERVICE, CRON_SCHEDULER, ENTERPRISE_GATEWAY) senza permesso esplicito
2. Ogni modifica deve essere retrocompatibile
3. Testare sempre il build (`dotnet build -m:1`) prima di committare
4. Aggiornare la documentazione endpoint-mapping dopo ogni nuovo endpoint

## Convenzioni Codice
- Un controller per servizio (pattern semplice)
- Dapper queries inline (no ORM pesanti)
- Soft delete con Status = Deleted
- Risposte wrapped in ApiResponse<T>
- Serilog per tutti i log
- Swagger in development mode

## Processo di Deploy
1. `dotnet build -m:1` dal root
2. Verificare 0 errori
3. `./universal_stop.sh && ./universal_start.sh`

## Integrazione Cross-Dominio
- Sempre via Enterprise Gateway (porta 5001)
- Mai chiamate dirette tra domini su localhost
- Gestire SERVICE_UNAVAILABLE nel frontend

## Priorita Sviluppo Legal
1. Completare microservizi mancanti (Compliance, Scadenze, Contenzioso)
2. Frontend React con dashboard legale
3. Integrazione firma digitale
4. Template contratti
5. Integrazione PEC
