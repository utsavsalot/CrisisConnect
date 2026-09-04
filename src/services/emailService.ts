import emailjs from '@emailjs/browser';
import { EmergencyRequest, EmergencyStatus } from '../types';

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const isConfigured = Boolean(serviceId && templateId && publicKey);

const statusMessage: Record<EmergencyStatus, string> = {
  active: 'Your emergency request is active and has been broadcast to responders.',
  accepted: 'A responder has accepted your emergency request and will coordinate assistance.',
  in_progress: 'Assistance is currently in progress at your location.',
  resolved: 'Your emergency assistance request has been marked as resolved.',
  admin_escalated: 'Your emergency request has been escalated for priority attention.'
};

export const sendEmergencyEmail = async (
  request: EmergencyRequest,
  event: 'created' | 'accepted' | EmergencyStatus
): Promise<void> => {
  if (!isConfigured || !request.requesterEmail) return;

  const subject = event === 'created'
    ? 'CrisisConnect SOS request received'
    : event === 'accepted'
      ? 'CrisisConnect assistance accepted'
      : 'CrisisConnect request update';

  try {
    await emailjs.send(serviceId, templateId, {
      to_email: request.requesterEmail,
      user_email: request.requesterEmail,
      user_name: request.requesterName,
      subject,
      message: event === 'accepted'
        ? `${request.acceptedByName || 'A responder'} accepted your request. Please open CrisisConnect to coordinate.\n\n${statusMessage.accepted}`
        : event === 'created'
          ? statusMessage.active
          : statusMessage[event]
    }, { publicKey });
  } catch (error) {
    console.warn('EmailJS notification failed:', error);
  }
};