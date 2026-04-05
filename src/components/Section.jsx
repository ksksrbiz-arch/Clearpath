import useInView from '../hooks/useInView'

export default function Section({ children, id, dark }) {
  const [ref, isVisible] = useInView()
  return (
    <section ref={ref} id={id} className={`s ${dark ? 's--d' : ''} ${isVisible ? 's--v' : ''}`}>
      <div className="s__i">{children}</div>
    </section>
  )
}
