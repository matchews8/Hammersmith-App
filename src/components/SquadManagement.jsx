import { useState } from "react";
import SquadSelector from "./SquadSelector";
import { getNextMatch, formatDateLong, formatTime } from "./Calendar";

const POS_COLOR = { GK: "#f59e0b", DEF: "#3b82f6", MID: "#22c55e", FWD: "#ef4444" };
const POS_LABEL = { GK: "Goalkeepers", DEF: "Defenders", MID: "Midfielders", FWD: "Forwards" };

// ─── Team Cards ──────────────────────────────────────────────────────────────

function TeamCards({ teams, onSelect, events }) {
  return (
    <div style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900,
          fontSize: 26, letterSpacing: 1.5, color: "#e8e8e8",
        }}>SQUAD MANAGEMENT</div>
        <div style={{ fontSize: 12, color: "#444", marginTop: 4 }}>Select a team to manage</div>
      </div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {Object.values(teams).map(team => (
          <TeamCard key={team.id} team={team} events={events} onClick={() => onSelect(team.id)} />
        ))}
      </div>
    </div>
  );
}

function TeamCard({ team, events, onClick }) {
  const [hovered, setHovered] = useState(false);
  const nextMatch = getNextMatch(events, team.id);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#191919" : "#141414",
        border: `1px solid ${hovered ? "#cc0000" : "#1f1f1f"}`,
        borderRadius: 8, padding: "20px 22px",
        cursor: "pointer", width: 300,
        transition: "all 0.18s ease",
        boxShadow: hovered ? "0 0 0 1px rgba(204,0,0,0.15)" : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <div style={{
          width: 44, height: 44, background: "#cc0000", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="20" height="20">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
          </svg>
        </div>
        <div>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
            fontSize: 19, color: "#e8e8e8", letterSpacing: 0.5,
          }}>{team.name.toUpperCase()}</div>
          <div style={{ fontSize: 11, color: "#444", marginTop: 1 }}>{team.players.length} registered players</div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid #1f1f1f", paddingTop: 14 }}>
        <div style={{
          fontSize: 9, fontWeight: 700, letterSpacing: 2, color: "#555",
          fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 8,
        }}>NEXT MATCH</div>
        {nextMatch ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#cc0000", flexShrink: 0 }}/>
              <span style={{ fontSize: 14, color: "#e8e8e8", fontWeight: 600 }}>vs {nextMatch.opponent}</span>
            </div>
            <div style={{ fontSize: 12, color: "#666", paddingLeft: 12 }}>{formatDateLong(nextMatch.date)} · {formatTime(nextMatch.time)}</div>
            <div style={{ fontSize: 11, color: "#444", paddingLeft: 12, marginTop: 2 }}>{nextMatch.location}</div>
          </>
        ) : (
          <div style={{ fontSize: 12, color: "#444", fontStyle: "italic" }}>No upcoming match</div>
        )}
      </div>

      <div style={{
        marginTop: 16, padding: "8px 12px",
        background: hovered ? "rgba(204,0,0,0.1)" : "rgba(255,255,255,0.02)",
        borderRadius: 4, border: `1px solid ${hovered ? "rgba(204,0,0,0.3)" : "#1a1a1a"}`,
        textAlign: "center", transition: "all 0.18s",
      }}>
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
          fontSize: 12, letterSpacing: 1, color: hovered ? "#ff4444" : "#555",
        }}>MANAGE TEAM →</span>
      </div>
    </div>
  );
}

// ─── Team View ────────────────────────────────────────────────────────────────

