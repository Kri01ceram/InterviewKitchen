import Link from "next/link";

export default function Home() {
  return (
    <main className="page-frame">
      <div className="content-column landing-page">
        <header className="landing-nav">
          <Link className="brand" href="/"><span className="brand-mark">IK</span><span>InterviewKitchen</span></Link>
          <div className="landing-actions"><Link href="/login">Log in</Link><Link className="button button-primary" href="/register">Get started</Link></div>
        </header>
        <section className="landing-hero">
          <div><p className="eyebrow">Practice with intent</p><h1 className="page-title">Turn interview nerves into working knowledge.</h1><p className="landing-copy muted">Build focused interview sessions, practice realistic questions, and learn from clear feedback on every attempt.</p><Link className="button button-primary landing-cta" href="/register">Build your first interview</Link></div>
          <div className="landing-note"><span className="eyebrow">The loop</span><ol><li><strong>01</strong><span>Choose your focus</span></li><li><strong>02</strong><span>Practice under pressure</span></li><li><strong>03</strong><span>Review what to sharpen</span></li></ol></div>
        </section>
        <section className="landing-stats" aria-label="Practice benefits"><div><strong>Technical</strong><span>System design, coding, and fundamentals</span></div><div><strong>Human</strong><span>Behavioral practice with room to reflect</span></div><div><strong>Measurable</strong><span>Scores and evaluator feedback after every run</span></div></section>
      </div>
    </main>
  );
}
