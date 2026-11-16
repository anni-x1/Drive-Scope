"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, CircleAlert, LoaderCircle, Plus, RefreshCw } from "lucide-react";

type Account = {
  _id: string;
  email: string;
  name?: string;
  syncState: "never" | "queued" | "syncing" | "ready" | "error";
  syncError?: string;
  lastSyncedAt?: string;
};

type AccountsResponse = { accounts?: Account[]; error?: string };
type FilesResponse = { total?: number };

function syncLabel(account: Account) {
  if (account.syncState === "error") return account.syncError || "Sync needs attention";
  if (account.syncState === "ready") return account.lastSyncedAt ? `Synced ${new Date(account.lastSyncedAt).toLocaleString()}` : "Ready to sync";
  if (account.syncState === "syncing") return "Sync in progress";
  if (account.syncState === "queued") return "Ready to index";
  return "Not synced yet";
}

export default function LiveOverview() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [busyAccountId, setBusyAccountId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const accountsResponse = await fetch("/api/accounts", { cache: "no-store" });
      if (accountsResponse.status === 401) {
        setAccounts([]);
        setTotal(null);
        return;
      }
      const accountsData = await accountsResponse.json() as AccountsResponse;
      if (!accountsResponse.ok) throw new Error(accountsData.error || "Could not load connected accounts.");
      setAccounts(accountsData.accounts ?? []);
      const filesResponse = await fetch("/api/files?limit=1", { cache: "no-store" });
      if (filesResponse.ok) {
        const filesData = await filesResponse.json() as FilesResponse;
        setTotal(filesData.total ?? 0);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load account status.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function sync(accountId: string) {
    setBusyAccountId(accountId);
    setError("");
    try {
      const response = await fetch(`/api/accounts/${accountId}/sync`, { method: "POST" });
      const data = await response.json() as { error?: string; complete?: boolean };
      if (!response.ok) throw new Error(data.error || "Sync failed.");
      if (!data.complete) setError("A batch was saved. Select Sync again to continue indexing this account.");
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sync failed.");
    } finally {
      setBusyAccountId(null);
    }
  }

  return (
    <section className="live-panel" aria-labelledby="accounts-title" aria-busy={loading}>
      <div className="live-panel-head">
        <div><h2 id="accounts-title">Connected accounts</h2><p>{loading ? "Checking account status…" : accounts.length ? `${accounts.length} Google ${accounts.length === 1 ? "account" : "accounts"} connected` : "No Google accounts connected yet"}</p></div>
        <a href="/api/accounts/google/start"><Plus size={15} /> Connect</a>
      </div>
      {error && <p className="live-error" role="alert"><CircleAlert size={15} />{error}</p>}
      {!loading && accounts.map((account) => {
        const syncing = busyAccountId === account._id;
        return <article className="live-account" key={account._id}>
          <div className="live-account-avatar" aria-hidden="true">{(account.name || account.email).slice(0, 1).toUpperCase()}</div>
          <div className="live-account-info"><b>{account.name || account.email}</b><span>{account.email}</span><small className={account.syncState === "error" ? "sync-error-text" : ""}>{syncLabel(account)}</small></div>
          <button onClick={() => void sync(account._id)} disabled={busyAccountId !== null} className="live-sync">{syncing ? <LoaderCircle size={15} className="spin" /> : <RefreshCw size={15} />}<span>{syncing ? "Syncing…" : "Sync"}</span></button>
        </article>;
      })}
      {!loading && accounts.length > 0 && <p className="live-total">{total === null ? "Loading indexed file count…" : `${total.toLocaleString()} indexed files`}</p>}
      {!loading && accounts.length === 0 && <div className="live-empty"><CheckCircle2 size={18} />Connect Google Drive to start indexing accessible file metadata.</div>}
    </section>
  );
}
