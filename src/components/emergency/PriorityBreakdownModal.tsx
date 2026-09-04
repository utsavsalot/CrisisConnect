import React from 'react';
import { EmergencyRequest } from '../../types';
import { X, Flame, HeartPulse, Users, Clock, Box, ShieldAlert } from 'lucide-react';
import { PriorityBadge } from '../ui/PriorityBadge';

interface PriorityBreakdownModalProps {
  request: EmergencyRequest;
  onClose: () => void;
}

export const PriorityBreakdownModal: React.FC<PriorityBreakdownModalProps> = ({ request, onClose }) => {
  if (!request.priorityBreakdown) return null;

  const { emergencyType, medicalSeverity, peopleAffected, waitingTime, resourceScarcity } = request.priorityBreakdown;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border-2 border-black/10 flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-6 border-b border-black/10 bg-gray-50">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-display font-black text-black">
              Priority Engine
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 text-black/50 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex items-center justify-between mb-8 p-4 rounded-2xl bg-gray-50 border border-gray-200">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Final Score</p>
              <PriorityBadge level={request.priorityLevel} score={request.priorityScore} size="lg" />
            </div>
            <div className="text-right">
              <div className="text-4xl font-display font-black text-black">
                {request.priorityScore} <span className="text-lg text-gray-400">/ 100</span>
              </div>
            </div>
          </div>

          <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
            Score Breakdown
          </h3>

          <div className="space-y-4">
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-black">Emergency Type</span>
                  <span className="font-mono font-bold text-red-600">+{emergencyType}</span>
                </div>
                <p className="text-xs text-gray-500">Based on needs: {request.needs.join(', ')}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-black">Medical Severity</span>
                  <span className="font-mono font-bold text-rose-600">+{medicalSeverity}</span>
                </div>
                <p className="text-xs text-gray-500">Self-reported condition: {request.medicalSeverity || 'None'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-black">People Affected</span>
                  <span className="font-mono font-bold text-amber-600">+{peopleAffected}</span>
                </div>
                <p className="text-xs text-gray-500">Number of individuals: {request.peopleAffected || 1}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-black">Waiting Time</span>
                  <span className="font-mono font-bold text-blue-600">+{waitingTime}</span>
                </div>
                <p className="text-xs text-gray-500">Time elapsed since request was created.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Box className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-black">Resource Scarcity</span>
                  <span className="font-mono font-bold text-emerald-600">+{resourceScarcity}</span>
                </div>
                <p className="text-xs text-gray-500">Availability of required resources in the network.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
