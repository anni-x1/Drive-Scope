import { Activity, Cloud, Home, Plus, Search, Zap } from "lucide-react";
import DashboardStats from "@/components/DashboardStats";
import LiveOverview from "@/components/LiveOverview";
import RecentFiles from "@/components/RecentFiles";

const navigation = [{ label: "Overview", icon: Home }];

export default function HomePage() {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-icon"><Cloud size={21} /></div><span>Drive<span className="brand-light">Scope</span></span></div>
        <a className="new-button" href="/api/accounts/google/start"><Plus size={19} /> Connect</a>
        <nav className="nav-list">{navigation.map(({ label, icon: Icon }) => <a key={label} className="nav-item active" href="/"><Icon size={19} /><span>{label}</span></a>)}</nav>
        <div className="side-divider" />
        <div className="account-label">CONNECTED ACCOUNTS <a aria-label="Connect account" href="/api/accounts/google/start"><Plus size={15} /></a></div>
        <div className="account-empty">Connected Google accounts appear in the overview below.</div>
        <div className="side-bottom">
          <div className="upgrade"><div className="upgrade-top"><Zap size={16} /><b>Storage insights</b></div><p>Quota and cleanup insights are coming next.</p><div className="progress"><span style={{ width: 0 }} /></div></div>
          <div className="user-row"><div className="avatar avatar-user">DS</div><div><b>DriveScope</b><span>Google Drive overview</span></div></div>
        </div>
      </aside>
      <section className="content">
        <header className="topbar">
          <div className="mobile-brand"><div className="brand-icon"><Cloud size={20} /></div>DriveScope</div>
          <div className="search"><Search size={19} /><input placeholder="Search is coming soon" disabled /></div>
          <div className="top-actions"><button className="icon-button" aria-label="Activity unavailable" disabled><Activity size={19} /></button><span className="sync-button"><span className="sync-indicator" style={{ background: "#34a853" }} />Connected</span></div>
        </header>
        <div className="main-content">
          <div className="welcome-row"><div><div className="eyebrow">DRIVE OVERVIEW</div><h1>Your Drive, in one place.</h1><p className="subtitle">Live metadata from your connected Google Drive accounts.</p></div><a className="connect-button" href="/api/accounts/google/start"><Plus size={17} /> Connect account</a></div>
          <DashboardStats />
          <LiveOverview />
          <RecentFiles />
          <footer>DriveScope stores searchable metadata only. File contents stay in Google Drive.</footer>
        </div>
      </section>
      <nav className="mobile-nav">{navigation.map(({ label, icon: Icon }) => <a key={label} className="selected" href="/"><Icon size={20} /><span>{label}</span></a>)}</nav>
    </main>
  );
}
