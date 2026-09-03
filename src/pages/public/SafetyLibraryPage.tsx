import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, BookOpen, CheckCircle2, ChevronRight, ClipboardList, HeartPulse, Home, LifeBuoy, MapPin, Search, ShieldCheck, Siren, Stethoscope, Users, X } from 'lucide-react';

type GuideId = 'overview' | 'send-sos' | 'track-request' | 'bleeding' | 'choking' | 'burns' | 'unresponsive' | 'plan' | 'kit';

interface Guide {
  id: GuideId;
  group: string;
  title: string;
  icon: React.ElementType;
  eyebrow: string;
  description: string;
  callout?: string;
  sections: Array<{ title: string; body: string; bullets?: string[] }>;
  source?: { label: string; href: string };
}

const guides: Guide[] = [
  {
    id: 'overview', group: 'Getting started', title: 'Safety Library overview', icon: BookOpen, eyebrow: 'CrisisConnect guide',
    description: 'A calm, practical starting point for using CrisisConnect and preparing for an emergency before it happens.',
    sections: [
      { title: 'What this library is for', body: 'Use these guides to understand the app, prepare your household, and find reputable first-aid resources. They support—but never replace—local emergency services or trained medical care.' },
      { title: 'In an immediate emergency', body: 'Call your local emergency number first if someone is in immediate danger, seriously injured, unconscious, or not breathing normally. Then use CrisisConnect to reach nearby community responders and partner organizations.' },
      { title: 'Choose the guide you need', body: 'The left panel separates app instructions, emergency preparedness, and basic first-aid reference topics.' }
    ]
  },
  {
    id: 'send-sos', group: 'Getting started', title: 'Send an SOS', icon: Siren, eyebrow: 'CrisisConnect guide',
    description: 'Create a clear emergency request in a few deliberate steps.',
    sections: [
      { title: 'Before sending', body: 'Move to a safer place if you can. For a life-threatening emergency, call local emergency services first.' },
      { title: 'Send the request', body: 'Open Request Help, confirm the incident location, choose the relevant need, and press and hold the SOS button to avoid accidental submissions.' },
      { title: 'Make it useful for responders', body: 'Add a brief description when safe to do so.', bullets: ['What happened and how many people need help', 'Immediate risks, such as fire, flooding, or an inaccessible entrance', 'Medication, mobility, or communication needs that responders should know about'] }
    ]
  },
  {
    id: 'track-request', group: 'Getting started', title: 'Track a request', icon: MapPin, eyebrow: 'CrisisConnect guide',
    description: 'Follow the status of an active request and coordinate once help accepts it.',
    sections: [
      { title: 'While you wait', body: 'Keep your phone charged where possible, monitor the request status, and stay in a safe visible location if that does not increase risk.' },
      { title: 'When a responder accepts', body: 'Use the private coordination chat to share safe arrival details. Do not share sensitive information beyond what is needed for the emergency.' },
      { title: 'Close the request', body: 'Mark the request resolved only when help is no longer needed, so other responders can focus on open emergencies.' }
    ]
  },
  {
    id: 'bleeding', group: 'First-aid reference', title: 'Severe bleeding', icon: HeartPulse, eyebrow: 'First aid',
    description: 'Prioritize emergency services and direct pressure with a clean barrier when it is safe to help.',
    callout: 'Severe or uncontrolled bleeding is an emergency. Call local emergency services immediately.',
    sections: [
      { title: 'First priorities', body: 'Ensure the scene is safe and use gloves or a clean barrier if available. Apply firm, continuous pressure with clean cloth or gauze.' },
      { title: 'Get trained help', body: 'Follow emergency-dispatcher instructions. Do not remove a soaked dressing; add another layer while maintaining pressure.' },
      { title: 'Training matters', body: 'For tourniquet use and other trauma interventions, follow the instructions of emergency professionals or formal first-aid training.' }
    ],
    source: { label: 'American Red Cross: First Aid Steps', href: 'https://www.redcross.org/take-a-class/first-aid/performing-first-aid/first-aid-steps' }
  },
  {
    id: 'choking', group: 'First-aid reference', title: 'Choking', icon: LifeBuoy, eyebrow: 'First aid',
    description: 'Assess whether the person can cough or speak and get emergency help for severe choking.',
    callout: 'Call emergency services if the person cannot breathe, speak, or cough effectively, or becomes unresponsive.',
    sections: [
      { title: 'Recognize the emergency', body: 'A person who can cough forcefully should be encouraged to keep coughing. If they cannot breathe or speak, treat it as an emergency.' },
      { title: 'Act within your training', body: 'Use a recognized first-aid procedure only if you are trained, and follow instructions from emergency dispatchers.' },
      { title: 'If they become unresponsive', body: 'Call emergency services, begin CPR if trained, and use an AED if available and instructed.' }
    ],
    source: { label: 'American Red Cross: Choking First Aid', href: 'https://www.redcross.org/take-a-class/first-aid/performing-first-aid/choking-first-aid' }
  },
  {
    id: 'burns', group: 'First-aid reference', title: 'Burns', icon: Stethoscope, eyebrow: 'First aid',
    description: 'Remove the heat source, cool minor burns safely, and seek urgent care for serious burns.',
    callout: 'Call emergency services for major burns, electrical or chemical burns, or burns affecting the face, hands, feet, genitals, or large areas.',
    sections: [
      { title: 'Stop the source', body: 'Move away from the heat source and remove hot or smoldering clothing unless it is stuck to the skin.' },
      { title: 'Cool and protect', body: 'Cool a minor burn with cool running water. Do not use ice, butter, or grease. Cover loosely with a clean dressing.' },
      { title: 'Know when to escalate', body: 'Seek professional care for serious, deep, chemical, electrical, or extensive burns.' }
    ],
    source: { label: 'American Red Cross: Burns First Aid', href: 'https://www.redcross.org/take-a-class/first-aid/performing-first-aid/burns' }
  },
  {
    id: 'unresponsive', group: 'First-aid reference', title: 'Unresponsive person', icon: AlertTriangle, eyebrow: 'First aid',
    description: 'Call emergency services immediately and follow the dispatcher’s instructions.',
    callout: 'If a person is unresponsive or not breathing normally, call emergency services now.',
    sections: [
      { title: 'Check and call', body: 'Check whether the person responds and whether they are breathing normally. Call emergency services or direct someone else to call.' },
      { title: 'Use available support', body: 'Follow emergency-dispatcher guidance. If trained, begin CPR when appropriate and use an AED as soon as one is available.' },
      { title: 'Stay with the person', body: 'Keep monitoring until professional help arrives, unless remaining would put you in danger.' }
    ],
    source: { label: 'American Red Cross: CPR Training and Guidance', href: 'https://www.redcross.org/take-a-class/cpr' }
  },
  {
    id: 'plan', group: 'Preparedness', title: 'Make an emergency plan', icon: Users, eyebrow: 'Preparedness',
    description: 'Decide how your household will communicate, meet, and get help before an emergency starts.',
    sections: [
      { title: 'Make the plan together', body: 'Choose an out-of-area contact, safe meeting places, evacuation routes, and a way to check in when networks are busy.' },
      { title: 'Plan for real needs', body: 'Account for children, older adults, disability access, pets, medical devices, and prescription medications.' },
      { title: 'Keep it accessible', body: 'Save key contacts in your phone and keep a paper copy in your emergency kit.' }
    ],
    source: { label: 'Ready.gov: Make a Plan', href: 'https://www.ready.gov/plan' }
  },
  {
    id: 'kit', group: 'Preparedness', title: 'Build a go-bag', icon: ClipboardList, eyebrow: 'Preparedness',
    description: 'Prepare portable essentials so you can leave quickly or manage a short disruption safely.',
    sections: [
      { title: 'Core supplies', body: 'Start with water, non-perishable food, a flashlight, extra batteries, a first-aid kit, a phone charger, and a whistle.' },
      { title: 'Personal essentials', body: 'Add medications, identification copies, cash, glasses, hygiene items, infant supplies, pet supplies, and mobility or communication aids.' },
      { title: 'Keep it current', body: 'Review the bag regularly and replace expired supplies, batteries, and medicines.' }
    ],
    source: { label: 'Ready.gov: Build a Kit', href: 'https://www.ready.gov/kit' }
  }
];

