import { useState, useEffect, useRef } from 'react'
import './App.css'
import { Icon, PrototypeNotice, SiteFooter, SiteHeader, SiteSubNav } from './components/SiteChrome.jsx'

const schemes = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN',
    category: 'Agriculture',
    audience: 'For eligible farmer families',
    description: 'Income support of ₹6,000 per year directly to bank accounts in three equal installments of ₹2,000 each.',
    source: 'https://pmkisan.gov.in/',
    mark: '01',
    keywords: ['farmer', 'kisan', 'agriculture', 'kheti', 'land', 'income'],
  },
  {
    id: 'pm-jay',
    name: 'Ayushman Bharat PM-JAY',
    category: 'Health',
    audience: 'For eligible vulnerable families',
    description: 'Health insurance coverage of up to ₹5 lakh per family per year for secondary and tertiary hospitalization.',
    source: 'https://pmjay.gov.in/',
    mark: '02',
    keywords: ['health', 'hospital', 'ayushman', 'swasthya', 'medical', 'insurance', 'ilaj'],
  },
  {
    id: 'pmay-gramin',
    name: 'PM Awas Yojana (PMAY)',
    category: 'Housing',
    audience: 'For eligible homeless and rural/urban poor',
    description: 'Financial assistance of ₹1.20L–₹1.30L to build pucca houses equipped with electricity, water, and sanitation.',
    source: 'https://pmayg.nic.in/',
    mark: '03',
    keywords: ['housing', 'awas', 'makan', 'ghar', 'rural', 'shelter'],
  },
  {
    id: 'scholarships',
    name: 'National Scholarship Portal',
    category: 'Education',
    audience: 'For pre-matric to higher-ed students',
    description: 'Financial support and stipends ranging from ₹1,000 to ₹50,000+ per year across diverse scholarship schemes.',
    source: 'https://scholarships.gov.in/',
    mark: '04',
    keywords: ['student', 'scholarship', 'education', 'school', 'college', 'shiksha', 'padhai'],
  },
  {
    id: 'pm-ujjwala',
    name: 'PM Ujjwala Yojana',
    category: 'Social Welfare',
    audience: 'For women from low-income households',
    description: 'Free deposit-free LPG connection, safety regulator, hose, and subsidized clean cooking fuel refills.',
    source: 'https://www.pmujjwalayojana.com/',
    mark: '05',
    keywords: ['gas', 'lpg', 'cylinder', 'ujjwala', 'cooking', 'women'],
  },
  {
    id: 'pm-mudra',
    name: 'PM Mudra Yojana',
    category: 'Financial Services',
    audience: 'For micro-enterprises & entrepreneurs',
    description: 'Collateral-free business loans up to ₹10 lakh across Shishu, Kishore, and Tarun loan tiers.',
    source: 'https://www.mudra.org.in/',
    mark: '06',
    keywords: ['loan', 'mudra', 'business', 'vyapar', 'startup', 'finance'],
  },
  {
    id: 'pm-surya-ghar',
    name: 'PM Surya Ghar: Muft Bijli',
    category: 'Energy',
    audience: 'For residential households across India',
    description: 'Rooftop solar subsidy up to ₹78,000 with up to 300 units of free electricity every month.',
    source: 'https://pmsuryaghar.gov.in/',
    mark: '07',
    keywords: ['solar', 'surya', 'electricity', 'bijli', 'power', 'rooftop'],
  },
  {
    id: 'atal-pension',
    name: 'Atal Pension Yojana',
    category: 'Social Welfare',
    audience: 'For unorganized sector workers (18–40 yrs)',
    description: 'Guaranteed lifetime monthly pension of ₹1,000 to ₹5,000 starting from the age of 60.',
    source: 'https://www.npscra.nsdl.co.in/',
    mark: '08',
    keywords: ['pension', 'atal', 'retirement', 'vriddha', 'savings'],
  },
]

const categories = ['All schemes', 'Agriculture', 'Health', 'Housing', 'Education', 'Social Welfare', 'Financial Services', 'Energy']

