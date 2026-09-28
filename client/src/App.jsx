import { useState } from 'react'
import './App.css'
import { Icon, PrototypeNotice, SiteFooter, SiteHeader, SiteSubNav } from './components/SiteChrome.jsx'

const schemes = [
    {
        id: 'pm-kisan',
        name: 'PM-KISAN',
        category: 'Agriculture',
        audience: 'For eligible farmer families',
        description: 'Explore income support for eligible landholding farmer families.',
        source: 'https://pmkisan.gov.in/',
        mark: '01',
    },
    {
        id: 'pm-jay',
        name: 'Ayushman Bharat PM-JAY',
        category: 'Health',
        audience: 'For eligible families',
        description: 'Understand health coverage options and how to check your eligibility.',
        source: 'https://pmjay.gov.in/',
        mark: '02',
    },
    {
        id: 'pmay-urban',
        name: 'PM Awas Yojana (Urban)',
        category: 'Housing',
        audience: 'For eligible urban households',
        description: 'Review housing assistance information and the official application route.',
        source: 'https://pmay-urban.gov.in/',
        mark: '03',
    },
    {
        id: 'scholarships',
        name: 'National Scholarship Portal',
        category: 'Education',
        audience: 'For students across India',
        description: 'Find scholarship programs and prepare for an application.',
        source: 'https://scholarships.gov.in/',
        mark: '04',
    },
]

const categories = ['All schemes', 'Agriculture', 'Health', 'Housing', 'Education']

