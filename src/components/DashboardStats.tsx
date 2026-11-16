"use client";

import { useEffect, useState } from "react";
import { File, Folder, Users } from "lucide-react";

type Overview = { accounts: number; indexedFiles: number; folders: number };

const number = new Intl.NumberFormat();

function StatCard({ label, value, detail, icon: Icon, tone }: { label: string; value: number | null; detail: string; icon: typeof File; tone: "blue-bg" | "purple-bg" | "green-bg" }) {
  return (
    <article className="stat-card">
      <div className="stat-top"><span>{label}</span><div className={`stat-icon ${tone}`}><Icon size={18} /></div></div>
      <div className="stat-value">{value === null ? "—" : number.format(value)}</div>
      <div className="stat-foot">{detail}</div>
    </article>
  );
}

export default function DashboardStats() {
  const [overview, setOverview] = useState<Overview | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function loadOverview() {
      try {
        const response = await fetch("/api/overview", { cache: "no-store", signal: controller.signal });
        if (!response.ok) return;
        setOverview(await response.json() as Overview);
      } catch {
        // The connected-account panel presents detailed errors and retry controls.
      }
    }
    void loadOverview();
    return () => controller.abort();
  }, []);

  return (
    <div className="stats-grid" aria-label="Drive overview statistics">
      <StatCard label="Indexed files" value={overview?.indexedFiles ?? null} detail={overview ? "Metadata available to search" : "Loading your metadata"} icon={File} tone="purple-bg" />
      <StatCard label="Folders" value={overview?.folders ?? null} detail={overview ? "Across connected accounts" : "Loading your metadata"} icon={Folder} tone="blue-bg" />
      <StatCard label="Connected accounts" value={overview?.accounts ?? null} detail={overview ? "Ready to monitor" : "Checking account status"} icon={Users} tone="green-bg" />
    </div>
  );
}
