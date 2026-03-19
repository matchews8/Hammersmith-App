import { useState } from "react";

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_NAMES = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const EVENT_COLOR = { match: "#cc0000", training: "#3b82f6" };
const EVENT_BG    = { match: "rgba(204,0,0,0.15)", training: "rgba(59,130,246,0.13)" };
const EVENT_TEXT  = { match: "#ff9999", training: "#93c5fd" };

export function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
}

export function formatDateLong(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return `${days[d.getDay()]} ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
}

export function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "pm" : "am";
  const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${display}:${m}${ampm}`;
}

// Returns the next upcoming match for a team from the events array
export function getNextMatch(events, teamId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());
  return events
    .filter(e => e.type === "match" && (e.team === teamId || e.team === "all") && e.date >= todayStr)
    .sort((a, b) => a.date !== b.date ? a.date.localeCompare(b.date) : a.time.localeCompare(b.time))[0] || null;
}

// ─── Shared form styles ───────────────────────────────────────────────────────

const inputStyle = {
  width: "100%", background: "#1c1c1c", border: "1px solid #2a2a2a",
  borderRadius: 4, padding: "8px 11px", color: "#e8e8e8", fontSize: 13,
  fontFamily: "'Barlow', sans-serif", outline: "none", transition: "border-color 0.15s",
};

const toggleBtnBase = {
  border: "none", borderRadius: 4, padding: "6px 14px", cursor: "pointer",
  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
  fontSize: 12, letterSpacing: 0.5, transition: "all 0.12s",
};

const actionBtnBase = {
  background: "none", border: "none", borderRadius: 4, padding: "9px 16px",
  cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 700, fontSize: 12, letterSpacing: 0.5, transition: "all 0.12s",
};

// ─── Field Row ────────────────────────────────────────────────────────────────

function FieldRow({ label, error, children }) {
  return (
    <div>
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
        color: error ? "#ef4444" : "#555", marginBottom: 6,
        fontFamily: "'Barlow Condensed', sans-serif",
      }}>
        {label.toUpperCase()}{error ? <span style={{ fontWeight: 400 }}> — {error}</span> : null}
      </div>
      {children}
    </div>
  );
}

// ─── Event Modal ──────────────────────────────────────────────────────────────
// position: absolute so it covers only the Calendar area, not the sidebar

