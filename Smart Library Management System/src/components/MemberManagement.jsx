import { useState } from "react";

export default function MemberManagement({ users, onAddUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");

  function handleSubmit(event) {
    event.preventDefault();
    onAddUser(role, { name, email });
    setName("");
    setEmail("");
  }

  return (
    <section className="panel member-panel" aria-labelledby="member-management-title">
      <div className="panel-heading">
        <div>
          <span className="section-kicker">YOUR COMMUNITY</span>
          <h2 id="member-management-title">Members</h2>
        </div>
        <span className="count-pill">{users.length} people</span>
      </div>

      <form className="member-form" onSubmit={handleSubmit}>
        <label>
          <span className="field-label">FULL NAME</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Alex Morgan"
            autoComplete="name"
            required
          />
        </label>
        <label>
          <span className="field-label">EMAIL ADDRESS</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="alex@example.com"
            autoComplete="email"
            required
          />
        </label>
        <label>
          <span className="field-label">MEMBER TYPE</span>
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </label>
        <button className="button button-dark full-button" type="submit">
          Add member <span aria-hidden="true">+</span>
        </button>
      </form>

      <div className="member-list">
        {users.map((user) => (
          <article className="member-row" key={user.id}>
            <span className={`avatar ${user.role.toLowerCase()}`} aria-hidden="true">
              {user.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}
            </span>
            <span className="member-details">
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </span>
            <span className={`role-label ${user.role.toLowerCase()}`}>{user.role}</span>
          </article>
        ))}
        {users.length === 0 && (
          <p className="empty-members">Add a student or teacher to get started.</p>
        )}
      </div>
    </section>
  );
}