function TeamView({ team, selection, onOpenSelector, onAddPlayer, onBack, events }) {
  const [showAddModal, setShowAddModal] = useState(false);

  const xiCount = Object.values(selection.slots).filter(Boolean).length;
  const benchCount = selection.bench.length;

  const playersByPos = { GK: [], DEF: [], MID: [], FWD: [] };
  team.players.forEach(p => playersByPos[p.pos]?.push(p));

  const nextMatch = getNextMatch(events, team.id);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Sub-header */}
      <div style={{
        background: "#141414", borderBottom: "1px solid #1f1f1f",
        padding: "0 24px", height: 52, display: "flex", alignItems: "center",
        justifyContent: "space-between", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={onBack}
            style={{
              background: "none", border: "none", color: "#555", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6, padding: "4px 0",
              transition: "color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#e8e8e8"}
            onMouseLeave={e => e.currentTarget.style.color = "#555"}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            <span style={{ fontSize: 12 }}>All Teams</span>
          </button>
          <span style={{ color: "#2a2a2a" }}>/</span>
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
            fontSize: 16, letterSpacing: 0.5, color: "#e8e8e8",
          }}>{team.name.toUpperCase()}</span>
        </div>
        <div style={{ fontSize: 12, color: "#555" }}>
          {xiCount > 0 && (
            <span style={{ color: "#888" }}>
              <span style={{ color: "#cc0000", fontWeight: 700 }}>{xiCount}</span>/11 XI selected
              {benchCount > 0 && <span> · {benchCount} bench</span>}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Left: Match Hub */}
        <div style={{
          flex: 1, padding: "24px", display: "flex", flexDirection: "column",
          gap: 16, overflowY: "auto", borderRight: "1px solid #1a1a1a",
        }}>
          <div>
            <div style={{
              fontSize: 9, fontWeight: 700, letterSpacing: 2.5, color: "#555",
              fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 12,
            }}>MATCH HUB</div>

            <div style={{
              background: "#141414", border: "1px solid #1f1f1f",
              borderRadius: 8, padding: "20px 22px",
            }}>
              {nextMatch ? (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 10, color: "#cc0000", fontWeight: 700, letterSpacing: 1.5, fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 6 }}>UPCOMING FIXTURE</div>
                      <div style={{
                        fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
                        fontSize: 22, color: "#e8e8e8", letterSpacing: 0.5, lineHeight: 1,
                      }}>vs {nextMatch.opponent}</div>
                    </div>
                    {nextMatch.homeAway && (
                      <div style={{
                        background: "rgba(204,0,0,0.12)", border: "1px solid rgba(204,0,0,0.25)",
                        borderRadius: 4, padding: "4px 10px",
                        fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                        fontSize: 10, letterSpacing: 1, color: "#cc0000",
                      }}>{nextMatch.homeAway.toUpperCase()}</div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
                    {[
                      { label: "Date", value: formatDateLong(nextMatch.date) },
                      { label: "Kick-off", value: formatTime(nextMatch.time) },
                      { label: "Venue", value: nextMatch.location },
                    ].map(item => (
                      <div key={item.label} style={{
                        background: "#1a1a1a", borderRadius: 6, padding: "10px 12px", flex: 1,
                      }}>
                        <div style={{ fontSize: 9, color: "#444", marginBottom: 4, letterSpacing: 1 }}>{item.label.toUpperCase()}</div>
                        <div style={{ fontSize: 11, color: "#ccc", fontWeight: 500, lineHeight: 1.3 }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ paddingBottom: 18 }}>
                  <div style={{ fontSize: 10, color: "#555", fontWeight: 700, letterSpacing: 1.5, fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 10 }}>UPCOMING FIXTURE</div>
                  <div style={{
                    background: "#1a1a1a", borderRadius: 6, padding: "16px",
                    textAlign: "center", border: "1px dashed #252525",
                  }}>
                    <div style={{ fontSize: 13, color: "#444", marginBottom: 4 }}>No upcoming match scheduled</div>
                    <div style={{ fontSize: 11, color: "#333" }}>Add one via the Calendar section</div>
                  </div>
                </div>
              )}
              <button
                onClick={onOpenSelector}
                style={{
                  width: "100%", background: "#cc0000", border: "none", color: "white",
                  padding: "10px 0", borderRadius: 5, cursor: "pointer",
                  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
                  fontSize: 14, letterSpacing: 1, transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#e60000"}
                onMouseLeave={e => e.currentTarget.style.background = "#cc0000"}
              >
                {xiCount > 0 ? `EDIT TEAM SELECTION (${xiCount}/11)` : "SELECT TEAM"}
              </button>
            </div>
          </div>

          {/* Selection summary */}
          {xiCount > 0 && (
            <div style={{ background: "#141414", border: "1px solid #1f1f1f", borderRadius: 8, padding: "16px 20px" }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2.5, color: "#555", fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 12 }}>CURRENT SELECTION</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: benchCount > 0 ? 10 : 0 }}>
                {Object.values(selection.slots).filter(Boolean).map(player => (
                  <div key={player.id} style={{
                    background: "#1a1a1a", borderRadius: 4, padding: "4px 8px",
                    fontSize: 11, color: "#ccc", border: "1px solid #222",
                  }}>
                    <span style={{ color: "#cc0000", fontWeight: 700, marginRight: 4 }}>#{player.number}</span>
                    {player.name}
                  </div>
                ))}
              </div>
              {benchCount > 0 && (
                <>
                  <div style={{ fontSize: 9, color: "#444", letterSpacing: 1, marginBottom: 6 }}>BENCH</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {selection.bench.map(player => (
                      <div key={player.id} style={{
                        background: "#181818", borderRadius: 4, padding: "4px 8px",
                        fontSize: 11, color: "#888", border: "1px solid #1e1e1e",
                      }}>
                        <span style={{ color: "#555", fontWeight: 700, marginRight: 4 }}>#{player.number}</span>
                        {player.name}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right: Squad List */}
        <div style={{
          width: 300, background: "#141414", display: "flex", flexDirection: "column",
          overflow: "hidden", flexShrink: 0,
        }}>
          <div style={{
            padding: "14px 18px 10px", borderBottom: "1px solid #1f1f1f",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 2, color: "#555" }}>
                SQUAD LIST
              </div>
              <div style={{ fontSize: 11, color: "#333", marginTop: 2 }}>{team.players.length} players</div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                background: "#cc0000", border: "none", color: "white",
                padding: "6px 12px", borderRadius: 4, cursor: "pointer",
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                fontSize: 11, letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 4,
                transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#e60000"}
              onMouseLeave={e => e.currentTarget.style.background = "#cc0000"}
            >
              <span style={{ fontSize: 14, lineHeight: 1 }}>+</span> ADD PLAYER
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
            {Object.entries(playersByPos).map(([pos, players]) => (
              <div key={pos}>
                <div style={{
                  padding: "8px 18px 5px",
                  fontSize: 9, fontWeight: 700, letterSpacing: 2,
                  color: POS_COLOR[pos], fontFamily: "'Barlow Condensed', sans-serif",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: POS_COLOR[pos], display: "inline-block" }}/>
                  {POS_LABEL[pos].toUpperCase()} ({players.length})
                </div>
                {players.map(player => (
                  <PlayerRow key={player.id} player={player} posColor={POS_COLOR[pos]} />
                ))}
                {players.length === 0 && (
                  <div style={{ padding: "4px 18px 8px", fontSize: 11, color: "#2a2a2a", fontStyle: "italic" }}>None registered</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddPlayerModal
          teamName={team.name}
          onAdd={(player) => { onAddPlayer(player); setShowAddModal(false); }}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

function PlayerRow({ player, posColor }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "7px 18px", borderBottom: "1px solid rgba(255,255,255,0.03)",
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: "rgba(255,255,255,0.04)", border: "1px solid #222",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 10, fontWeight: 700, color: posColor,
        fontFamily: "'Barlow Condensed', sans-serif", flexShrink: 0,
      }}>{player.number}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#d0d0d0", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {player.name}
        </div>
        <div style={{ fontSize: 10, color: "#444", marginTop: 1 }}>{player.pos}</div>
      </div>
      <div style={{
        fontSize: 9, color: "#333", fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 700, letterSpacing: 0.5,
      }}>#{player.number}</div>
    </div>
  );
}

// ─── Add Player Modal ─────────────────────────────────────────────────────────

function AddPlayerModal({ teamName, onAdd, onClose }) {
  const [form, setForm] = useState({ name: "", pos: "MID", number: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Player name is required."); return; }
    if (!form.number || isNaN(Number(form.number)) || Number(form.number) < 1) {
      setError("Enter a valid squad number."); return;
    }
    onAdd({
      id: `custom_${Date.now()}`,
      name: form.name.trim(),
      pos: form.pos,
      number: Number(form.number),
    });
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#161616", border: "1px solid #222",
          borderRadius: 8, padding: "28px",
          width: 360, boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: 1, color: "#e8e8e8" }}>
            ADD PLAYER
          </div>
          <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>{teamName}</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Full Name">
              <input
                autoFocus type="text" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Jamie Smith" style={inputStyle}
              />
            </Field>
            <Field label="Position">
              <select
                value={form.pos}
                onChange={e => setForm(f => ({ ...f, pos: e.target.value }))}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="GK">GK — Goalkeeper</option>
                <option value="DEF">DEF — Defender</option>
                <option value="MID">MID — Midfielder</option>
                <option value="FWD">FWD — Forward</option>
              </select>
            </Field>
            <Field label="Squad Number">
              <input
                type="number" min="1" max="99" value={form.number}
                onChange={e => setForm(f => ({ ...f, number: e.target.value }))}
                placeholder="e.g. 17" style={inputStyle}
              />
            </Field>
          </div>

          {error && <div style={{ marginTop: 10, fontSize: 11, color: "#ef4444" }}>{error}</div>}

          <div style={{ display: "flex", gap: 8, marginTop: 22 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, background: "none", border: "1px solid #2a2a2a",
              color: "#555", padding: "9px 0", borderRadius: 4, cursor: "pointer",
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 0.5,
            }}>CANCEL</button>
            <button type="submit" style={{
              flex: 2, background: "#cc0000", border: "none", color: "white",
              padding: "9px 0", borderRadius: 4, cursor: "pointer",
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 0.5,
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#e60000"}
              onMouseLeave={e => e.currentTarget.style.background = "#cc0000"}
            >ADD TO SQUAD</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#555", marginBottom: 6, fontFamily: "'Barlow Condensed', sans-serif" }}>
        {label.toUpperCase()}
      </div>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a",
  borderRadius: 4, padding: "9px 12px", color: "#e8e8e8", fontSize: 13,
  fontFamily: "'Barlow', sans-serif", outline: "none", transition: "border-color 0.15s",
};

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function SquadManagement({ teams, onAddPlayer, squadState, onSquadStateChange, events }) {
  const { selectedTeam, showSelector, teamSelections } = squadState;

  const setSelectedTeam = (id) => onSquadStateChange({ ...squadState, selectedTeam: id, showSelector: false });
  const setShowSelector = (val) => onSquadStateChange({ ...squadState, showSelector: val });
  const updateSelection = (teamId, sel) => onSquadStateChange({
    ...squadState,
    teamSelections: { ...teamSelections, [teamId]: sel },
  });

  // No team selected → show team cards
  if (!selectedTeam) {
    return <TeamCards teams={teams} onSelect={setSelectedTeam} events={events} />;
  }

  const team = teams[selectedTeam];
  const selection = teamSelections[selectedTeam];

  // Selector open → render squad selector inline (replaces team view, sidebar stays visible)
  if (showSelector) {
    return (
      <SquadSelector
        team={team}
        selection={selection}
        onUpdateSelection={sel => updateSelection(selectedTeam, sel)}
        onBack={() => setShowSelector(false)}
      />
    );
  }

  // Team selected, selector closed → show team view
  return (
    <TeamView
      team={team}
      selection={selection}
      onOpenSelector={() => setShowSelector(true)}
      onAddPlayer={player => onAddPlayer(selectedTeam, player)}
      onBack={() => setSelectedTeam(null)}
      events={events}
    />
  );
}
