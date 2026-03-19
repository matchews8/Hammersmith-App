function PlaceholderShell({ title, subtitle, children }) {
  return (
    <div style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900,
          fontSize: 26, letterSpacing: 1.5, color: "#e8e8e8",
        }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: "#444", marginTop: 4 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

function EmptyCard({ icon, label }) {
  return (
    <div style={{
      background: "#141414", border: "1px dashed #1f1f1f",
      borderRadius: 8, padding: "32px", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 10, color: "#333",
    }}>
      <div style={{ fontSize: 32 }}>{icon}</div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 1 }}>{label}</div>
    </div>
  );
}

function StatBox({ value, label }) {
  return (
    <div style={{
      background: "#141414", border: "1px solid #1f1f1f",
      borderRadius: 8, padding: "18px 22px", minWidth: 120,
    }}>
      <div style={{
        fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900,
        fontSize: 36, color: "#cc0000", lineHeight: 1,
      }}>{value}</div>
      <div style={{ fontSize: 11, color: "#555", marginTop: 5, letterSpacing: 0.5 }}>{label}</div>
    </div>
  );
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

export function Calendar() {
  const months = ["March 2025"];
  const fixtures = [
    { date: "22 Mar", team: "Hammersmith 1s", opponent: "Northgate Athletic", time: "10:30am", venue: "Hurlingham Park", type: "Home" },
    { date: "29 Mar", team: "Hammersmith 1s", opponent: "Ealing Rangers", time: "10:30am", venue: "Hurlingham Park", type: "Home" },
    { date: "30 Mar", team: "Hammersmith 2s", opponent: "Fulham Casuals", time: "11:00am", venue: "Bishops Park", type: "Away" },
    { date: "5 Apr", team: "Hammersmith 1s", opponent: "Wandsworth United", time: "11:00am", venue: "Clapham Common", type: "Away" },
    { date: "6 Apr", team: "Hammersmith 2s", opponent: "Chiswick Town", time: "10:00am", venue: "Hurlingham Park", type: "Home" },
  ];

  return (
    <PlaceholderShell title="CALENDAR" subtitle="Fixtures & events for Hammersmith FC">
      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 640 }}>
        {fixtures.map((f, i) => (
          <div key={i} style={{
            background: "#141414", border: "1px solid #1f1f1f",
            borderRadius: 6, padding: "12px 16px",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{
              width: 48, textAlign: "center", flexShrink: 0,
            }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 20, color: "#cc0000", lineHeight: 1 }}>
                {f.date.split(" ")[0]}
              </div>
              <div style={{ fontSize: 10, color: "#555" }}>{f.date.split(" ")[1]}</div>
            </div>
            <div style={{ width: 1, height: 32, background: "#1f1f1f" }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: "#e8e8e8", fontWeight: 600 }}>vs {f.opponent}</div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{f.team} · {f.time} · {f.venue}</div>
            </div>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: 1,
              color: f.type === "Home" ? "#22c55e" : "#f59e0b",
              fontFamily: "'Barlow Condensed', sans-serif",
            }}>{f.type}</div>
          </div>
        ))}
      </div>
    </PlaceholderShell>
  );
}

// ─── Physio ───────────────────────────────────────────────────────────────────

export function Physio() {
  const injuries = [
    { name: "Aaron West", team: "1s", injury: "Hamstring strain", status: "Out", eta: "3 weeks" },
    { name: "Kyle Sharp", team: "2s", injury: "Ankle sprain", status: "Doubt", eta: "1 week" },
    { name: "Tom Rowe", team: "2s", injury: "Knee bruising", status: "Light training", eta: "Available" },
  ];

  return (
    <PlaceholderShell title="PHYSIO" subtitle="Player injury tracker & fitness status">
      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 600 }}>
        {injuries.length > 0 ? injuries.map((p, i) => (
          <div key={i} style={{
            background: "#141414", border: "1px solid #1f1f1f",
            borderRadius: 6, padding: "12px 16px",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{
              width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
              background: p.status === "Out" ? "#ef4444" : p.status === "Doubt" ? "#f59e0b" : "#22c55e",
            }}/>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, color: "#e8e8e8", fontWeight: 600 }}>{p.name}</span>
                <span style={{ fontSize: 10, color: "#555" }}>({p.team})</span>
              </div>
              <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{p.injury}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: 1,
                color: p.status === "Out" ? "#ef4444" : p.status === "Doubt" ? "#f59e0b" : "#22c55e",
                fontFamily: "'Barlow Condensed', sans-serif",
              }}>{p.status.toUpperCase()}</div>
              <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>ETA: {p.eta}</div>
            </div>
          </div>
        )) : (
          <EmptyCard icon="💪" label="ALL PLAYERS FIT" />
        )}
      </div>
    </PlaceholderShell>
  );
}

// ─── Availability ─────────────────────────────────────────────────────────────

