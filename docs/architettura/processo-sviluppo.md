# Processo di Sviluppo

## Setup Ambiente
1. Clonare il repository
2. Copiare `.env.example` in `.env` e configurare
3. Eseguire `./universal_start.sh`
4. Accedere a http://localhost:3200 (frontend) o http://localhost:5220 (gateway)

## Sviluppo Backend
- Ogni microservizio e' indipendente
- Per sviluppare un singolo servizio: `cd src/LEGAL.<Servizio>.Api && dotnet run`
- Swagger UI disponibile in development: `http://localhost:<porta>/swagger`
- Database SQLite creato automaticamente al primo avvio

## Sviluppo Frontend
- `cd legal-web && npm install && npm run dev`
- Proxy Vite verso gateway su porta 5220
- Hot reload automatico

## Aggiungere un nuovo endpoint
1. Aggiungere il metodo nel controller del servizio
2. Se serve una nuova tabella, aggiungere la CREATE TABLE nel Program.cs
3. Aggiornare `docs/api-mapping/endpoint-mapping.md`
4. Aggiungere la route nel gateway se necessario

## Aggiungere un nuovo microservizio
1. Creare `src/LEGAL.<Nome>.Api/` con .csproj, Program.cs, Controller
2. Aggiungere route e cluster nel gateway `appsettings.json`
3. Aggiungere il progetto al file `.slnx`
4. Aggiornare documentazione

## Convenzioni
- Soft delete (Status = Deleted), mai DELETE fisico
- Campi data in ISO 8601 (UTC)
- Paginazione con `page` e `pageSize`
- Risposta standard con `ApiResponse<T>`
- Dapper queries inline nei repository
- Serilog per tutti i log

## Build e Deploy
```bash
dotnet build -m:1          # Build completo
./universal_stop.sh && ./universal_start.sh  # Deploy
```
