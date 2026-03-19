const NAV_ITEMS = [
  {
    id: "calendar", label: "Calendar",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    id: "squad", label: "Squad",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    id: "physio", label: "Physio",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
  },
  {
    id: "availability", label: "Availability",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20">
        <polyline points="9 11 12 14 22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
  {
    id: "history", label: "Club History",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    id: "docs", label: "Documents",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="17" x2="16" y2="17"/>
      </svg>
    ),
  },
];

export default function Sidebar({ activeNav, setActiveNav, sidebarOpen, setSidebarOpen }) {
  return (
    <div style={{
      width: sidebarOpen ? 210 : 64, minWidth: sidebarOpen ? 210 : 64,
      background: "#141414", borderRight: "1px solid #1f1f1f",
      display: "flex", flexDirection: "column",
      transition: "width 0.25s ease, min-width 0.25s ease",
      overflow: "hidden", zIndex: 10, flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: "18px 0", borderBottom: "1px solid #1f1f1f",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        minHeight: 64,
      }}>
        <div style={{
          width: 34, height: 34, background: "#cc0000", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="17" height="17">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
          </svg>
        </div>
        {sidebarOpen && (
          <div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900,
              fontSize: 15, letterSpacing: 1.5, color: "#e8e8e8", lineHeight: 1,
            }}>PITCHSIDE</div>
            <div style={{ fontSize: 9, color: "#555", letterSpacing: 0.5, marginTop: 2 }}>HAMMERSMITH FC</div>
          </div>
        )}
      </div>

      {/* Toggle */}
      <button
        onClick={() => setSidebarOpen(o => !o)}
        style={{
          background: "none", border: "none", color: "#444", cursor: "pointer",
          padding: "8px", display: "flex", justifyContent: "center", marginTop: 4,
          transition: "color 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = "#888"}
        onMouseLeave={e => e.currentTarget.style.color = "#444"}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
          {sidebarOpen
            ? <polyline points="15 18 9 12 15 6"/>
            : <polyline points="9 18 15 12 9 6"/>}
        </svg>
      </button>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "6px 0", display: "flex", flexDirection: "column", gap: 1 }}>
        {NAV_ITEMS.map(item => {
          const active = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              style={{
                background: active ? "rgba(204,0,0,0.18)" : "none",
                border: "none",
                borderLeft: `3px solid ${active ? "#cc0000" : "transparent"}`,
                color: active ? "#ff4444" : "#555",
                display: "flex", alignItems: "center",
                gap: 12, padding: "10px 16px", cursor: "pointer",
                textAlign: "left", width: "100%", whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(204,0,0,0.08)"; e.currentTarget.style.color = "#999"; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#555"; }}}
            >
              <span style={{ flexShrink: 0, opacity: active ? 1 : 0.7 }}>{item.icon}</span>
              {sidebarOpen && (
                <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: 0.3 }}>{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: "12px 14px", borderTop: "1px solid #1f1f1f",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%", background: "#1a1a1a",
          border: "1px solid #2a2a2a", display: "flex", alignItems: "center",
          justifyContent: "center", flexShrink: 0, fontSize: 10, fontWeight: 700,
          color: "#cc0000", fontFamily: "'Barlow Condensed', sans-serif",
        }}>ADM</div>
        {sidebarOpen && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#ccc" }}>Admin</div>
            <div style={{ fontSize: 10, color: "#444" }}>Hammersmith FC</div>
          </div>
        )}
      </div>
    </div>
  );
}
