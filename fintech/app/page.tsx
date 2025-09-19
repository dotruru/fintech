'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
// Use the Aurora component you installed
import Aurora from '../components/Aurora';
// Use SplitText in its normal/simple form
import SplitText from '../components/SplitText';

const INSTAGRAM_URL = 'https://www.instagram.com/qmfintechsociety/';
const WHATSAPP_URL = 'https://chat.whatsapp.com/InsX9P4rf3z3Nw6QrbnuoT?mode=ems_copy_t';
const MEMBERSHIP_URL = 'https://www.qmsu.org/groups/19772/';

const NAV_LINKS = [
  { label: 'Instagram', href: INSTAGRAM_URL },
  { label: 'WhatsApp', href: WHATSAPP_URL },
];

const captionSteps = [
  'what is fintech?',
  'well, banks were slow.',
  'paperwork, in-person sessions.',
  'eww.',
  'tech added pretty buttons.',
  'and digital banking.',
  'web2.5 arrived: think revolut—tap, card, split, done.',
  'faster, but',
  'it was same old pipes.',
  'banks still had to process everything.',
  'they were still the king.',
  'and we still had to wait a lot.',
  'enter blockchain.',
  'blockchain = a ledger everyone can check.',
  'bitcoin proves value can move without a middle boss.',
  'smart contracts: code that does the deal.',
  'web3 shows up: money gets its own internet.',
  'tradfi + tech remix: quicker, cheaper, 24/7.',
  'your money: pay, save, invest—one tap, anywhere.',
  'that’s fintech.',
  'welcome to fintech society',
];

const handleAnimationCompleteLog = () => {
  console.log('All letters have animated!');
};

