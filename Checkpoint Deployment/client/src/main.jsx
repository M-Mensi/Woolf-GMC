import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function localDate(date = new Date()) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

function clock(date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

async function readJson(response) {
  if (!response.headers.get("content-type")?.includes("application/json")) {
    throw new Error("Attendance API unavailable. Check the backend and MongoDB connection.");
  }
  return response.json();
}

function duration(record) {
  const minutes = record.checkOut
    ? record.minutesWorked
    : Math.max(0, Math.floor((Date.now() - new Date(record.checkIn)) / 60000));
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`;
}

function Icon({ name }) {
  const icons = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    team: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    chart: <><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-5 5" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    exit: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></>,
  };
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

function App() {
  const [date, setDate] = useState(localDate());
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const [listResponse, summaryResponse] = await Promise.all([
        fetch(`/api/attendance?date=${date}`),
        fetch(`/api/attendance/summary?date=${date}`),
      ]);
      const list = await readJson(listResponse);
      const totals = await readJson(summaryResponse);
      if (!listResponse.ok) throw new Error(list.error);
      if (!summaryResponse.ok) throw new Error(totals.error);
      setRecords(list);
      setSummary(totals);
      setMessage("");
    } catch (error) {
      setMessage(error.message || "Could not connect to the attendance server.");
    }
  }, [date]);

  useEffect(() => {
    load();
    const timer = setInterval(load, 60000);
    return () => clearInterval(timer);
  }, [load]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return records.filter((record) =>
      `${record.name} ${record.role}`.toLowerCase().includes(query)
    );
  }, [records, search]);

  async function checkIn(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/attendance/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, workDate: date }),
      });
      const result = await readJson(response);
      if (!response.ok) throw new Error(result.error);
      setName("");
      setRole("");
      await load();
      setMessage(`${result.name} checked in.`);
    } catch (error) {
      setMessage(error.message || "Could not check in.");
    } finally {
      setBusy(false);
    }
  }

  async function checkOut(id) {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/attendance/${id}/check-out`, {
        method: "POST",
      });
      const result = await readJson(response);
      if (!response.ok) throw new Error(result.error);
      await load();
      setMessage(`${result.name} checked out.`);
    } catch (error) {
      setMessage(error.message || "Could not check out.");
    } finally {
      setBusy(false);
    }
  }

  const working = records.filter((record) => !record.checkOut).length;
  const completed = records.length - working;
  const ratio = records.length ? Math.round((working / records.length) * 100) : 0;
  const chartMax = Math.max(1, ...(summary?.week || []).map((day) => day.employees));
  const formattedDate = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T12:00:00`));

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="Shiftly home">
          <span className="brand-icon"><Icon name="clock" /></span>
          <span>shiftly<span className="brand-dot">.</span></span>
        </a>
        <p className="nav-heading">WORKSPACE</p>
        <nav className="side-nav" aria-label="Main navigation">
          <a className="nav-item active" href="#overview"><Icon name="grid" /> Overview</a>
          <a className="nav-item" href="#attendance"><Icon name="team" /> Attendance</a>
          <a className="nav-item" href="#insights"><Icon name="chart" /> Insights</a>
        </nav>
        <div className="sidebar-bottom">
          <div className="workspace-badge">SB</div>
          <div><strong>Small business</strong><span>Team workspace</span></div>
          <span className="workspace-menu">···</span>
        </div>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> Overview</div>
          <div className="topbar-right">
            <span className="today-pill"><i /> Attendance is live</span>
            <div className="avatar">SB</div>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <p className="overline">{formattedDate}</p>
              <h1>Team overview</h1>
              <p className="subheading">A clear view of who's working and when.</p>
            </div>
            <label className="date-picker">
              <Icon name="clock" />
              <input
                aria-label="Attendance date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </label>
          </section>

          <section className="metric-grid" aria-label="Attendance summary">
            <article className="metric-card">
              <div className="metric-heading"><span>Checked in now</span><span className="metric-icon green"><Icon name="team" /></span></div>
              <strong className="metric-value">{summary?.working ?? "—"}</strong>
              <span className="metric-caption"><i className="status-dot green-dot" /> Team members on shift</span>
            </article>
            <article className="metric-card">
              <div className="metric-heading"><span>People today</span><span className="metric-icon blue"><Icon name="grid" /></span></div>
              <strong className="metric-value">{summary?.employees ?? "—"}</strong>
              <span className="metric-caption">Unique team members</span>
            </article>
            <article className="metric-card">
              <div className="metric-heading"><span>Shifts completed</span><span className="metric-icon amber"><Icon name="check" /></span></div>
              <strong className="metric-value">{completed}</strong>
              <span className="metric-caption">Checked out for the day</span>
            </article>
            <article className="metric-card">
              <div className="metric-heading"><span>Hours logged</span><span className="metric-icon purple"><Icon name="clock" /></span></div>
              <strong className="metric-value">{summary?.hours ?? "—"}<small>h</small></strong>
              <span className="metric-caption">Completed shifts today</span>
            </article>
          </section>

          <section className="chart-grid" id="insights">
            <article className="panel weekly-panel">
              <div className="panel-heading">
                <div><h2>Attendance trend</h2><p>Unique team members · last 7 days</p></div>
                <span className="panel-icon"><Icon name="chart" /></span>
              </div>
              <div className="bar-chart" role="img" aria-label="Number of team members attending each of the last seven days">
                {(summary?.week || []).map((day) => {
                  const height = day.employees ? Math.max(8, (day.employees / chartMax) * 100) : 3;
                  return (
                    <div className="bar-column" key={day.date} title={`${day.employees} team members`}>
                      <span className="bar-count">{day.employees || ""}</span>
                      <div className="bar-track"><div className={`bar-fill ${day.date === date ? "bar-today" : ""}`} style={{ height: `${height}%` }} /></div>
                      <span className="bar-label">{new Intl.DateTimeFormat(undefined, { weekday: "short", timeZone: "UTC" }).format(new Date(`${day.date}T12:00:00Z`))}</span>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="panel status-panel">
              <div className="panel-heading">
                <div><h2>Today’s shifts</h2><p>Live attendance status</p></div>
                <span className="live-label"><i /> LIVE</span>
              </div>
              <div className="donut-wrap">
                <div className="donut" style={{ "--ratio": `${ratio}%` }}>
                  <div><strong>{records.length}</strong><span>total shifts</span></div>
                </div>
              </div>
              <div className="legend">
                <span><i className="legend-green" /> Working <strong>{working}</strong></span>
                <span><i className="legend-gray" /> Completed <strong>{completed}</strong></span>
              </div>
            </article>
          </section>

          <section className="attendance-section" id="attendance">
            <div className="attendance-heading">
              <div><h2>Team attendance</h2><p>Check in a team member or manage today's shifts.</p></div>
              <span className="record-count">{records.length} {records.length === 1 ? "record" : "records"}</span>
            </div>

            <form className="checkin-form" onSubmit={checkIn}>
              <div className="form-title"><span className="form-plus">+</span><div><strong>Quick check-in</strong><span>Start a new shift</span></div></div>
              <label><span>Employee name</span><input value={name} onChange={(event) => setName(event.target.value)} maxLength="100" placeholder="e.g. Alex Morgan" required /></label>
              <label><span>Role <small>optional</small></span><input value={role} onChange={(event) => setRole(event.target.value)} maxLength="100" placeholder="e.g. Barista" /></label>
              <button className="checkin-button" disabled={busy || !date}><Icon name="check" /> Check in</button>
            </form>

            <div className="table-toolbar">
              <div className="table-title">Attendance log <span>{date}</span></div>
              <label className="search-box"><Icon name="search" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search team..." aria-label="Search attendance" /></label>
            </div>
            <div className="attendance-table-wrap">
              <table className="attendance-table">
                <thead><tr><th>EMPLOYEE</th><th>CHECK IN</th><th>CHECK OUT</th><th>HOURS</th><th>STATUS</th><th /></tr></thead>
                <tbody>
                  {filtered.map((record) => (
                    <tr key={record._id}>
                      <td><div className="employee-cell"><span className="employee-avatar">{record.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span><span><strong>{record.name}</strong><small>{record.role || "Team member"}</small></span></div></td>
                      <td>{clock(record.checkIn)}</td>
                      <td>{record.checkOut ? clock(record.checkOut) : "—"}</td>
                      <td>{duration(record)}</td>
                      <td><span className={`attendance-status ${record.checkOut ? "completed-status" : "working-status"}`}><i />{record.checkOut ? "Completed" : "Working"}</span></td>
                      <td>{record.checkOut ? null : <button className="checkout-button" disabled={busy} onClick={() => checkOut(record._id)}><Icon name="exit" /> Check out</button>}</td>
                    </tr>
                  ))}
                  {!filtered.length && <tr><td className="empty-row" colSpan="6">{records.length ? "No team members match your search." : "No attendance yet. Check in your first team member above."}</td></tr>}
                </tbody>
              </table>
            </div>
            <p className="feedback" role="status" aria-live="polite">{message}</p>
          </section>

          <footer className="page-footer"><span>Shiftly · Simple attendance for small teams</span><span>Times shown in your local timezone</span></footer>
        </div>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);
