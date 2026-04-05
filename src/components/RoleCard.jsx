export default function RoleCard({ title, name, children, tag, open }) {
  return (
    <div className={`rc ${open ? 'rc--o' : ''}`}>
      <div className="rc__t">{title}</div>
      <div className="rc__n">{name}</div>
      {children}
      <span className={`rc__tag ${open ? 'rc__tag--o' : ''}`}>{tag}</span>
    </div>
  )
}