export default function Home() {
  const [step, setStep] = useState(0);
  const [showAbout, setShowAbout] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aboutSectionRef = useRef<HTMLDivElement | null>(null);
  const skipToAboutRef = useRef(false);

  const handleAnimationComplete = useCallback(() => {
    handleAnimationCompleteLog();
    setStep(prev => {
      const next = prev + 1;
      if (next >= captionSteps.length) {
        setShowAbout(true);
        return prev; // keep showing the last caption
      }
      return next;
    });
  }, []);

  const currentText = captionSteps[Math.min(step, captionSteps.length - 1)];
  const isLong = currentText.length > 70;

  const handleSkipIntro = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    skipToAboutRef.current = true;
    setStep(captionSteps.length - 1);
    setShowAbout(true);
  }, []);

  // Fallback: auto-advance by time in case GSAP onComplete doesn't fire
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const lastIndex = captionSteps.length - 1;
    if (step >= lastIndex) {
      setShowAbout(true);
      return;
    }

    const units = isLong
      ? currentText.trim().split(/\s+/).filter(Boolean).length
      : currentText.replace(/\s/g, '').length;
    const delayMs = isLong ? 30 : 100; // matches SplitText delay
    const ms = Math.max(0, units - 1) * delayMs + 600 + 250; // duration + buffer
    timerRef.current = setTimeout(() => {
      setStep(prev => (prev === step ? prev + 1 : prev));
    }, ms);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [step, currentText, isLong]);

  useEffect(() => {
    if (showAbout && skipToAboutRef.current && aboutSectionRef.current) {
      aboutSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      skipToAboutRef.current = false;
    }
  }, [showAbout]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Aurora background */}
      <div className="absolute inset-0">
        <Aurora
          colorStops={["#3A29FF", "#0A0A0A", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      {/* Transparent navbar */}
      <header className="relative z-10 px-6 pt-[max(10px,env(safe-area-inset-top))]">
        <nav className="mx-auto w-full max-w-5xl rounded-3xl border border-white/20 bg-white/10 px-5 py-4 text-xs uppercase tracking-[0.18em] text-white/85 backdrop-blur-2xl sm:rounded-full sm:px-6 sm:py-3 sm:text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold text-white">Fintech Society</span>
            <div className="hidden items-center gap-3 sm:flex">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/25 bg-white/5 px-4 py-2 font-medium text-white transition hover:border-white/40 hover:bg-white/15"
                >
                  {label}
                </Link>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIsNavOpen(open => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white transition hover:border-white/40 hover:bg-white/15 sm:hidden"
              aria-expanded={isNavOpen}
              aria-controls="primary-navigation"
              aria-label="Toggle navigation"
            >
              <span className="flex h-4 w-4 flex-col justify-between">
                <span className="h-[2px] w-full rounded bg-current"></span>
                <span className="h-[2px] w-full rounded bg-current"></span>
                <span className="h-[2px] w-full rounded bg-current"></span>
              </span>
            </button>
          </div>
          <div
            id="primary-navigation"
            className={`${isNavOpen ? 'flex' : 'hidden'} mt-4 flex-col items-stretch gap-2 sm:hidden`}
          >
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsNavOpen(false)}
                className="rounded-full border border-white/25 bg-white/5 px-4 py-2 text-center font-medium text-white transition hover:border-white/40 hover:bg-white/15"
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Main caption that changes through steps */}
      <main className="relative z-10 flex min-h-[70svh] flex-col items-center justify-center gap-10 px-6 text-center sm:min-h-[70vh]">
        <SplitText
          text={currentText}
          className="text-balance text-[clamp(2.4rem,8.5vw,6.2rem)] font-semibold text-center leading-tight"
          delay={isLong ? 30 : 100}
          duration={0.6}
          ease="power3.out"
          splitType={isLong ? "words" : "chars"}
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
          onLetterAnimationComplete={handleAnimationComplete}
          useScrollTrigger={false}
        />

        {!showAbout && (
          <button
            type="button"
            onClick={handleSkipIntro}
            className="rounded-full border border-white/30 bg-white/10 px-6 py-2 text-[0.75rem] font-medium uppercase tracking-[0.2em] text-white transition hover:border-white/50 hover:bg-white/20 sm:text-xs"
          >
            Skip intro
          </button>
        )}

        {showAbout && (
          <section ref={aboutSectionRef} className="mx-auto max-w-4xl text-center">
            <h2 className="text-[clamp(1.4rem,3.6vw,2.25rem)] font-semibold">
              what do we do (fintech society)?
            </h2>
            <p className="mt-4 text-[clamp(0.95rem,2.4vw,1.125rem)] leading-relaxed text-white/90">
              we’re the campus tour guides for money-tech and all things blockchain. we run beginner sessions, meme-fueled explainers, and pre-panel warmups so you don’t sit there googling acronyms. this year we’re poking at how ai and blockchain mess with banking, healthcare, retail, gaming, energy—basically everyone’s business. no jargon. no gatekeeping. dumb questions welcome. smart answers preferred.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href={MEMBERSHIP_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:border-white/50 hover:bg-white/20"
              >
                Buy membership
              </Link>
            </div>
            <div className="mt-12 text-left">
              <h3 className="text-center text-[clamp(1.15rem,3vw,1.75rem)] font-semibold uppercase tracking-[0.14em] text-white">
                upcoming pipeline
              </h3>
              <div className="mt-6 grid gap-5 md:grid-cols-6">
                <article className="col-span-1 rounded-3xl border border-white/15 bg-white/5 p-6 text-white shadow-lg transition hover:border-white/25 hover:bg-white/10 md:col-span-3">
                  <header className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                      Event 01
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-white/80">
                      Social
                    </span>
                  </header>
                  <h4 className="mt-4 text-2xl font-semibold">Kickoff: What even is fintech?</h4>
                  <p className="mt-3 text-sm leading-6 text-white/85">
                    Meet the society, break down the fintech basics, and hear the founder of the biggest blockchain hub share what’s coming in the next 24 months. Bring questions—this is a networking-first hangout.
                  </p>
                </article>
                <article className="col-span-1 rounded-3xl border border-white/15 bg-white/5 p-6 text-white shadow-lg transition hover:border-white/25 hover:bg-white/10 md:col-span-3">
                  <header className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                      Event 02
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-white/80">
                      Lectures
                    </span>
                  </header>
                  <h4 className="mt-4 text-2xl font-semibold">Biweekly Industry Deep-Dives</h4>
                  <p className="mt-3 text-sm leading-6 text-white/85">
                    Fortnightly talks on how AI and blockchain reshape finance, healthcare, retail, gaming, energy, and beyond. Each session spotlights one sector so you can connect the dots without drowning in buzzwords.
                  </p>
                </article>
                <article className="col-span-1 rounded-3xl border border-white/15 bg-white/5 p-6 text-white shadow-lg transition hover:border-white/25 hover:bg-white/10 md:col-span-6">
                  <header className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                      Event 03
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-white/80">
                      Panel
                    </span>
                  </header>
                  <h4 className="mt-4 text-2xl font-semibold">Industry Titan Panel</h4>
                  <p className="mt-3 text-sm leading-6 text-white/85">
                    Executives and analysts from JP Morgan, Goldman Sachs, and other heavyweights unpack how fintech, AI, and crypto rails are changing the deal flow. Expect unfiltered takes and recruiting tips.
                  </p>
                </article>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
