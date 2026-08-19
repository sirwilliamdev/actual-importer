export interface Transaction {
  date: string; // YYYY-MM-DD
  payee: string; // merchant/description
  amount: number; // integer cents: Math.round(value * 100), negative = outflow
  importedId: string; // unique dedup key
  notes: string; // additional description
}

export interface Config {
  serverURL: string;
  password: string;
  budgetId: string; // groupId / syncId (used for downloadBudget)
  defaultAccountId: string; // account UUID or name
  allowSelfSignedCert?: boolean; // opt in only when serverURL has an untrusted cert
}
