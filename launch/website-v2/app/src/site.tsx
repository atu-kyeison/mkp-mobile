import { NavLink, Outlet } from 'react-router-dom';

type CardItem = {
  kicker?: string;
  title: string;
  body: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type TableRow = {
  label: string;
  status: string;
  note: string;
};

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/trust', label: 'Trust' },
  { to: '/compare', label: 'Compare' },
  { to: '/availability', label: 'Availability' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Early Access' },
];

const supportPoints = [
  'Sunday-anchored weekly rhythm',
  'Private-by-default reflection',
  'Prayer and care pathways when members choose to share',
  'Built for churches, not generic app engagement',
];

const continuityCards: CardItem[] = [
  {
    kicker: 'REALITY',
    title: 'The sermon lands.',
    body: 'But by Tuesday many people are already back inside noise, pressure, distraction, and routine.',
  },
  {
    kicker: 'TENSION',
    title: 'Churches want formation, not just attendance.',
    body: 'The challenge is not only gathering people. It is helping the Word stay with them Monday through Saturday.',
  },
  {
    kicker: 'OPPORTUNITY',
    title: 'Continuity should not depend on scattered habits.',
    body: 'My Kingdom Pal is built to create a steadier bridge between what is preached, what is practiced, and when care is needed.',
  },
];

const howItWorksCards: CardItem[] = [
  {
    kicker: 'STEP 1',
    title: 'Start with Sunday teaching',
    body: 'The weekly formation rhythm begins with the message your church is already preaching.',
  },
  {
    kicker: 'STEP 2',
    title: 'Guide members through the week',
    body: 'Gentle daily prompts help members revisit truth, reflect honestly, and take one faithful next step at a time.',
  },
  {
    kicker: 'STEP 3',
    title: 'Keep reflection private by default',
    body: 'Journal entries and mood notes are designed to remain on the member’s device without becoming staff workflow.',
  },
  {
    kicker: 'STEP 4',
    title: 'Support care when members choose to share',
    body: 'Prayer and support requests create a clearer path for church follow-up when someone intentionally reaches out.',
  },
];

const valueCards: CardItem[] = [
  {
    kicker: 'CONVICTION',
    title: 'Church-led, not platform-led',
    body: 'The product is designed to support the local church’s voice, not replace it with a generic content stream.',
  },
  {
    kicker: 'CONVICTION',
    title: 'Non-gamified by design',
    body: 'No streak pressure. No engagement tricks. No performative spirituality.',
  },
  {
    kicker: 'CONVICTION',
    title: 'Private by default',
    body: 'Honest reflection is more likely when members trust that private notes stay private.',
  },
  {
    kicker: 'CONVICTION',
    title: 'Grounded in care',
    body: 'When someone needs prayer or support, the app can help surface that moment for church follow-up.',
  },
];

const expectationCards: CardItem[] = [
  {
    kicker: 'FORMATION',
    title: 'A steadier bridge between sermon and weekday life',
    body: 'Members get a simple weekly flow instead of disconnected inspiration.',
  },
  {
    kicker: 'PRIVACY',
    title: 'A private place for honest reflection',
    body: 'Reflection and mood notes are designed to remain on the device.',
  },
  {
    kicker: 'CARE',
    title: 'A clearer path for prayer and support follow-up',
    body: 'When members choose to share, the church can respond more intentionally.',
  },
];

const compareRows = [
  {
    category: 'Generic devotional apps',
    focus: 'Daily inspiration and reading plans',
    limit: 'Helpful content, but usually disconnected from the church’s weekly teaching rhythm.',
    mkp: 'My Kingdom Pal starts from Sunday teaching and extends it into the week.',
  },
  {
    category: 'Church communication tools',
    focus: 'Announcements, scheduling, and logistics',
    limit: 'Useful for operations, but not designed for a quieter formation rhythm.',
    mkp: 'My Kingdom Pal is centered on discipleship continuity, private reflection, and care connection.',
  },
  {
    category: 'Wellness or habit apps',
    focus: 'Mood, routine, and streak mechanics',
    limit: 'They can create pressure or self-optimization language that does not fit spiritual formation well.',
    mkp: 'My Kingdom Pal is intentionally non-gamified and pastorally restrained.',
  },
  {
    category: 'AI sermon tools',
    focus: 'Drafting or content assistance for staff teams',
    limit: 'They do not necessarily solve the continuity gap for members after Sunday.',
    mkp: 'My Kingdom Pal is framed around church trust and member experience beyond the service.',
  },
];

const availabilityRows: TableRow[] = [
  {
    label: 'Sunday-anchored weekly rhythm',
    status: 'Current positioning',
    note: 'This is the central product story and should lead every church-facing page.',
  },
  {
    label: 'Private reflection on device',
    status: 'Supported now',
    note: 'Journal entries and mood notes are designed to remain on the member’s device.',
  },
  {
    label: 'Prayer and support pathways',
    status: 'Supported carefully',
    note: 'Use conditional language: follow-up happens when members choose to share.',
  },
  {
    label: 'Church dashboards and admin analytics',
    status: 'Do not imply',
    note: 'Not part of the current website positioning and should not appear in launch messaging.',
  },
  {
    label: 'Automation, staff workflow, or management suite claims',
    status: 'Do not imply',
    note: 'The current product story is formation rhythm, privacy, and care connection.',
  },
];

const faqItems: FaqItem[] = [
  {
    question: 'Is My Kingdom Pal built for individual consumers or for churches?',
    answer:
      'The product is being built for churches. Individual member experience matters, but it is framed in service of church-led discipleship and care.',
  },
  {
    question: 'Does the app replace pastoral leadership or church discipleship strategy?',
    answer:
      'No. The goal is to support the church’s existing teaching and care rhythm, not replace leadership, pastoral relationships, or ministry structure.',
  },
  {
    question: 'Are member reflections visible to pastors or church staff?',
    answer:
      'Private reflections and mood notes are designed to remain on the member’s device. Care-related submissions are surfaced only when members choose to share them for church follow-up.',
  },
  {
    question: 'Is this a church management platform?',
    answer:
      'No. My Kingdom Pal is not being positioned as a full church management or communication suite. It is focused on formation rhythm, private reflection, and care connection.',
  },
  {
    question: 'Can our church request early access?',
    answer:
      'Yes. The current site package includes an early-access form placeholder for church leaders who want to stay in touch as launch gets closer.',
  },
];

const trustItems: CardItem[] = [
  {
    kicker: 'PRIVACY',
    title: 'Private reflection stays private by default.',
    body: 'Journal entries and mood notes are designed to remain on the member’s device.',
  },
  {
    kicker: 'CARE',
    title: 'Church follow-up happens when members choose to share.',
    body: 'Prayer and support requests create a path for care connection only when a member intentionally reaches out.',
  },
  {
    kicker: 'PRODUCT POSTURE',
    title: 'No engagement hacks.',
    body: 'The product is intentionally non-gamified and does not try to turn discipleship into visible performance metrics.',
  },
  {
    kicker: 'CHURCH ROLE',
    title: 'The church remains central.',
    body: 'My Kingdom Pal is built to support the church’s teaching and care rhythm, not replace leadership or ministry relationships.',
  },
];

const privacySections = [
  {
    title: 'What stays on the device',
    body: 'Private reflections and mood notes are designed to remain on the member’s device. This website should not imply leader access to those notes.',
  },
  {
    title: 'What can be shared with the church',
    body: 'Prayer and support requests may create a path for follow-up when the member chooses to submit them for church care.',
  },
  {
    title: 'How this site should speak about privacy',
    body: 'Keep claims precise, grounded, and aligned to the current app language. Avoid technical promises the site cannot prove or maintain.',
  },
];

const termsSections = [
  {
    title: 'Service scope',
    body: 'My Kingdom Pal is a spiritual formation and church communication tool. It is not emergency response, therapy, crisis intervention, or a full church management platform.',
  },
  {
    title: 'Respectful use',
    body: 'Users should not use the product to harass, threaten, impersonate others, or submit harmful or unlawful content.',
  },
  {
    title: 'Privacy relationship',
    body: 'Private reflection is designed to stay private. Care requests are shared only when a user chooses to send them for church follow-up.',
  },
];

function Header() {
  return (
    <header className="chrome">
      <div className="page-shell chrome__inner">
        <NavLink className="wordmark" to="/">
          My Kingdom Pal
        </NavLink>
        <nav className="chrome__nav" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
              end={item.end}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-shell site-footer__inner">
        <div>
          <div className="footer-mark">My Kingdom Pal</div>
          <p className="footer-copy">Church-led spiritual formation beyond Sunday.</p>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <NavLink to="/about">About</NavLink>
          <NavLink to="/trust">Trust</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
          <NavLink to="/privacy">Privacy</NavLink>
          <NavLink to="/terms">Terms</NavLink>
          <NavLink to="/contact">Early Access</NavLink>
        </nav>
      </div>
    </footer>
  );
}

function HeroPanel() {
  return (
    <aside className="hero-panel">
      <div className="hero-panel__constellation" />
      <div className="hero-stack">
        <div className="glass-tile">
          <div className="tile-kicker">SUNDAY ANCHOR</div>
          <h3>Start with the message your church already preached.</h3>
          <p>The week begins with Sunday teaching, not a disconnected content feed.</p>
        </div>
        <div className="glass-tile glass-tile--offset">
          <div className="tile-kicker">WEEKDAY FORMATION</div>
          <h3>Guide members with a gentler daily rhythm.</h3>
          <p>Simple prompts help people revisit truth, reflect honestly, and take one faithful next step.</p>
        </div>
        <div className="glass-tile">
          <div className="tile-kicker">CARE CONNECTION</div>
          <h3>Support follow-up when members choose to reach out.</h3>
          <p>Prayer and support requests create a clearer path for care without turning private reflection into surveillance.</p>
        </div>
      </div>
    </aside>
  );
}

function PageHero(props: { eyebrow: string; title: string; lead: string }) {
  return (
    <section className="page-hero">
      <div className="page-shell">
        <div className="eyebrow">{props.eyebrow}</div>
        <h1>{props.title}</h1>
        <p>{props.lead}</p>
      </div>
    </section>
  );
}

function CardGrid(props: { items: CardItem[]; className?: string }) {
  return (
    <div className={props.className ?? 'card-grid'}>
      {props.items.map((item) => (
        <article className="story-card" key={item.title}>
          {item.kicker ? <div className="story-card__kicker">{item.kicker}</div> : null}
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </article>
      ))}
    </div>
  );
}

function FaqList(props: { items: FaqItem[] }) {
  return (
    <div className="faq-list">
      {props.items.map((item) => (
        <article className="faq-card" key={item.question}>
          <h3>{item.question}</h3>
          <p>{item.answer}</p>
        </article>
      ))}
    </div>
  );
}

export function AppLayout() {
  return (
    <div className="site-shell">
      <div className="background-orb background-orb--one" />
      <div className="background-orb background-orb--two" />
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="page-shell hero__grid">
          <div className="hero__copy">
            <div className="eyebrow">FOR CHURCHES</div>
            <h1>Help your church carry Sunday into the rest of the week.</h1>
            <p>
              My Kingdom Pal is a church-led spiritual formation app built to help churches extend Sunday teaching through gentle daily discipleship, private reflection, and care connection.
            </p>
            <div className="hero__actions">
              <NavLink className="button button--primary" to="/contact">
                Request early access
              </NavLink>
              <a className="button button--ghost" href="#how-it-works">
                See how it works
              </a>
            </div>
            <ul className="support-points">
              {supportPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <HeroPanel />
        </div>
      </section>

      <section className="section">
        <div className="page-shell">
          <div className="section-heading">
            <div className="eyebrow">BEYOND SUNDAY</div>
            <h2>The challenge is not Sunday. It’s everything after.</h2>
            <p>
              Many churches preach faithfully, care deeply, and want people to stay rooted in the Word throughout the week. The difficulty is creating a simple rhythm that helps members carry Sunday teaching into ordinary weekday life.
            </p>
          </div>
          <CardGrid items={continuityCards} />
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="page-shell">
          <div className="section-heading">
            <div className="eyebrow">HOW IT WORKS</div>
            <h2>A simple rhythm for formation beyond Sunday</h2>
            <p>The product is designed around church trust, member honesty, and a calmer weekly flow.</p>
          </div>
          <CardGrid items={howItWorksCards} className="card-grid card-grid--four" />
        </div>
      </section>

      <section className="section section--split">
        <div className="page-shell split-layout">
          <div className="section-heading section-heading--compact">
            <div className="eyebrow">WHY IT FEELS DIFFERENT</div>
            <h2>Built with pastoral trust in mind</h2>
            <p>This is not meant to replace pastoral leadership, church relationships, or discipleship strategy. It is built to support them.</p>
          </div>
          <div className="spotlight">
            <h3>A quieter product can still create meaningful continuity for churches.</h3>
            <p>
              No streak pressure. No engagement tricks. No performative spirituality. Just a steadier bridge from sermon to weekday practice, with privacy and care handled carefully.
            </p>
          </div>
        </div>
        <div className="page-shell">
          <CardGrid items={valueCards} />
        </div>
      </section>

      <section className="section">
        <div className="page-shell">
          <div className="section-heading">
            <div className="eyebrow">WHAT CHURCHES CAN EXPECT</div>
            <h2>Support for formation rhythm, private reflection, and care connection</h2>
            <p>My Kingdom Pal is built to support a calmer formation rhythm for members while keeping the church’s teaching and trust central.</p>
          </div>
          <CardGrid items={expectationCards} />
        </div>
      </section>

      <section className="section">
        <div className="page-shell action-banner">
          <div>
            <div className="eyebrow">EARLY ACCESS</div>
            <h2>Interested in bringing My Kingdom Pal to your church?</h2>
            <p>
              We’re getting closer to launch. If you’re a pastor or ministry leader exploring how to support formation beyond Sunday, we’d be glad to stay in touch.
            </p>
          </div>
          <div className="hero__actions">
            <NavLink className="button button--primary" to="/contact">
              Request early access
            </NavLink>
            <NavLink className="button button--ghost" to="/faq">
              Read the FAQ
            </NavLink>
          </div>
        </div>
      </section>
    </main>
  );
}

export function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="ABOUT"
        title="Built to support the church’s voice, not compete with it."
        lead="My Kingdom Pal exists to help churches create more continuity between Sunday teaching, weekday formation, and moments when care is needed."
      />
      <section className="section">
        <div className="page-shell stack">
          <CardGrid
            items={[
              {
                kicker: 'VISION',
                title: 'Help believers live the Word every day, beyond Sunday.',
                body: 'We want churches to have a calmer, more faithful bridge between what is preached and how members walk it out during the week.',
              },
              {
                kicker: 'ORIGIN',
                title: 'The problem is familiar to almost every church.',
                body: 'Sunday can be strong, clear, and spiritually meaningful. The harder question is what happens on Monday, Tuesday, and beyond.',
              },
            ]}
          />
          <CardGrid items={valueCards} className="card-grid card-grid--four" />
          <div className="spotlight">
            <h3>We’re building toward a church-facing launch, not a generic consumer app release.</h3>
            <p>
              The goal is not to replace discipleship strategy or church leadership. The goal is to support the church’s existing rhythm with a more coherent weekly experience.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export function TrustPage() {
  return (
    <main>
      <PageHero
        eyebrow="TRUST"
        title="Built with privacy, restraint, and church trust in mind."
        lead="My Kingdom Pal is designed for spiritual formation and care connection, which means trust cannot be an afterthought."
      />
      <section className="section">
        <div className="page-shell">
          <CardGrid items={trustItems} />
          <div className="spotlight spotlight--wide">
            <h3>This is not a full church management platform.</h3>
            <p>
              The current product positioning is focused on sermon-linked weekly rhythm, private reflection, and care connection. It should not imply admin dashboards, analytics, workflow automation, or real-time access to private member notes.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export function ComparePage() {
  return (
    <main>
      <PageHero
        eyebrow="COMPARE"
        title="Different from devotional apps, church admin tools, and engagement-first products."
        lead="My Kingdom Pal is built around continuity between Sunday teaching, weekday formation, private reflection, and care."
      />
      <section className="section">
        <div className="page-shell">
          <div className="section-heading">
            <div className="eyebrow">POSITIONING</div>
            <h2>What makes the product distinct</h2>
            <p>Churches are the customer, and the member experience is evidence of church value rather than a consumer-only story.</p>
          </div>
          <div className="comparison-table">
            <div className="comparison-row comparison-row--head">
              <div>Category</div>
              <div>What it usually focuses on</div>
              <div>Why that is not enough here</div>
              <div>My Kingdom Pal difference</div>
            </div>
            {compareRows.map((row) => (
              <div className="comparison-row" key={row.category}>
                <div>{row.category}</div>
                <div>{row.focus}</div>
                <div>{row.limit}</div>
                <div>{row.mkp}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export function AvailabilityPage() {
  return (
    <main>
      <PageHero
        eyebrow="AVAILABILITY"
        title="What this website should claim now, later, and not at all."
        lead="This page replaces the old feature-heavy roadmap framing with a launch-safe messaging guide tied to the current product."
      />
      <section className="section">
        <div className="page-shell">
          <div className="availability-table">
            <div className="availability-table__head">
              <div>Message area</div>
              <div>Status</div>
              <div>Notes</div>
            </div>
            {availabilityRows.map((row) => (
              <div className="availability-table__row" key={row.label}>
                <div>{row.label}</div>
                <div><span className="status-pill">{row.status}</span></div>
                <div>{row.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export function WhitepaperPage() {
  return (
    <main>
      <PageHero
        eyebrow="WHITEPAPER"
        title="The church problem we’re solving is continuity."
        lead="This is a simplified thought-piece page replacing the older AI-heavy whitepaper story with a church-facing launch narrative."
      />
      <section className="section">
        <div className="page-shell article-flow">
          <section className="article-card">
            <h2>Executive summary</h2>
            <p>
              My Kingdom Pal is being built to help churches create more continuity between Sunday teaching, weekday formation, private reflection, and care connection. The goal is not just content access. It is a calmer formation rhythm.
            </p>
          </section>
          <section className="article-card">
            <h2>The problem</h2>
            <p>
              Churches already preach, teach, pray, and care well. What is often missing is a simple structure that helps members carry Sunday into ordinary weekday life without turning spirituality into performance or pressure.
            </p>
          </section>
          <section className="article-card">
            <h2>Product convictions</h2>
            <p>
              The product is church-led, private by default, and intentionally non-gamified. Reflection and mood notes are designed to stay on the device. Prayer and support requests create a path for care only when the member chooses to share.
            </p>
          </section>
          <section className="article-card">
            <h2>Why the website needed to change</h2>
            <p>
              Older positioning overemphasized AI, structuring frameworks, dashboards, and roadmap claims. The current site should lead with church value, not internal mechanics or speculative features.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}

export function FaqPage() {
  return (
    <main>
      <PageHero
        eyebrow="FAQ"
        title="Answers for pastors and ministry leaders."
        lead="The product is being positioned for churches first, so the questions here focus on formation rhythm, privacy, and care."
      />
      <section className="section">
        <div className="page-shell">
          <FaqList items={faqItems} />
        </div>
      </section>
    </main>
  );
}

export function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="EARLY ACCESS"
        title="Interested in bringing My Kingdom Pal to your church?"
        lead="We’re getting closer to launch. If you’re a pastor or ministry leader exploring how to support formation beyond Sunday, we’d be glad to stay in touch."
      />
      <section className="section">
        <div className="page-shell contact-layout">
          <div className="contact-column">
            <article className="story-card">
              <div className="story-card__kicker">WHO THIS IS FOR</div>
              <h3>Church leaders evaluating weekday formation support</h3>
              <p>Use this form if you’re exploring how your church can create more continuity between Sunday teaching, private reflection, and care connection.</p>
            </article>
            <article className="story-card">
              <div className="story-card__kicker">WHAT TO EXPECT</div>
              <h3>We’ll follow up as launch gets closer.</h3>
              <p>This is an interest form, not a promise of immediate onboarding. Launch timing and next steps can stay flexible.</p>
            </article>
          </div>
          <form
            action="https://formspree.io/f/xrbogwbd"
            className="contact-form"
            method="POST"
          >
            <input name="_subject" type="hidden" value="MKP Church Early Access Request" />
            <input name="_redirect" type="hidden" value="/thank-you" />
            <div className="field-pair">
              <label>
                <span>Name</span>
                <input name="name" placeholder="Your full name" required />
              </label>
              <label>
                <span>Email</span>
                <input name="email" placeholder="you@church.org" required type="email" />
              </label>
            </div>
            <div className="field-pair">
              <label>
                <span>Church</span>
                <input name="church" placeholder="Church name" required />
              </label>
              <label>
                <span>Role</span>
                <select name="role">
                  <option>Pastor</option>
                  <option>Executive Pastor</option>
                  <option>Ministry Leader</option>
                  <option>Church Staff</option>
                  <option>Other</option>
                </select>
              </label>
            </div>
            <label>
              <span>What are you exploring for your church?</span>
              <textarea
                name="notes"
                placeholder="Tell us a bit about your ministry context, discipleship goals, or current challenge."
              />
            </label>
            <div className="hero__actions">
              <button className="button button--primary" type="submit">
                Request early access
              </button>
              <a className="button button--ghost" href="mailto:hello@mykingdompal.com">
                Email instead
              </a>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export function PrivacyPage() {
  return (
    <main>
      <PageHero
        eyebrow="PRIVACY"
        title="Plain-language privacy guidance aligned to the current product."
        lead="This page is written to match the current local-first reflection and care-request posture in the app rather than the older marketing claims."
      />
      <section className="section">
        <div className="page-shell">
          <CardGrid items={privacySections.map((item) => ({ kicker: 'PRIVACY', title: item.title, body: item.body }))} />
        </div>
      </section>
    </main>
  );
}

export function TermsPage() {
  return (
    <main>
      <PageHero
        eyebrow="TERMS"
        title="Plain-language terms for churches and members."
        lead="This page provides lightweight, launch-safe terms copy until formal legal copy replaces it."
      />
      <section className="section">
        <div className="page-shell">
          <CardGrid items={termsSections.map((item) => ({ kicker: 'TERMS', title: item.title, body: item.body }))} />
        </div>
      </section>
    </main>
  );
}

export function ThankYouPage() {
  return (
    <main>
      <section className="section section--centered">
        <div className="page-shell">
          <div className="thank-you-card">
            <div className="eyebrow">THANK YOU</div>
            <h1>Your church interest has been received.</h1>
            <p>We’ll follow up as launch gets closer. In the meantime, you can review the current product positioning for churches.</p>
            <div className="hero__actions">
              <NavLink className="button button--primary" to="/">
                Back to home
              </NavLink>
              <NavLink className="button button--ghost" to="/faq">
                Read the FAQ
              </NavLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export function NotFoundPage() {
  return (
    <main>
      <section className="section section--centered">
        <div className="page-shell">
          <div className="thank-you-card">
            <div className="eyebrow">404</div>
            <h1>This page isn’t part of the new site yet.</h1>
            <p>Return to the church-facing launch pages or review the updated early-access and trust content.</p>
            <div className="hero__actions">
              <NavLink className="button button--primary" to="/">
                Go home
              </NavLink>
              <NavLink className="button button--ghost" to="/contact">
                Request early access
              </NavLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
