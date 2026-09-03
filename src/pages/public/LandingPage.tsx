import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowUpRight, Bot, Building2, CheckCircle2, HeartHandshake, MapPin, Radio, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { NetworkVisual } from '../../components/landing/NetworkVisual';
import { RequesterMotionWidget, NGOMotionWidget } from '../../components/landing/RoleMotionWidgets';

const responseSteps = [
  ['01', 'Locate', 'GPS coordinates are captured quietly, so help knows where to go.', MapPin],
  ['02', 'Broadcast', 'A single held SOS reaches verified NGOs and nearby responders.', Radio],
  ['03', 'Coordinate', 'Once accepted, a private channel opens for the help you need.', HeartHandshake],
  ['04', 'Resolve', 'Track progress until support reaches you and the incident is closed.', CheckCircle2],
] as const;

const caseStudies = [
  { number: '01', eyebrow: 'CITIZEN DISPATCH', title: 'A request that arrives with context.', copy: 'Medical help, blood, medicine, rescue, food, shelter, water, or transport. People can name the need without slowing down the signal.', tone: 'bg-[#e74636]', icon: AlertTriangle, image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=85' },
  { number: '02', eyebrow: 'NGO OPERATIONS', title: 'A clear handoff to people who can act.', copy: 'Relief organizations see their nearby queue, accept the right request, view the requester location, and coordinate in one direct workspace.', tone: 'bg-[#d7e2ea]', icon: Building2, image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=85' },
  { number: '03', eyebrow: 'CRISISAI GUIDANCE', title: 'Useful calm while help is moving.', copy: 'Embedded safety guidance helps with first steps for bleeding, burns, choking, CPR, and other urgent situations while official help is contacted.', tone: 'bg-[#8e9bff]', icon: Bot, image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1200&q=85' },
];

export const LandingPage: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const signalPanelRef = useRef<HTMLDivElement>(null);
  const aboutParagraphRef = useRef<HTMLParagraphElement>(null);
  const [signalPoint, setSignalPoint] = useState({ x: 0, y: 0 });
  const [signalStatus, setSignalStatus] = useState('Signal live');

  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.cc-reveal', { y: 34, opacity: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out' });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const moveSignal = (clientX: number, clientY: number) => {
    const panel = signalPanelRef.current;
    if (!panel) return;
    const bounds = panel.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (clientX - (bounds.left + bounds.width / 2)) / (bounds.width / 2)));
    const y = Math.max(-1, Math.min(1, (clientY - (bounds.top + bounds.height / 2)) / (bounds.height / 2)));
    setSignalPoint({ x, y });
    setSignalStatus(Math.abs(x) > 0.45 ? 'Scanning nearby' : Math.abs(y) > 0.45 ? 'Signal focused' : 'Signal live');
  };

  return (
    <div ref={pageRef} className="cc-editorial overflow-x-clip bg-white text-black">
      <section className="relative flex min-h-[calc(100vh-4rem)] flex-col overflow-hidden bg-white px-5 pt-6 sm:px-10 sm:pt-8">
        <div className="cc-reveal flex items-center justify-between border-b border-black/15 pb-5 text-xs font-medium uppercase tracking-[.2em] sm:text-sm">
          <span>CRISISCONNECT / 01</span><span className="hidden sm:inline">Emergency response, redesigned</span><span>Live network</span>
        </div>
        <div className="relative z-10 mt-auto pb-7 pt-20 sm:pb-10">
          <p className="cc-reveal mb-4 text-xs font-semibold uppercase tracking-[.24em] text-[#f45b52] sm:text-sm">When every second matters</p>
          <div className="overflow-hidden"><h1 className="cc-reveal cc-hero-heading max-w-6xl">Help is<br className="sm:hidden" /> closer.</h1></div>
          <div className="mt-8 flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
            <p className="cc-reveal max-w-[250px] text-sm font-light uppercase leading-snug tracking-wide text-black sm:text-base">A real-time emergency network connecting people who need help with verified organizations ready to respond.</p>
            <Link to="/request-help" className="cc-reveal group inline-flex w-fit items-center gap-3 rounded-full border-2 border-black px-7 py-3 text-xs font-medium uppercase tracking-[.18em] text-black transition hover:bg-black hover:text-white sm:px-10 sm:py-4 sm:text-sm">Send SOS <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></Link>
          </div>
        </div>
        <div ref={signalPanelRef} onMouseMove={(event) => moveSignal(event.clientX, event.clientY)} onTouchMove={(event) => moveSignal(event.touches[0].clientX, event.touches[0].clientY)} className="absolute bottom-[-8%] right-[4%] hidden h-[520px] w-[40vw] max-w-[580px] overflow-hidden lg:block">
          <div className="absolute inset-8 rounded-[42px] border border-black/20 bg-[#FF4D4D] shadow-[0_22px_70px_rgba(255,77,77,.24)]" />
          <div className="cc-radar-ring cc-radar-ring-outer absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/20" />
          <div className="cc-radar-ring cc-radar-ring-inner absolute left-1/2 top-1/2 h-[290px] w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/20" />
          <div className="cc-signal-core absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 border-black bg-white text-center shadow-[0_0_55px_rgba(0,0,0,.18)] transition-transform duration-300" style={{ transform: `translate(calc(-50% + ${signalPoint.x * 10}px), calc(-50% + ${signalPoint.y * 10}px))` }}>
            <MapPin className="h-9 w-9 text-black" />
            <span className="mt-2 text-[10px] font-bold uppercase tracking-[.2em] text-black">{signalStatus}</span>
          </div>
          <div className="cc-signal-node cc-signal-node-one absolute left-[18%] top-[22%] rounded-full border border-black/30 bg-white/70 p-3 text-black transition-transform duration-500" style={{ transform: `translate(${signalPoint.x * 18}px, ${signalPoint.y * 14}px)` }}><ShieldCheck className="h-5 w-5" /></div>
          <div className="cc-signal-node cc-signal-node-two absolute right-[16%] top-[34%] rounded-full border border-black/30 bg-white/70 p-3 text-black transition-transform duration-500" style={{ transform: `translate(${signalPoint.x * -14}px, ${signalPoint.y * 18}px)` }}><HeartHandshake className="h-5 w-5" /></div>
          <div className="cc-signal-node cc-signal-node-three absolute bottom-[22%] left-[25%] rounded-full border border-black/30 bg-white/70 p-3 text-black transition-transform duration-500" style={{ transform: `translate(${signalPoint.x * 22}px, ${signalPoint.y * -12}px)` }}><Radio className="h-5 w-5" /></div>
        </div>
      </section>

      <section className="overflow-hidden border-y border-black/15 bg-white py-10 sm:py-14">
        <div className="mb-4 flex w-max gap-3 cc-marquee-right">{['GPS LOCKED', 'VERIFIED NGOs', 'PRIVATE CHAT', 'MEDICAL AID', 'BLOOD SUPPORT', 'RESCUE READY', 'GPS LOCKED', 'VERIFIED NGOs'].map((label, index) => <div key={`${label}-${index}`} className="flex h-28 w-56 items-end rounded-2xl border border-black/15 bg-slate-50 p-4 sm:h-36 sm:w-72"><span className="font-display text-2xl font-black uppercase leading-none text-black sm:text-3xl">{label}</span></div>)}</div>
        <div className="flex w-max gap-3 cc-marquee-left">{['One held button', 'Exact location', 'Direct coordination', 'Open until safe', 'One held button', 'Exact location', 'Direct coordination'].map((label, index) => <div key={`${label}-${index}`} className="flex h-24 w-64 items-center justify-center rounded-2xl bg-[#e74636] px-5 text-center font-display text-xl font-black uppercase leading-none text-white sm:h-28 sm:w-80 sm:text-2xl">{label}</div>)}</div>
      </section>

      <section id="about" className="flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-white px-5 pb-16 pt-32 text-center sm:px-10 sm:pb-20 sm:pt-40">
        <p className="text-xs font-semibold uppercase tracking-[.24em] text-[#f45b52]">About CrisisConnect</p>
        <h2 className="cc-display-heading mt-5 max-w-5xl">No one waits<br />alone.</h2>
        <p ref={aboutParagraphRef} className="mt-10 max-w-2xl text-base font-medium leading-relaxed text-black sm:text-xl">CrisisConnect closes the gap between an emergency happening and verified assistance arriving. Your coordinates, your need, and a direct line to the people who accept your request.</p>
      </section>

      <section id="how-it-works" className="rounded-t-[42px] bg-[#f5f5f0] px-5 py-20 text-[#0c0c0c] sm:rounded-t-[60px] sm:px-10 sm:py-28">
        <div className="mx-auto max-w-6xl"><p className="text-xs font-bold uppercase tracking-[.24em] text-[#e74636]">The response cycle</p><h2 className="cc-section-heading mt-4">How it<br />works.</h2><div className="mt-16 border-t border-black/15">{responseSteps.map(([number, title, copy, Icon]) => <div key={number} className="grid gap-5 border-b border-black/15 py-8 sm:grid-cols-[180px_1fr_1.4fr] sm:items-center sm:py-10"><span className="font-display text-6xl font-black leading-none sm:text-8xl">{number}</span><div className="flex items-center gap-3"><Icon className="h-5 w-5 text-[#e74636]" /><h3 className="font-display text-2xl font-bold uppercase sm:text-3xl">{title}</h3></div><p className="max-w-xl text-sm leading-relaxed opacity-65 sm:text-base">{copy}</p></div>)}</div></div>
      </section>

      <section id="projects" className="-mt-8 rounded-t-[42px] bg-white px-5 py-20 text-black sm:rounded-t-[60px] sm:px-10 sm:py-28"><div className="mx-auto max-w-6xl"><div className="flex items-end justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[.24em] text-[#f45b52]">Inside the network</p><h2 className="cc-section-heading mt-4 text-black">The<br />work.</h2></div><span className="hidden text-xs uppercase tracking-[.2em] text-black/60 sm:block">Three connected surfaces</span></div><div className="mt-16 space-y-8">{caseStudies.map(({ number, eyebrow, title, copy, tone, icon: Icon, image }) => <article key={number} className="sticky top-24 min-h-[520px] overflow-hidden rounded-[34px] border-2 border-black bg-white p-5 sm:top-28 sm:rounded-[48px] sm:p-8"><div className="flex items-start justify-between gap-4"><div className="flex items-center gap-4"><span className="font-display text-5xl font-black leading-none sm:text-7xl">{number}</span><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#f45b52]">{eyebrow}</p><h3 className="mt-2 max-w-xl font-display text-2xl font-bold uppercase leading-tight sm:text-4xl">{title}</h3></div></div><span className="hidden rounded-full border border-black px-4 py-2 text-[10px] uppercase tracking-[.2em] sm:block">CrisisConnect</span></div><div className="mt-10 grid gap-4 sm:grid-cols-[.8fr_1.2fr]"><div className={`flex min-h-52 flex-col justify-between rounded-[26px] p-5 text-black ${tone}`}><Icon className="h-9 w-9" /><p className="max-w-xs text-sm font-medium leading-relaxed">{copy}</p></div><img src={image} alt={title} loading="lazy" className="h-52 w-full rounded-[26px] object-cover grayscale-[.15] sm:h-64" /></div></article>)}</div></div></section>

      <section id="network" className="border-t border-black/15 bg-white px-5 py-20 text-black sm:px-10 sm:py-28"><div className="mx-auto max-w-6xl"><div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[.24em] text-[#e74636]">Built for every role</p><h2 className="mt-4 font-display text-4xl font-black uppercase leading-none sm:text-6xl">One network.<br />Real people.</h2><p className="mt-6 max-w-md text-base leading-relaxed text-black/70">Citizens get a fast SOS. NGOs get a focused queue. CrisisAI stays close when the situation needs calm, practical guidance.</p><Link to="/login" className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#e74636] px-7 py-4 text-xs font-bold uppercase tracking-[.18em] text-white transition hover:bg-[#f45b52]">Enter the network <ArrowUpRight className="h-4 w-4" /></Link></div><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-[28px] border border-black/15 p-5"><RequesterMotionWidget /></div><div className="rounded-[28px] border border-black/15 p-5"><NGOMotionWidget /></div></div></div><NetworkVisual /></div></section>

      <section id="crisis-ai" className="border-t-2 border-[#e74636] bg-white px-5 py-20 text-black sm:px-10 sm:py-28"><div className="mx-auto flex max-w-6xl flex-col justify-between gap-10 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.24em] text-[#e74636]">Embedded safety guidance</p><h2 className="mt-4 max-w-3xl font-display text-5xl font-black uppercase leading-[.85] tracking-[-.03em] sm:text-8xl">CrisisAI<br />stays calm.</h2></div><div className="max-w-sm"><p className="text-base leading-relaxed text-black/70">First-aid protocols, clear next steps, and a steady voice while verified help is on its way.</p><Link to="/login" className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#e74636] px-7 py-3 text-xs font-bold uppercase tracking-[.18em] text-white transition hover:bg-[#f45b52]">Ask CrisisAI <Bot className="h-4 w-4" /></Link></div></div></section>

      <footer className="flex flex-col justify-between gap-6 border-t border-black/15 bg-white px-5 py-8 text-xs uppercase tracking-[.16em] text-black/60 sm:flex-row sm:px-10"><span>CRISISCONNECT / 2026</span><span>Official services first: 112 / 911</span><Link to="/signup?role=ngo" className="text-black hover:text-[#e74636]">Join as an NGO <ArrowUpRight className="inline h-3 w-3" /></Link></footer>
    </div>
  );
};
