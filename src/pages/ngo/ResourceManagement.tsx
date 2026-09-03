import React, { useState, useEffect, useMemo } from 'react';
import { Package, Minus, Plus, Save, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { NGOResource } from '../../types';
import { resourceService } from '../../services/serviceManager';

// Define the standard resource template to initialize for new NGOs
const DEFAULT_RESOURCE_CATEGORIES = [
  { category: 'Medical Resources', items: [
    { type: 'Blood Units', unit: 'Units' },
    { type: 'Medicine Kits', unit: 'Kits' },
    { type: 'First Aid Kits', unit: 'Kits' },
    { type: 'Oxygen Cylinders', unit: 'Cylinders' },
    { type: 'Medical Personnel', unit: 'Staff' }
  ]},
  { category: 'Transportation & Rescue', items: [
    { type: 'Ambulances', unit: 'Vehicles' },
    { type: 'Emergency Vehicles', unit: 'Vehicles' },
    { type: 'Rescue Vehicles', unit: 'Vehicles' }
  ]},
  { category: 'Food & Essential Supplies', items: [
    { type: 'Food Packages', unit: 'Packages' },
    { type: 'Water Supplies', unit: 'Liters' },
    { type: 'Essential Supply Kits', unit: 'Kits' }
  ]},
  { category: 'Shelter', items: [
    { type: 'Available Beds', unit: 'Beds' },
    { type: 'Shelter Capacity', unit: 'People' }
  ]}
];

interface ResourceManagementProps {
  onBack?: () => void;
}

export const ResourceManagement: React.FC<ResourceManagementProps> = ({ onBack }) => {
  const { currentUser } = useAuth();
  const { resources, addResource } = useEmergency();

  // Local state for edits: mapping resource ID to its new 'available' quantity
  const [localEdits, setLocalEdits] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize defaults if the NGO has no resources
  useEffect(() => {
    const initializeDefaults = async () => {
      if (!currentUser) return;
      
      // If resources are already loaded, we don't need to initialize
      if (resources.length > 0) {
        setIsInitializing(false);
        return;
      }

      setIsInitializing(true);
      try {
        // Create defaults sequentially
        for (const cat of DEFAULT_RESOURCE_CATEGORIES) {
          for (const item of cat.items) {
            await addResource(item.type, 0, item.unit);
          }
        }
      } catch (err) {
        console.error('Failed to initialize default resources:', err);
      } finally {
        setIsInitializing(false);
      }
    };

    // We rely on the context `resources` being populated on mount.
    // If it's empty after a short delay, we assume they have none.
    const timer = setTimeout(() => {
      initializeDefaults();
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, resources.length]);


  // Determine if there are unsaved changes by comparing localEdits with actual resources
  const hasUnsavedChanges = useMemo(() => {
    return Object.entries(localEdits).some(([id, newQty]) => {
      const original = resources.find(r => r.id === id);
      return original && original.available !== newQty;
    });
  }, [localEdits, resources]);

  const handleQuantityChange = (id: string, newQty: number) => {
    if (newQty < 0 || isNaN(newQty)) newQty = 0;
    
    setLocalEdits(prev => ({
      ...prev,
      [id]: Math.floor(newQty)
    }));
  };

  const getDisplayQuantity = (resource: NGOResource) => {
    return localEdits[resource.id] !== undefined ? localEdits[resource.id] : resource.available;
  };

  const handleSave = async () => {
    if (!hasUnsavedChanges || isSaving || !currentUser) return;

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Find all modified resources
      const updates = resources.filter(r => 
        localEdits[r.id] !== undefined && localEdits[r.id] !== r.available
      );

      // Execute all updates
      await Promise.all(
        updates.map(r => 
          resourceService.updateResource(r.id, localEdits[r.id], r.allocated)
        )
      );

      setSaveSuccess(true);
      // Clear local edits since they are now saved
      setLocalEdits({});
      
      // Redirect after success
      setTimeout(() => {
        if (onBack) {
          onBack();
        }
      }, 1500);

    } catch (err) {
      console.error('Failed to save resources:', err);
      setSaveError('Failed to update resource inventory. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Group current resources by category
  const groupedResources = useMemo(() => {
    const groups: Record<string, NGOResource[]> = {
      'Medical Resources': [],
      'Transportation & Rescue': [],
      'Food & Essential Supplies': [],
      'Shelter': [],
      'Other': []
    };

    resources.forEach(r => {
      let foundCategory = 'Other';
      for (const cat of DEFAULT_RESOURCE_CATEGORIES) {
        if (cat.items.some(item => item.type === r.type)) {
          foundCategory = cat.category;
          break;
        }
      }
      if (groups[foundCategory]) {
        groups[foundCategory].push(r);
      } else {
        groups[foundCategory] = [r];
      }
    });

    return groups;
  }, [resources]);

  if (isInitializing && resources.length === 0) {
    return (
      <div className="min-h-screen bg-theme-light flex items-center justify-center">
        <div className="text-theme-forest/60 text-sm animate-pulse flex flex-col items-center gap-3">
          <Package className="w-8 h-8" />
          <span>Initializing resource inventory...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-light pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 glass-panel p-6 rounded-3xl border border-theme-mint/30 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-wider">
                LIVE RESOURCE INVENTORY
              </span>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-3 mb-2">
              {onBack && (
                <button onClick={onBack} className="p-2 hover:bg-theme-mint/20 rounded-xl text-theme-forest/80 transition-colors hidden sm:block">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 border border-sky-500/20">
                <Package className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-theme-dark font-display">
                Resource Management
              </h1>
            </div>
            <p className="text-sm text-theme-forest/80 max-w-xl leading-relaxed">
              Manage and update your organization's available emergency resources. 
              Changes made here are reflected in real-time across the CrisisConnect network.
            </p>
          </div>
        </div>

        {/* Status Alerts */}
        {saveError && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="text-sm text-red-800 font-medium">
              ✕ {saveError}
            </div>
          </div>
        )}

        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-sm text-emerald-800 font-medium">
              ✓ Resource inventory updated successfully. Redirecting to dashboard...
            </div>
          </div>
        )}

        {/* Resource Categories Grid */}
        <div className="space-y-8">
          {Object.entries(groupedResources).map(([categoryName, items]) => {
            if (items.length === 0) return null;

            return (
              <div key={categoryName} className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-theme-dark border-b border-theme-mint/30 pb-2">
                  {categoryName}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map(resource => {
                    const currentQty = getDisplayQuantity(resource);
                    const isChanged = localEdits[resource.id] !== undefined && localEdits[resource.id] !== resource.available;

                    return (
                      <div 
                        key={resource.id} 
                        className={`glass-panel p-5 rounded-2xl border transition-all duration-300 hover:shadow-md ${
                          isChanged 
                            ? 'border-amber-400/50 bg-amber-50/30' 
                            : 'border-theme-mint/30 hover:border-theme-mint/60'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-theme-dark text-sm">{resource.type}</h4>
                              {isChanged && <div className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Unsaved change" />}
                            </div>
                            <span className="text-[10px] font-mono text-theme-forest/60 uppercase">
                              Available {resource.unit}
                            </span>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-theme-sage/50 flex items-center justify-center text-theme-forest/80">
                            <Package className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between bg-white/60 rounded-xl p-1.5 border border-theme-mint/20">
                          <button
                            onClick={() => handleQuantityChange(resource.id, currentQty - 1)}
                            disabled={currentQty <= 0}
                            className="p-2 rounded-lg hover:bg-theme-sage/50 text-theme-forest disabled:opacity-30 disabled:cursor-not-allowed transition-colors active:scale-95"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          
                          <input
                            type="number"
                            min="0"
                            value={currentQty === 0 && localEdits[resource.id] === undefined && resource.available === 0 ? '' : currentQty}
                            placeholder="0"
                            onChange={(e) => handleQuantityChange(resource.id, parseInt(e.target.value) || 0)}
                            className="w-16 text-center bg-transparent border-none focus:outline-none font-bold text-theme-dark text-lg"
                          />

                          <button
                            onClick={() => handleQuantityChange(resource.id, currentQty + 1)}
                            className="p-2 rounded-lg hover:bg-theme-sage/50 text-theme-forest transition-colors active:scale-95"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Floating Save Bar */}
      <div className={`fixed bottom-0 left-0 right-0 md:left-64 z-40 transition-transform duration-300 ${
        hasUnsavedChanges ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="bg-white/90 backdrop-blur-xl border-t border-theme-mint/30 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] p-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider hidden sm:inline-block">
              UNSAVED CHANGES
            </span>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider sm:hidden">
              UNSAVED
            </span>
          </div>
          
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isSaving}
            className="px-6 py-3 rounded-xl bg-emergency-600 hover:bg-emergency-500 text-white font-bold text-xs uppercase tracking-wider shadow-emergency-glow transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
