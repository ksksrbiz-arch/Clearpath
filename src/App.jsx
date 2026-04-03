import { useEffect, useRef, useState, useCallback } from 'react'
import './App.css'

/* ─── CONFIG ─── */
const VENTURE_NAME = "ClearPath Environmental"
const TAGLINE = "Restoring Oregon's Roadsides, Parks & Public Lands"
const REGION = "Oregon City · Clackamas County · Greater Portland Metro"

/* ─── Intersection Observer hook ─── */
function useInView(threshold = 0.1) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(el) } },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return [ref, isVisible]
}

/* ─── Count-up animation hook ─── */
function useCountUp(endValue, duration = 2000, threshold = 0.1) {
  const ref = useRef(null)
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [display, setDisplay] = useState(prefersReduced ? endValue : 0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          observer.unobserve(el)
          const start = performance.now()
          const easeOutQuart = t => 1 - Math.pow(1 - t, 4)
          const step = now => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            setDisplay(Math.round(easeOutQuart(progress) * endValue))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [endValue, duration, threshold, prefersReduced])

  return [ref, display]
}

/* ─── Animated stat counter ─── */
function AnimatedStat({ prefix = '', endValue, suffix = '', label }) {
  const [ref, display] = useCountUp(endValue)
  return (
    <div className="stat" ref={ref}>
      <span className="stat__n">{prefix}{display}{suffix}</span>
      <span className="stat__l">{label}</span>
    </div>
  )
}

function Section({ children, id, dark }) {
  const [ref, isVisible] = useInView()
  return (
    <section ref={ref} id={id} className={`s ${dark ? 's--d' : ''} ${isVisible ? 's--v' : ''}`}>
      <div className="s__i">{children}</div>
    </section>
  )
}

function Card({ icon, title, children }) {
  return (
    <div className="card">
      {icon && <div className="card__ic">{icon}</div>}
      <h3>{title}</h3>
      {children}
    </div>
  )
}

function RoleCard({ title, name, children, tag, open }) {
  return (
    <div className={`rc ${open ? 'rc--o' : ''}`}>
      <div className="rc__t">{title}</div>
      <div className="rc__n">{name}</div>
      {children}
      <span className={`rc__tag ${open ? 'rc__tag--o' : ''}`}>{tag}</span>
    </div>
  )
}

