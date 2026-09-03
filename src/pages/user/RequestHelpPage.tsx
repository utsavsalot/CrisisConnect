import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Send, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { EmergencyNeedCategory, LocationCoordinates } from '../../types';
import { EmergencyCategoryCard } from '../../components/emergency/EmergencyCategoryCard';
import { LocationDetector } from '../../components/emergency/LocationDetector';
import { RequestSubmissionAnimation } from '../../components/animations/RequestSubmissionAnimation';

export const RequestHelpPage: React.FC = () => {
  const { createEmergencyRequest } = useEmergency();
  const navigate = useNavigate();

  const [selectedNeeds, setSelectedNeeds] = useState<EmergencyNeedCategory[]>(['Medical Assistance']);
  const [otherNeedText, setOtherNeedText] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<LocationCoordinates>({
    latitude: 40.7128,
    longitude: -74.0060,
    address: 'Greenwich Village, New York, NY'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);

  const categories: EmergencyNeedCategory[] = [
    'Blood',
    'Medicine',
    'Medical Assistance',
    'Food',
    'Shelter',
    'Transportation',
    'Rescue',
    'Water',
    'Other'
  ];

  const handleToggleCategory = (cat: EmergencyNeedCategory) => {
    setSelectedNeeds(prev => {
      if (prev.includes(cat)) {
        return prev.filter(c => c !== cat);
      } else {
        return [...prev, cat];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedNeeds.length === 0) {
      alert('Please select at least one emergency need.');
      return;
    }
    if (!description.trim()) {
      alert('Please describe your emergency situation.');
      return;
    }

    try {
      const created = await createEmergencyRequest({
        needs: selectedNeeds,
        otherNeed: selectedNeeds.includes('Other') ? otherNeedText.trim() : undefined,
        description: description.trim(),
        location
      });

      setCreatedRequestId(created.id);
      setIsSubmitting(true);
    } catch (err) {
      console.error('Request creation error:', err);
      alert('Failed to submit emergency request. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] py-8 px-4 sm:px-6 lg:px-8 text-slate-100">
      
      {/* Sequence Animation Overlay on Submission */}
      {isSubmitting && (
        <RequestSubmissionAnimation
          onComplete={() => {
            navigate(`/requests/${createdRequestId || 'req-101'}`);
          }}
        />
      )}

      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Back Link & Header */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emergency-600/30 border-2 border-emergency-500 flex items-center justify-center text-emergency-500 shadow-emergency-glow">
              <AlertTriangle className="w-7 h-7 animate-bounce" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
                REQUEST EMERGENCY ASSISTANCE
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Fast broadcast to nearby community responders and NGO emergency hubs
              </p>
            </div>
          </div>
        </div>

        {/* Life-threatening Warning Disclaimer */}
        <div className="p-4 rounded-2xl bg-emergency-500/10 border border-emergency-500/30 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-emergency-500 shrink-0 mt-0.5" />
          <p className="text-xs text-emergency-300 leading-relaxed">
            <strong>For life-threatening emergencies, contact your local emergency services immediately (911/112).</strong> CrisisConnect connects you with available community assistance and does not replace emergency services.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section A: What Do You Need? */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 space-y-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emergency-400">
                Step 01
              </span>
              <h2 className="text-lg font-black text-white font-display">
                What do you need?
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Select all categories that apply to your emergency
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <EmergencyCategoryCard
                  key={cat}
                  category={cat}
                  selected={selectedNeeds.includes(cat)}
                  onToggle={handleToggleCategory}
                />
              ))}
            </div>

            {selectedNeeds.includes('Other') && (
              <div className="pt-2 animate-in fade-in duration-150">
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Please specify what you need:
                </label>
                <input
                  type="text"
                  value={otherNeedText}
                  onChange={(e) => setOtherNeedText(e.target.value)}
                  placeholder="e.g. Baby formula, power generator for medical equipment..."
                  className="w-full bg-slate-900/80 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emergency-500"
                />
              </div>
            )}
          </div>

          {/* Section B: Describe the situation */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 space-y-3">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
                Step 02
              </span>
              <h2 className="text-lg font-black text-white font-display">
                Describe the situation
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Briefly describe what is happening and what kind of assistance you need
              </p>
            </div>

            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe what is happening and what kind of assistance you need..."
              required
              className="w-full bg-slate-900/80 border border-white/15 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emergency-500 leading-relaxed transition-colors"
            />
          </div>

          {/* Section C: Location */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 space-y-3">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                Step 03
              </span>
              <h2 className="text-lg font-black text-white font-display">
                Emergency Location
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically detects coordinates for rapid responder dispatch
              </p>
            </div>

            <LocationDetector location={location} onChange={setLocation} />
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              data-emergency="true"
              className="emergency-cta w-full py-4 rounded-2xl bg-emergency-600 hover:bg-emergency-500 text-white font-black text-sm uppercase tracking-wider shadow-emergency-glow beacon-pulse flex items-center justify-center gap-3 transition-transform active:scale-98"
            >
              <AlertTriangle className="w-5 h-5 animate-pulse" />
              <span>SUBMIT EMERGENCY REQUEST</span>
            </button>
            <p className="text-center text-[11px] text-slate-500 mt-3 font-mono">
              Coordinates will be encrypted & broadcast to verified radius mesh nodes.
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};
