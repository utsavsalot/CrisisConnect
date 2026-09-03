import React, { useRef } from 'react';
import { Flame, HeartPulse, ShieldAlert, Wind, Droplets, LifeBuoy, PhoneCall } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const safetyStories = [
  ['01', 'Stop the bleed', 'Firm pressure buys time until trained help arrives.', HeartPulse, 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=640&q=80'],
  ['02', 'Cool the burn', 'Use cool running water. Skip ice and creams.', Flame, 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=640&q=80'],
  ['03', 'Clear the airway', 'Call emergency services and stay with the person.', Wind, 'https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?auto=format&fit=crop&w=640&q=80'],
  ['04', 'Protect from shock', 'Keep the person warm, still, and reassured.', LifeBuoy, 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=640&q=80'],
  ['05', 'Share the location', 'A precise location helps responders arrive faster.', Droplets, 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=640&q=80'],
  ['06', 'Call for help', 'Give the dispatcher clear facts and follow instructions.', PhoneCall, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=640&q=80'],
] as const;

interface AuthSafetyPanelProps {
  storyCount: 2 | 3 | 5;
  storyStart?: number;
  showIntro?: boolean;
}

export const AuthSafetyPanel: React.FC<AuthSafetyPanelProps> = ({ storyCount, storyStart = 0, showIntro = true }) => {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: paragraphRef,
    offset: ['start 0.8', 'end 0.2'],
  });
  const paragraphY = useTransform(scrollYProgress, [0, 1], [18, 0]);
  const paragraphOpacity = useTransform(scrollYProgress, [0, 0.25, 1], [0.4, 1, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], [12, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);

  return (
    <aside className="hidden w-56 shrink-0 self-center lg:block xl:w-64" aria-label="Life-saving techniques">
      <div className={`border-red-500 ${showIntro ? 'border-l-2 pl-6' : 'border-r-2 pr-6'}`}>
        {showIntro && <>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-red-600">
            <ShieldAlert className="h-4 w-4" />
            First moments matter
          </div>
          <motion.p ref={paragraphRef} style={{ y: paragraphY, opacity: paragraphOpacity }} className="mt-5 text-sm font-medium leading-relaxed text-black/75">
            Simple actions can protect a life while verified help is moving toward you.
          </motion.p>
          <motion.figure style={{ y: imageY, scale: imageScale }} className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.12)]">
            <img src={safetyStories[0][4]} alt="A responder providing hands-on medical care" loading="lazy" className="h-28 w-full object-cover grayscale-[.1]" />
            <figcaption className="p-3 text-[11px] leading-relaxed text-black/65">A calm first response creates time, clarity, and a better handoff to trained help.</figcaption>
          </motion.figure>
        </>}
        <div className={showIntro ? 'mt-8 space-y-6' : 'space-y-6'}>
          {safetyStories.slice(storyStart, storyStart + storyCount).map(([number, title, copy, Icon, image], index) => (
            <div key={number} className="border-t border-black/15 pt-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-bold tracking-[.2em] text-red-600">{number}</span>
                <Icon className="h-4 w-4 text-red-600" />
              </div>
              <img src={image} alt="" loading="lazy" className="mt-3 h-20 w-full rounded-xl object-cover grayscale-[.15]" />
              <h2 className="mt-3 font-display text-lg font-black uppercase text-black">{title}</h2>
              <motion.p ref={index === 0 ? paragraphRef : undefined} style={index === 0 ? { y: paragraphY, opacity: paragraphOpacity } : undefined} className="mt-1 text-xs leading-relaxed text-black/60">{copy}</motion.p>
            </div>
          ))}
        </div>
        {showIntro && <p className="mt-8 text-[10px] font-bold uppercase tracking-[.14em] text-black/50">Call local emergency services first.</p>}
      </div>
    </aside>
  );
};