function EventModal({ mode, event, defaultDate, onSave, onDelete, onClose }) {
  const blankForm = {
    title: "", type: "training", team: "all",
    date: defaultDate || "", time: "", location: "",
    opponent: "", homeAway: "home",
  };
  const [form, setForm] = useState(mode === "edit" ? { ...event } : blankForm);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errors, setErrors] = useState({});

  const setField = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }));
  };

  // Switching type to match resets "all" team → "1s"
  const setType = (type) => {
    setForm(f => ({
      ...f, type,
      team: type === "match" && f.team === "all" ? "1s" : f.team,
    }));
    setErrors({});
  };

  const validate = () => {
    const e = {};
    if (form.type === "training" && !form.title.trim()) e.title = "Required";
    if (!form.date) e.date = "Required";
    if (!form.time) e.time = "Required";
    if (!form.location.trim()) e.location = "Required";
    if (form.type === "match" && !form.opponent.trim()) e.opponent = "Required";
    return e;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({
      ...form,
      id: mode === "edit" ? form.id : `evt_${Date.now()}`,
      title: form.type === "match" ? `vs ${form.opponent.trim()}` : form.title.trim(),
    });
  };

  const isMatch = form.type === "match";
  const teamOptions = isMatch
    ? [{ val: "1s", label: "Ham. 1s" }, { val: "2s", label: "Ham. 2s" }]
    : [{ val: "1s", label: "Ham. 1s" }, { val: "2s", label: "Ham. 2s" }, { val: "all", label: "All" }];

  return (
    <div
      style={{
        position: "absolute", inset: 0, zIndex: 50,
        background: "rgba(0,0,0,0.65)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#161616", border: "1px solid #252525",
          borderRadius: 8, padding: "24px 24px 20px",
          width: 420, maxHeight: "88vh", overflowY: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.75)",
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
            fontSize: 16, letterSpacing: 1, color: "#e8e8e8",
          }}>
            {mode === "add" ? "ADD EVENT" : "EDIT EVENT"}
          </div>
          {form.date && (
            <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>{formatDateLong(form.date)}</div>
          )}
        </div>

        {confirmDelete ? (
          <div>
            <div style={{
              background: "rgba(204,0,0,0.08)", border: "1px solid rgba(204,0,0,0.2)",
              borderRadius: 6, padding: "14px 16px", marginBottom: 16,
            }}>
              <div style={{ fontSize: 13, color: "#e8e8e8", marginBottom: 4 }}>Remove this event?</div>
              <div style={{ fontSize: 11, color: "#666" }}>{form.title} · {formatDateLong(form.date)}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setConfirmDelete(false)} style={{ ...actionBtnBase, flex: 1, border: "1px solid #2a2a2a", color: "#555" }}>CANCEL</button>
              <button onClick={() => onDelete(form.id)} style={{ ...actionBtnBase, flex: 1, background: "#cc0000", color: "white" }}>CONFIRM REMOVE</button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Type */}
            <FieldRow label="Type">
              <div style={{ display: "flex", gap: 6 }}>
                {[{ val: "training", label: "Training" }, { val: "match", label: "Match" }].map(({ val, label }) => (
                  <button
                    key={val}
                    onClick={() => setType(val)}
                    style={{
                      ...toggleBtnBase,
                      background: form.type === val
                        ? (val === "match" ? "rgba(204,0,0,0.18)" : "rgba(59,130,246,0.18)")
                        : "#1c1c1c",
                      border: `1px solid ${form.type === val
                        ? (val === "match" ? "#cc0000" : "#3b82f6")
                        : "#2a2a2a"}`,
                      color: form.type === val
                        ? (val === "match" ? "#ff5555" : "#60a5fa")
                        : "#555",
                    }}
                  >{label}</button>
                ))}
              </div>
            </FieldRow>

            {/* Team */}
            <FieldRow label="Team">
              <div style={{ display: "flex", gap: 6 }}>
                {teamOptions.map(({ val, label }) => (
                  <button
                    key={val}
                    onClick={() => setField("team", val)}
                    style={{
                      ...toggleBtnBase,
                      background: form.team === val ? "rgba(204,0,0,0.18)" : "#1c1c1c",
                      border: `1px solid ${form.team === val ? "#cc0000" : "#2a2a2a"}`,
                      color: form.team === val ? "#ff5555" : "#555",
                    }}
                  >{label}</button>
                ))}
              </div>
            </FieldRow>

            {/* Opponent (match only) */}
            {isMatch && (
              <FieldRow label="Opponent" error={errors.opponent}>
                <input
                  type="text" value={form.opponent}
                  onChange={e => setField("opponent", e.target.value)}
                  placeholder="e.g. Ealing Rangers"
                  style={{ ...inputStyle, borderColor: errors.opponent ? "#ef4444" : "#2a2a2a" }}
                  autoFocus
                />
              </FieldRow>
            )}

            {/* Home / Away (match only) */}
            {isMatch && (
              <FieldRow label="Home / Away">
                <div style={{ display: "flex", gap: 6 }}>
                  {[{ val: "home", label: "Home" }, { val: "away", label: "Away" }].map(({ val, label }) => (
                    <button
                      key={val}
                      onClick={() => setField("homeAway", val)}
                      style={{
                        ...toggleBtnBase,
                        background: form.homeAway === val ? "rgba(204,0,0,0.18)" : "#1c1c1c",
                        border: `1px solid ${form.homeAway === val ? "#cc0000" : "#2a2a2a"}`,
                        color: form.homeAway === val ? "#ff5555" : "#555",
                      }}
                    >{label}</button>
                  ))}
                </div>
              </FieldRow>
            )}

            {/* Title (training only) */}
            {!isMatch && (
              <FieldRow label="Title" error={errors.title}>
                <input
                  type="text" value={form.title}
                  onChange={e => setField("title", e.target.value)}
                  placeholder="e.g. Pre-season training"
                  style={{ ...inputStyle, borderColor: errors.title ? "#ef4444" : "#2a2a2a" }}
                  autoFocus
                />
              </FieldRow>
            )}

            {/* Date */}
            <FieldRow label="Date" error={errors.date}>
              <input
                type="date" value={form.date}
                onChange={e => setField("date", e.target.value)}
                style={{ ...inputStyle, colorScheme: "dark", borderColor: errors.date ? "#ef4444" : "#2a2a2a" }}
              />
            </FieldRow>

            {/* Time */}
            <FieldRow label="Time" error={errors.time}>
              <input
                type="time" value={form.time}
                onChange={e => setField("time", e.target.value)}
                style={{ ...inputStyle, colorScheme: "dark", borderColor: errors.time ? "#ef4444" : "#2a2a2a" }}
              />
            </FieldRow>

            {/* Location */}
            <FieldRow label="Location" error={errors.location}>
              <input
                type="text" value={form.location}
                onChange={e => setField("location", e.target.value)}
                placeholder="e.g. Hurlingham Park"
                style={{ ...inputStyle, borderColor: errors.location ? "#ef4444" : "#2a2a2a" }}
              />
            </FieldRow>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              {mode === "edit" && (
                <button
                  onClick={() => setConfirmDelete(true)}
                  style={{ ...actionBtnBase, border: "1px solid #3a1515", color: "#cc4444" }}
                >REMOVE</button>
              )}
              <button
                onClick={onClose}
                style={{ ...actionBtnBase, flex: 1, border: "1px solid #2a2a2a", color: "#555" }}
              >CANCEL</button>
              <button
                onClick={handleSave}
                style={{ ...actionBtnBase, flex: 2, background: "#cc0000", color: "white" }}
                onMouseEnter={e => e.currentTarget.style.background = "#e60000"}
                onMouseLeave={e => e.currentTarget.style.background = "#cc0000"}
              >{mode === "add" ? "SAVE EVENT" : "SAVE CHANGES"}</button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