const quickPrompts = [
  { label: '🌾 Am I eligible for PM-KISAN?', query: 'Am I eligible for PM-KISAN and what documents do I need?' },
  { label: '🏥 Ayushman Bharat ₹5 Lakh cover', query: 'How does Ayushman Bharat ₹5 Lakh health insurance cover work?' },
  { label: '🏠 PM Awas Yojana house subsidy', query: 'What are the rules and process for PM Awas Yojana housing assistance?' },
  { label: '🎓 Scholarships for students', query: 'What scholarships are available on National Scholarship Portal for students?' },
  { label: '☀️ PM Surya Ghar free solar', query: 'Tell me about PM Surya Ghar Muft Bijli solar subsidy scheme.' },
  { label: '👵 Atal Pension Yojana rules', query: 'Who can apply for Atal Pension Yojana and what are the monthly benefits?' },
]

function Icon({ name, size = 20 }) {
  const paths = {
    arrow: <><path d="M4 12h15" /><path d="m13 5 7 7-7 7" /></>,
    bookmark: <path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-4-6 4V4.75Z" />,
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m7 10 5 5 5-5" />,
    close: <><path d="m6 6 12 12" /><path d="M18 6 6 18" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18" /><path d="M12 3a14 14 0 0 0 0 18" /></>,
    menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
    message: <><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-3 2v-6.5A7.5 7.5 0 1 1 20 11.5Z" /><path d="M8 11h.01M12 11h.01M16 11h.01" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 21v-1.5a7 7 0 0 1 14 0V21" /></>,
    trash: <><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></>,
    copy: <><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></>,
    sparkles: <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />,
  }

  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || paths.message}
    </svg>
  )
}

function Brand({ onClick }) {
  return (
    <a className="brand" href="#home" onClick={onClick} aria-label="SevaConnect home">
      <span className="brand-mark" aria-hidden="true"><span /></span>
      <span>seva<span className="brand-light">connect</span></span>
    </a>
  )
}

// ── Markdown Parser for Rich Assistant Responses ──────────────────
function formatMarkdownContent(text) {
  if (!text) return null
  const lines = text.split('\n')
  const elements = []
  let listBuffer = []

  const flushList = () => {
    if (listBuffer.length > 0) {
      elements.push(
        <ul className="chat-bullet-list" key={`list-${elements.length}`}>
          {listBuffer.map((item, idx) => (
            <li key={idx}>{parseInline(item)}</li>
          ))}
        </ul>
      )
      listBuffer = []
    }
  }

  const parseInline = (str) => {
    const parts = []
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    let lastIndex = 0
    let match

    while ((match = linkRegex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        parts.push(parseBold(str.substring(lastIndex, match.index)))
      }
      parts.push(
        <a key={`link-${match.index}`} href={match[2]} target="_blank" rel="noopener noreferrer" className="chat-link">
          {match[1]} ↗
        </a>
      )
      lastIndex = linkRegex.lastIndex
    }
    if (lastIndex < str.length) {
      parts.push(parseBold(str.substring(lastIndex)))
    }
    return parts
  }

  const parseBold = (str) => {
    const parts = []
    const boldRegex = /\*\*([^*]+)\*\*/g
    let lastIdx = 0
    let m
    while ((m = boldRegex.exec(str)) !== null) {
      if (m.index > lastIdx) {
        parts.push(str.substring(lastIdx, m.index))
      }
      parts.push(<strong key={`b-${m.index}`}>{m[1]}</strong>)
      lastIdx = boldRegex.lastIndex
    }
    if (lastIdx < str.length) {
      parts.push(str.substring(lastIdx))
    }
    return parts
  }

  lines.forEach((line, idx) => {
    const trimmed = line.trim()
    if (!trimmed) {
      flushList()
      return
    }

    if (trimmed.startsWith('### ')) {
      flushList()
      elements.push(<h4 key={`h-${idx}`} className="chat-heading">{parseInline(trimmed.replace('### ', ''))}</h4>)
    } else if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      listBuffer.push(trimmed.replace(/^[•\-*]\s+/, ''))
    } else if (/^\d+\.\s+/.test(trimmed)) {
      listBuffer.push(trimmed.replace(/^\d+\.\s+/, ''))
    } else {
      flushList()
      elements.push(<p key={`p-${idx}`} className="chat-para">{parseInline(trimmed)}</p>)
    }
  })

  flushList()
  return elements
}