function App() {
    const [query, setQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState('All schemes')
    const [saved, setSaved] = useState([])
    const [selectedScheme, setSelectedScheme] = useState(null)
    const [showProfile, setShowProfile] = useState(false)
    const [showAssistant, setShowAssistant] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [profile, setProfile] = useState({ state: '', age: '', occupation: '' })
    const [profileSaved, setProfileSaved] = useState(false)
    const [message, setMessage] = useState('')
    const [conversation, setConversation] = useState([])

    const filteredSchemes = schemes.filter((scheme) => {
        const matchesCategory = activeCategory === 'All schemes' || scheme.category === activeCategory
        const searchText = `${scheme.name} ${scheme.category} ${scheme.audience} ${scheme.description}`.toLowerCase()
        return matchesCategory && searchText.includes(query.trim().toLowerCase())
    })

    const toggleSaved = (schemeId) => {
        setSaved((current) => current.includes(schemeId)
            ? current.filter((id) => id !== schemeId)
            : [...current, schemeId])
    }

    const sendMessage = (event) => {
        event.preventDefault()
        const question = message.trim()
        if (!question) return
        setConversation((current) => [...current, {
            question,
            answer: 'I can help explain scheme information and next steps. For a personal match, complete your profile first. Any result here is informational; confirm eligibility with the official scheme source.',
        }])
        setMessage('')
    }

    const closeMobileMenu = () => setMobileMenuOpen(false)

    return (
        <div className="site-shell">
            <PrototypeNotice />
            <SiteHeader mobileMenuOpen={mobileMenuOpen} onMobileMenuToggle={() => setMobileMenuOpen((open) => !open)} onMobileMenuClose={closeMobileMenu} onProfileClick={() => setShowProfile(true)} />
            <SiteSubNav action={<button className="button button-primary button-small" type="button" onClick={() => setShowProfile(true)}>Build my profile</button>} />

            <main>
                <section className="hero-tile" id="home">
                    <div className="hero-copy">
                        <p className="eyebrow">Government schemes and public services</p>
                        <h1>Find support. Know what to do next.</h1>
                        <p className="hero-lead">Search public benefit schemes, review the information you may need, and follow links to official application sources.</p>
                        <div className="hero-actions">
                            <a className="button button-primary" href="#discover">Search schemes</a>
                            <button className="button button-secondary" type="button" onClick={() => setShowAssistant(true)}>Get help understanding a scheme</button>
                        </div>
                        <div className="hero-assurance"><Icon name="shield" size={16} /><span>Scheme matches are informational, not official eligibility decisions.</span></div>
                    </div>
                    <aside className="hero-guide" aria-label="Services available">
                        <h2>What you can do here</h2>
                        <a href="#discover"><span className="guide-number">01</span><span><strong>Find schemes</strong><small>Browse by category or search</small></span><Icon name="arrow" size={16} /></a>
                        <button type="button" onClick={() => setShowProfile(true)}><span className="guide-number">02</span><span><strong>Review your details</strong><small>Create a profile for relevant guidance</small></span><Icon name="arrow" size={16} /></button>
                        <button type="button" onClick={() => setShowAssistant(true)}><span className="guide-number">03</span><span><strong>Understand next steps</strong><small>Ask a question in plain language</small></span><Icon name="arrow" size={16} /></button>
                    </aside>
                </section>

                <section className="discovery-section" id="discover">
                    <div className="section-heading">
                        <div>
                            <p className="eyebrow">Start with a possibility</p>
                            <h2>Explore support that fits your life.</h2>
                            <p className="section-lead">Browse a few popular starting points, or search across the catalog.</p>
                        </div>
                        <span className="catalog-note">Sample catalog · Always verify details with the official source</span>
                    </div>

                    <div className="discovery-controls">
                        <label className="search-field">
                            <Icon name="search" size={19} />
                            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by scheme, need, or category" />
                        </label>
                        <div className="category-list" role="group" aria-label="Filter schemes by category">
                            {categories.map((category) => (
                                <button
                                    className={`category-chip${activeCategory === category ? ' is-active' : ''}`}
                                    type="button"
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    aria-pressed={activeCategory === category}
                                >{category}</button>
                            ))}
                        </div>
                    </div>

                    {filteredSchemes.length ? (
                        <div className="scheme-grid">
                            {filteredSchemes.map((scheme) => (
                                <article className="scheme-card" key={scheme.id}>
                                    <div className="scheme-heading">
                                        <span className="scheme-category">{scheme.category}</span>
                                        <button className={`save-button${saved.includes(scheme.id) ? ' is-saved' : ''}`} type="button" onClick={() => toggleSaved(scheme.id)} aria-label={saved.includes(scheme.id) ? `Remove ${scheme.name} from saved schemes` : `Save ${scheme.name}`} aria-pressed={saved.includes(scheme.id)}>
                                            <Icon name="bookmark" size={18} />
                                        </button>
                                    </div>
                                    <div className="scheme-card-copy">
                                        <p className="scheme-audience">{scheme.audience}</p>
                                        <h3>{scheme.name}</h3>
                                        <p className="scheme-description">{scheme.description}</p>
                                        <button className="text-link" type="button" onClick={() => setSelectedScheme(scheme)}>Explore scheme <Icon name="arrow" size={16} /></button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state"><Icon name="search" size={24} /><h3>No schemes found</h3><p>Try a different search or choose another category.</p><button className="text-link" type="button" onClick={() => { setQuery(''); setActiveCategory('All schemes') }}>Clear filters</button></div>
                    )}
                    {saved.length > 0 && <p className="saved-count"><Icon name="bookmark" size={15} /> {saved.length} {saved.length === 1 ? 'scheme' : 'schemes'} saved in this session</p>}
                </section>

                <section className="assistant-tile">
                    <div className="assistant-inner">
                        <div className="assistant-copy">
                            <p className="eyebrow eyebrow-dark">A little help goes a long way</p>
                            <h2>Questions are part<br />of the process.</h2>
                            <p>Ask in everyday language. Get a clear explanation of scheme information and what to do next.</p>
                            <button className="button button-primary" type="button" onClick={() => setShowAssistant(true)}>Talk to SevaConnect AI <Icon name="arrow" size={17} /></button>
                        </div>
                        <div className="assistant-preview" aria-label="Example assistant conversation">
                            <div className="preview-label"><span className="online-dot" /> SevaConnect assistant <span className="preview-language">EN</span></div>
                            <div className="preview-message user-message">What should I do before applying?</div>
                            <div className="preview-message assistant-message">Start by checking the official eligibility criteria and gathering the documents listed for your scheme.</div>
                            <p className="preview-footnote">Answers explain information; official authorities make eligibility decisions.</p>
                        </div>
                    </div>
                </section>

                <section className="steps-section" id="how-it-works">
                    <div className="steps-heading">
                        <p className="eyebrow">From discovery to next step</p>
                        <h2>A simpler path, one step at a time.</h2>
                    </div>
                    <div className="steps-grid">
                        <article className="step-item"><span className="step-number">01</span><h3>Tell us what matters</h3><p>Add a few profile details to make discovery more relevant. You choose what to share.</p></article>
                        <article className="step-item"><span className="step-number">02</span><h3>See why it may fit</h3><p>Review the criteria behind each match and spot anything that needs verification.</p></article>
                        <article className="step-item"><span className="step-number">03</span><h3>Prepare with clarity</h3><p>Keep track of documents, next steps, and the official source for each scheme.</p></article>
                    </div>
                    <div className="profile-banner">
                        <div className="profile-banner-icon"><Icon name="user" size={20} /></div>
                        <div><h3>{profileSaved ? 'Your demo profile is ready' : 'A few details can make a difference.'}</h3><p>{profileSaved ? 'Your information stays in this browser session.' : 'Build a profile to see a more relevant starting point.'}</p></div>
                        <button className="button button-secondary" type="button" onClick={() => setShowProfile(true)}>{profileSaved ? 'Edit profile' : 'Build my profile'} <Icon name="arrow" size={16} /></button>
                    </div>
                </section>

                <section className="trust-section" id="trust">
                    <div className="trust-inner">
                        <span className="trust-icon"><Icon name="shield" size={22} /></span>
                        <div><p className="eyebrow">Built for clarity and trust</p><h2>Your information is yours.<br />Your next step stays clear.</h2></div>
                        <p className="trust-description">SevaConnect is an independent prototype, not a government service. Scheme details are for guidance only. Always confirm eligibility, documents, and application steps with the linked official source.</p>
                    </div>
                </section>
            </main>

            <SiteFooter />

            {selectedScheme && (
                <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedScheme(null) }}>
                    <section className="detail-dialog" role="dialog" aria-modal="true" aria-labelledby="scheme-dialog-title">
                        <button className="dialog-close" type="button" onClick={() => setSelectedScheme(null)} aria-label="Close scheme details"><Icon name="close" /></button>
                        <p className="eyebrow">{selectedScheme.category} · Scheme overview</p>
                        <h2 id="scheme-dialog-title">{selectedScheme.name}</h2>
                        <p className="dialog-lead">{selectedScheme.description}</p>
                        <div className="dialog-note"><Icon name="shield" size={19} /><p>Eligibility and documents depend on official criteria. This prototype does not make a final eligibility decision.</p></div>
                        <div className="dialog-actions">
                            <a className="button button-primary" href={selectedScheme.source} target="_blank" rel="noreferrer">Visit official source <Icon name="arrow" size={16} /></a>
                            <button className="button button-secondary" type="button" onClick={() => { setSelectedScheme(null); setShowProfile(true) }}>Check my profile</button>
                        </div>
                    </section>
                </div>
            )}

            {showProfile && (
                <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowProfile(false) }}>
                    <section className="detail-dialog profile-dialog" role="dialog" aria-modal="true" aria-labelledby="profile-dialog-title">
                        <button className="dialog-close" type="button" onClick={() => setShowProfile(false)} aria-label="Close profile form"><Icon name="close" /></button>
                        <p className="eyebrow">A more relevant starting point</p>
                        <h2 id="profile-dialog-title">Build your profile.</h2>
                        <p className="dialog-lead">Share only what you are comfortable sharing. These details stay in this demo session.</p>
                        <form className="profile-form" onSubmit={(event) => { event.preventDefault(); setProfileSaved(true); setShowProfile(false) }}>
                            <label>State or union territory<input value={profile.state} onChange={(event) => setProfile({ ...profile, state: event.target.value })} placeholder="e.g. Maharashtra" required /></label>
                            <label>Age group<select value={profile.age} onChange={(event) => setProfile({ ...profile, age: event.target.value })} required><option value="" disabled>Select an age group</option><option>Under 18</option><option>18–29</option><option>30–59</option><option>60 or above</option></select></label>
                            <label>What best describes you?<select value={profile.occupation} onChange={(event) => setProfile({ ...profile, occupation: event.target.value })} required><option value="" disabled>Select one</option><option>Student</option><option>Farmer</option><option>Self-employed</option><option>Employed</option><option>Looking for work</option><option>Other</option></select></label>
                            <div className="privacy-note"><Icon name="shield" size={17} /><span>Demo only: details are kept in page memory and are not sent to a server.</span></div>
                            <button className="button button-primary form-submit" type="submit">Save profile <Icon name="arrow" size={16} /></button>
                        </form>
                    </section>
                </div>
            )}

            {showAssistant && (
                <div className="assistant-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowAssistant(false) }}>
                    <section className="assistant-panel" role="dialog" aria-modal="true" aria-labelledby="assistant-title">
                        <header className="assistant-panel-header"><div><span className="assistant-avatar"><Icon name="message" size={19} /></span><div><h2 id="assistant-title">SevaConnect AI</h2><p>Scheme information, made clearer</p></div></div><button className="dialog-close" type="button" onClick={() => setShowAssistant(false)} aria-label="Close assistant"><Icon name="close" /></button></header>
                        <div className="assistant-thread">
                            <div className="assistant-welcome"><p className="eyebrow">Hello</p><h3>What would you like to understand?</h3><p>Ask about scheme details, documents, or where to apply. I can help explain, not make official eligibility decisions.</p></div>
                            {conversation.map((item, index) => <div className="conversation-turn" key={`${item.question}-${index}`}><p className="conversation-question">{item.question}</p><p className="conversation-answer">{item.answer}</p></div>)}
                        </div>
                        <form className="assistant-compose" onSubmit={sendMessage}><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask a question..." aria-label="Ask a question" /><button className="button button-primary" type="submit" aria-label="Send message"><Icon name="arrow" size={18} /></button></form>
                        <p className="assistant-disclaimer">For guidance only. Check every detail with the official source.</p>
                    </section>
                </div>
            )}
        </div>
    )
}

export default App
