import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthSafetyPanel } from '../../components/navigation/AuthSafetyPanel';
import { otpService } from '../../services/otpService';

export const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
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
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [otpNotice, setOtpNotice] = useState('');
  

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !password.trim()) return;

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (!otpSent) {
        await otpService.send(email);
        setOtpSent(true);
        setOtp('');
        setOtpNotice(`A new code was sent to ${email.trim().toLowerCase()}. Use the newest code.`);
        return;
      }

      if (!/^\d{6}$/.test(otp)) {
        setError('Enter the 6-digit verification code from your email.');
        return;
      }

      await otpService.verify(email, otp);

      try {
        await signup({
          name,
          email,
          phone: phone || '+91',
          password,
          role: 'user',
          location: {
            latitude: 19.0760,
            longitude: 72.8777,
            address: 'Mumbai, Maharashtra'
          },
          address,
          gender,
          age,
          bloodGroup,
          medicalHistory: medicalHistory ? [medicalHistory] : [],
          emergencyContacts: [
            ...(fam1Phone ? [{ relation: fam1Rel || 'Family', phone: fam1Phone }] : []),
            ...(fam2Phone ? [{ relation: fam2Rel || 'Family', phone: fam2Phone }] : [])
          ]
        });
      } catch (signupError) {
        if (signupError && typeof signupError === 'object' && 'code' in signupError && signupError.code === 'auth/email-already-in-use') {
          throw new Error('This email is already registered. Please sign in instead.');
        }
        const message = signupError instanceof Error ? signupError.message : 'Account creation failed.';
        throw new Error(`Email verified, but account creation failed: ${message}`);
      }

      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain scroll-smooth bg-[#f4f5f8] p-4 sm:p-8 relative">
      <div className="relative z-10 flex min-h-full w-full max-w-[80rem] items-center justify-center gap-8 py-8 sm:gap-10 sm:py-12 xl:gap-14">
        <AuthSafetyPanel storyCount={3} showIntro={false} />
        <div className="w-full max-w-lg">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mx-auto mb-3 shadow-sm">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black font-display">
            Join the CrisisConnect Network
          </h1>
          <p className="text-xs text-black/60 mt-1">
            Create your account to begin coordinating immediate assistance
          </p>
        </div>

        {/* Form Container */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white/95 border border-white shadow-[0_20px_55px_rgba(15,23,42,0.14)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                required
                className="w-full bg-[#f4f5f8] border border-slate-200 rounded-xl px-4 py-3 text-xs text-black placeholder:text-slate-400 focus:outline-none focus:border-red-500"
              />
            </div>

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
                  className="w-full bg-[#f4f5f8] border border-slate-200 rounded-xl px-4 py-3 text-xs text-black placeholder:text-slate-400 focus:outline-none focus:border-red-500"
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
                  className="w-full bg-[#f4f5f8] border border-slate-200 rounded-xl px-4 py-3 text-xs text-black placeholder:text-slate-400 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <>
                <div className="pt-4 border-t border-slate-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 mb-4">Personal Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1.5">
                        Address
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Full residential address"
                        className="w-full bg-[#f4f5f8] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-black focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1.5">
                          Gender
                        </label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full bg-[#f4f5f8] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-black focus:outline-none focus:border-red-500"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1.5">
                          Age
                        </label>
                        <input
                          type="number"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          placeholder="e.g. 34"
                          className="w-full bg-[#f4f5f8] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-black focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 mb-4">Medical Info</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1.5">
                        Blood Group
                      </label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full bg-[#f4f5f8] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-black focus:outline-none focus:border-red-500"
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
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1.5">
                        Medical History
                      </label>
                      <select
                        value={medicalHistory}
                        onChange={(e) => setMedicalHistory(e.target.value)}
                        className="w-full bg-[#f4f5f8] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-black focus:outline-none focus:border-red-500"
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

                <div className="pt-4 border-t border-slate-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 mb-4">Emergency Contacts</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1.5">
                          Relation
                        </label>
                        <input
                          type="text"
                          value={fam1Rel}
                          onChange={(e) => setFam1Rel(e.target.value)}
                          placeholder="Spouse, etc."
                          className="w-full bg-[#f4f5f8] border border-slate-200 rounded-xl px-3 py-2.5 text-[11px] text-black focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1.5">
                          Contact 1 Phone
                        </label>
                        <input
                          type="tel"
                          value={fam1Phone}
                          onChange={(e) => setFam1Phone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-[#f4f5f8] border border-slate-200 rounded-xl px-3 py-2.5 text-[11px] text-black focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1.5">
                          Relation
                        </label>
                        <input
                          type="text"
                          value={fam2Rel}
                          onChange={(e) => setFam2Rel(e.target.value)}
                          placeholder="Parent, etc."
                          className="w-full bg-[#f4f5f8] border border-slate-200 rounded-xl px-3 py-2.5 text-[11px] text-black focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1.5">
                          Contact 2 Phone
                        </label>
                        <input
                          type="tel"
                          value={fam2Phone}
                          onChange={(e) => setFam2Phone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-[#f4f5f8] border border-slate-200 rounded-xl px-3 py-2.5 text-[11px] text-black focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
            </>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#f4f5f8] border border-slate-200 rounded-xl px-4 py-3 text-xs text-black placeholder:text-slate-400 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2.5 text-xs text-black/60">
              <MapPin className="w-4 h-4 text-red-600 shrink-0" />
              <span>Location permission enabled automatically for rapid crisis dispatch.</span>
            </div>

            {error && (
              <p className="text-xs font-semibold text-red-600" role="alert">
                {error}{' '}
                {error.includes('already registered') && (
                  <Link to="/login" className="underline">Sign in instead.</Link>
                )}
              </p>
            )}

            {otpSent && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                  Email Verification Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  required
                  className="w-full bg-white border border-red-200 rounded-xl px-4 py-3 text-sm tracking-[0.35em] text-black placeholder:tracking-normal placeholder:text-slate-400 focus:outline-none focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={async () => {
                    setError('');
                    setOtp('');
                    try {
                      await otpService.send(email);
                      setOtpNotice(`A new code was sent to ${email.trim().toLowerCase()}. Older codes no longer work.`);
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Unable to resend the code.');
                    }
                  }}
                  className="mt-2 text-xs font-bold text-red-600 hover:underline"
                >
                  Resend code
                </button>
                {otpNotice && <p className="mt-2 text-xs text-black/60">{otpNotice}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_10px_25px_rgba(239,68,68,0.28)] transition-all flex items-center justify-center gap-2 transform active:scale-98"
            >
              <span>{loading ? (otpSent ? 'Verifying...' : 'Sending Code...') : (otpSent ? 'Verify & Register' : 'Send Verification Code')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-black/60">
            Already registered?{' '}
            <Link to="/login" className="text-black font-bold hover:underline">
              Sign In Instead
            </Link>
          </div>
        </div>

        </div>
        <AuthSafetyPanel storyCount={3} storyStart={3} showIntro={false} />
      </div>
    </div>
  );
};
