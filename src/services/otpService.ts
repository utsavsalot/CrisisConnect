const otpApiUrl = import.meta.env.VITE_OTP_API_URL || 'http://localhost:3001';

async function requestOtp(path: string, body: Record<string, string>): Promise<void> {
  const response = await fetch(`${otpApiUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const result = await response.json() as { message?: string };
  if (!response.ok) throw new Error(result.message || 'Verification request failed.');
}

export const otpService = {
  send(email: string): Promise<void> {
    return requestOtp('/api/otp/send', { email });
  },
  verify(email: string, code: string): Promise<void> {
    return requestOtp('/api/otp/verify', { email, code });
  }
};