export default function Calendar({ events, onEventsChange, calendarState, onCalendarStateChange }) {
  const { year, month } = calendarState;
  const [modal, setModal] = useState(null);

  const today = new Date();
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  // Build grid cells (Monday-first)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const mondayOffset = (firstDay + 6) % 7;

  const cells = [
    ...Array(mondayOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const eventsForDate = (ds) => events.filter(e => e.date === ds);

  const navigate = (dir) => {
    let m = month + dir, y = year;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    onCalendarStateChange({ year: y, month: m });
  };

  const handleDayClick = (day) => {
    setModal({ mode: "add", date: toDateStr(year, month, day) });
  };

  const handleEventClick = (e, event) => {
    e.stopPropagation();
    setModal({ mode: "edit", event });
  };

  const handleSave = (formData) => {
    if (modal.mode === "add") {
      onEventsChange([...events, formData]);
    } else {
      onEventsChange(events.map(e => e.id === formData.id ? formData : e));
    }
    setModal(null);
  };

  const handleDelete = (id) => {
    onEventsChange(events.filter(e => e.id !== id));
    setModal(null);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>

      {/* Header */}
      <div style={{
        background: "#141414", borderBottom: "1px solid #1f1f1f",
        padding: "0 20px", height: 52, display: "flex", alignItems: "center",
        justifyContent: "space-between", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900,
            fontSize: 20, letterSpacing: 1.5, color: "#e8e8e8", minWidth: 180,
          }}>
            {MONTH_NAMES[month].toUpperCase()} {year}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {[-1, 1].map(dir => (
              <button
                key={dir}
                onClick={() => navigate(dir)}
                style={{
                  background: "#1a1a1a", border: "1px solid #252525", color: "#555",
                  width: 26, height: 26, borderRadius: 4, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.12s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#cc0000"; e.currentTarget.style.color = "#cc0000"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#252525"; e.currentTarget.style.color = "#555"; }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="11" height="11">
                  {dir === -1 ? <polyline points="15 18 9 12 15 6"/> : <polyline points="9 18 15 12 9 6"/>}
                </svg>
              </button>
            ))}
          </div>
          <button
            onClick={() => onCalendarStateChange({ year: today.getFullYear(), month: today.getMonth() })}
            style={{
              background: "none", border: "1px solid #252525", color: "#555",
              padding: "3px 10px", borderRadius: 4, cursor: "pointer",
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
              fontSize: 10, letterSpacing: 1, transition: "all 0.12s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#cc0000"; e.currentTarget.style.color = "#cc0000"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#252525"; e.currentTarget.style.color = "#555"; }}
          >TODAY</button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {[{ type: "match", label: "Match" }, { type: "training", label: "Training" }].map(({ type, label }) => (
              <span key={type} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#555" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: EVENT_COLOR[type], display: "inline-block" }}/>
                {label}
              </span>
            ))}
          </div>
          <button
            onClick={() => setModal({ mode: "add", date: todayStr })}
            style={{
              background: "#cc0000", border: "none", color: "white",
              padding: "6px 14px", borderRadius: 4, cursor: "pointer",
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
              fontSize: 12, letterSpacing: 0.5, transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#e60000"}
            onMouseLeave={e => e.currentTarget.style.background = "#cc0000"}
          >+ ADD EVENT</button>
        </div>
      </div>

      {/* Day column headers */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
        background: "#131313", borderBottom: "1px solid #1a1a1a",
        flexShrink: 0,
      }}>
        {DAY_NAMES.map((d, i) => (
          <div key={d} style={{
            padding: "7px 0", textAlign: "center",
            fontSize: 9, fontWeight: 700, letterSpacing: 2,
            color: i >= 5 ? "#444" : "#3a3a3a",
            fontFamily: "'Barlow Condensed', sans-serif",
            borderRight: i < 6 ? "1px solid #1a1a1a" : "none",
          }}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gridAutoRows: "minmax(108px, auto)",
        }}>
          {cells.map((day, i) => {
            if (!day) {
              return (
                <div key={i} style={{
                  background: "#0d0d0d",
                  borderRight: (i % 7 < 6) ? "1px solid #181818" : "none",
                  borderBottom: "1px solid #181818",
                }}/>
              );
            }

            const ds = toDateStr(year, month, day);
            const dayEvts = eventsForDate(ds);
            const isToday = ds === todayStr;
            const isPast = ds < todayStr;
            const isWeekend = i % 7 >= 5;

            return (
              <div
                key={i}
                onClick={() => handleDayClick(day)}
                style={{
                  background: isToday ? "#1a1a1a" : "#141414",
                  borderRight: (i % 7 < 6) ? "1px solid #1a1a1a" : "none",
                  borderBottom: "1px solid #1a1a1a",
                  borderTop: isToday ? "2px solid #cc0000" : "none",
                  padding: "8px 9px 6px",
                  cursor: "pointer",
                  opacity: isPast ? 0.5 : 1,
                  display: "flex", flexDirection: "column",
                  transition: "background 0.1s",
                }}
                onMouseEnter={e => { if (!isToday) e.currentTarget.style.background = "#191919"; }}
                onMouseLeave={e => { if (!isToday) e.currentTarget.style.background = "#141414"; }}
              >
                {/* Day number */}
                <div style={{
                  fontSize: 12, lineHeight: 1, marginBottom: 6,
                  color: isToday ? "#cc0000" : isWeekend ? "#555" : "#666",
                  fontWeight: isToday ? 700 : 400,
                  fontFamily: isToday ? "'Barlow Condensed', sans-serif" : "inherit",
                }}>{day}</div>

                {/* Event pills */}
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {dayEvts.map(evt => (
                    <div
                      key={evt.id}
                      onClick={e => handleEventClick(e, evt)}
                      title={`${evt.title} — ${formatTime(evt.time)}`}
                      style={{
                        background: EVENT_BG[evt.type],
                        borderLeft: `2px solid ${EVENT_COLOR[evt.type]}`,
                        borderRadius: "0 3px 3px 0",
                        padding: "3px 6px",
                        fontSize: 10, fontWeight: 600,
                        color: EVENT_TEXT[evt.type],
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        cursor: "pointer", lineHeight: 1.5,
                        transition: "opacity 0.1s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
                      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                    >
                      {evt.time && (
                        <span style={{ opacity: 0.65, marginRight: 4, fontSize: 9 }}>
                          {formatTime(evt.time)}
                        </span>
                      )}
                      {evt.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal — absolutely positioned so sidebar stays visible */}
      {modal && (
        <EventModal
          mode={modal.mode}
          event={modal.mode === "edit" ? modal.event : null}
          defaultDate={modal.mode === "add" ? modal.date : null}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
