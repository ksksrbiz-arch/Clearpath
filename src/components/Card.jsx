export default function Card({ icon, title, children }) {
  return (
    <div className="card">
      {icon && <div className="card__ic">{icon}</div>}
      <h3>{title}</h3>
      {children}
    </div>
  )
}
