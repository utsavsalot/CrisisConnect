import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Edit, 
  AlertCircle, 
  Heart, 
  Pill, 
  Utensils, 
  Home, 
  Truck, 
  Droplets,
  Check,
  X
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { NGOResource } from '../../types';

export const NGOResourcesPage: React.FC = () => {
  const { resources, updateResource, addResource } = useEmergency();
  
  const [editingRes, setEditingRes] = useState<NGOResource | null>(null);
  const [editAvailable, setEditAvailable] = useState(0);
  const [editAllocated, setEditAllocated] = useState(0);

  const [isAdding, setIsAdding] = useState(false);
  const [newType, setNewType] = useState('Blood Units');
  const [newTotal, setNewTotal] = useState(50);
  const [newUnit, setNewUnit] = useState('Units');

  const getIcon = (type: string) => {
    if (type.includes('Blood')) return <Heart className="w-5 h-5 text-red-500" />;
    if (type.includes('Medicine')) return <Pill className="w-5 h-5 text-purple-400" />;
    if (type.includes('Food')) return <Utensils className="w-5 h-5 text-amber-400" />;
    if (type.includes('Shelter')) return <Home className="w-5 h-5 text-indigo-400" />;
    if (type.includes('Transport')) return <Truck className="w-5 h-5 text-blue-400" />;
    return <Droplets className="w-5 h-5 text-cyan-400" />;
  };

  const handleStartEdit = (res: NGOResource) => {
    setEditingRes(res);
    setEditAvailable(res.available);
    setEditAllocated(res.allocated);
  };

  const handleSaveEdit = async () => {
    if (!editingRes) return;
    await updateResource(editingRes.id, Number(editAvailable), Number(editAllocated));
    setEditingRes(null);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addResource(newType, Number(newTotal), newUnit);
    setIsAdding(false);
  };

  return (
    <div className="min-h-screen bg-[#070B14] py-8 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
              EMERGENCY RESOURCE INVENTORY
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Coordinate life-saving supplies: blood units, pharmaceuticals, field rations, and evacuation fleet
            </p>
          </div>

          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-tech-glow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Resource Category</span>
          </button>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res) => {
            const availPct = Math.round((res.available / res.total) * 100);
            return (
              <div
                key={res.id}
                className="glass-panel rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      {getIcon(res.type)}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      Unit: {res.unit}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{res.type}</h3>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-center p-3 rounded-2xl bg-white/5 border border-white/5">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Available</span>
                      <span className="text-xl font-black text-emerald-400 font-display">{res.available}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Allocated</span>
                      <span className="text-xl font-black text-amber-400 font-display">{res.allocated}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Total</span>
                      <span className="text-xl font-black text-white font-display">{res.total}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>Readiness: {availPct}% available</span>
                      <span>Updated {new Date(res.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-sky-400"
                        style={{ width: `${availPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => handleStartEdit(res)}
                    className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1.5"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Update Stock</span>
                  </button>

                  <button
                    onClick={async () => {
                      await updateResource(res.id, 0, res.total);
                    }}
                    className="text-[11px] text-red-400 hover:text-red-300 font-medium"
                  >
                    Mark Depleted
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Edit Stock */}
        {editingRes && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-white/20 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white">Update Stock: {editingRes.type}</h3>
                <button onClick={() => setEditingRes(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Available Units</label>
                  <input
                    type="number"
                    value={editAvailable}
                    onChange={(e) => setEditAvailable(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Allocated Units</label>
                  <input
                    type="number"
                    value={editAllocated}
                    onChange={(e) => setEditAllocated(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingRes(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add Resource Category */}
        {isAdding && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-white/20 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white">Add Emergency Resource</h3>
                <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Resource Name</label>
                  <input
                    type="text"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    placeholder="e.g. Oxygen Tanks, Pediatric Trauma Kits..."
                    required
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Total Stock</label>
                  <input
                    type="number"
                    value={newTotal}
                    onChange={(e) => setNewTotal(Number(e.target.value))}
                    required
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Unit Description</label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="e.g. Cylinders, Kits, Rations..."
                    required
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs"
                  >
                    Add Resource
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