export function Availability() {
  const responses = [
    { name: "Dan Fletcher", team: "1s", pos: "GK", status: "yes" },
    { name: "Tom Ashby", team: "1s", pos: "DEF", status: "yes" },
    { name: "Aaron West", team: "1s", pos: "MID", status: "no" },
    { name: "Ellis Shaw", team: "1s", pos: "FWD", status: "yes" },
    { name: "Matty Burns", team: "1s", pos: "MID", status: "maybe" },
    { name: "Tyler Moore", team: "1s", pos: "FWD", status: "yes" },
    { name: "Will Garner", team: "2s", pos: "GK", status: "yes" },
    { name: "Liam Cross", team: "2s", pos: "DEF", status: "yes" },
    { name: "Tom Rowe", team: "2s", pos: "MID", status: "maybe" },
    { name: "Joe Mead", team: "2s", pos: "FWD", status: "yes" },
  ];

  const statusColor = { yes: "#22c55e", no: "#ef4444", maybe: "#f59e0b" };
  const statusLabel = { yes: "Available", no: "Unavailable", maybe: "Unsure" };

  return (
    <PlaceholderShell title="AVAILABILITY" subtitle="Player responses for upcoming fixtures">
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["yes", "no", "maybe"].map(s => (
          <div key={s} style={{
            background: "#141414", border: "1px solid #1f1f1f",
            borderRadius: 6, padding: "8px 16px",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor[s] }}/>
            <span style={{ fontSize: 12, color: "#888" }}>
              {responses.filter(r => r.status === s).length} {statusLabel[s]}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 500 }}>
        {responses.map((r, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "8px 14px", background: "#141414",
            border: "1px solid #1a1a1a", borderRadius: 4,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: statusColor[r.status] }}/>
            <span style={{ flex: 1, fontSize: 12, color: "#ccc" }}>{r.name}</span>
            <span style={{ fontSize: 10, color: "#444" }}>{r.team} · {r.pos}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: statusColor[r.status], fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 0.5 }}>
              {statusLabel[r.status].toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </PlaceholderShell>
  );
}

// ─── Club History ─────────────────────────────────────────────────────────────

export function ClubHistory() {
  return (
    <PlaceholderShell title="CLUB HISTORY" subtitle="Hammersmith FC — Est. 2008">
      <div style={{ maxWidth: 660 }}>
        <div style={{
          background: "#141414", border: "1px solid #1f1f1f",
          borderRadius: 8, padding: "22px 24px", marginBottom: 20,
          display: "flex", alignItems: "center", gap: 20,
        }}>
          <div style={{
            width: 72, height: 72, background: "#cc0000", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" width="34" height="34">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 24, color: "#e8e8e8", letterSpacing: 1 }}>
              HAMMERSMITH FC
            </div>
            <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>Founded 2008 · West London Sunday League · Colours: Red & Black</div>
            <div style={{ fontSize: 11, color: "#444", marginTop: 2 }}>Home ground: Hurlingham Park, London SW6</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          {[
            { value: "2", label: "Teams" },
            { value: "32", label: "Registered Players" },
            { value: "6", label: "Seasons Played" },
            { value: "2", label: "League Titles" },
          ].map((s, i) => <StatBox key={i} {...s} />)}
        </div>

        <div style={{
          background: "#141414", border: "1px solid #1f1f1f",
          borderRadius: 8, padding: "18px 22px",
        }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 2, color: "#555", marginBottom: 14 }}>SEASON HISTORY</div>
          {[
            { season: "2024/25", div: "Division 2", pos: "2nd (ongoing)", notes: "Promotion push" },
            { season: "2023/24", div: "Division 3", pos: "1st — Champions", notes: "Promoted" },
            { season: "2022/23", div: "Division 3", pos: "4th", notes: "" },
            { season: "2021/22", div: "Division 4", pos: "1st — Champions", notes: "Promoted" },
          ].map((row, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "8px 0", borderBottom: i < 3 ? "1px solid #1a1a1a" : "none",
            }}>
              <span style={{ fontSize: 12, color: "#555", width: 64, flexShrink: 0 }}>{row.season}</span>
              <span style={{ fontSize: 12, color: "#888", flex: 1 }}>{row.div}</span>
              <span style={{ fontSize: 12, color: row.pos.includes("Champions") ? "#cc0000" : "#ccc", fontWeight: row.pos.includes("Champions") ? 600 : 400 }}>{row.pos}</span>
              {row.notes && <span style={{ fontSize: 10, color: "#444" }}>{row.notes}</span>}
            </div>
          ))}
        </div>
      </div>
    </PlaceholderShell>
  );
}

// ─── Documents ────────────────────────────────────────────────────────────────

export function Documents() {
  const docs = [
    { name: "Code of Conduct 2024/25", type: "PDF", size: "84 KB", date: "Sep 2024" },
    { name: "Player Registration Form", type: "PDF", size: "120 KB", date: "Aug 2024" },
    { name: "Kit Order — 2025", type: "PDF", size: "56 KB", date: "Jan 2025" },
    { name: "Pitch Booking Confirmation", type: "PDF", size: "32 KB", date: "Mar 2025" },
    { name: "League Rules 2024/25", type: "PDF", size: "210 KB", date: "Aug 2024" },
  ];

  return (
    <PlaceholderShell title="DOCUMENTS" subtitle="Club files and documentation">
      <div style={{ maxWidth: 560 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {docs.map((doc, i) => (
            <div key={i} style={{
              background: "#141414", border: "1px solid #1f1f1f",
              borderRadius: 6, padding: "11px 16px",
              display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
              transition: "border-color 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#2a2a2a"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#1f1f1f"}
            >
              <div style={{
                width: 32, height: 32, background: "rgba(204,0,0,0.1)",
                border: "1px solid rgba(204,0,0,0.2)",
                borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#cc0000" strokeWidth="1.8" width="16" height="16">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "#d0d0d0", fontWeight: 500 }}>{doc.name}</div>
                <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>{doc.type} · {doc.size} · {doc.date}</div>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" width="14" height="14">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </div>
          ))}
        </div>
      </div>
    </PlaceholderShell>
  );
}
