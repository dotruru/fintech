'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
// Use the Aurora component you installed
import Aurora from '../components/Aurora';
// Use SplitText in its normal/simple form
import SplitText from '../components/SplitText';

const INSTAGRAM_URL = 'https://www.instagram.com/qmfintechsociety/';
const WHATSAPP_URL = 'https://chat.whatsapp.com/InsX9P4rf3z3Nw6QrbnuoT?mode=ems_copy_t';

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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        <nav className="mx-auto flex max-w-5xl items-center justify-between rounded-full border border-white/20 bg-white/10 px-5 py-3 text-[0.8rem] uppercase tracking-[0.18em] text-white/85 backdrop-blur-2xl sm:px-6 sm:text-sm">
          <span className="font-semibold text-white">Fintech Society</span>
          <div className="flex items-center gap-3">
            <Link
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/25 bg-white/5 px-4 py-2 font-medium text-white transition hover:border-white/40 hover:bg-white/15"
            >
              Instagram
            </Link>
            <Link
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/25 bg-white/5 px-4 py-2 font-medium text-white transition hover:border-white/40 hover:bg-white/15"
        >
              WhatsApp
            </Link>
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

        {showAbout && (
          <section className="mx-auto max-w-4xl text-center">
            <h2 className="text-[clamp(1.4rem,3.6vw,2.25rem)] font-semibold">
              what do we do (fintech society)?
            </h2>
            <p className="mt-4 text-[clamp(0.95rem,2.4vw,1.125rem)] leading-relaxed text-white/90">
              we’re the campus tour guides for money-tech and all things blockchain. we run beginner sessions, meme-fueled explainers, and pre-panel warmups so you don’t sit there googling acronyms. this year we’re poking at how ai and blockchain mess with banking, healthcare, retail, gaming, energy—basically everyone’s business. no jargon. no gatekeeping. dumb questions welcome. smart answers preferred.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
