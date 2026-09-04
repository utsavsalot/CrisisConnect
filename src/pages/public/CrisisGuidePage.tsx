import React, { useState, useMemo, useEffect } from 'react';
import { 
  AlertTriangle, Book, Flame, Activity, ShieldAlert, Droplets, MapPin, 
  HeartPulse, ShieldCheck, PhoneCall, AlertOctagon, Search, ChevronRight, 
  CheckCircle2, XCircle, ExternalLink, Info
} from 'lucide-react';
import { crisisGuideData, CrisisGuideTopic } from '../../data/crisisGuideData';

// Map icon strings to actual Lucide components
const iconMap: Record<string, React.FC<any>> = {
  AlertTriangle, Book, Flame, Activity, ShieldAlert, Droplets, 
  MapPin, HeartPulse, ShieldCheck, PhoneCall, AlertOctagon, Info
};

export const CrisisGuidePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState<string>(crisisGuideData[0]?.id || '');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return crisisGuideData;
    const query = searchQuery.toLowerCase();
    return crisisGuideData.filter(
      (topic) =>
        topic.title.toLowerCase().includes(query) ||
        topic.description.toLowerCase().includes(query) ||
        topic.sections.some(s => s.heading.toLowerCase().includes(query) || s.content.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  // If search filters out the currently selected topic, pick the first available one
  useEffect(() => {
    if (filteredTopics.length > 0 && !filteredTopics.some(t => t.id === selectedTopicId)) {
      setSelectedTopicId(filteredTopics[0].id);
    }
  }, [filteredTopics, selectedTopicId]);

  const selectedTopic = useMemo(() => {
    return crisisGuideData.find((t) => t.id === selectedTopicId) || crisisGuideData[0];
  }, [selectedTopicId]);

  const SelectedIcon = iconMap[selectedTopic?.iconName] || Info;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f4f5f8] text-black">
      {/* Header section */}
      <section className="bg-white px-5 py-10 sm:px-10 border-b border-black/15">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[.24em] text-[#e74636] mb-4">Official Handbook</p>
          <h1 className="font-display text-4xl font-black uppercase leading-none sm:text-6xl mb-6">
            Crisis Guide
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-black/70 sm:text-base">
            Essential emergency information, preparedness steps, and direct safety protocols. Stay calm and follow these guidelines when an emergency happens.
          </p>
        </div>
      </section>

      {/* Main Content: Two Panel Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] xl:grid-cols-[380px_1fr] gap-8 lg:gap-12 items-start">
          
          {/* Left Panel: Search and Topic List */}
          <div className="flex flex-col gap-6 sticky top-24">
            
            {/* Search Box */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-black/40" />
              </div>
              <input
                type="text"
                placeholder="Search guides (e.g., Burns, Fire, Flood)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 rounded-[1rem] border-2 border-black/10 bg-white text-sm font-medium focus:border-black/30 focus:outline-none transition-colors shadow-sm"
              />
            </div>

            {/* Topic List */}
            <div className="bg-white rounded-[1.5rem] border border-black/10 shadow-[0_14px_30px_rgba(15,23,42,0.06)] overflow-hidden">
              <div className="p-4 border-b border-black/10 bg-slate-50/50">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider">Guide Topics</h3>
              </div>
              <div className="flex flex-col max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                {filteredTopics.length === 0 ? (
                  <div className="py-10 px-4 text-center text-sm text-black/50">
                    No guides found matching "{searchQuery}"
                  </div>
                ) : (
                  filteredTopics.map((topic) => {
                    const Icon = iconMap[topic.iconName] || Info;
                    const isActive = selectedTopicId === topic.id;
                    
                    return (
                      <button
                        key={topic.id}
                        onClick={() => setSelectedTopicId(topic.id)}
                        className={`flex items-center gap-3 w-full text-left p-3 rounded-xl transition-all ${
                          isActive 
                            ? 'bg-[#e74636]/10 text-black border border-[#e74636]/20' 
                            : 'text-black/70 hover:bg-black/5 hover:text-black border border-transparent'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-[#e74636] text-white shadow-md' : 'bg-black/5 text-black/60'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-bold truncate ${isActive ? 'text-[#e74636]' : 'text-black'}`}>
                            {topic.title}
                          </h4>
                        </div>
                        {isActive && <ChevronRight className="w-4 h-4 text-[#e74636]" />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Content Display */}
          <div className="bg-white rounded-[2rem] border border-black/10 shadow-[0_20px_55px_rgba(15,23,42,0.08)] overflow-hidden">
            {selectedTopic ? (
              <div className="flex flex-col h-full animate-in fade-in duration-300">
                
                {/* Topic Header */}
                <div className="p-6 sm:p-10 border-b border-black/10 bg-gradient-to-b from-slate-50 to-white">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-[#e74636]/10 rounded-2xl border border-[#e74636]/20 text-[#e74636]">
                      <SelectedIcon className="w-8 h-8 sm:w-10 sm:h-10" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[.2em] text-[#e74636] mb-1 block">
                        Emergency Guide
                      </span>
                      <h2 className="font-display text-2xl sm:text-4xl font-black uppercase leading-tight text-black">
                        {selectedTopic.title}
                      </h2>
                    </div>
                  </div>
                  <p className="text-base sm:text-lg text-black/70 font-medium leading-relaxed mt-4 max-w-3xl">
                    {selectedTopic.description}
                  </p>
                </div>

                <div className="p-6 sm:p-10 space-y-10 sm:space-y-12">
                  
                  {/* Important Warnings */}
                  {selectedTopic.importantWarnings.length > 0 && (
                    <div className="space-y-4">
                      {selectedTopic.importantWarnings.map((warning, idx) => (
                        <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-[#e74636]/10 border-l-4 border-[#e74636] text-[#b33023]">
                          <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
                          <p className="text-sm sm:text-base font-bold leading-relaxed">{warning}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Do's and Don'ts */}
                  {(selectedTopic.doItems.length > 0 || selectedTopic.dontItems.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                      {selectedTopic.doItems.length > 0 && (
                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-[1.5rem] p-6">
                          <h3 className="flex items-center gap-2 font-display text-lg font-black uppercase text-emerald-800 mb-5 pb-3 border-b border-emerald-200">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> What to Do
                          </h3>
                          <ul className="space-y-4">
                            {selectedTopic.doItems.map((item, idx) => (
                              <li key={idx} className="flex gap-3 text-sm font-medium text-emerald-950 leading-relaxed">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {selectedTopic.dontItems.length > 0 && (
                        <div className="bg-red-50/50 border border-red-100 rounded-[1.5rem] p-6">
                          <h3 className="flex items-center gap-2 font-display text-lg font-black uppercase text-red-800 mb-5 pb-3 border-b border-red-200">
                            <XCircle className="w-5 h-5 text-red-600" /> What Not to Do
                          </h3>
                          <ul className="space-y-4">
                            {selectedTopic.dontItems.map((item, idx) => (
                              <li key={idx} className="flex gap-3 text-sm font-medium text-red-950 leading-relaxed">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Detailed Sections */}
                  {selectedTopic.sections.length > 0 && (
                    <div className="space-y-8">
                      {selectedTopic.sections.map((section, idx) => (
                        <div key={idx}>
                          <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-black mb-3">
                            {section.heading}
                          </h3>
                          <p className="text-sm sm:text-base text-black/75 leading-relaxed font-medium">
                            {section.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Sources */}
                  {selectedTopic.sources.length > 0 && (
                    <div className="pt-8 border-t border-black/10">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-black/50 mb-4">
                        Sources & Further Information
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {selectedTopic.sources.map((source, idx) => (
                          <a
                            key={idx}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                          >
                            {source.label} <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-10 text-center">
                <Book className="w-12 h-12 text-black/20 mb-4" />
                <h3 className="font-display text-xl font-black uppercase text-black mb-2">No Topic Selected</h3>
                <p className="text-sm text-black/50">Select a topic from the guide menu to view its details.</p>
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
};
