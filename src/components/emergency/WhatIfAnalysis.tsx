import React from 'react';
import { ArrowDown, ArrowRight, ArrowUp, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { runSimulation } from '../../services/simulationService';

type SimulationResult = Awaited<ReturnType<typeof runSimulation>>;

const Metric: React.FC<{ label: string; current: number; forecast: number; tone: string }> = ({ label, current, forecast, tone }) => {
  const change = forecast - current;
  return <div className={`rounded-xl border p-4 ${tone}`}>
    <p className="text-xs font-black uppercase tracking-wider">{label}</p>
    <div className="mt-2 flex items-center gap-2 text-2xl font-black">
      <span>{current}</span><ArrowRight className="h-4 w-4 opacity-40" /><span>{forecast}</span>
      {change > 0 && <span className="flex items-center text-xs text-red-600"><ArrowUp className="h-3 w-3" /> +{change}</span>}
      {change < 0 && <span className="flex items-center text-xs text-emerald-600"><ArrowDown className="h-3 w-3" /> {change}</span>}
    </div>
    <p className="mt-1 text-xs text-slate-500">Current to forecast without action</p>
  </div>;
};

export const WhatIfAnalysis: React.FC<{ result: SimulationResult }> = ({ result }) => {
  const { current, withoutAction, intervention, expectedResult } = result;
  return <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start">
      <div>
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.16em] text-red-600"><Sparkles className="h-4 w-4" /> Decision support</div>
        <h2 className="mt-2 font-display text-3xl font-black text-slate-950">What-if response simulator</h2>
        <p className="mt-1 text-sm text-slate-500">See the pressure building over the next {result.simulationDurationMinutes} minutes, then test a response plan.</p>
      </div>
      <div className={`rounded-xl px-5 py-3 text-center ${result.risk.level === 'HIGH' ? 'bg-red-50 text-red-700' : result.risk.level === 'MEDIUM' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
        <p className="text-[10px] font-black uppercase tracking-widest">Risk level</p><p className="text-2xl font-black">{result.risk.level}</p><p className="text-xs font-bold">Score {result.risk.score}/100</p>
      </div>
    </div>

    <div className="mt-5"><p className="mb-3 text-xs font-black uppercase tracking-[.16em] text-slate-400">Current situation</p><div className="grid gap-3 sm:grid-cols-3"><Metric label="Critical" current={current.critical} forecast={current.critical} tone="border-red-200 bg-red-50 text-red-700" /><Metric label="High" current={current.high} forecast={current.high} tone="border-amber-200 bg-amber-50 text-amber-700" /><Metric label="Medium" current={current.medium} forecast={current.medium} tone="border-slate-200 bg-slate-50 text-slate-700" /></div><div className="mt-3 grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-slate-200 p-4"><p className="text-xs font-bold uppercase text-slate-400">Available responders</p><p className="mt-1 text-2xl font-black text-slate-950">{current.availableResponders}</p></div><div className="rounded-xl border border-slate-200 p-4"><p className="text-xs font-bold uppercase text-slate-400">Unassigned emergencies</p><p className="mt-1 text-2xl font-black text-slate-950">{current.unassignedEmergencies}</p></div><div className="rounded-xl border border-slate-200 p-4"><p className="text-xs font-bold uppercase text-slate-400">Resource shortages</p><p className="mt-1 text-2xl font-black text-slate-950">{result.resourceShortages.length}</p></div></div></div>
    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4"><div className="mb-3 flex items-center justify-between"><p className="text-xs font-black uppercase tracking-[.16em] text-slate-500">SOS criticality assessment</p><span className="text-[10px] font-bold text-slate-400">Score based on needs, symptoms, waiting time, assignment</span></div><div className="space-y-2">{result.criticality.slice(0, 5).map((incident) => <div key={incident.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2"><div className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${incident.severity === 'critical' ? 'bg-red-600' : incident.severity === 'high' ? 'bg-amber-500' : 'bg-slate-400'}`} /><span className="font-mono text-xs font-bold text-slate-700">{incident.id}</span><span className="text-xs font-black uppercase text-slate-600">{incident.severity}</span></div><div className="text-right text-xs"><span className="font-black text-slate-900">{incident.score}/100</span><span className="ml-2 text-slate-500">{incident.reasons[0]}</span></div></div>)}</div></div>

    <div className="my-6 flex items-center gap-3 text-xs font-black uppercase tracking-[.16em] text-slate-400"><div className="h-px flex-1 bg-slate-200" />Without additional action<div className="h-px flex-1 bg-slate-200" /></div>
    <div className="grid gap-3 sm:grid-cols-3"><Metric label="Critical" current={current.critical} forecast={withoutAction.critical} tone="border-red-200 bg-red-50 text-red-700" /><Metric label="High" current={current.high} forecast={withoutAction.high} tone="border-amber-200 bg-amber-50 text-amber-700" /><Metric label="Medium" current={current.medium} forecast={withoutAction.medium} tone="border-slate-200 bg-slate-50 text-slate-700" /></div>

    <div className="mt-6 rounded-xl border border-red-200 bg-red-50/70 p-5"><div className="flex items-center gap-2 text-sm font-black text-red-800"><ShieldAlert className="h-5 w-5" /> Predicted pressure points</div><div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-red-700">{result.responderAnalysis.responderShortage && <span className="rounded-full bg-white px-3 py-2">Responder shortage predicted</span>}{result.resourceShortages.length > 0 && <span className="rounded-full bg-white px-3 py-2">Resource shortage predicted</span>}{withoutAction.critical > current.critical && <span className="rounded-full bg-white px-3 py-2">Critical incidents increasing</span>}</div></div>

    <div className="mt-6"><p className="mb-3 text-xs font-black uppercase tracking-[.16em] text-slate-400">Recommended intervention</p><div className="grid gap-3 md:grid-cols-3"><div className="rounded-xl border border-red-200 bg-[#fffdf8] p-4"><p className="text-sm font-black text-slate-950">Deploy {intervention.responders} responders</p><p className="mt-1 text-xs text-slate-500">Send to {intervention.zone} to cover the highest pressure incidents.</p></div><div className="rounded-xl border border-red-200 bg-[#fffdf8] p-4"><p className="text-sm font-black text-slate-950">Move {intervention.medicineKits} medicine kits</p><p className="mt-1 text-xs text-slate-500">Stage emergency supplies in {intervention.resourceZone}.</p></div><div className="rounded-xl border border-red-200 bg-[#fffdf8] p-4"><p className="text-sm font-black text-slate-950">Assign {intervention.transportVehicles} transport vehicles</p><p className="mt-1 text-xs text-slate-500">Prioritize mobility support in {intervention.transportZone}.</p></div></div></div>

    <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5"><div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.16em] text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Expected result after intervention</div><div className="mt-4 grid gap-3 sm:grid-cols-3"><Metric label="Critical" current={withoutAction.critical} forecast={expectedResult.critical} tone="border-red-200 bg-white text-red-700" /><Metric label="High" current={withoutAction.high} forecast={expectedResult.high} tone="border-amber-200 bg-white text-amber-700" /><div className="rounded-xl border border-emerald-200 bg-white p-4"><p className="text-xs font-black uppercase tracking-wider text-emerald-700">Response time</p><p className="mt-2 text-2xl font-black text-slate-950">{expectedResult.responseTimeBefore} <span className="text-sm text-slate-400">min</span> <ArrowRight className="inline h-4 w-4 text-emerald-600" /> {expectedResult.responseTimeAfter} <span className="text-sm text-slate-400">min</span></p><p className="mt-1 text-xs text-emerald-700">Forecast to expected</p></div></div><p className="mt-4 text-xs font-bold text-emerald-800">Medicine shortage: {expectedResult.medicineShortageBefore ? 'YES' : 'NO'} <ArrowRight className="mx-1 inline h-3 w-3" /> {expectedResult.medicineShortageAfter ? 'YES' : 'NO'}</p></div>
  </section>;
};