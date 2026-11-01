export default function StatCard({ label, value, icon, tone }) {
  return (
    <article className={`stat-card ${tone}`}>
      <span className="stat-icon" aria-hidden="true">{icon}</span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </article>
  );
}
