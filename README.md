# actual-importer

Shared core library for importing bank transactions into [Actual Budget](https://actualbudget.org/) via `@actual-app/api`.

This package provides the common logic used by bank-specific importers:

- [actual-importer-bbva](https://github.com/sirwilliamdev/actual-importer-bbva) — BBVA Spain (Excel)
- [actual-importer-traderepublic](https://github.com/sirwilliamdev/actual-importer-traderepublic) — TradeRepublic (CSV)
- [actual-importer-imagin](https://github.com/sirwilliamdev/actual-importer-imagin) — imagin / CaixaBank (CSV)

## What's included

- **Transaction / Config types** — shared interfaces for all importers
- **ActualBudget API integration** — connect, resolve accounts, import transactions with deduplication
- **Polyfill** — browser globals shim required by `@actual-app/api` in Node.js
- **SQLite build script** — compiles `better-sqlite3` for all Node.js runtimes on the machine

## Usage

This package is consumed as a local dependency by bank-specific importers:

```json
{
  "dependencies": {
    "actual-importer": "file:../actual-importer"
  }
}
```

```typescript
import { importTransactions, type Transaction, type Config } from "actual-importer";
```

## Requirements

- Node.js >= 20
- A running Actual Budget server
