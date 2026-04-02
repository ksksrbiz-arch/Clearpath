import React, { useEffect, useRef, useState, useCallback } from 'react'

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

function Section({ children, id, dark }) {
  const [ref, isVisible] = useInView()
  return (
    <section ref={ref} id={id} className={`s ${dark ? 's--d' : ''} ${isVisible ? 's--v' : ''}`}>
      <div className="s__i">{children}</div>
    </section>
  )
}

function Stat({ number, label }) {
  return (<div className="stat"><span className="stat__n">{number}</span><span className="stat__l">{label}</span></div>)
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

function MobileDrawer({ isOpen, onClose, links }) {
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
            <a key={href} href={href} className="dr__link" onClick={onClose}>{label}</a>
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
  const toggleDrawer = useCallback(() => setDrawerOpen(p => !p), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  useEffect(() => {
    const fn = () => { setScrolled(window.scrollY > 60); setShowTop(window.scrollY > 800) }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') closeDrawer() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [closeDrawer])

  const NAV = [
    ['#mission','Mission'],['#opportunity','Opportunity'],['#model','Model'],['#structure','Structure'],
    ['#team','Team'],['#operations','Operations'],['#roadmap','Roadmap'],['#projections','Projections'],
    ['#edge','Why Us'],['#trust','Proof'],['#boundaries','Boundaries'],['#costs','Costs'],
    ['#files','The Files'],['#invitation','Join'],
  ]

  return (
    <>
      <style>{styles}</style>

      <header className={`nav ${scrolled ? 'nav--s' : ''}`}>
        <a href="#" className="nav__brand">{VENTURE_NAME}</a>
        <ul className="nav__links">{NAV.map(([h,l])=>(<li key={h}><a href={h}>{l}</a></li>))}</ul>
        <button className="nav__burger" onClick={toggleDrawer} aria-label="Open menu" aria-expanded={drawerOpen}>
          <span /><span /><span />
        </button>
      </header>

      <MobileDrawer isOpen={drawerOpen} onClose={closeDrawer} links={NAV} />

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

      <main>
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
            <Stat number="$250K" label="ODOT spent monthly on Clackamas/Multnomah cleanup"/>
            <Stat number="240K lbs" label="Litter removed from metro highways in one year"/>
            <Stat number="$20M" label="SB 5701 allocated for metro cleanup in 2024"/>
            <Stat number="60 tons" label="Adopt-a-Road volunteers collect annually"/>
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
              { phase:'Phase 1', when:'Now', title:'Foundation', text:'Register LLC/nonprofit. Secure equipment and insurance. Join Adopt-a-Road. Register on OregonBuys. Document first 5 sites with full before/after reports.' },
              { phase:'Phase 2', when:'Q3 2026', title:'Revenue', text:'Apply for Oregon City Enhancement Grant. Secure first private contracts (HOAs, property managers). Submit initial government RFP responses.' },
              { phase:'Phase 3', when:'2027', title:'Systems', text:'Formalize crew training. Build recurring contract base. Establish grant writing rhythm. Launch volunteer program through nonprofit arm.' },
              { phase:'Phase 4', when:'2028+', title:'Scale', text:'Bid on larger ODOT/Metro contracts. Hire seasonal crews. Add specialized services (invasive species, graffiti, remediation).' },
            ].map((item, i) => (
              <div key={i} className="tl__item">
                <div className="tl__marker"><div className="tl__dot"/>{i<3&&<div className="tl__line"/>}</div>
                <div className="tl__body">
                  <span className="tl__when">{item.phase} · {item.when}</span>
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
              <div className="gallery__img gallery__img--1" role="img" aria-label="Litter-strewn highway shoulder along I-205 in Clackamas County" />
              <span className="gallery__cap">Highway shoulder litter — I-205 corridor, Clackamas County</span>
            </div>
            <div className="gallery__item">
              <div className="gallery__img gallery__img--2" role="img" aria-label="Illegal dumping site near Oregon City trail system" />
              <span className="gallery__cap">Illegal dumping near public trail — Oregon City area</span>
            </div>
            <div className="gallery__item">
              <div className="gallery__img gallery__img--3" role="img" aria-label="Volunteer cleanup crew removing debris from park" />
              <span className="gallery__cap">Community volunteer cleanup — Clackamas County park</span>
            </div>
            <div className="gallery__item">
              <div className="gallery__img gallery__img--4" role="img" aria-label="Restored roadside after professional cleanup" />
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
            <div className="invite__contact">
              <a href="mailto:skdevv@att.net" className="invite__btn">skdevv@att.net</a>
            </div>
          </div>
        </Section>

        <Section id="costs" dark>
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
        <nav className="foot__nav">
          {NAV.map(([h,l])=>(<a key={h} href={h}>{l}</a>))}
        </nav>
        <p className="foot__copy">Draft Business Plan — {new Date().getFullYear()} · Prepared by Keith Skaggs Jr.</p>
      </footer>

      <button className={`totop ${showTop?'totop--v':''}`} onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} aria-label="Scroll to top">↑</button>
    </>
  )
}

const styles = `
:root{--forest:#1a3a2a;--pine:#2d5a3f;--sage:#7a9e7e;--earth:#8b6f47;--clay:#c4956a;--sand:#f5f0e8;--cream:#faf8f4;--stone:#e8e2d8;--charcoal:#2a2a28;--text:#3a3a38;--text-lt:#6a6a66;--white:#fff;--serif:'DM Serif Display',Georgia,serif;--sans:'Source Sans 3',-apple-system,sans-serif;--max-w:960px;--pad:1.25rem;--r:10px}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{font-family:var(--sans);font-size:16px;color:var(--text);background:var(--cream);line-height:1.65;-webkit-font-smoothing:antialiased;overflow-x:hidden}
:focus-visible{outline:2px solid var(--clay);outline-offset:2px;border-radius:3px}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:.8rem var(--pad);transition:background .35s,padding .35s,box-shadow .35s;background:transparent}
.nav--s{background:rgba(26,58,42,.96);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);padding:.6rem var(--pad);box-shadow:0 2px 20px rgba(0,0,0,.12)}
.nav__brand{font-family:var(--serif);font-size:1.05rem;color:var(--white);text-decoration:none;white-space:nowrap}
.nav__links{display:none;list-style:none;gap:.9rem}
.nav__links a{color:rgba(255,255,255,.75);text-decoration:none;font-size:.7rem;font-weight:500;letter-spacing:.04em;text-transform:uppercase;transition:color .2s;padding:.3rem 0}
.nav__links a:hover{color:var(--white)}
.nav__burger{display:flex;flex-direction:column;justify-content:center;gap:5px;width:44px;height:44px;background:none;border:none;cursor:pointer;padding:10px;-webkit-tap-highlight-color:transparent}
.nav__burger span{display:block;width:22px;height:2px;background:var(--white);border-radius:2px;transition:transform .25s,opacity .25s}

/* DRAWER */
.ov{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:opacity .3s}
.ov--o{opacity:1;pointer-events:auto}
.dr{position:fixed;top:0;right:0;bottom:0;z-index:201;width:min(320px,85vw);background:var(--forest);transform:translateX(100%);transition:transform .35s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;padding:env(safe-area-inset-top,0) 0 env(safe-area-inset-bottom,0) 0}
.dr--o{transform:translateX(0)}
.dr__head{display:flex;align-items:center;justify-content:space-between;padding:1.2rem 1.5rem;border-bottom:1px solid rgba(255,255,255,.08)}
.dr__brand{font-family:var(--serif);font-size:1rem;color:var(--white)}
.dr__close{width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:none;border:none;color:rgba(255,255,255,.6);font-size:1.2rem;cursor:pointer;-webkit-tap-highlight-color:transparent}
.dr__nav{flex:1;display:flex;flex-direction:column;padding:1rem 0;overflow-y:auto;-webkit-overflow-scrolling:touch}
.dr__link{display:flex;align-items:center;padding:1rem 1.5rem;color:rgba(255,255,255,.8);text-decoration:none;font-size:1rem;font-weight:500;letter-spacing:.02em;transition:background .15s;min-height:48px}
.dr__link:active{background:rgba(255,255,255,.06)}
.dr__foot{padding:1rem 1.5rem;border-top:1px solid rgba(255,255,255,.08);font-size:.75rem;color:rgba(255,255,255,.35)}

/* HERO */
.hero{position:relative;min-height:100vh;min-height:100dvh;display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(165deg,var(--forest) 0%,#1e4432 40%,var(--pine) 100%);overflow:hidden;padding:5rem var(--pad) 4rem}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 20% 80%,rgba(122,158,126,.12) 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(139,111,71,.08) 0%,transparent 50%)}
.hero::after{content:'';position:absolute;bottom:0;left:0;right:0;height:80px;background:linear-gradient(to top,var(--cream),transparent)}
.hero__tex{position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.025'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")}
.hero__c{position:relative;z-index:2;max-width:640px}
.hero__badge{display:inline-block;padding:.35rem .85rem;border:1px solid rgba(255,255,255,.18);border-radius:2rem;color:var(--sage);font-size:.68rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:1.25rem}
.hero h1{font-family:var(--serif);font-size:clamp(2rem,7vw,4rem);color:var(--white);line-height:1.08;margin-bottom:.8rem;letter-spacing:-.02em}
.hero__tag{font-size:clamp(.95rem,2.5vw,1.2rem);color:rgba(255,255,255,.65);font-weight:300;margin-bottom:1rem;line-height:1.45}
.hero__reg{font-size:.78rem;color:var(--sage);font-weight:500;letter-spacing:.04em}
.hero__scroll{position:absolute;bottom:100px;left:50%;transform:translateX(-50%);z-index:2;color:rgba(255,255,255,.35);text-decoration:none;transition:color .2s;width:44px;height:44px;display:flex;align-items:center;justify-content:center}
.hero__scroll:hover{color:rgba(255,255,255,.6)}
.hero__dot{animation:scrollDot 2s ease-in-out infinite}
@keyframes scrollDot{0%,100%{cy:8;opacity:1}50%{cy:18;opacity:.3}}

/* SECTIONS */
.s{padding:clamp(2.5rem,7vw,5rem) var(--pad);opacity:0;transform:translateY(24px);transition:opacity .6s ease,transform .6s ease}
.s--v{opacity:1;transform:translateY(0)}
.s--d{background:var(--forest);color:var(--sand)}
.s__i{max-width:var(--max-w);margin:0 auto}

/* TYPOGRAPHY */
.label{font-size:.68rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--earth);margin-bottom:.6rem}
.s--d .label{color:var(--clay)}
h2{font-family:var(--serif);font-size:clamp(1.6rem,4.5vw,2.5rem);color:var(--forest);line-height:1.15;margin-bottom:.8rem;letter-spacing:-.015em}
.s--d h2{color:var(--white)}
h3{font-family:var(--serif);font-size:1.15rem;color:var(--forest);margin-bottom:.4rem;line-height:1.25}
.s--d h3{color:var(--sand)}
p{margin-bottom:.8rem}.s--d p{color:rgba(245,240,232,.8)}
.lead{font-size:clamp(.95rem,2vw,1.08rem);font-weight:300;color:var(--text-lt);max-width:640px}
.s--d .lead{color:rgba(245,240,232,.65)}
.divider{width:40px;height:2px;background:var(--sage);margin-bottom:1.2rem}
.s--d .divider{background:var(--clay)}
.br-m{display:inline}

/* STATS */
.stats{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;padding:1.5rem 0;border-top:1px solid rgba(255,255,255,.08);border-bottom:1px solid rgba(255,255,255,.08);margin:1.5rem 0}
.stat{text-align:center;padding:.5rem 0}
.stat__n{display:block;font-family:var(--serif);font-size:clamp(1.6rem,4vw,2.2rem);color:var(--clay);line-height:1;margin-bottom:.25rem}
.stat__l{font-size:.72rem;color:rgba(245,240,232,.55);font-weight:500;line-height:1.35}

/* GRID */
.grid{display:grid;grid-template-columns:1fr;gap:1rem;margin-top:1.5rem}

/* CARDS */
.card{background:var(--white);border:1px solid var(--stone);border-radius:var(--r);padding:1.25rem;transition:transform .25s,box-shadow .25s}
.s--d .card{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.08)}
.card__ic{width:40px;height:40px;background:var(--sand);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;margin-bottom:.75rem}
.s--d .card__ic{background:rgba(196,149,106,.12)}
.card h3{font-size:1.05rem}.card p{font-size:.9rem;margin-bottom:.4rem}.card p:last-child{margin-bottom:0}

/* COST ROWS */
.cr{display:flex;justify-content:space-between;align-items:baseline;padding:.4rem 0;border-bottom:1px solid var(--stone);font-size:.88rem}
.cr span:last-child{font-weight:600;color:var(--earth);white-space:nowrap}
.ct{margin-top:.75rem;font-weight:700;color:var(--earth);font-size:.95rem}

/* ROLE CARDS */
.rc{background:var(--white);border:1px solid var(--stone);border-radius:var(--r);padding:1.25rem;position:relative;overflow:hidden}
.s--d .rc{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.08)}
.rc::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--pine)}
.rc--o::before{background:var(--earth)}
.rc__t{font-family:var(--serif);font-size:1.05rem;color:var(--forest);margin-bottom:.15rem}
.s--d .rc__t{color:var(--sand)}
.rc__n{font-size:.82rem;color:var(--earth);font-weight:600;margin-bottom:.6rem}
.s--d .rc__n{color:var(--clay)}
.rc p{font-size:.88rem;margin-bottom:.35rem}
.rc__flex{font-style:italic;opacity:.8}
.rc__tag{display:inline-block;margin-top:.5rem;padding:.25rem .55rem;background:rgba(45,90,63,.08);border-radius:4px;font-size:.68rem;font-weight:700;color:var(--pine);letter-spacing:.05em;text-transform:uppercase}
.s--d .rc__tag{background:rgba(122,158,126,.12);color:var(--sage)}
.rc__tag--o{background:rgba(139,111,71,.1)!important;color:var(--earth)!important}

/* TIMELINE */
.tl{margin-top:1.5rem}.tl__item{display:flex;gap:1rem;min-height:80px}
.tl__marker{display:flex;flex-direction:column;align-items:center;flex-shrink:0;width:20px;padding-top:.3rem}
.tl__dot{width:10px;height:10px;border-radius:50%;background:var(--clay);flex-shrink:0}
.tl__line{width:1px;flex:1;background:rgba(255,255,255,.1);margin-top:.4rem}
.tl__body{padding-bottom:1.5rem;flex:1}
.tl__when{display:block;font-size:.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--clay);margin-bottom:.2rem}
.tl__body h3{font-size:1.05rem;margin-bottom:.3rem}.tl__body p{font-size:.88rem;margin-bottom:0}

/* BOUNDARY */
.bbox{background:rgba(45,90,63,.05);border:1px solid rgba(45,90,63,.12);border-radius:var(--r);padding:1.25rem;margin-top:1.25rem}
.bbox--w{background:rgba(196,149,106,.06);border-color:rgba(196,149,106,.18)}
.bbox h3{color:var(--pine);margin-bottom:.75rem;font-size:1.05rem}
.bbox--w h3{color:var(--earth)}
.bbox__list{list-style:none;display:flex;flex-direction:column;gap:.5rem}
.bbox__list li{font-size:.88rem;padding-left:1.2rem;position:relative;line-height:1.5}
.bbox__list li::before{content:'—';position:absolute;left:0;color:var(--pine);font-weight:700}
.bbox--w .bbox__list li::before{color:var(--earth)}

/* GALLERY */
.gallery{display:grid;grid-template-columns:repeat(2,1fr);gap:.75rem;margin:1.5rem 0}
.gallery__item{position:relative;border-radius:var(--r);overflow:hidden}
.gallery__img{width:100%;aspect-ratio:4/3;background-size:cover;background-position:center;filter:brightness(.85)}
.gallery__img--1{background:linear-gradient(135deg,#3a5a3a 0%,#5a7a5a 50%,#4a6a4a 100%);background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%233a5a3a' width='400' height='300'/%3E%3Ctext x='200' y='140' text-anchor='middle' fill='%23ffffff30' font-family='sans-serif' font-size='14'%3EHighway Shoulder — I-205%3C/text%3E%3Ctext x='200' y='165' text-anchor='middle' fill='%23ffffff20' font-family='sans-serif' font-size='11'%3EPhoto placeholder%3C/text%3E%3C/svg%3E")}
.gallery__img--2{background:linear-gradient(135deg,#4a5a3a 0%,#6a7a4a 50%,#5a6a3a 100%);background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%234a5a3a' width='400' height='300'/%3E%3Ctext x='200' y='140' text-anchor='middle' fill='%23ffffff30' font-family='sans-serif' font-size='14'%3EIllegal Dumping Site%3C/text%3E%3Ctext x='200' y='165' text-anchor='middle' fill='%23ffffff20' font-family='sans-serif' font-size='11'%3EPhoto placeholder%3C/text%3E%3C/svg%3E")}
.gallery__img--3{background:linear-gradient(135deg,#2d5a3f 0%,#4a7a5a 50%,#3a6a4a 100%);background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%232d5a3f' width='400' height='300'/%3E%3Ctext x='200' y='140' text-anchor='middle' fill='%23ffffff30' font-family='sans-serif' font-size='14'%3EVolunteer Cleanup Crew%3C/text%3E%3Ctext x='200' y='165' text-anchor='middle' fill='%23ffffff20' font-family='sans-serif' font-size='11'%3EPhoto placeholder%3C/text%3E%3C/svg%3E")}
.gallery__img--4{background:linear-gradient(135deg,#1a4a2a 0%,#3a6a4a 50%,#2a5a3a 100%);background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%231a4a2a' width='400' height='300'/%3E%3Ctext x='200' y='140' text-anchor='middle' fill='%23ffffff30' font-family='sans-serif' font-size='14'%3EAfter Cleanup — Restored%3C/text%3E%3Ctext x='200' y='165' text-anchor='middle' fill='%23ffffff20' font-family='sans-serif' font-size='11'%3EPhoto placeholder%3C/text%3E%3C/svg%3E")}
.gallery__cap{display:block;padding:.5rem .1rem;font-size:.72rem;color:var(--text-lt);text-align:center}

/* TRUST SOURCES */
.trust-sources{margin-top:2rem;padding-top:1.5rem;border-top:1px solid rgba(255,255,255,.08)}
.trust-sources h3{font-size:1.05rem;margin-bottom:.3rem}
.trust-sources>p{font-size:.88rem;margin-bottom:1rem}
.trust-grid{display:grid;grid-template-columns:1fr;gap:.6rem}
.trust-link{display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;text-decoration:none;transition:transform .2s,background .2s}
.trust-link:hover{transform:translateY(-2px);background:rgba(255,255,255,.08)}
.trust-link__org{font-family:var(--serif);font-size:.9rem;color:var(--clay);white-space:nowrap;min-width:90px}
.trust-link__desc{font-size:.78rem;color:rgba(245,240,232,.5);line-height:1.35}
.gallery__cap{color:rgba(245,240,232,.5)}

/* THE FILES */
.files{margin-top:1.5rem;display:flex;flex-direction:column;gap:2rem}
.files__group h3{color:var(--clay);font-size:1rem;margin-bottom:.75rem;padding-bottom:.4rem;border-bottom:1px solid rgba(255,255,255,.08)}
.files__list{display:flex;flex-direction:column;gap:.5rem}
.file-link{display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;text-decoration:none;transition:background .2s,transform .15s}
.file-link:hover{background:rgba(255,255,255,.08);transform:translateX(4px)}
.file-link__icon{font-size:1.1rem;flex-shrink:0;margin-top:.1rem}
.file-link__title{display:block;font-weight:600;font-size:.88rem;color:var(--sand);line-height:1.3}
.file-link__sub{display:block;font-size:.75rem;color:rgba(245,240,232,.45);line-height:1.4;margin-top:.15rem}

/* INVITE */
.invite{background:rgba(255,255,255,.03);border:2px dashed rgba(255,255,255,.12);border-radius:12px;padding:1.5rem;margin-top:1.5rem;text-align:center}
.invite h3{font-size:1.2rem;margin-bottom:.5rem}
.invite p{max-width:540px;margin:0 auto .5rem;font-size:.92rem}
.invite__cta{font-weight:600!important;color:var(--clay)!important}

/* STRUCTURE LIST */
.struct-list{list-style:none;margin:.6rem 0 0;display:flex;flex-direction:column;gap:.35rem}
.struct-list li{font-size:.85rem;padding-left:1.2rem;position:relative;line-height:1.5}
.struct-list li::before{content:'✓';position:absolute;left:0;color:var(--sage);font-weight:700;font-size:.75rem}
.s--d .struct-list li::before{color:var(--clay)}
.struct-note{margin-top:1.5rem;padding:1rem 1.25rem;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:var(--r);font-size:.88rem;font-style:italic;color:rgba(245,240,232,.6)}

/* PROJECTIONS */
.proj{margin:1.5rem 0;border:1px solid var(--stone);border-radius:var(--r);overflow:hidden}
.proj__row{display:grid;grid-template-columns:1.6fr repeat(3,1fr);padding:.65rem 1rem;font-size:.85rem;border-bottom:1px solid var(--stone)}
.proj__row:last-child{border-bottom:none}
.proj__head{background:var(--forest);color:var(--sand);font-weight:700;font-size:.72rem;letter-spacing:.06em;text-transform:uppercase}
.proj__head span:not(:first-child){text-align:center}
.proj__row span:not(:first-child){text-align:center;font-weight:600;color:var(--earth)}
.proj__total{background:var(--sand);font-weight:700}
.proj__total span{color:var(--forest)!important;font-size:.95rem}
.proj-notes{display:grid;grid-template-columns:1fr;gap:1rem;margin-top:1.5rem}
.proj-note{background:var(--white);border:1px solid var(--stone);border-radius:var(--r);padding:1.25rem}
.proj-note h3{font-size:1rem;margin-bottom:.6rem}
.proj-note p{font-size:.88rem;margin-bottom:0}

/* INVITE CONTACT */
.invite__contact{display:flex;flex-direction:column;align-items:center;gap:.6rem;margin-top:1.25rem}
.invite__btn{display:inline-block;padding:.6rem 1.5rem;background:var(--clay);color:var(--white);text-decoration:none;border-radius:6px;font-weight:600;font-size:.9rem;letter-spacing:.02em;transition:background .2s,transform .15s}
.invite__btn:hover{background:var(--earth);transform:translateY(-1px)}
.invite__btn--s{background:transparent;border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.7);font-size:.82rem;padding:.45rem 1.2rem}
.invite__btn--s:hover{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.35);color:var(--white);transform:translateY(-1px)}

/* FOOTER */
.foot{background:var(--charcoal);color:rgba(255,255,255,.45);padding:2.5rem var(--pad);text-align:center;font-size:.8rem}
.foot__brand{font-family:var(--serif);font-size:1rem;color:var(--white);margin-bottom:.35rem}
.foot__nav{display:flex;flex-wrap:wrap;justify-content:center;gap:.5rem .9rem;margin:1rem 0}
.foot__nav a{color:rgba(255,255,255,.4);text-decoration:none;font-size:.72rem;font-weight:500;letter-spacing:.04em;text-transform:uppercase;transition:color .2s}
.foot__nav a:hover{color:var(--white)}
.foot__copy{margin-top:.4rem;opacity:.6}.foot p{margin-bottom:0}

/* SCROLL TO TOP */
.totop{position:fixed;bottom:1.25rem;right:1.25rem;z-index:90;width:44px;height:44px;border-radius:50%;background:var(--forest);color:var(--white);border:1px solid rgba(255,255,255,.15);font-size:1.1rem;cursor:pointer;opacity:0;transform:translateY(10px);transition:opacity .3s,transform .3s,background .2s;pointer-events:none;display:flex;align-items:center;justify-content:center;-webkit-tap-highlight-color:transparent;box-shadow:0 4px 14px rgba(0,0,0,.2)}
.totop--v{opacity:1;transform:translateY(0);pointer-events:auto}
.totop:active{background:var(--pine)}

/* REDUCED MOTION */
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}html{scroll-behavior:auto}.s{opacity:1;transform:none}}

/* TABLET 640px+ */
@media(min-width:640px){
:root{--pad:2rem}
.grid{grid-template-columns:repeat(2,1fr);gap:1.25rem}
.grid--2{grid-template-columns:repeat(2,1fr)}
.stats{grid-template-columns:repeat(4,1fr)}
.bbox__list{display:grid;grid-template-columns:1fr 1fr;gap:.5rem 1.5rem}
.invite{padding:2rem}
.invite__contact{flex-direction:row;gap:.8rem}
.hero{padding:6rem 2rem 5rem}
.proj-notes{grid-template-columns:1fr 1fr}
.trust-grid{grid-template-columns:repeat(2,1fr)}
.files__list{display:grid;grid-template-columns:1fr}
}

/* DESKTOP 900px+ */
@media(min-width:900px){
:root{--pad:2rem}
.nav__links{display:flex}.nav__burger{display:none}
.nav{padding:1rem 2.5rem}.nav--s{padding:.65rem 2.5rem}
.nav__brand{font-size:1.15rem}
.grid{grid-template-columns:repeat(2,1fr);gap:1.5rem}
.grid--roles{grid-template-columns:repeat(2,1fr)}
.card{padding:1.75rem}
.card:hover{transform:translateY(-3px);box-shadow:0 8px 28px rgba(0,0,0,.06)}
.s--d .card:hover{box-shadow:0 8px 28px rgba(0,0,0,.2)}
.rc{padding:1.75rem}
.br-m{display:none}
.hero__scroll{bottom:120px}
.totop{bottom:2rem;right:2rem}
.trust-grid{grid-template-columns:repeat(3,1fr)}
.files__list{display:grid;grid-template-columns:1fr 1fr;gap:.6rem}
.nav__links a{font-size:.65rem;letter-spacing:.03em}
}

/* PRINT */
@media print{
.nav,.totop,.hero__scroll,.ov,.dr,.nav__burger,.foot__nav{display:none!important}
.s{opacity:1!important;transform:none!important}
.s--d{background:#fff!important;color:#3a3a38!important}
.s--d h2,.s--d h3,.s--d p,.s--d .label,.s--d .lead,.s--d .card,.s--d .rc,.s--d .stat,.s--d .stat__n,.s--d .stat__l,.s--d li,.s--d .bbox,.s--d .invite,.s--d .struct-list li,.s--d .struct-note,.s--d .trust-link__org,.s--d .trust-link__desc,.s--d .file-link__title,.s--d .file-link__sub,.s--d .gallery__cap{color:#3a3a38!important}
.s--d .card,.s--d .rc,.s--d .bbox,.s--d .invite,.s--d .trust-link,.s--d .file-link,.s--d .struct-note,.s--d .proj-note{background:#fff!important;border-color:#ccc!important}
.s--d .proj__head{background:#e8e8e6!important;color:#3a3a38!important}
.s--d .proj__row span:not(:first-child){color:#3a3a38!important}
.card,.rc,.bbox,.tl__item,.proj,.invite{page-break-inside:avoid}
.hero{background:#fff!important;color:#3a3a38!important;padding:2rem!important}
.hero h1,.hero p,.hero__tag{color:#3a3a38!important}
.hero::before,.hero::after{display:none!important}
*{box-shadow:none!important}
.s{padding:1.5rem var(--pad)!important}
body{font-size:11pt;line-height:1.5}
a{color:#3a3a38!important;text-decoration:underline}
.foot{background:#fff!important;color:#3a3a38!important}
.foot__brand{color:#3a3a38!important}
}
`
