import { useEffect } from 'react'
import { VENTURE_NAME, REGION } from '../config'

export default function MobileDrawer({ isOpen, onClose, links, activeSection }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      <div className={`ov ${isOpen ? 'ov--o' : ''}`} onClick={onClose} aria-hidden="true" />
      <div className={`dr ${isOpen ? 'dr--o' : ''}`} role="dialog" aria-modal="true" aria-label="Navigation">
        <div className="dr__head">
          <span className="dr__brand">{VENTURE_NAME}</span>
          <button className="dr__close" onClick={onClose} aria-label="Close menu">&#x2715;</button>
        </div>
        <nav className="dr__nav">
          {links.map(([href, label]) => (
            <a key={href} href={href} className={`dr__link${activeSection === href.slice(1) ? ' dr__link--active' : ''}`} onClick={onClose}>{label}</a>
          ))}
        </nav>
        <div className="dr__foot"><span>{REGION}</span></div>
      </div>
    </>
  )
}
