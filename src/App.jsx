import { useState } from "react";
import { INITIAL_TEAMS, initSelection } from "./data";
import Sidebar from "./components/Sidebar";
import SquadManagement from "./components/SquadManagement";
import { Calendar, Physio, Availability, ClubHistory, Documents } from "./components/Placeholders";

export default function App() {
  const [activeNav, setActiveNav] = useState("squad");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [teams, setTeams] = useState(INITIAL_TEAMS);

  // All squad management navigation state lives here so it persists across nav switches
  const [squadState, setSquadState] = useState({
    selectedTeam: null,   // null | "1s" | "2s"
    showSelector: false,  // whether the pitch selector view is active
    teamSelections: {
      "1s": initSelection(),
      "2s": initSelection(),
    },
  });

  const addPlayer = (teamId, player) => {
    setTeams(prev => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        players: [...prev[teamId].players, player],
      },
    }));
  };

  const renderContent = () => {
    switch (activeNav) {
      case "squad":
        return (
          <SquadManagement
            teams={teams}
            onAddPlayer={addPlayer}
            squadState={squadState}
            onSquadStateChange={setSquadState}
          />
        );
      case "calendar":    return <Calendar />;
      case "physio":      return <Physio />;
      case "availability":return <Availability />;
      case "history":     return <ClubHistory />;
      case "docs":        return <Documents />;
      default:            return null;
    }
  };

  return (
    <div style={{
      display: "flex", height: "100vh", width: "100%",
      background: "#0f0f0f", color: "#e8e8e8",
      fontFamily: "'Barlow', sans-serif",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@500;700;800;900&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #cc0000; }
        input, select { color-scheme: dark; }
        input:focus, select:focus { border-color: #cc0000 !important; outline: none; }
        button { font-family: inherit; }
      `}</style>

      {/* Sidebar is always rendered outside main — never obscured */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Top bar */}
        <div style={{
          background: "#141414", borderBottom: "1px solid #1f1f1f",
          padding: "0 24px", height: 52, display: "flex", alignItems: "center",
          justifyContent: "space-between", flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#cc0000" }}/>
            <span style={{ fontSize: 11, color: "#444", letterSpacing: 0.5 }}>
              Pitchside Admin · Hammersmith FC
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 11, color: "#333" }}>Season 2024/25</div>
            <div style={{
              background: "rgba(204,0,0,0.1)", border: "1px solid rgba(204,0,0,0.2)",
              borderRadius: 4, padding: "3px 10px",
              fontSize: 10, fontWeight: 700, letterSpacing: 1,
              color: "#cc0000", fontFamily: "'Barlow Condensed', sans-serif",
            }}>ADMIN</div>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