function MobileDrawer({ isOpen, onClose, links, activeSection }) {
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
          <button className="dr__close" onClick={onClose} aria-label="Close menu">✕</button>
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

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark')
  const [formStatus, setFormStatus] = useState('idle') // idle | submitting | success | error
  const toggleDrawer = useCallback(() => setDrawerOpen(p => !p), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])
  const toggleTheme = useCallback(() => setDarkMode(p => !p), [])
  const handleContactSubmit = useCallback((e) => {
    e.preventDefault()
    setFormStatus('submitting')
    const form = e.target
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() })
      .then(() => setFormStatus('success'))
      .catch(() => setFormStatus('error'))
  }, [])

  useEffect(() => {
    const fn = () => { setScrolled(window.scrollY > 60); setShowTop(window.scrollY > 800) }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const sections = document.querySelectorAll('.s[id]')
    if (!sections.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection((prev) => prev === entry.target.id ? prev : entry.target.id)
        })
      },
      { rootMargin: '-80px 0px -50% 0px', threshold: 0 }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') closeDrawer() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [closeDrawer])
  useEffect(() => {
    document.documentElement.classList.toggle('theme--dark', darkMode)
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const NAV = [
    ['#mission','Mission'],['#opportunity','Opportunity'],['#model','Model'],['#structure','Structure'],
    ['#team','Team'],['#operations','Operations'],['#roadmap','Roadmap'],['#projections','Projections'],
    ['#edge','Why Us'],['#trust','Proof'],['#boundaries','Boundaries'],['#costs','Costs'],
    ['#files','The Files'],['#invitation','Join'],['#workforce','Workforce'],
  ]

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header className={`nav ${scrolled ? 'nav--s' : ''}`} role="banner">
        <a href="#" className="nav__brand">{VENTURE_NAME}</a>
        <ul className="nav__links">{NAV.map(([h,l])=>(<li key={h}><a href={h} className={activeSection === h.slice(1) ? 'nav__link--active' : ''}>{l}</a></li>))}</ul>
        <button className="nav__theme" onClick={toggleTheme} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
          {darkMode ? '\u2600' : '\u263E'}
        </button>
        <button className="nav__burger" onClick={toggleDrawer} aria-label="Open menu" aria-expanded={drawerOpen}>
          <span /><span /><span />
        </button>
      </header>

      <MobileDrawer isOpen={drawerOpen} onClose={closeDrawer} links={NAV} activeSection={activeSection} />

      <div className="hero">
        <div className="hero__tex" aria-hidden="true" />
        <div className="hero__c">
          <div className="hero__badge">Business Plan — Confidential Draft</div>
          <h1>{VENTURE_NAME}</h1>
          <p className="hero__tag">{TAGLINE}</p>
          <p className="hero__reg">{REGION}</p>
        </div>
        <a href="#mission" className="hero__scroll" aria-label="Scroll to content">
          <svg width="20" height="28" viewBox="0 0 20 28" fill="none" aria-hidden="true">
            <rect x="1" y="1" width="18" height="26" rx="9" stroke="currentColor" strokeWidth="1.5"/>
            <circle className="hero__dot" cx="10" cy="8" r="2" fill="currentColor"/>
          </svg>
        </a>
      </div>

      <main id="main-content">
        <Section id="mission">
          <p className="label">Our Mission</p><div className="divider"/>
          <h2>Clean land. Honest work.<br className="br-m"/> Stronger communities.</h2>
          <p className="lead">{VENTURE_NAME} is a community-rooted environmental services company based in Oregon City. We restore parks, roadsides, wooded areas, and public lands across Clackamas County and the greater Portland metro — creating jobs, winning contracts, and making the places we live in look the way they should.</p>
          <p className="lead">We started because we drive these roads and walk these trails every day. Now we're building a business that turns that care into something sustainable.</p>
        </Section>

        <Section id="opportunity" dark>
          <p className="label">The Opportunity</p><div className="divider"/>
          <h2>Oregon needs this — right now.</h2>
          <p className="lead">ODOT's $4M/year highway cleanup contract expired mid-2025 after the legislature failed to pass a transportation funding package. Nearly 500 ODOT employees laid off. A statewide vacuum in roadside maintenance.</p>
          <div className="stats">
            <AnimatedStat prefix="$" endValue={250} suffix="K" label="ODOT spent monthly on Clackamas/Multnomah cleanup"/>
            <AnimatedStat endValue={240} suffix="K lbs" label="Litter removed from metro highways in one year"/>
            <AnimatedStat prefix="$" endValue={20} suffix="M" label="SB 5701 allocated for metro cleanup in 2024"/>
            <AnimatedStat endValue={60} suffix=" tons" label="Adopt-a-Road volunteers collect annually"/>
          </div>
          <p>Oregon City runs a Metro-funded Community Enhancement Grant with up to $400,000 annually for projects improving neighborhood safety, appearance, and cleanliness. Our work aligns directly with every stated priority.</p>
        </Section>

        <Section id="model">
          <p className="label">Revenue Model</p><div className="divider"/>
          <h2>Multiple income streams.<br className="br-m"/> One mission.</h2>
          <p className="lead">Hybrid structure — an LLC for commercial contracts and a nonprofit arm for grants, volunteer coordination, and community programming.</p>
          <div className="grid">
            <Card icon="🏛️" title="Government Contracts"><p>ODOT, Clackamas County, Oregon City, and Metro all contract cleanup services. We register on OregonBuys and Bid Locker to bid as funding cycles reopen.</p></Card>
            <Card icon="📋" title="Grants & Community Funds"><p>Oregon City Enhancement Grants, Metro Regional Refresh Fund, Oregon Community Foundation, and SOLVE partnerships. Requires 501(c)(3) — our formation priority.</p></Card>
            <Card icon="🏢" title="Private Contracts"><p>Property managers, HOAs, commercial properties, and business improvement districts pay for regular lot, perimeter, and right-of-way cleanup.</p></Card>
            <Card icon="♻️" title="Material Recovery"><p>Oregon's bottle bill makes can/bottle redemption viable at volume. Scrap metal salvage adds incremental revenue. Sorting is built into our process.</p></Card>
          </div>
        </Section>

        <Section id="structure" dark>
          <p className="label">Legal Structure</p><div className="divider"/>
          <h2>Two entities. One mission.</h2>
          <p className="lead">A hybrid model gives us the flexibility to win contracts and the eligibility to receive grants — without compromising either.</p>
          <div className="grid grid--2">
            <div className="card">
              <div className="card__ic">🏢</div>
              <h3>ClearPath Environmental LLC</h3>
              <p>The commercial arm. Bids on government RFPs via OregonBuys, signs private contracts with HOAs and property managers, handles payroll and operations.</p>
              <ul className="struct-list">
                <li>Registered in Oregon (Secretary of State)</li>
                <li>General liability + commercial auto insurance</li>
                <li>OregonBuys & Bid Locker vendor registration</li>
                <li>Revenue from contracts and material recovery</li>
              </ul>
            </div>
            <div className="card">
              <div className="card__ic">🌱</div>
              <h3>ClearPath Community (501c3)</h3>
              <p>The nonprofit arm. Applies for grants, coordinates volunteers, runs community cleanup events, and tracks environmental impact metrics.</p>
              <ul className="struct-list">
                <li>501(c)(3) tax-exempt status (formation priority)</li>
                <li>Eligible for Oregon City Enhancement Grants</li>
                <li>SOLVE Oregon & Adopt-a-Road partnerships</li>
                <li>Board of directors with community oversight</li>
              </ul>
            </div>
          </div>
          <p className="struct-note">Both entities share the same mission, team, and operational standards. The LLC contracts work; the nonprofit funds community programs and volunteer coordination. Revenue flows are kept separate with full transparency.</p>
        </Section>

        <Section id="team">
          <p className="label">Team & Roles</p><div className="divider"/>
          <h2>Clearly defined. Openly structured.</h2>
          <p className="lead">Every role has a defined scope. No one is locked into anything they didn't agree to.</p>
          <div className="grid grid--roles">
            <RoleCard title="Operations Lead" name="Keith Skaggs Jr." tag="Founding Partner">
              <p>Day-to-day operations, crew scheduling, equipment, site assessment, client relationships, digital presence, and business development.</p>
            </RoleCard>
            <RoleCard title="Field Lead(s)" name="Founding Crew" tag="Founding Partners">
              <p>On-the-ground cleanup execution, safety compliance, material sorting, site documentation, and quality control.</p>
            </RoleCard>
            <RoleCard title="Strategic Advisor" name="Jay — Architect & Attorney" tag="Open — Your Terms" open>
              <p>Legal structuring, contract review, nonprofit formation, land-use expertise, and strategic counsel.</p>
              <p className="rc__flex">Role is deliberately flexible — advisory, equity partner, board member, or active co-founder. Defined by mutual agreement.</p>
            </RoleCard>
            <RoleCard title="Future Roles" name="As We Grow" tag="Growth Phase" open>
              <p>Grant writer, nonprofit board members, seasonal crew, subcontractors for specialized remediation work.</p>
            </RoleCard>
          </div>
        </Section>

        <Section id="operations" dark>
          <p className="label">How We Operate</p><div className="divider"/>
          <h2>Simple systems.<br className="br-m"/> Professional execution.</h2>
          <div className="grid">
            <Card icon="📍" title="Site Assessment"><p>Document with photos, assess hazards, estimate scope, log GPS. Every job gets a brief report for grant reporting and contract compliance.</p></Card>
            <Card icon="🦺" title="Safety First"><p>OSHA-compliant PPE for every crew member. Hazmat flagged for certified handlers. ODOT and county safety protocols for roadside work.</p></Card>
            <Card icon="📊" title="Documentation"><p>Before/after photos, weight logs, GPS mapping. Feeds grant reports, contract deliverables, and community impact metrics.</p></Card>
            <Card icon="🤝" title="Community Integration"><p>Partner with SOLVE Oregon, Clackamas Adopt-a-Road, neighborhood associations, and business districts.</p></Card>
          </div>
        </Section>

        <Section id="roadmap">
          <p className="label">Roadmap</p><div className="divider"/>
          <h2>Phased growth. No overextension.</h2>
          <p className="lead">Build sequentially — each phase funds the next.</p>
          <div className="tl">
            {[
              { phase:'Phase 1', when:'Now', title:'Foundation', active: true, text:'Register LLC/nonprofit. Secure equipment and insurance. Join Adopt-a-Road. Register on OregonBuys. Document first 5 sites with full before/after reports.' },
              { phase:'Phase 2', when:'Q3 2026', title:'Revenue', text:'Apply for Oregon City Enhancement Grant. Secure first private contracts (HOAs, property managers). Submit initial government RFP responses.' },
              { phase:'Phase 3', when:'2027', title:'Systems', text:'Formalize crew training. Build recurring contract base. Establish grant writing rhythm. Launch volunteer program through nonprofit arm.' },
              { phase:'Phase 4', when:'2028+', title:'Scale', text:'Bid on larger ODOT/Metro contracts. Hire seasonal crews. Add specialized services (invasive species, graffiti, remediation).' },
            ].map((item, i) => (
              <div key={i} className="tl__item">
                <div className="tl__marker"><div className={`tl__dot${item.active?' tl__dot--active':''}`}/>{i<3&&<div className="tl__line"/>}</div>
                <div className="tl__body">
                  <span className="tl__when">{item.phase} · {item.when}{item.active&&<span className="tl__badge">In Progress</span>}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="projections" dark>
          <p className="label">Financial Projections</p><div className="divider"/>
          <h2>Conservative targets.<br className="br-m"/> Built on real numbers.</h2>
          <p className="lead">Revenue projections based on published contract values, grant award ranges, and market rates for cleanup services in the Portland metro.</p>
          <div className="proj">
            <div className="proj__row proj__head">
              <span></span><span>Year 1</span><span>Year 2</span><span>Year 3</span>
            </div>
            <div className="proj__row">
              <span>Government Contracts</span><span>$15K</span><span>$60K</span><span>$150K</span>
            </div>
            <div className="proj__row">
              <span>Grants & Community Funds</span><span>$25K</span><span>$50K</span><span>$80K</span>
            </div>
            <div className="proj__row">
              <span>Private Contracts</span><span>$10K</span><span>$35K</span><span>$70K</span>
            </div>
            <div className="proj__row">
              <span>Material Recovery</span><span>$2K</span><span>$5K</span><span>$10K</span>
            </div>
            <div className="proj__row proj__total">
              <span>Total Revenue</span><span>$52K</span><span>$150K</span><span>$310K</span>
            </div>
          </div>
          <div className="proj-notes">
            <div className="proj-note">
              <h3>Key Assumptions</h3>
              <ul className="bbox__list">
                <li>Oregon City Enhancement Grant: $25K–$50K award in Year 1</li>
                <li>First government RFP win by Q4 Year 1 (small ODOT/County scope)</li>
                <li>3–5 recurring private contracts by end of Year 1</li>
                <li>Full-time crew of 2–3 by Year 2, scaling to 4–6 by Year 3</li>
              </ul>
            </div>
            <div className="proj-note">
              <h3>Break-Even</h3>
              <p>Monthly operating costs estimated at $3,500–$4,500 (insurance, fuel, equipment, crew). Break-even at ~$4K/month revenue — achievable within 6 months of first contract.</p>
            </div>
          </div>
        </Section>

        <Section id="edge">
          <p className="label">Competitive Edge</p><div className="divider"/>
          <h2>Why ClearPath wins.</h2>
          <p className="lead">We're not the only cleanup company — but we're built differently.</p>
          <div className="grid">
            <Card icon="📍" title="Local Roots, Local Knowledge"><p>Based in Oregon City, not a satellite office. We know these roads, trails, and neighborhoods because we live here. Faster response, better site assessments, real relationships with local government.</p></Card>
            <Card icon="📐" title="Dual-Entity Advantage"><p>Our LLC + nonprofit structure lets us compete for contracts AND qualify for grants. Most competitors can only do one. This gives us access to funding streams others can't touch.</p></Card>
            <Card icon="📊" title="Documentation-First"><p>Every job produces GPS-tagged before/after photos, weight logs, and impact reports. Grant agencies and contract managers get exactly the data they need — no extra work.</p></Card>
            <Card icon="⏱️" title="Timing"><p>ODOT's $4M/year cleanup contract expired. 500 workers laid off. The state has a massive backlog and no current vendor. We're positioning now for when funding reopens — and filling the gap with private and grant work in the meantime.</p></Card>
          </div>
        </Section>

        <Section id="trust" dark>
          <p className="label">On the Ground</p><div className="divider"/>
          <h2>This is what the work looks like.</h2>
          <p className="lead">Oregon's roadside and public-land cleanup crisis is well-documented. These are real conditions across Clackamas County and the Portland metro — and exactly what ClearPath is built to address.</p>
          <div className="gallery">
            <div className="gallery__item">
              <img className="gallery__img" src="/images/highway-litter.jpg" alt="Litter-strewn highway shoulder along I-205 in Clackamas County" loading="lazy" width="600" height="450" />
              <span className="gallery__cap">Highway shoulder litter — I-205 corridor, Clackamas County</span>
            </div>
            <div className="gallery__item">
              <img className="gallery__img" src="/images/dumping-site.jpg" alt="Illegal dumping site near Oregon City trail system" loading="lazy" width="600" height="450" />
              <span className="gallery__cap">Illegal dumping near public trail — Oregon City area</span>
            </div>
            <div className="gallery__item">
              <img className="gallery__img" src="/images/volunteer-cleanup.jpg" alt="Volunteer cleanup crew removing debris from park" loading="lazy" width="600" height="450" />
              <span className="gallery__cap">Community volunteer cleanup — Clackamas County park</span>
            </div>
            <div className="gallery__item">
              <img className="gallery__img" src="/images/clean-roadside.jpg" alt="Restored roadside after professional cleanup" loading="lazy" width="600" height="450" />
              <span className="gallery__cap">After professional cleanup — the standard we deliver</span>
            </div>
          </div>
          <div className="trust-sources">
            <h3>Verified Sources & Reporting</h3>
            <p>Every number in this plan comes from public records. Here are the agencies and programs we reference:</p>
            <div className="trust-grid">
              <a href="https://www.oregon.gov/odot/maintenance/" className="trust-link" target="_blank" rel="noopener noreferrer">
                <span className="trust-link__org">ODOT</span>
                <span className="trust-link__desc">Highway Maintenance & Litter Programs</span>
              </a>
              <a href="https://www.oregonmetro.gov/" className="trust-link" target="_blank" rel="noopener noreferrer">
                <span className="trust-link__org">Metro</span>
                <span className="trust-link__desc">Regional Government — Cleanup & Enhancement Grants</span>
              </a>
              <a href="https://www.oregon.gov/deq/" className="trust-link" target="_blank" rel="noopener noreferrer">
                <span className="trust-link__org">Oregon DEQ</span>
                <span className="trust-link__desc">Dept. of Environmental Quality — Hazards & Cleanup</span>
              </a>
              <a href="https://www.solveoregon.org/" className="trust-link" target="_blank" rel="noopener noreferrer">
                <span className="trust-link__org">SOLVE Oregon</span>
                <span className="trust-link__desc">Statewide Volunteer Cleanup & Restoration</span>
              </a>
              <a href="https://osha.oregon.gov/" className="trust-link" target="_blank" rel="noopener noreferrer">
                <span className="trust-link__org">Oregon OSHA</span>
                <span className="trust-link__desc">Workplace Safety Standards & Compliance</span>
              </a>
              <a href="https://www.oregon.gov/olcc/pages/bottle_bill.aspx" className="trust-link" target="_blank" rel="noopener noreferrer">
                <span className="trust-link__org">Oregon Bottle Bill</span>
                <span className="trust-link__desc">OLCC — Bottle Redemption & Recovery Program</span>
              </a>
            </div>
          </div>
        </Section>

        <Section id="boundaries">
          <p className="label">Clear Boundaries</p><div className="divider"/>
          <h2>What we commit to — and what we don't.</h2>
          <p className="lead">Trust starts with honesty about scope.</p>
          <div className="bbox">
            <h3>We Will</h3>
            <ul className="bbox__list">
              <li>Full transparency on finances, contracts, and decisions</li>
              <li>Proper insurance, safety equipment, and OSHA compliance</li>
              <li>Document every job with photos, weight logs, and GPS</li>
              <li>Quarterly financial reports shared with all partners</li>
              <li>Respect every partner's time commitment — flexible by design</li>
              <li>Proper permits before working on any public land</li>
            </ul>
          </div>
          <div className="bbox bbox--w">
            <h3>We Won't</h3>
            <ul className="bbox__list">
              <li>Handle hazmat without proper certification</li>
              <li>Take contracts we can't fulfill safely</li>
              <li>Make commitments that outpace actual revenue</li>
              <li>Pressure any partner into a larger role</li>
              <li>Skip permitting or safety protocols</li>
              <li>Misrepresent our capabilities to win contracts</li>
            </ul>
          </div>
        </Section>

        <Section id="files" dark>
          <p className="label">The Files</p><div className="divider"/>
          <h2>Every source. Every form.<br className="br-m"/> All in one place.</h2>
          <p className="lead">This project is built on publicly available legal frameworks, state programs, and government funding mechanisms. Below is the full reference library — organized by category.</p>

          <div className="files">
            <div className="files__group">
              <h3>Business Formation & Registration</h3>
              <div className="files__list">
                <a href="https://sos.oregon.gov/business/pages/register.aspx" className="file-link" target="_blank" rel="noopener noreferrer">
                  <span className="file-link__icon">📄</span>
                  <div>
                    <span className="file-link__title">Oregon LLC Registration</span>
                    <span className="file-link__sub">Secretary of State — Business Registry</span>
                  </div>
                </a>
                <a href="https://www.doj.state.or.us/charitable-activities/" className="file-link" target="_blank" rel="noopener noreferrer">
                  <span className="file-link__icon">📄</span>
                  <div>
                    <span className="file-link__title">Oregon Nonprofit / 501(c)(3) Formation</span>
                    <span className="file-link__sub">Dept. of Justice — Charitable Activities Section</span>
                  </div>
                </a>
                <a href="https://oregonbuys.gov/" className="file-link" target="_blank" rel="noopener noreferrer">
                  <span className="file-link__icon">📄</span>
                  <div>
                    <span className="file-link__title">OregonBuys — State Procurement Portal</span>
                    <span className="file-link__sub">Vendor registration for government contract bidding</span>
                  </div>
                </a>
              </div>
            </div>

            <div className="files__group">
              <h3>Government Contracts & Grants</h3>
              <div className="files__list">
                <a href="https://www.oregon.gov/odot/maintenance/" className="file-link" target="_blank" rel="noopener noreferrer">
                  <span className="file-link__icon">📋</span>
                  <div>
                    <span className="file-link__title">ODOT Highway Maintenance & Cleanup</span>
                    <span className="file-link__sub">Oregon Dept. of Transportation — maintenance division, litter programs, Adopt a Highway</span>
                  </div>
                </a>
                <a href="https://www.oregonmetro.gov/" className="file-link" target="_blank" rel="noopener noreferrer">
                  <span className="file-link__icon">📋</span>
                  <div>
                    <span className="file-link__title">Metro Regional Government</span>
                    <span className="file-link__sub">Community enhancement grants, regional cleanup funding, Nature in Neighborhoods</span>
                  </div>
                </a>
                <a href="https://www.orcity.org/" className="file-link" target="_blank" rel="noopener noreferrer">
                  <span className="file-link__icon">📋</span>
                  <div>
                    <span className="file-link__title">Oregon City — Community Enhancement Grant</span>
                    <span className="file-link__sub">Metro-funded, up to $400K/year for neighborhood safety & cleanliness projects</span>
                  </div>
                </a>
                <a href="https://www.clackamas.us/roads/" className="file-link" target="_blank" rel="noopener noreferrer">
                  <span className="file-link__icon">📋</span>
                  <div>
                    <span className="file-link__title">Clackamas County Roads & Adopt-a-Road</span>
                    <span className="file-link__sub">County-level roadside maintenance programs and volunteer coordination</span>
                  </div>
                </a>
              </div>
            </div>

            <div className="files__group">
              <h3>Safety, Compliance & Environmental</h3>
              <div className="files__list">
                <a href="https://osha.oregon.gov/" className="file-link" target="_blank" rel="noopener noreferrer">
                  <span className="file-link__icon">🛡️</span>
                  <div>
                    <span className="file-link__title">Oregon OSHA</span>
                    <span className="file-link__sub">State workplace safety standards — PPE, hazmat, roadside work protocols</span>
                  </div>
                </a>
                <a href="https://www.oregon.gov/deq/" className="file-link" target="_blank" rel="noopener noreferrer">
                  <span className="file-link__icon">🛡️</span>
                  <div>
                    <span className="file-link__title">Oregon DEQ</span>
                    <span className="file-link__sub">Dept. of Environmental Quality — hazards, cleanup standards, environmental permits</span>
                  </div>
                </a>
                <a href="https://www.oregon.gov/odot/maintenance/pages/adopt.aspx" className="file-link" target="_blank" rel="noopener noreferrer">
                  <span className="file-link__icon">🛡️</span>
                  <div>
                    <span className="file-link__title">ODOT Adopt a Highway Safety Requirements</span>
                    <span className="file-link__sub">Volunteer and contractor safety protocols for highway work zones</span>
                  </div>
                </a>
              </div>
            </div>

            <div className="files__group">
              <h3>Partners & Material Recovery</h3>
              <div className="files__list">
                <a href="https://www.solveoregon.org/" className="file-link" target="_blank" rel="noopener noreferrer">
                  <span className="file-link__icon">🤝</span>
                  <div>
                    <span className="file-link__title">SOLVE Oregon</span>
                    <span className="file-link__sub">Statewide cleanup events, volunteer coordination, environmental restoration</span>
                  </div>
                </a>
                <a href="https://www.bottledropcenters.com/" className="file-link" target="_blank" rel="noopener noreferrer">
                  <span className="file-link__icon">♻️</span>
                  <div>
                    <span className="file-link__title">BottleDrop / Oregon Bottle Bill</span>
                    <span className="file-link__sub">Beverage container redemption — revenue stream for high-volume collection</span>
                  </div>
                </a>
                <a href="https://www.oregon.gov/olcc/pages/bottle_bill.aspx" className="file-link" target="_blank" rel="noopener noreferrer">
                  <span className="file-link__icon">♻️</span>
                  <div>
                    <span className="file-link__title">OLCC Bottle Bill — Official Program</span>
                    <span className="file-link__sub">Oregon Liquor & Cannabis Commission — bottle bill administration & rates</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </Section>

        <Section id="invitation">
          <p className="label">Open Invitation</p><div className="divider"/>
          <h2>This is a conversation, not a pitch.</h2>
          <div className="invite">
            <h3>Your ideas belong here.</h3>
            <p>This plan is a starting point. If you see angles we've missed, structures that work better, or a different way to be involved — that's what we want to hear.</p>
            <p className="invite__cta">Advisory, board, co-founder, or one-time consult on legal structure — every option is on the table. We define this together.</p>
            <div className="invite__actions">
              <button className="invite__btn no-print" onClick={() => window.print()}>Download Business Plan</button>
            </div>
            {formStatus === 'success' ? (
              <div className="contact-form__success">
                <h3>Thank you!</h3>
                <p>We'll be in touch soon.</p>
              </div>
            ) : (
              <form className="contact-form" name="contact" method="POST" data-netlify="true" onSubmit={handleContactSubmit}>
                <input type="hidden" name="form-name" value="contact" />
                <div className="contact-form__group">
                  <label className="contact-form__label" htmlFor="name">Name</label>
                  <input className="contact-form__input" type="text" id="name" name="name" required />
                </div>
                <div className="contact-form__group">
                  <label className="contact-form__label" htmlFor="email">Email</label>
                  <input className="contact-form__input" type="email" id="email" name="email" required />
                </div>
                <div className="contact-form__group">
                  <label className="contact-form__label" htmlFor="interest">Interest</label>
                  <select className="contact-form__select" id="interest" name="interest">
                    <option value="Advisory Role">Advisory Role</option>
                    <option value="Board Member">Board Member</option>
                    <option value="Co-Founder">Co-Founder</option>
                    <option value="Legal Consultation">Legal Consultation</option>
                    <option value="Volunteer">Volunteer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="contact-form__group">
                  <label className="contact-form__label" htmlFor="message">Message</label>
                  <textarea className="contact-form__textarea" id="message" name="message" rows="4" required />
                </div>
                {formStatus === 'error' && <p className="contact-form__error">Something went wrong. Please try again or email us directly.</p>}
                <button className="contact-form__btn" type="submit" disabled={formStatus === 'submitting'}>{formStatus === 'submitting' ? 'Sending...' : 'Send Message'}</button>
              </form>
            )}
            <p className="invite__fallback">Or email directly: <a href="mailto:skdevv@att.net">skdevv@att.net</a></p>
          </div>
        </Section>

        <Section id="workforce" dark>
          <p className="label">Community Workforce Program</p><div className="divider"/>
          <h2>Paid work. Real impact.<br className="br-m"/> Open to everyone.</h2>
          <p className="lead">ClearPath partners with local shelters, transitional housing programs, and workforce agencies to offer paid cleanup shifts to people experiencing homelessness or economic hardship. No experience required. No judgment. Just honest work and fair pay.</p>

          <div className="grid grid--2">
            <div className="card">
              <div className="card__ic">💼</div>
              <h3>How It Works</h3>
              <ul className="wf-list">
                <li>Sign up at any partner location or walk-in</li>
                <li>30-minute safety orientation and PPE fitting</li>
                <li>Assigned to a supervised crew (4–6 hour shifts)</li>
                <li>Paid $15–$18/hr, same-day or weekly</li>
                <li>Consistent performers offered recurring shifts</li>
              </ul>
            </div>
            <div className="card">
              <div className="card__ic">🤝</div>
              <h3>Partner Organizations</h3>
              <ul className="wf-list">
                <li>Central City Concern — housing & recovery services</li>
                <li>Clackamas County Social Services</li>
                <li>WorkSource Oregon — workforce development</li>
                <li>JOIN — homeless outreach & services</li>
                <li>Clackamas Women's Services</li>
              </ul>
            </div>
          </div>

          <div className="grid">
            <Card icon="🌟" title="Benefits for Participants">
              <p>Immediate income with no barriers to entry. Outdoor, meaningful work. Pathway to full-time crew positions for consistent performers. Reference letters and job skills documentation for future employment.</p>
            </Card>
            <Card icon="📈" title="Benefits for ClearPath">
              <p>Scalable, flexible labor force. Stronger grant eligibility through workforce development and equity programs. Deeper community integration. Aligns nonprofit mission with direct social impact.</p>
            </Card>
            <Card icon="💰" title="Funding Sources">
              <p>Oregon Workforce Innovation and Opportunity Act (WIOA) funds. Metro equity-focused community grants. Private foundation grants for workforce development. Social enterprise revenue models.</p>
            </Card>
            <Card icon="🛡️" title="Safety & Support">
              <p>Full PPE provided for every participant. Water, snacks, and sunscreen on-site. Transportation to work sites when possible. On-site crew lead supervision. Zero-tolerance for harassment — safe environment guaranteed.</p>
            </Card>
          </div>

          <div className="wf-cta">
            <h3>Everyone deserves a shot.</h3>
            <p>This isn't charity — it's a workforce model that works. Participants earn real wages doing real work. ClearPath gets the crew capacity to scale. The community gets cleaner public spaces. Everyone wins.</p>
          </div>
        </Section>

        <Section id="costs">
          <p className="label">Startup Requirements</p><div className="divider"/>
          <h2>Low barrier. Real returns.</h2>
          <p className="lead">Not capital-intensive. Costs scale with revenue.</p>
          <div className="grid grid--2">
            <div className="card">
              <h3>Essential (Month 1)</h3>
              <div className="cr"><span>LLC registration</span><span>~$100</span></div>
              <div className="cr"><span>General liability insurance</span><span>~$50–80/mo</span></div>
              <div className="cr"><span>Equipment (grabbers, bags, PPE)</span><span>~$300</span></div>
              <div className="cr"><span>OregonBuys registration</span><span>Free</span></div>
              <div className="ct">Under $600 to start</div>
            </div>
            <div className="card">
              <h3>Growth (Months 3–6)</h3>
              <div className="cr"><span>501(c)(3) formation</span><span>~$275–600</span></div>
              <div className="cr"><span>Trailer / truck organizer</span><span>$500–2,000</span></div>
              <div className="cr"><span>Additional crew PPE sets</span><span>~$150 each</span></div>
              <div className="cr"><span>Website & branding</span><span>Built ✓</span></div>
              <div className="ct">Funded by Phase 1 revenue</div>
            </div>
          </div>
        </Section>
      </main>

      <footer className="foot">
        <div className="foot__brand">{VENTURE_NAME}</div>
        <p>{REGION}</p>
        <nav className="foot__nav" aria-label="Footer">
          {NAV.map(([h,l])=>(<a key={h} href={h}>{l}</a>))}
        </nav>
        <p className="foot__copy">Draft Business Plan — {new Date().getFullYear()} · Prepared by Keith Skaggs Jr.</p>
      </footer>

      <button className={`totop ${showTop?'totop--v':''}`} onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} aria-label="Scroll to top">↑</button>
    </>
  )
}