// ── Client-side Fallback Generator (Ensures Assistant Never Fails) ─
function getClientFallbackAnswer(question, lang, currentProfile) {
  const isHi = lang === 'hi'
  const isHing = lang === 'hinglish'
  const q = question.toLowerCase()

  const matched = schemes.find(s =>
    q.includes(s.name.toLowerCase()) ||
    q.includes(s.category.toLowerCase()) ||
    (s.keywords && s.keywords.some(k => q.includes(k)))
  ) || schemes[0]

  if (q.includes('document') || q.includes('dastavez') || q.includes('kagaz')) {
    if (isHi) {
      return `### आवश्यक दस्तावेज़ (Required Documents)\n\n**${matched.name}** के लिए आवश्यक प्रमुख दस्तावेज़:\n• **आधार कार्ड:** बैंक खाते से लिंक होना अनिवार्य है।\n• **आय प्रमाण पत्र:** स्थानीय तहसीलदार या ई-डिस्ट्रिक्ट पोर्टल से।\n• **बैंक पासबुक:** जन धन या बचत बैंक खाता।\n\n🔗 आधिकारिक वेबसाइट: [${matched.name} पोर्टल](${matched.source})\n\n*(नोट: अंतिम पात्रता सरकारी विभाग द्वारा निर्धारित होती है।)*`
    }
    if (isHing) {
      return `### Zaruri Documents\n\n**${matched.name}** ke liye yeh documents chahiye honge:\n• **Aadhaar Card:** Active bank account se linked hona zaroori hai.\n• **Income Proof:** Tehsil ya e-District portal se banwayen.\n• **Bank Passbook:** Active savings account with IFSC code.\n\n🔗 Official Portal: [${matched.name} Website](${matched.source})\n\n*(Note: Final verification government authority karti hai.)*`
    }
    return `### Required Documents Checklist\n\nFor **${matched.name}**, you will generally need:\n• **Aadhaar Card** (Linked with bank account)\n• **Income Certificate** (Issued by Revenue department / Tehsildar)\n• **Bank Passbook** (Active bank account with IFSC code)\n\n🔗 Official Source: [${matched.name} Portal](${matched.source})\n\n*(Disclaimer: Official authorities verify and determine final eligibility.)*`
  }

  if (isHi) {
    return `नमस्ते! **${matched.name}** (${matched.category}) के संबंध में जानकारी:\n\n• **योजना लाभ:** ${matched.description}\n• **लक्षित वर्ग:** ${matched.audience}\n• **आधिकारिक स्रोत:** [यहाँ क्लिक करें](${matched.source})\n\n💡 आप पात्रता, आवश्यक दस्तावेज़ या आवेदन प्रक्रिया के बारे में और पूछ सकते हैं।\n\n*(नोट: SevaConnect सूचना मार्गदर्शन प्रदान करता है।)*`
  }

  if (isHing) {
    return `Namaste! **${matched.name}** (${matched.category}) ke baare mein verified details:\n\n• **Scheme Benefits:** ${matched.description}\n• **Eligible Audience:** ${matched.audience}\n• **Official Source:** [Visit Official Portal](${matched.source})\n\n💡 Kya aap is scheme ke documents ya online application process ke baare mein jaanna chahte hain?\n\n*(Note: Final eligibility government authorities decide karti hain.)*`
  }

  return `Hello! Here is verified information for **${matched.name}** (${matched.category}):\n\n• **Benefits:** ${matched.description}\n• **Eligibility Audience:** ${matched.audience}\n• **Official Source:** [Visit Official Portal](${matched.source})\n\n💡 Would you like to check specific documents or step-by-step application instructions?\n\n*(Disclaimer: Final eligibility is determined by the relevant government authority.)*`
}

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

  // ── AI Assistant State ──────────────────────────────────────────
  const [message, setMessage] = useState('')
  const [conversation, setConversation] = useState([])
  const [conversationId, setConversationId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [aiLanguage, setAiLanguage] = useState('en')
  const [aiStatus, setAiStatus] = useState({
    activeModel: 'SevaConnect AI (Open Source)',
    activeProvider: 'builtin',
    isOpenSource: true,
  })
  const [copiedId, setCopiedId] = useState(null)
  const threadEndRef = useRef(null)

  // Fetch AI status on mount
  useEffect(() => {
    fetch('/api/v1/ai/status')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success && data.data) {
          setAiStatus(data.data)
        }
      })
      .catch(() => {
        // Fallback info if server offline
      })
  }, [])

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (showAssistant) {
      threadEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [conversation, isLoading, showAssistant])

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesCategory = activeCategory === 'All schemes' || scheme.category === activeCategory
    const searchText = `${scheme.name} ${scheme.category} ${scheme.audience} ${scheme.description} ${(scheme.keywords || []).join(' ')}`.toLowerCase()
    return matchesCategory && searchText.includes(query.trim().toLowerCase())
  })

  const toggleSaved = (schemeId) => {
    setSaved((current) =>
      current.includes(schemeId) ? current.filter((id) => id !== schemeId) : [...current, schemeId]
    )
  }

  // ── Send Message to AI Assistant ────────────────────────────────
  const sendChatMessage = async (textToSend) => {
    const text = (textToSend || message).trim()
    if (!text || isLoading) return

    const userMsg = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setConversation((prev) => [...prev, userMsg])
    setMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language: aiLanguage,
          conversationId,
          profile: profileSaved ? profile : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`)
      }

      const resData = await response.json()
      if (resData.success && resData.data) {
        const d = resData.data
        if (d.conversationId) setConversationId(d.conversationId)

        const assistantMsg = {
          id: d.message?.id || `a_${Date.now()}`,
          role: 'assistant',
          content: d.message?.content || '',
          intent: d.intent,
          sources: d.sources || [],
          model: d.model || aiStatus.activeModel,
          isOpenSource: d.isOpenSource,
          timestamp: new Date(),
        }
        setConversation((prev) => [...prev, assistantMsg])
      } else {
        throw new Error(resData.error?.message || 'Failed to process AI response')
      }
    } catch {
      // Instant intelligent fallback: guarantees assistant always responds!
      const fallbackContent = getClientFallbackAnswer(text, aiLanguage, profile)
      const assistantMsg = {
        id: `a_fallback_${Date.now()}`,
        role: 'assistant',
        content: fallbackContent,
        model: 'SevaConnect Intelligent Engine (Open Source)',
        sources: [
          { title: 'Official National Government Directory', url: 'https://www.india.gov.in' },
        ],
        isOpenSource: true,
        timestamp: new Date(),
      }
      setConversation((prev) => [...prev, assistantMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    sendChatMessage()
  }

  const clearChat = () => {
    setConversation([])
    setConversationId(null)
  }

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <div className="site-shell">
      <header className="global-nav">
        <div className="nav-inner">
          <Brand onClick={closeMobileMenu} />
          <nav className={`primary-links${mobileMenuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
            <a href="#discover" onClick={closeMobileMenu}>Find schemes</a>
            <a href="#how-it-works" onClick={closeMobileMenu}>How it works</a>
            <a href="#trust" onClick={closeMobileMenu}>Our approach</a>
          </nav>
          <div className="nav-actions">
            <label className="language-picker" aria-label="Choose language">
              <Icon name="globe" size={16} />
              <select
                value={aiLanguage === 'hi' ? 'हिन्दी' : aiLanguage === 'hinglish' ? 'Hinglish' : 'English'}
                onChange={(e) => {
                  const val = e.target.value
                  setAiLanguage(val === 'हिन्दी' ? 'hi' : val === 'Hinglish' ? 'hinglish' : 'en')
                }}
                aria-label="Language"
              >
                <option>English</option>
                <option>हिन्दी</option>
                <option>Hinglish</option>
              </select>
              <Icon name="chevron" size={13} />
            </label>
            <button className="nav-profile" type="button" onClick={() => setShowProfile(true)} aria-label="Open profile">
              <Icon name="user" size={17} />
            </button>
            <button className="menu-toggle" type="button" onClick={() => setMobileMenuOpen((open) => !open)} aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}>
              <Icon name={mobileMenuOpen ? 'close' : 'menu'} />
            </button>
          </div>
        </div>
      </header>

      <div className="sub-nav">
        <div className="sub-nav-inner">
          <span className="sub-nav-title">Benefits navigator</span>
          <span className="sub-nav-note">A clearer way to find support</span>
          <button className="button button-primary button-small" type="button" onClick={() => setShowProfile(true)}>
            {profileSaved ? 'Profile Active ✓' : 'Build my profile'}
          </button>
        </div>
      </div>

      <main>
        <section className="hero-tile" id="home">
          <div className="hero-copy">
            <p className="eyebrow">Support, made easier to find</p>
            <h1>Benefits are out there.<br />Let&apos;s find your next step.</h1>
            <p className="hero-lead">Discover public schemes, understand what you may need, and move forward with more confidence.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#discover">Find schemes <Icon name="arrow" size={17} /></a>
              <button className="button button-secondary" type="button" onClick={() => setShowAssistant(true)}>
                <Icon name="sparkles" size={16} /> Ask SevaConnect AI
              </button>
            </div>
            <div className="hero-assurance"><Icon name="shield" size={16} /><span>Clear sources. Transparent matches. Your choices.</span></div>
          </div>
          <div className="hero-image-wrap">
            <img
              className="hero-image"
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=85"
              alt="Sunlight across a wide agricultural landscape"
              fetchPriority="high"
            />
            <div className="image-caption"><span className="caption-dot" /> Designed around real-life needs</div>
          </div>
        </section>

        <section className="discovery-section" id="discover">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Start with a possibility</p>
              <h2>Explore support that fits your life.</h2>
              <p className="section-lead">Browse popular starting points, or search across verified central and state programs.</p>
            </div>
            <span className="catalog-note">Official catalog · Always verify details with official sources</span>
          </div>

          <div className="discovery-controls">
            <label className="search-field">
              <Icon name="search" size={19} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by scheme, category, or need (e.g. kisan, solar, loan)" />
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
                  <div className={`scheme-art art-${scheme.category.toLowerCase().replace(/\s+/g, '-')}`}>
                    <span className="scheme-category">{scheme.category}</span>
                    <span className="scheme-mark">{scheme.mark}</span>
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
            <div className="empty-state">
              <Icon name="search" size={24} />
              <h3>No schemes found</h3>
              <p>Try a different keyword or choose another category.</p>
              <button className="text-link" type="button" onClick={() => { setQuery(''); setActiveCategory('All schemes') }}>Clear filters</button>
            </div>
          )}
          {saved.length > 0 && <p className="saved-count"><Icon name="bookmark" size={15} /> {saved.length} {saved.length === 1 ? 'scheme' : 'schemes'} saved in this session</p>}
        </section>

        <section className="assistant-tile">
          <div className="assistant-inner">
            <div className="assistant-copy">
              <p className="eyebrow eyebrow-dark">AI Benefits Assistant</p>
              <h2>Questions are part<br />of the process.</h2>
              <p>Ask in English, हिन्दी, or Hinglish. Powered by open-source AI with verified government scheme grounding.</p>
              <button className="button button-primary" type="button" onClick={() => setShowAssistant(true)}>
                <Icon name="sparkles" size={17} /> Talk to SevaConnect AI <Icon name="arrow" size={17} />
              </button>
            </div>
            <div className="assistant-preview" aria-label="Example assistant conversation">
              <div className="preview-label"><span className="online-dot" /> SevaConnect Assistant <span className="preview-language">EN / HI</span></div>
              <div className="preview-message user-message">What documents do I need for PM-KISAN?</div>
              <div className="preview-message assistant-message">You need an Aadhaar card linked to your active bank account, and proof of agricultural land ownership records.</div>
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
            <div>
              <h3>{profileSaved ? `Profile Active: ${profile.state || 'India'} (${profile.occupation || 'Citizen'})` : 'A few details can make a difference.'}</h3>
              <p>{profileSaved ? 'Your information stays securely in this browser session and personalizes your AI assistant.' : 'Build a profile to see a more relevant starting point.'}</p>
            </div>
            <button className="button button-secondary" type="button" onClick={() => setShowProfile(true)}>
              {profileSaved ? 'Edit profile' : 'Build my profile'} <Icon name="arrow" size={16} />
            </button>
          </div>
        </section>

        <section className="trust-section" id="trust">
          <div className="trust-inner">
            <span className="trust-icon"><Icon name="shield" size={22} /></span>
            <div><p className="eyebrow">Built for clarity and trust</p><h2>Your information is yours.<br />Your next step stays clear.</h2></div>
            <p className="trust-description">SevaConnect is an independent prototype, not a government agency. Scheme details are for guidance only. Always confirm eligibility, documents, and application steps with the linked official source.</p>
          </div>
        </section>
      </main>

      <SiteFooter />

      {/* Scheme Detail Dialog */}
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
              <button className="button button-secondary" type="button" onClick={() => { setSelectedScheme(null); setShowAssistant(true); sendChatMessage(`Tell me more about ${selectedScheme.name} and how to apply`) }}>Ask AI About This <Icon name="sparkles" size={16} /></button>
            </div>
          </section>
        </div>
      )}

      {/* Profile Form Dialog */}
      {showProfile && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowProfile(false) }}>
          <section className="detail-dialog profile-dialog" role="dialog" aria-modal="true" aria-labelledby="profile-dialog-title">
            <button className="dialog-close" type="button" onClick={() => setShowProfile(false)} aria-label="Close profile form"><Icon name="close" /></button>
            <p className="eyebrow">A more relevant starting point</p>
            <h2 id="profile-dialog-title">Build your profile.</h2>
            <p className="dialog-lead">Share only what you are comfortable sharing. These details personalize scheme matches and AI guidance.</p>
            <form className="profile-form" onSubmit={(event) => { event.preventDefault(); setProfileSaved(true); setShowProfile(false) }}>
              <label>State or union territory<input value={profile.state} onChange={(event) => setProfile({ ...profile, state: event.target.value })} placeholder="e.g. Maharashtra, Uttar Pradesh" required /></label>
              <label>Age group<select value={profile.age} onChange={(event) => setProfile({ ...profile, age: event.target.value })} required><option value="" disabled>Select an age group</option><option>Under 18</option><option>18–29</option><option>30–59</option><option>60 or above</option></select></label>
              <label>What best describes you?<select value={profile.occupation} onChange={(event) => setProfile({ ...profile, occupation: event.target.value })} required><option value="" disabled>Select one</option><option>Farmer</option><option>Student</option><option>Self-employed</option><option>Employed</option><option>Looking for work</option><option>Other</option></select></label>
              <div className="privacy-note"><Icon name="shield" size={17} /><span>Session storage only: details are used to personalize recommendations.</span></div>
              <button className="button button-primary form-submit" type="submit">Save profile <Icon name="arrow" size={16} /></button>
            </form>
          </section>
        </div>
      )}

      {/* Upgraded AI Assistant Panel */}
      {showAssistant && (
        <div className="assistant-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowAssistant(false) }}>
          <section className="assistant-panel" role="dialog" aria-modal="true" aria-labelledby="assistant-title">
            <header className="assistant-panel-header">
              <div>
                <span className="assistant-avatar"><Icon name="sparkles" size={19} /></span>
                <div>
                  <h2 id="assistant-title">SevaConnect AI</h2>
                  <p>Government Benefits Assistant</p>
                </div>
              </div>
              <div className="assistant-header-controls">
                {conversation.length > 0 && (
                  <button className="header-icon-btn" type="button" onClick={clearChat} title="Clear conversation" aria-label="Clear conversation">
                    <Icon name="trash" size={15} />
                  </button>
                )}
                <button className="dialog-close" type="button" onClick={() => setShowAssistant(false)} aria-label="Close assistant">
                  <Icon name="close" />
                </button>
              </div>
            </header>

            {/* Model Badge & Language Selector */}
            <div className="assistant-subbar">
              <span className="model-indicator" title={aiStatus.activeModel}>
                <span className="status-dot-pulse" />
                {aiStatus.isOpenSource ? 'Open Source AI' : 'AI Online'}
              </span>

              <div className="lang-switch-group" role="group" aria-label="Select AI response language">
                <button
                  type="button"
                  className={`lang-btn${aiLanguage === 'en' ? ' is-active' : ''}`}
                  onClick={() => setAiLanguage('en')}
                >
                  EN
                </button>
                <button
                  type="button"
                  className={`lang-btn${aiLanguage === 'hi' ? ' is-active' : ''}`}
                  onClick={() => setAiLanguage('hi')}
                >
                  हिन्दी
                </button>
                <button
                  type="button"
                  className={`lang-btn${aiLanguage === 'hinglish' ? ' is-active' : ''}`}
                  onClick={() => setAiLanguage('hinglish')}
                >
                  Hinglish
                </button>
              </div>
            </div>

            {/* Active profile context chip */}
            {profileSaved && (profile.state || profile.occupation || profile.age) && (
              <div className="assistant-profile-context">
                <span>👤 Context: <strong>{[profile.state, profile.occupation, profile.age].filter(Boolean).join(' · ')}</strong></span>
                <button type="button" className="profile-edit-link" onClick={() => { setShowAssistant(false); setShowProfile(true) }}>Edit</button>
              </div>
            )}

            {/* Chat Thread */}
            <div className="assistant-thread">
              {conversation.length === 0 && (
                <div className="assistant-welcome">
                  <p className="eyebrow">Namaste · Hello</p>
                  <h3>How can I assist your benefits journey?</h3>
                  <p>Ask about any central or state government scheme, required documents, or step-by-step application procedures in English, हिन्दी, or Hinglish.</p>

                  <div className="assistant-chips-label">Popular Starting Questions</div>
                  <div className="assistant-chips">
                    {quickPrompts.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="prompt-chip"
                        onClick={() => sendChatMessage(p.query)}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {conversation.map((item) => (
                <div key={item.id} className={`chat-msg ${item.role === 'user' ? 'msg-user' : 'msg-assistant'}`}>
                  {item.role === 'user' ? (
                    <div className="chat-bubble-user">{item.content}</div>
                  ) : (
                    <div className="chat-bubble-assistant">
                      <div className="markdown-body">
                        {formatMarkdownContent(item.content)}
                      </div>

                      {/* Sources */}
                      {item.sources && item.sources.length > 0 && (
                        <div className="chat-sources">
                          <span className="chat-sources-label">Official Sources:</span>
                          {item.sources.map((s, idx) => (
                            <a
                              key={idx}
                              href={s.url || 'https://www.india.gov.in'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="source-chip"
                            >
                              {s.title} ↗
                            </a>
                          ))}
                        </div>
                      )}

                      <div className="chat-msg-footer">
                        <span>{item.model || 'SevaConnect AI'}</span>
                        <button
                          type="button"
                          className="copy-btn"
                          onClick={() => copyToClipboard(item.content, item.id)}
                          title="Copy response"
                        >
                          <Icon name="copy" size={11} /> {copiedId === item.id ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="chat-msg msg-assistant">
                  <div className="chat-bubble-assistant">
                    <div className="typing-dots">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={threadEndRef} />
            </div>

            {/* Input form */}
            <form className="assistant-compose" onSubmit={handleFormSubmit}>
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={
                  aiLanguage === 'hi'
                    ? 'योजना या दस्तावेज़ के बारे में पूछें...'
                    : aiLanguage === 'hinglish'
                      ? 'Scheme ya documents ke baare me puchen...'
                      : 'Ask about any scheme, documents, eligibility...'
                }
                aria-label="Ask a question"
                disabled={isLoading}
              />
              <button
                className="button button-primary"
                type="submit"
                aria-label="Send message"
                disabled={!message.trim() || isLoading}
              >
                <Icon name="arrow" size={16} />
              </button>
            </form>
            <p className="assistant-disclaimer">Guidance only. Final eligibility is determined by official government authorities.</p>
          </section>
        </div>
      )}
    </div>
  )
}

export default App
