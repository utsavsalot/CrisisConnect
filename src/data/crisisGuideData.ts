import { AlertTriangle, Book, Flame, Activity, ShieldAlert, Droplets, MapPin, HeartPulse, ShieldCheck, PhoneCall, AlertOctagon } from 'lucide-react';

export interface CrisisGuideTopic {
  id: string;
  title: string;
  description: string;
  iconName: string; // We'll map this to a Lucide icon in the component
  sections: { heading: string; content: string }[];
  importantWarnings: string[];
  doItems: string[];
  dontItems: string[];
  sources: { label: string; url: string }[];
}

export const crisisGuideData: CrisisGuideTopic[] = [
  {
    id: 'how-to-use-crisisconnect',
    title: 'How to Use CrisisConnect',
    description: 'Learn the fastest way to request help and coordinate with responders using the CrisisConnect platform.',
    iconName: 'Book',
    sections: [
      {
        heading: 'Broadcasting an SOS',
        content: 'Press and hold the red SOS button on the home screen or dashboard for 3 seconds. Your GPS location is automatically captured. Select the type of help you need (Medical, Rescue, Fire, etc.) and add a brief description if possible.'
      },
      {
        heading: 'What Happens Next',
        content: 'Your request is immediately broadcasted to verified NGOs and community responders in your area. You will see a "Live Map" showing who is nearby. Once a responder accepts your request, a private coordination chat will open.'
      }
    ],
    importantWarnings: [
      'If you are in immediate, life-threatening danger, always call official emergency services (e.g., 911 or 112) first before or while using CrisisConnect.'
    ],
    doItems: [
      'Keep your location services (GPS) turned on.',
      'Stay in the same location if it is safe to do so.',
      'Monitor the private chat once your request is accepted.'
    ],
    dontItems: [
      'Do not submit test SOS requests. This ties up vital resources.',
      'Do not close the app entirely while waiting for a response, to ensure you receive chat notifications.'
    ],
    sources: []
  },
  {
    id: 'what-to-do-during-emergency',
    title: 'What to Do During an Emergency',
    description: 'General guidelines for staying safe and calm during any sudden crisis or emergency situation.',
    iconName: 'AlertTriangle',
    sections: [
      {
        heading: 'Assess the Situation',
        content: 'Take a deep breath and quickly evaluate your surroundings. Identify the immediate threats (e.g., fire, unstable structures, active violence).'
      },
      {
        heading: 'Make a Decision',
        content: 'Decide whether it is safer to EVACUATE the area or SHELTER in place. If the danger is inside (like a fire), evacuate immediately. If the danger is outside (like severe weather or chemical spills), stay inside.'
      }
    ],
    importantWarnings: [
      'Panic is contagious and dangerous. Take a few seconds to breathe before acting.'
    ],
    doItems: [
      'Move away from immediate danger.',
      'Help others if it does not put your own life at risk.',
      'Follow instructions from official emergency personnel.'
    ],
    dontItems: [
      'Do not return for personal belongings if evacuating a dangerous area.',
      'Do not assume someone else has already called for help.'
    ],
    sources: [
      { label: 'Ready.gov - Make A Plan', url: 'https://www.ready.gov/plan' }
    ]
  },
  {
    id: 'first-aid-information',
    title: 'First Aid Information',
    description: 'Basic first aid steps for common injuries while waiting for professional medical assistance.',
    iconName: 'HeartPulse',
    sections: [
      {
        heading: 'Severe Bleeding',
        content: 'Apply firm, direct pressure to the wound with a clean cloth or sterile dressing. Maintain pressure until bleeding stops or help arrives. If blood soaks through, do not remove the cloth; add more on top.'
      },
      {
        heading: 'Choking',
        content: 'For a conscious adult or child, perform the Heimlich maneuver (abdominal thrusts) by standing behind them, making a fist just above their navel, and giving quick, upward thrusts.'
      },
      {
        heading: 'Burns',
        content: 'Cool the burn under cool (not cold) running water for at least 10 minutes. Loosely cover the burn with sterile, non-fluffy material like cling film or a sterile dressing.'
      }
    ],
    importantWarnings: [
      'Do not move someone with a suspected spinal or neck injury unless they are in immediate danger of death (e.g., fire).'
    ],
    doItems: [
      'Ensure the scene is safe for you before helping someone else.',
      'Wear protective gloves if available.',
      'Reassure the injured person and keep them calm.'
    ],
    dontItems: [
      'Do not apply ice, butter, or ointments to a severe burn.',
      'Do not remove objects impaled in a wound; stabilize them instead.',
      'Do not give an unconscious person anything to eat or drink.'
    ],
    sources: [
      { label: 'Red Cross - First Aid Steps', url: 'https://www.redcross.org/take-a-class/first-aid/performing-first-aid/first-aid-steps' }
    ]
  },
  {
    id: 'fire-safety',
    title: 'Fire Safety',
    description: 'Crucial steps to take if you discover a fire or hear a fire alarm.',
    iconName: 'Flame',
    sections: [
      {
        heading: 'If You Discover a Fire',
        content: 'Alert others immediately by shouting "Fire!" and activating the nearest fire alarm. Evacuate the building using the nearest safe exit.'
      },
      {
        heading: 'If You Are Trapped',
        content: 'Close all doors between you and the fire. Stuff wet towels or clothes in the cracks around the doors to keep smoke out. Call for help and signal from a window if possible.'
      }
    ],
    importantWarnings: [
      'Smoke is toxic and rises. If you must escape through smoke, get low and crawl under it where the air is cleaner.'
    ],
    doItems: [
      'Test doors with the back of your hand before opening. If it\'s hot, find another way out.',
      'Close doors behind you as you escape to slow the spread of fire.',
      'Stop, Drop, and Roll if your clothes catch fire.'
    ],
    dontItems: [
      'Do not use elevators during a fire.',
      'Do not hide in closets or under beds.',
      'Do not go back inside a burning building for any reason.'
    ],
    sources: [
      { label: 'NFPA - Fire Safety Equipment', url: 'https://www.nfpa.org/Public-Education/Fire-causes-and-risks/Fire-safety-equipment' }
    ]
  },
  {
    id: 'earthquake-safety',
    title: 'Earthquake Safety',
    description: 'How to protect yourself when the ground starts shaking.',
    iconName: 'Activity',
    sections: [
      {
        heading: 'If You Are Indoors',
        content: 'Drop to your hands and knees. Cover your head and neck with your arms. If a sturdy table or desk is nearby, crawl underneath it and hold on until the shaking stops.'
      },
      {
        heading: 'If You Are Outdoors',
        content: 'Move away from buildings, streetlights, and utility wires. Stay in the open until the shaking stops.'
      }
    ],
    importantWarnings: [
      'Most earthquake-related injuries result from collapsing walls, flying glass, and falling objects.'
    ],
    doItems: [
      'Drop, Cover, and Hold On.',
      'Stay away from windows and glass.',
      'Expect aftershocks and be prepared to take cover again.'
    ],
    dontItems: [
      'Do not run outside during the shaking; stay where you are.',
      'Do not use doorways for protection; they are not stronger than the rest of the building.',
      'Do not light matches or turn on light switches if you suspect a gas leak.'
    ],
    sources: [
      { label: 'USGS - Earthquake Hazards', url: 'https://www.usgs.gov/programs/earthquake-hazards' }
    ]
  },
  {
    id: 'flood-safety',
    title: 'Flood Safety',
    description: 'Essential guidance for surviving flash floods and rising waters.',
    iconName: 'Droplets',
    sections: [
      {
        heading: 'Evacuation',
        content: 'If ordered to evacuate, do so immediately. Move to higher ground before floodwaters cut off your escape routes.'
      },
      {
        heading: 'Driving in Floodwaters',
        content: 'Never drive through flooded roadways. Just 12 inches of fast-moving water can carry away a small car, and 24 inches can carry away most vehicles.'
      }
    ],
    importantWarnings: [
      'Turn Around, Don\'t Drown! The depth of water is not always obvious, and the roadbed may be washed out underneath.'
    ],
    doItems: [
      'Move to the highest level of a building if trapped, but do not climb into a closed attic.',
      'Disconnect electrical appliances if safe to do so before water enters your home.',
      'Avoid contact with floodwater, which may be contaminated or electrically charged.'
    ],
    dontItems: [
      'Do not walk, swim, or drive through floodwaters.',
      'Do not cross flowing streams where water is above your ankles.',
      'Do not touch electrical equipment if you are wet or standing in water.'
    ],
    sources: [
      { label: 'Weather.gov - Flood Safety', url: 'https://www.weather.gov/safety/flood' }
    ]
  }
];
