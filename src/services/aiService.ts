export interface CrisisAIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const EMERGENCY_GUIDELINES: Record<string, string> = {
  unconscious: `⚠️ FIRST STEP: Call 911 or emergency services immediately.
1. Check responsiveness: Tap shoulders firmly and ask loudly: "Are you okay?"
2. Check airway and breathing: Look for normal chest rising for 10 seconds.
3. If not breathing normally: If trained, initiate Hands-Only CPR (compress center of chest hard and fast at 100-120 bpm).
4. If breathing normally: Place in Recovery Position (roll gently onto their side) to keep airway open.
5. If AED is nearby, turn it on and follow verbal instructions.`,

  bleeding: `⚠️ FIRST STEP: Call emergency services if bleeding is severe or spurting.
1. Protect yourself: Use sterile gloves or clean plastic barrier if available.
2. Direct Pressure: Place a clean cloth or sterile gauze directly over the wound and apply firm, continuous pressure with both hands.
3. Elevate: If on an extremity and no bone fracture is suspected, raise wound above heart level.
4. Do NOT remove soaked gauze: Place additional layers on top and keep pressing.
5. Tourniquet: Only for severe limb trauma where direct pressure fails. Apply 2-3 inches above wound, never on a joint.`,

  burns: `1. Stop the burning process immediately: Remove from heat source.
2. Cool the burn: Run cool (NOT ice-cold) potable water over the burn for 10 to 20 minutes.
3. Never apply ice, butter, grease, or ointments to fresh burns.
4. Cover loosely with clean, dry, sterile gauze or plastic cling wrap.
5. Seek immediate medical assistance for burns larger than a hand palm, face/joint burns, or chemical burns.`,

  choking: `1. Assess severity: Can the person cough, speak, or breathe?
2. If coughing forcefully: Encourage them to keep coughing. Do NOT interfere.
3. If unable to breathe or make sound:
   - Stand behind them and give 5 sharp back blows between shoulder blades with the heel of your hand.
   - If unsuccessful, perform Heimlich maneuver (5 abdominal thrusts just above the navel).
   - Alternate 5 back blows and 5 abdominal thrusts until object clears.
4. If person becomes unresponsive: Lower to ground and begin CPR.`,

  seizure: `1. Keep calm and time the seizure.
2. Clear the area of sharp objects, furniture, or hazards.
3. Protect their head by placing something soft (jacket, pillow) beneath it.
4. Turn them gently onto their side to keep airway clear.
5. ⚠️ DO NOT put anything in their mouth, and DO NOT restrain their movements.
6. Call 911 if seizure lasts longer than 5 minutes or repeats.`,

  find_help: `You can use the 🚨 REQUEST HELP button in CrisisConnect right now to alert nearby verified responders and NGOs in your radius.
If this is an immediate life-threatening emergency, please dial 911 (or your local emergency dispatch) first before community coordination.`
};

export const aiService = {
  async getGuidance(query: string): Promise<string> {
    if (import.meta.env.VITE_OLLAMA_ENABLED === 'true') {
      let timeout: number | undefined;
      try {
        const controller = new AbortController();
        timeout = window.setTimeout(() => controller.abort(), 20000);
        const response = await fetch(`${import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434'}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            model: import.meta.env.VITE_OLLAMA_MODEL || 'llama3.2',
            stream: false,
            messages: [
              {
                role: 'system',
                content: 'You are CrisisAI, a concise emergency safety assistant. Give calm, practical first-aid guidance. Always say to call local emergency services immediately for life-threatening situations. Do not diagnose, prescribe medication, or replace professional medical care.'
              },
              { role: 'user', content: query }
            ]
          })
        });
        if (!response.ok) throw new Error(`Ollama returned ${response.status}`);
        const data = await response.json() as { message?: { content?: string } };
        if (data.message?.content?.trim()) return data.message.content.trim();
      } catch (error) {
        console.warn('Ollama unavailable, using built-in emergency guidance:', error);
      } finally {
        if (timeout) window.clearTimeout(timeout);
      }
    }

    // Artificial slight delay to feel like intelligent retrieval
    await new Promise(res => setTimeout(res, 600));

    const lower = query.toLowerCase();

    if (lower.includes('unconscious') || lower.includes('faint') || lower.includes('not breathing') || lower.includes('cpr')) {
      return EMERGENCY_GUIDELINES.unconscious;
    }
    if (lower.includes('bleed') || lower.includes('cut') || lower.includes('wound') || lower.includes('blood')) {
      return EMERGENCY_GUIDELINES.bleeding;
    }
    if (lower.includes('burn') || lower.includes('scald') || lower.includes('fire')) {
      return EMERGENCY_GUIDELINES.burns;
    }
    if (lower.includes('chok') || lower.includes('airway') || lower.includes('throat')) {
      return EMERGENCY_GUIDELINES.choking;
    }
    if (lower.includes('seiz') || lower.includes('convuls') || lower.includes('epilep')) {
      return EMERGENCY_GUIDELINES.seizure;
    }
    if (lower.includes('where') || lower.includes('find') || lower.includes('request') || lower.includes('assistance')) {
      return EMERGENCY_GUIDELINES.find_help;
    }

    return `Safety Protocol Advice for: "${query}":\n
1. Ensure your own safety before approaching any crisis zone or victim.
2. For severe trauma, severe chest pain, or immediate threat to life, contact emergency authorities (911/112) immediately.
3. Submit an emergency request using the top-right 🚨 REQUEST HELP button so nearby responders can locate you.
4. Keep the person calm, sheltered, warm, and conscious if possible. Do not move injured individuals unless immediate environmental danger exists.`;
  }
};
