import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertTriangle, User, Building2, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SignupPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'ngo' ? 'ngo' : 'user';

  const [selectedRole, setSelectedRole] = useState<'user' | 'ngo'>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [orgType, setOrgType] = useState('Humanitarian Relief');
  
  // Extended User Fields
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [fam1Rel, setFam1Rel] = useState('');
  const [fam1Phone, setFam1Phone] = useState('');
  const [fam2Rel, setFam2Rel] = useState('');
  const [fam2Phone, setFam2Phone] = useState('');
  
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   if (!name.trim() || !email.trim() || !password.trim()) return;

if (password.length < 6) {
  alert('Password must be at least 6 characters.');
  return;
}

    setLoading(true);
    try {
      await signup({
        name,
        email,
        phone: phone || '+91',
        password,
        role: selectedRole,
        orgType: selectedRole === 'ngo' ? orgType : undefined,
        location: {
          latitude: 19.0760,
          longitude: 72.8777,
          address: 'Mumbai, Maharashtra'
        },
        ...(selectedRole === 'user' && {
          address,
          gender,
          age,
          bloodGroup,
          medicalHistory: medicalHistory ? [medicalHistory] : [],
          emergencyContacts: [
            ...(fam1Phone ? [{ relation: fam1Rel || 'Family', phone: fam1Phone }] : []),
            ...(fam2Phone ? [{ relation: fam2Rel || 'Family', phone: fam2Phone }] : [])
          ]
        })
      });

      if (selectedRole === 'ngo') {
        navigate('/ngo/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-theme-light flex items-center justify-center p-4 sm:p-8 relative overflow-hidden ">
      <div className="w-full max-w-lg relative z-10">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emergency-600/20 border border-emergency-500/40 flex items-center justify-center text-emergency-500 mx-auto mb-3 shadow-emergency-glow">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-theme-dark font-display">
            Join the CrisisConnect Network
          </h1>
          <p className="text-xs text-theme-forest/80 mt-1">
            Choose your account role to begin coordinating immediate assistance
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setSelectedRole('user')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedRole === 'user'
                ? 'border-emerald-500 bg-emerald-500/15 shadow-lg'
                : 'border-theme-mint/30 bg-white/60 hover:border-theme-mint/40'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <User className={`w-5 h-5 ${selectedRole === 'user' ? 'text-emerald-400' : 'text-theme-forest/80'}`} />
              <span className="font-bold text-sm text-theme-dark">USER</span>
            </div>
            <p className="text-[11px] text-theme-forest leading-snug">
              "I need help, or I may also respond to help neighbors."
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('ngo')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedRole === 'ngo'
                ? 'border-sky-500 bg-sky-500/15 shadow-lg'
                : 'border-theme-mint/30 bg-white/60 hover:border-theme-mint/40'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Building2 className={`w-5 h-5 ${selectedRole === 'ngo' ? 'text-sky-400' : 'text-theme-forest/80'}`} />
              <span className="font-bold text-sm text-theme-dark">NGO / ORG</span>
            </div>
            <p className="text-[11px] text-theme-forest leading-snug">
              "We provide disaster assistance and large-scale resources."
            </p>
          </button>
        </div>

        {/* Form Container */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-theme-mint/30 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-theme-forest mb-1.5">
                {selectedRole === 'ngo' ? 'Organization Name' : 'Full Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={selectedRole === 'ngo' ? 'e.g. Red Cross Metro Relief' : 'e.g. Alex Rivera'}
                required
                className="w-full bg-white/80 border border-theme-mint/30 rounded-xl px-4 py-3 text-xs text-theme-dark placeholder:text-theme-forest/50 bg-white border-theme-mint/30 focus:outline-none focus:border-emergency-500"
              />
            </div>

            {selectedRole === 'ngo' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-theme-forest mb-1.5">
                  Organization Type
                </label>
                <select
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value)}
                  className="w-full bg-white/80 border border-theme-mint/30 rounded-xl px-4 py-3 text-xs text-theme-dark focus:outline-none focus:border-sky-400"
                >
                  <option value="Humanitarian Disaster Relief">Humanitarian Disaster Relief</option>
                  <option value="Medical & Mobile Health Services">Medical & Mobile Health Services</option>
                  <option value="Search & Water Rescue Operations">Search & Water Rescue Operations</option>
                  <option value="Food Bank & Nutrition Aid">Food Bank & Nutrition Aid</option>
                  <option value="Temporary Shelter Operations">Temporary Shelter Operations</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-theme-forest mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@email.com"
                  required
                  className="w-full bg-white/80 border border-theme-mint/30 rounded-xl px-4 py-3 text-xs text-theme-dark placeholder:text-theme-forest/50 bg-white border-theme-mint/30 focus:outline-none focus:border-emergency-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-theme-forest mb-1.5">
                  Emergency Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-white/80 border border-theme-mint/30 rounded-xl px-4 py-3 text-xs text-theme-dark placeholder:text-theme-forest/50 bg-white border-theme-mint/30 focus:outline-none focus:border-emergency-500"
                />
              </div>
            </div>

            {selectedRole === 'user' && (
              <>
                <div className="pt-4 border-t border-theme-mint/30">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">Personal Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-theme-forest/80 mb-1.5">
                        Address
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Full residential address"
                        className="w-full bg-white/80 border border-theme-mint/30 rounded-xl px-4 py-2.5 text-xs text-theme-dark focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-theme-forest/80 mb-1.5">
                          Gender
                        </label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full bg-white/80 border border-theme-mint/30 rounded-xl px-4 py-2.5 text-xs text-theme-dark focus:outline-none focus:border-emerald-500"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-theme-forest/80 mb-1.5">
                          Age
                        </label>
                        <input
                          type="number"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          placeholder="e.g. 34"
                          className="w-full bg-white/80 border border-theme-mint/30 rounded-xl px-4 py-2.5 text-xs text-theme-dark focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-theme-mint/30">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">Medical Info</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-theme-forest/80 mb-1.5">
                        Blood Group
                      </label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full bg-white/80 border border-theme-mint/30 rounded-xl px-4 py-2.5 text-xs text-theme-dark focus:outline-none focus:border-emerald-500"
                      >
                        <option value="">Select Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-theme-forest/80 mb-1.5">
                        Medical History
                      </label>
                      <select
                        value={medicalHistory}
                        onChange={(e) => setMedicalHistory(e.target.value)}
                        className="w-full bg-white/80 border border-theme-mint/30 rounded-xl px-4 py-2.5 text-xs text-theme-dark focus:outline-none focus:border-emerald-500"
                      >
                        <option value="">None / Unknown</option>
                        <option value="Diabetes">Diabetes</option>
                        <option value="Hypertension">Hypertension</option>
                        <option value="Asthma">Asthma</option>
                        <option value="Heart Disease">Heart Disease</option>
                        <option value="Severe Allergies">Severe Allergies</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-theme-mint/30">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">Emergency Contacts</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-theme-forest/80 mb-1.5">
                          Relation
                        </label>
                        <input
                          type="text"
                          value={fam1Rel}
                          onChange={(e) => setFam1Rel(e.target.value)}
                          placeholder="Spouse, etc."
                          className="w-full bg-white/80 border border-theme-mint/30 rounded-xl px-3 py-2.5 text-[11px] text-theme-dark focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-theme-forest/80 mb-1.5">
                          Contact 1 Phone
                        </label>
                        <input
                          type="tel"
                          value={fam1Phone}
                          onChange={(e) => setFam1Phone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-white/80 border border-theme-mint/30 rounded-xl px-3 py-2.5 text-[11px] text-theme-dark focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-theme-forest/80 mb-1.5">
                          Relation
                        </label>
                        <input
                          type="text"
                          value={fam2Rel}
                          onChange={(e) => setFam2Rel(e.target.value)}
                          placeholder="Parent, etc."
                          className="w-full bg-white/80 border border-theme-mint/30 rounded-xl px-3 py-2.5 text-[11px] text-theme-dark focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-theme-forest/80 mb-1.5">
                          Contact 2 Phone
                        </label>
                        <input
                          type="tel"
                          value={fam2Phone}
                          onChange={(e) => setFam2Phone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-white/80 border border-theme-mint/30 rounded-xl px-3 py-2.5 text-[11px] text-theme-dark focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-theme-forest mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white/80 border border-theme-mint/30 rounded-xl px-4 py-3 text-xs text-theme-dark placeholder:text-theme-forest/50 bg-white border-theme-mint/30 focus:outline-none focus:border-emergency-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-theme-mint/30 flex items-center gap-2.5 text-xs text-theme-forest">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Location permission enabled automatically for rapid crisis dispatch.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emergency-600 hover:bg-emergency-500 text-theme-dark font-bold text-xs uppercase tracking-wider shadow-emergency-glow transition-all flex items-center justify-center gap-2 transform active:scale-98"
            >
              <span>{loading ? 'Creating Profile...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-theme-forest/80">
            Already registered?{' '}
            <Link to="/login" className="text-theme-dark font-bold hover:underline">
              Sign In Instead
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
