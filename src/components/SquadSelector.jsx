import { useRef } from "react";
import { FORMATION_SLOTS } from "../data";

const POS_COLOR = { GK: "#f59e0b", DEF: "#3b82f6", MID: "#22c55e", FWD: "#ef4444" };
const POS_LABEL = { GK: "Goalkeepers", DEF: "Defenders", MID: "Midfielders", FWD: "Forwards" };

function initSlots(formation) {
  const s = {};
  FORMATION_SLOTS[formation].forEach(sl => (s[sl.id] = null));
  return s;
}

function JerseyIcon({ color = "#cc0000", number, small = false }) {
  const size = small ? 34 : 46;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path
        d="M14 6 L6 14 L12 16 L12 42 L36 42 L36 16 L42 14 L34 6 C32 10 28 12 24 12 C20 12 16 10 14 6Z"
        fill={color} stroke="rgba(0,0,0,0.4)" strokeWidth="1.5"
      />
      {number !== undefined && (
        <text x="24" y="30" textAnchor="middle" fontSize={small ? "10" : "13"} fontWeight="700"
          fill="white" fontFamily="'Barlow Condensed', sans-serif">{number}</text>
      )}
    </svg>
  );
}

// Renders inline within the main content area — sidebar is always visible
export default function SquadSelector({ team, selection, onUpdateSelection, onBack }) {
  const { formation, slots, bench } = selection;
  const dragRef = useRef(null);

  const selectedIds = new Set([
    ...Object.values(slots).filter(Boolean).map(p => p.id),
    ...bench.map(p => p.id),
  ]);
  const pool = team.players.filter(p => !selectedIds.has(p.id));

  const poolByPos = { GK: [], DEF: [], MID: [], FWD: [] };
  pool.forEach(p => poolByPos[p.pos]?.push(p));

  const formationRows = FORMATION_SLOTS[formation].reduce((acc, sl) => {
    if (!acc[sl.row]) acc[sl.row] = [];
    acc[sl.row].push(sl);
    return acc;
  }, {});

  const xiCount = Object.values(slots).filter(Boolean).length;
  const update = (partial) => onUpdateSelection({ ...selection, ...partial });

  const handleFormationChange = (f) => {
    update({ formation: f, slots: initSlots(f), bench: [] });
  };

  const handleDragStart = (e, player, source, sourceId) => {
    dragRef.current = { player, source, sourceId };
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDropOnSlot = (e, slotId) => {
    e.preventDefault();
    if (!dragRef.current) return;
    const { player, source, sourceId } = dragRef.current;
    const existing = slots[slotId];
    const newSlots = { ...slots, [slotId]: player };
    let newBench = bench;

    if (source === "bench") {
      newBench = bench.filter(p => p.id !== player.id);
      if (existing) newBench = [...newBench, existing];
    } else if (source === "slot") {
      newSlots[sourceId] = existing || null;
    }

    update({ slots: newSlots, bench: newBench });
    dragRef.current = null;
  };

  const handleDropOnBench = (e) => {
    e.preventDefault();
    if (!dragRef.current) return;
    const { player, source, sourceId } = dragRef.current;
    if (source === "bench") { dragRef.current = null; return; }
    if (bench.length >= 7) { dragRef.current = null; return; }

    let newSlots = slots;
    if (source === "slot") newSlots = { ...slots, [sourceId]: null };
    update({ slots: newSlots, bench: [...bench, player] });
    dragRef.current = null;
  };

  const handleDropOnPool = (e) => {
    e.preventDefault();
    if (!dragRef.current) return;
    const { player, source, sourceId } = dragRef.current;
    if (source === "pool") { dragRef.current = null; return; }

    let newSlots = slots;
    let newBench = bench;
    if (source === "slot") {
      newSlots = { ...slots, [sourceId]: null };
    } else if (source === "bench") {
      newBench = bench.filter(p => p.id !== player.id);
    }
    update({ slots: newSlots, bench: newBench });
    dragRef.current = null;
  };

  const allowDrop = e => e.preventDefault();

  return (
    <div style={{
      flex: 1, display: "flex", overflow: "hidden", background: "#0f0f0f",
    }}>
      <style>{`
        .ss-chip { cursor: grab; transition: background 0.12s, transform 0.12s; }
        .ss-chip:hover { background: rgba(204,0,0,0.14) !important; transform: translateX(2px); }
        .ss-chip:active { cursor: grabbing; }
        .ss-slot:hover { border-color: rgba(204,0,0,0.6) !important; background: rgba(204,0,0,0.08) !important; }
        .ss-bench-chip { cursor: grab; transition: background 0.12s; }
        .ss-bench-chip:hover { background: rgba(255,255,255,0.07) !important; }
      `}</style>

      {/* Pool sidebar */}
      <div style={{
        width: 210, background: "#141414", borderRight: "1px solid #222",
        display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0,
      }}
        onDragOver={allowDrop}
        onDrop={handleDropOnPool}
      >
        <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #1f1f1f" }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 11, letterSpacing: 2, color: "#555" }}>SQUAD POOL</div>
          <div style={{ fontSize: 11, color: "#444", marginTop: 3 }}>{pool.length} available</div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {Object.entries(poolByPos).map(([pos, players]) => (
            <div key={pos}>
              <div style={{
                padding: "8px 16px 4px",
                fontSize: 9, fontWeight: 700, letterSpacing: 2,
                color: POS_COLOR[pos], fontFamily: "'Barlow Condensed', sans-serif",
              }}>{POS_LABEL[pos].toUpperCase()}</div>
              {players.map(player => (
                <div
                  key={player.id}
                  draggable
                  onDragStart={e => handleDragStart(e, player, "pool", null)}
                  className="ss-chip"
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "5px 16px", margin: "1px 0",
                    background: "transparent", borderRadius: 4,
                  }}
                >
                  <JerseyIcon color={POS_COLOR[pos]} number={player.number} small />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "#d0d0d0", lineHeight: 1.3 }}>{player.name}</div>
                    <div style={{ fontSize: 10, color: "#555" }}>#{player.number} · {pos}</div>
                  </div>
                </div>
              ))}
              {players.length === 0 && (
                <div style={{ padding: "2px 16px 6px", fontSize: 10, color: "#2a2a2a", fontStyle: "italic" }}>All placed</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pitch column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header — back arrow on the left, formation + confirm on the right */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 20px", height: 52, borderBottom: "1px solid #1a1a1a",
          background: "#141414", flexShrink: 0,
        }}>
          {/* Left: back arrow + title */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              <span style={{ fontSize: 12 }}>Back</span>
            </button>

            <div style={{ width: 1, height: 20, background: "#222" }}/>

            <div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: 1, color: "#e8e8e8", lineHeight: 1 }}>
                {team.name.toUpperCase()}
              </div>
              <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>
                vs {team.match.opponent} · {team.match.date}
              </div>
            </div>
          </div>

          {/* Right: formation switcher + xi count + confirm */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 9, color: "#444", fontWeight: 700, letterSpacing: 1, fontFamily: "'Barlow Condensed', sans-serif" }}>FORMATION</span>
              {Object.keys(FORMATION_SLOTS).map(f => (
                <button key={f} onClick={() => handleFormationChange(f)}
                  style={{
                    background: formation === f ? "rgba(204,0,0,0.2)" : "#1a1a1a",
                    border: `1px solid ${formation === f ? "#cc0000" : "#2a2a2a"}`,
                    color: formation === f ? "#ff4444" : "#555",
                    padding: "3px 10px", borderRadius: 4, fontSize: 11, cursor: "pointer",
                    fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: 0.5,
                    transition: "all 0.12s",
                  }}
                >{f}</button>
              ))}
            </div>

            <div style={{ width: 1, height: 20, background: "#222" }}/>

            <span style={{ fontSize: 12, color: "#555", whiteSpace: "nowrap" }}>
              <span style={{ color: "#cc0000", fontWeight: 700, fontSize: 15 }}>{xiCount}</span>/11
            </span>

            <button
              onClick={onBack}
              style={{
                background: "#cc0000", border: "none", color: "white",
                padding: "6px 16px", borderRadius: 4, cursor: "pointer",
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                fontSize: 12, letterSpacing: 0.5, transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#e60000"}
              onMouseLeave={e => e.currentTarget.style.background = "#cc0000"}
            >CONFIRM</button>
          </div>
        </div>

        {/* Pitch */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 8px 8px", overflow: "hidden" }}>
          <div style={{
            position: "relative",
            width: "min(440px, 100%)",
            aspectRatio: "2/3",
            maxHeight: "calc(100vh - 210px)",
          }}>
            {/* Pitch bg */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: 6,
              background: "linear-gradient(180deg, #0a2a0a 0%, #0c300c 25%, #0a2a0a 50%, #0c300c 75%, #0a2a0a 100%)",
              border: "2px solid #1a3a1a", overflow: "hidden",
            }}>
              <svg width="100%" height="100%" viewBox="0 0 100 150" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
                <rect x="1" y="1" width="98" height="148" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5"/>
                <line x1="1" y1="75" x2="99" y2="75" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5"/>
                <circle cx="50" cy="75" r="12" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5"/>
                <circle cx="50" cy="75" r="0.8" fill="rgba(255,255,255,0.2)"/>
                <rect x="20" y="1" width="60" height="20" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5"/>
                <rect x="20" y="129" width="60" height="20" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5"/>
                <rect x="36" y="1" width="28" height="8" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
                <rect x="36" y="141" width="28" height="8" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
                <circle cx="50" cy="19" r="1" fill="rgba(255,255,255,0.15)"/>
                <circle cx="50" cy="131" r="1" fill="rgba(255,255,255,0.15)"/>
              </svg>
            </div>

            {/* Slot rows */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column-reverse",
              padding: "4% 2%", gap: "1%",
            }}>
              {Object.entries(formationRows)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([rowIdx, rowSlots]) => (
                  <div key={rowIdx} style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "space-evenly",
                  }}>
                    {rowSlots.map(slot => {
                      const player = slots[slot.id];
                      return (
                        <div
                          key={slot.id}
                          className="ss-slot"
                          onDragOver={allowDrop}
                          onDrop={e => handleDropOnSlot(e, slot.id)}
                          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, transition: "all 0.15s" }}
                        >
                          {player ? (
                            <div
                              draggable
                              onDragStart={e => handleDragStart(e, player, "slot", slot.id)}
                              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "grab" }}
                            >
                              <JerseyIcon color="#cc0000" number={player.number} />
                              <span style={{
                                fontSize: 8, fontWeight: 700, color: "#e8e8e8",
                                background: "rgba(0,0,0,0.75)", padding: "1px 5px",
                                borderRadius: 2, whiteSpace: "nowrap", maxWidth: 52,
                                overflow: "hidden", textOverflow: "ellipsis",
                                fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 0.3,
                              }}>{player.name.split(" ")[1] || player.name}</span>
                            </div>
                          ) : (
                            <div style={{
                              width: 46, height: 46,
                              border: "1.5px dashed rgba(255,255,255,0.12)",
                              borderRadius: 6,
                              display: "flex", flexDirection: "column",
                              alignItems: "center", justifyContent: "center", gap: 1,
                            }}>
                              <span style={{ fontSize: 7, color: "rgba(255,255,255,0.2)", fontWeight: 700, letterSpacing: 0.5 }}>{slot.label}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Bench */}
        <div
          style={{ background: "#111", borderTop: "1px solid #1a1a1a", padding: "8px 20px 12px", flexShrink: 0 }}
          onDragOver={allowDrop}
          onDrop={handleDropOnBench}
        >
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
            fontSize: 10, letterSpacing: 2, color: "#444", marginBottom: 6,
          }}>BENCH ({bench.length}/7)</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", minHeight: 46 }}>
            {bench.map(player => (
              <div
                key={player.id}
                draggable
                onDragStart={e => handleDragStart(e, player, "bench", null)}
                className="ss-bench-chip"
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "#1a1a1a", border: "1px solid #252525",
                  borderRadius: 4, padding: "4px 10px", cursor: "grab",
                }}
              >
                <JerseyIcon color="#444" number={player.number} small />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#bbb" }}>{player.name.split(" ")[1] || player.name}</div>
                  <div style={{ fontSize: 9, color: "#444" }}>{player.pos}</div>
                </div>
              </div>
            ))}
            {bench.length === 0 && (
              <div style={{ fontSize: 11, color: "#2a2a2a", fontStyle: "italic", display: "flex", alignItems: "center" }}>
                Drag players here for the bench
              </div>
            )}
            {bench.length > 0 && bench.length < 7 && (
              <div style={{
                width: 72, height: 44, border: "1px dashed #1f1f1f",
                borderRadius: 4, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 10, color: "#2a2a2a",
              }}>+ drop</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