export const SafetyLibraryPage: React.FC = () => {
  const [activeId, setActiveId] = useState<GuideId>('overview');
  const [query, setQuery] = useState('');
  const activeGuide = guides.find((guide) => guide.id === activeId) || guides[0];
  const visibleGuides = useMemo(() => guides.filter((guide) => `${guide.title} ${guide.group} ${guide.description}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const groups = [...new Set(guides.map((guide) => guide.group))];
  const ActiveIcon = activeGuide.icon;

  const chooseGuide = (id: GuideId) => { setActiveId(id); setQuery(''); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return <div className="min-h-screen bg-[#f6f8fb] text-slate-900">
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="hidden items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 sm:flex"><ArrowLeft className="h-4 w-4" /> Home</Link>
        <div className="hidden h-7 w-px bg-slate-200 sm:block" />
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-black tracking-tight"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emergency-600 text-white"><AlertTriangle className="h-5 w-5" /></span> CRISIS<span className="text-emergency-600">CONNECT</span><span className="text-slate-400">Safety Library</span></Link>
        <div className="ml-auto flex w-full max-w-md items-center rounded-full border border-slate-200 bg-slate-50 px-3 focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100"><Search className="h-4 w-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search safety guides…" className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-400" />{query && <button onClick={() => setQuery('')} aria-label="Clear search" className="text-slate-400"><X className="h-4 w-4" /></button>}</div>
      </div>
    </header>

    <main className="mx-auto grid max-w-7xl gap-7 px-4 py-8 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
      <aside className="lg:sticky lg:top-28 lg:h-[calc(100vh-9rem)] lg:overflow-y-auto">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          {query ? <div><p className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Search results</p>{visibleGuides.length ? visibleGuides.map((guide) => <GuideButton key={guide.id} guide={guide} active={guide.id === activeId} onClick={chooseGuide} />) : <p className="px-3 py-4 text-sm text-slate-500">No guide found.</p>}</div> : groups.map((group) => <div key={group} className="mb-5 last:mb-0"><p className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-emergency-600">{group}</p>{guides.filter((guide) => guide.group === group).map((guide) => <GuideButton key={guide.id} guide={guide} active={guide.id === activeId} onClick={chooseGuide} />)}</div>)}
        </div>
      </aside>

      <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,.08)] sm:p-10">
        <div className="mb-7 flex items-start justify-between gap-4 border-b border-slate-100 pb-7"><div><span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700"><ActiveIcon className="h-4 w-4" /> {activeGuide.eyebrow}</span><h1 className="mt-5 font-display text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{activeGuide.title}</h1><p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">{activeGuide.description}</p></div><ShieldCheck className="hidden h-9 w-9 text-emerald-500 sm:block" /></div>
        <div className="mb-7 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" /><p><strong>For a life-threatening emergency, call local emergency services (112/911) first.</strong> CrisisConnect helps coordinate community assistance; it is not a replacement for professional emergency care.</p></div>
        {activeGuide.callout && <div className="mb-7 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-900">{activeGuide.callout}</div>}
        <div className="space-y-8">{activeGuide.sections.map((section, index) => <section key={section.title}><div className="flex items-center gap-3"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">{index + 1}</span><h2 className="font-display text-xl font-black text-slate-900">{section.title}</h2></div><p className="mt-3 max-w-3xl leading-7 text-slate-600">{section.body}</p>{section.bullets && <ul className="mt-4 space-y-2">{section.bullets.map((bullet) => <li key={bullet} className="flex gap-2 text-sm leading-6 text-slate-600"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />{bullet}</li>)}</ul>}</section>)}</div>
        {activeGuide.source && <div className="mt-10 border-t border-slate-100 pt-6"><a href={activeGuide.source.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-bold text-sky-800 hover:bg-sky-100">Read the full official guidance <ChevronRight className="h-4 w-4" /></a><p className="mt-2 text-xs text-slate-400">Source: {activeGuide.source.label}</p></div>}
      </article>
    </main>
  </div>;
};

const GuideButton: React.FC<{ guide: Guide; active: boolean; onClick: (id: GuideId) => void }> = ({ guide, active, onClick }) => {
  const Icon = guide.icon;
  return <button onClick={() => onClick(guide.id)} className={`mb-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${active ? 'bg-emergency-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'}`}><Icon className="h-4 w-4 shrink-0" />{guide.title}</button>;
};
