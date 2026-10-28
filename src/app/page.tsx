import { Navigation } from '@/components/navigation';
import { Brand } from '@/components/brand';
import { Workflow } from '@/components/workflow';
import { ContactForm } from '@/components/contact-form';
import { BRAND, SERVICES, getPublicContact } from '@/lib/config';
import { FAQS, PROCESS, PROJECTS } from '@/lib/content';
export const dynamic = 'force-dynamic';
export default function Home() {
  const contact = getPublicContact();
  return (
    <>
      <Navigation />
      <main id="main">
        <section className="hero">
          <div className="container hero-content">
            <span className="eyebrow-pill">
              <span className="tiny-dot" /> A little less friction. A lot more
              possibility.
            </span>
            <h1>
              Less busywork.
              <br />
              <span>More room to grow.</span>
            </h1>
            <p className="hero-copy">
              Custom websites, practical AI automation, and connected tools.
              <br className="desktop-break" /> Built around the way your
              business works.
            </p>
            <div className="hero-actions">
              <a href="#contact" className="button">
                Let’s talk about your project <span aria-hidden="true">↗</span>
              </a>
              <a href="#services" className="button button-secondary">
                Explore services <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="hero-note">Thoughtful systems. Practical outcomes.</p>
          </div>
          <div className="hero-bottom container">
            <span>INDEPENDENT THINKING. CONNECTED SOLUTIONS.</span>
            <a href="#services" aria-label="Scroll to services">
              SCROLL TO EXPLORE <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>
        <section id="services" className="section container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / WHAT WE DO</p>
              <h2>
                Good for your business.
                <br />
                <span>Better for your day.</span>
              </h2>
            </div>
            <p>
              From the first impression to the work behind the scenes. We make
              the pieces work together.
            </p>
          </div>
          <div className="services-grid">
            {SERVICES.map((service) => (
              <article className="service-card" key={service.id}>
                <div className="service-top">
                  <span className="micro">/{service.number}</span>
                  <span className="service-symbol" aria-hidden="true">
                    {service.id === 'websites'
                      ? '↗'
                      : service.id === 'automation'
                        ? '✳'
                        : '⌘'}
                  </span>
                </div>
                <h3>{service.title}</h3>
                <p className="service-tagline">{service.description}</p>
                <p>{service.detail}</p>
                <ul className="tags">
                  {service.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <a className="text-link" href="#contact">
                  Let’s explore it <span aria-hidden="true">↗</span>
                  <span className="sr-only">: {service.title}</span>
                </a>
              </article>
            ))}
          </div>
        </section>
        <section className="connection-section">
          <div className="container">
            <p className="eyebrow">LESS COPY. LESS PASTE. MORE FLOW.</p>
            <h2>
              The space between your tools?
              <br />
              <span>That’s where we come in.</span>
            </h2>
            <p className="section-intro">
              A website should be the start of a useful conversation.
              <br className="desktop-break" /> We help connect what happens
              next.
            </p>
            <Workflow />
            <p className="diagram-caption">
              AN ILLUSTRATIVE WORKFLOW · BUILT AROUND YOUR TOOLS AND APPROVALS
            </p>
          </div>
        </section>
        <section id="work" className="section container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 / SELECTED EXPLORATIONS</p>
              <h2>
                A few possibilities.
                <br />
                <span>A clearer picture.</span>
              </h2>
            </div>
            <p>
              Concept demonstrations of what we can build. These are
              illustrative projects, not client work.
            </p>
          </div>
          <div className="projects-grid">
            {PROJECTS.map((project, index) => (
              <article
                className={`project project-${project.type}`}
                key={project.type}
              >
                <div className="project-visual" aria-hidden="true">
                  <div className="preview-bar">
                    <span>● ● ●</span>
                    <span>
                      {project.type === 'website'
                        ? 'FORM / STUDIO'
                        : project.type === 'automation'
                          ? 'ENQUIRY WORKFLOW'
                          : 'CONNECTED WORKSPACE'}
                    </span>
                    <span>↗</span>
                  </div>
                  {project.type === 'website' ? (
                    <div className="website-preview">
                      <span>FORM — ARCHITECTURE & INTERIORS</span>
                      <h4>
                        Space for
                        <br />a better
                        <br />
                        <em>everyday.</em>
                      </h4>
                      <div className="architecture">
                        <div />
                        <div />
                        <div />
                      </div>
                      <span className="preview-bottom">
                        THOUGHTFULLY DESIGNED. SIMPLY LIVED.
                      </span>
                    </div>
                  ) : project.type === 'automation' ? (
                    <div className="automation-preview">
                      <div>
                        ↙{' '}
                        <span>
                          New enquiry<small>FORM RECEIVED</small>
                        </span>
                        <i>✓</i>
                      </div>
                      <b>↓</b>
                      <div>
                        ✳{' '}
                        <span>
                          Organise & draft<small>READY FOR REVIEW</small>
                        </span>
                        <i>✓</i>
                      </div>
                      <b>↓</b>
                      <div>
                        ◎{' '}
                        <span>
                          Send to CRM<small>KEEP THE TEAM IN SYNC</small>
                        </span>
                        <i>✓</i>
                      </div>
                    </div>
                  ) : (
                    <div className="integration-preview">
                      <div className="integration-hub">
                        F<span>ONE CONNECTED FLOW</span>
                      </div>
                      <div className="integration-tools">
                        <span>↙ Forms</span>
                        <span>＠ Email</span>
                        <span>▦ Sheets</span>
                      </div>
                      <div className="sync-line">
                        <span className="tiny-dot" /> Everything in the right
                        place.
                      </div>
                    </div>
                  )}
                </div>
                <div className="project-meta">
                  <span className="demo-label">CONCEPT DEMONSTRATION</span>
                  <span className="micro">0{index + 1}</span>
                </div>
                <p className="micro project-category">{project.category}</p>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="process" className="section process-section">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">03 / HOW WE WORK</p>
                <h2>
                  Clear steps.
                  <br />
                  <span>No black box.</span>
                </h2>
              </div>
              <p>
                Good work starts with understanding. We keep the process
                collaborative and the next step clear.
              </p>
            </div>
            <div className="process-grid">
              {PROCESS.map((step, index) => (
                <article key={step.title}>
                  <span className="process-number">0{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="faq" className="section container faq-layout">
          <div>
            <p className="eyebrow">04 / A FEW GOOD QUESTIONS</p>
            <h2>
              Before we
              <br />
              <span>get started.</span>
            </h2>
            <p>
              Still curious about something?
              <br />
              <a className="text-link" href="#contact">
                Let’s talk it through ↗
              </a>
            </p>
          </div>
          <div className="faqs">
            {FAQS.map((faq) => (
              <details key={faq.question}>
                <summary>
                  {faq.question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section id="contact" className="section contact-section">
          <div className="container contact-layout">
            <div>
              <p className="eyebrow">05 / YOUR NEXT CHAPTER</p>
              <h2>
                What could
                <br />
                work <span>better?</span>
              </h2>
              <p>
                A new website? A repetitive task? Tools that don’t talk?
                <br />
                Tell us what’s on your mind. We’ll start there.
              </p>
              {contact.email && (
                <a className="contact-email" href={`mailto:${contact.email}`}>
                  {contact.email} ↗
                </a>
              )}
              <div className="contact-note">
                <span className="tiny-dot" /> Remote studio. Real conversations.
                <small>
                  Working with businesses in the US, Canada,
                  <br />
                  the UK, and Australia.
                </small>
              </div>
            </div>
            <ContactForm
              enabled={!!process.env.N8N_WEBHOOK_URL}
              email={contact.email}
            />
          </div>
        </section>
      </main>
      <footer className="container footer">
        <div className="footer-top">
          <Brand />
          <p>Good ideas deserve better systems.</p>
          <div className="footer-links">
            {contact.linkedin && (
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn ↗
              </a>
            )}
            <a href="/privacy">Privacy</a>
            <a href="#main">Back to top ↑</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {BRAND.fullName}
          </span>
          <span>Thoughtfully built. Purposefully connected.</span>
        </div>
      </footer>
      {contact.whatsapp && (
        <a
          className="whatsapp"
          href={contact.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with FlowPilot on WhatsApp"
        >
          Chat on WhatsApp ↗
        </a>
      )}
    </>
  );
}
