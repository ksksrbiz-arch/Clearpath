import useCountUp from '../hooks/useCountUp'

export default function AnimatedStat({ prefix = '', endValue, suffix = '', label }) {
  const [ref, display] = useCountUp(endValue)
  return (
    <div className="stat" ref={ref}>
      <span className="stat__n">{prefix}{display}{suffix}</span>
      <span className="stat__l">{label}</span>
    </div>
  )
}
