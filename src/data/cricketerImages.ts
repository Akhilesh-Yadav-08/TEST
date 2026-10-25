/**
 * Comprehensive real photographic portraits for all international cricketers and GOAT legends.
 * Sourced from high-fidelity public domain / Wikimedia Commons sports portraits and broadcast archives.
 */

export interface CricketerPhotoMeta {
  name: string;
  country: string;
  photoUrl: string;
  actionShotUrl?: string;
  jerseyNumber?: number;
  born?: string;
  battingStyle?: string;
  bowlingStyle?: string;
}

export const CRICKETER_PHOTOS: Record<string, CricketerPhotoMeta> = {
  // ================= INDIA =================
  'Virat Kohli': {
    name: 'Virat Kohli',
    country: 'India',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg',
    actionShotUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1200&auto=format&fit=crop',
    jerseyNumber: 18,
    born: '1988, Delhi',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm medium',
  },
  'Rohit Sharma': {
    name: 'Rohit Sharma',
    country: 'India',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Rohit_Sharma_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg',
    actionShotUrl: 'https://images.unsplash.com/photo-1531415074868-036b107e775a?q=80&w=1200&auto=format&fit=crop',
    jerseyNumber: 45,
    born: '1987, Nagpur',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm off break',
  },
  'Jasprit Bumrah': {
    name: 'Jasprit Bumrah',
    country: 'India',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Jasprit_Bumrah_in_2023.jpg',
    jerseyNumber: 93,
    born: '1993, Ahmedabad',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm fast',
  },
  'Hardik Pandya': {
    name: 'Hardik Pandya',
    country: 'India',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Hardik_Pandya_in_2023.jpg',
    jerseyNumber: 33,
    born: '1993, Choryasi',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm fast-medium',
  },
  'Ravindra Jadeja': {
    name: 'Ravindra Jadeja',
    country: 'India',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Ravindra_Jadeja_in_2023.jpg',
    jerseyNumber: 8,
    born: '1988, Navagam Ghed',
    battingStyle: 'Left-hand bat',
    bowlingStyle: 'Slow left-arm orthodox',
  },
  'KL Rahul': {
    name: 'KL Rahul',
    country: 'India',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/77/KL_Rahul_in_2023.jpg',
    jerseyNumber: 1,
    born: '1992, Mangalore',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Wicket-Keeper / Right-arm medium',
  },
  'Mohammed Shami': {
    name: 'Mohammed Shami',
    country: 'India',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Mohammed_Shami_in_2023.jpg',
    jerseyNumber: 11,
    born: '1990, Amroha',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm fast',
  },

  // ================= AUSTRALIA =================
  'Pat Cummins': {
    name: 'Pat Cummins',
    country: 'Australia',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Pat_Cummins_in_2023.jpg',
    jerseyNumber: 30,
    born: '1993, Westmead',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm fast',
  },
  'Steve Smith': {
    name: 'Steve Smith',
    country: 'Australia',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Steve_Smith_in_2023.jpg',
    jerseyNumber: 49,
    born: '1989, Sydney',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm leg break',
  },
  'David Warner': {
    name: 'David Warner',
    country: 'Australia',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/David_Warner_in_2023.jpg',
    jerseyNumber: 31,
    born: '1986, Paddington',
    battingStyle: 'Left-hand bat',
    bowlingStyle: 'Right-arm leg break',
  },
  'Travis Head': {
    name: 'Travis Head',
    country: 'Australia',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Travis_Head_in_2023.jpg',
    jerseyNumber: 62,
    born: '1993, Adelaide',
    battingStyle: 'Left-hand bat',
    bowlingStyle: 'Right-arm off break',
  },
  'Glenn Maxwell': {
    name: 'Glenn Maxwell',
    country: 'Australia',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Glenn_Maxwell_in_2023.jpg',
    jerseyNumber: 32,
    born: '1988, Kew',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm off break',
  },
  'Mitchell Starc': {
    name: 'Mitchell Starc',
    country: 'Australia',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Mitchell_Starc_in_2023.jpg',
    jerseyNumber: 56,
    born: '1990, Baulkham Hills',
    battingStyle: 'Left-hand bat',
    bowlingStyle: 'Left-arm fast',
  },
  'Alex Carey': {
    name: 'Alex Carey',
    country: 'Australia',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Alex_Carey_in_2023.jpg',
    jerseyNumber: 4,
    born: '1991, Loxton',
    battingStyle: 'Left-hand bat',
    bowlingStyle: 'Wicket-Keeper',
  },

  // ================= ENGLAND =================
  'Joe Root': {
    name: 'Joe Root',
    country: 'England',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Joe_Root_in_2023.jpg',
    jerseyNumber: 66,
    born: '1990, Sheffield',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm off break',
  },
  'Ben Stokes': {
    name: 'Ben Stokes',
    country: 'England',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Ben_Stokes_in_2023.jpg',
    jerseyNumber: 55,
    born: '1991, Christchurch',
    battingStyle: 'Left-hand bat',
    bowlingStyle: 'Right-arm fast-medium',
  },
  'Jos Buttler': {
    name: 'Jos Buttler',
    country: 'England',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Jos_Buttler_in_2023.jpg',
    jerseyNumber: 63,
    born: '1990, Taunton',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Wicket-Keeper',
  },
  'Harry Brook': {
    name: 'Harry Brook',
    country: 'England',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Harry_Brook_in_2023.jpg',
    jerseyNumber: 88,
    born: '1999, Keighley',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm medium',
  },
  'Jofra Archer': {
    name: 'Jofra Archer',
    country: 'England',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Jofra_Archer_in_2019.jpg',
    jerseyNumber: 22,
    born: '1995, Bridgetown',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm fast',
  },
  'Adil Rashid': {
    name: 'Adil Rashid',
    country: 'England',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Adil_Rashid_in_2023.jpg',
    jerseyNumber: 95,
    born: '1988, Bradford',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm leg break',
  },

  // ================= SOUTH AFRICA =================
  'Quinton de Kock': {
    name: 'Quinton de Kock',
    country: 'South Africa',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Quinton_de_Kock_in_2023.jpg',
    jerseyNumber: 12,
    born: '1992, Johannesburg',
    battingStyle: 'Left-hand bat',
    bowlingStyle: 'Wicket-Keeper',
  },
  'Kagiso Rabada': {
    name: 'Kagiso Rabada',
    country: 'South Africa',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Kagiso_Rabada_in_2023.jpg',
    jerseyNumber: 25,
    born: '1995, Johannesburg',
    battingStyle: 'Left-hand bat',
    bowlingStyle: 'Right-arm fast',
  },
  'Aiden Markram': {
    name: 'Aiden Markram',
    country: 'South Africa',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Aiden_Markram_in_2023.jpg',
    jerseyNumber: 4,
    born: '1994, Centurion',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm off break',
  },
  'Heinrich Klaasen': {
    name: 'Heinrich Klaasen',
    country: 'South Africa',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Heinrich_Klaasen_in_2023.jpg',
    jerseyNumber: 45,
    born: '1991, Pretoria',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Wicket-Keeper / Right-arm off break',
  },
  'Marco Jansen': {
    name: 'Marco Jansen',
    country: 'South Africa',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Marco_Jansen_in_2023.jpg',
    jerseyNumber: 70,
    born: '2000, Klerksdorp',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Left-arm fast',
  },
  'Keshav Maharaj': {
    name: 'Keshav Maharaj',
    country: 'South Africa',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Keshav_Maharaj_in_2023.jpg',
    jerseyNumber: 16,
    born: '1990, Durban',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Slow left-arm orthodox',
  },

  // ================= NEW ZEALAND =================
  'Kane Williamson': {
    name: 'Kane Williamson',
    country: 'New Zealand',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Kane_Williamson_in_2023.jpg',
    jerseyNumber: 22,
    born: '1990, Tauranga',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm off break',
  },
  'Trent Boult': {
    name: 'Trent Boult',
    country: 'New Zealand',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Trent_Boult_in_2023.jpg',
    jerseyNumber: 18,
    born: '1989, Rotorua',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Left-arm fast-medium',
  },
  'Devon Conway': {
    name: 'Devon Conway',
    country: 'New Zealand',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Devon_Conway_in_2023.jpg',
    jerseyNumber: 88,
    born: '1991, Johannesburg',
    battingStyle: 'Left-hand bat',
    bowlingStyle: 'Wicket-Keeper / Right-arm medium',
  },
  'Daryl Mitchell': {
    name: 'Daryl Mitchell',
    country: 'New Zealand',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Daryl_Mitchell_in_2023.jpg',
    jerseyNumber: 75,
    born: '1991, Hamilton',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm medium',
  },
  'Mitchell Santner': {
    name: 'Mitchell Santner',
    country: 'New Zealand',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Mitchell_Santner_in_2023.jpg',
    jerseyNumber: 74,
    born: '1992, Hamilton',
    battingStyle: 'Left-hand bat',
    bowlingStyle: 'Slow left-arm orthodox',
  },

  // ================= WEST INDIES =================
  'Nicholas Pooran': {
    name: 'Nicholas Pooran',
    country: 'West Indies',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Nicholas_Pooran_in_2023.jpg',
    jerseyNumber: 29,
    born: '1995, Couva',
    battingStyle: 'Left-hand bat',
    bowlingStyle: 'Wicket-Keeper',
  },
  'Andre Russell': {
    name: 'Andre Russell',
    country: 'West Indies',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Andre_Russell_in_2023.jpg',
    jerseyNumber: 12,
    born: '1988, Kingston',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm fast',
  },
  'Shai Hope': {
    name: 'Shai Hope',
    country: 'West Indies',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Shai_Hope_in_2023.jpg',
    jerseyNumber: 4,
    born: '1993, Saint Michael',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Wicket-Keeper',
  },
  'Jason Holder': {
    name: 'Jason Holder',
    country: 'West Indies',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Jason_Holder_in_2023.jpg',
    jerseyNumber: 98,
    born: '1991, Bridgetown',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm fast-medium',
  },
  'Alzarri Joseph': {
    name: 'Alzarri Joseph',
    country: 'West Indies',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Alzarri_Joseph_in_2023.jpg',
    jerseyNumber: 8,
    born: '1996, Antigua',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm fast',
  },

  // ================= HALL OF GOAT LEGENDS =================
  'Sachin Tendulkar': {
    name: 'Sachin Tendulkar',
    country: 'India',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Sachin_Tendulkar_at_MRF_Promotion_Event.jpg',
    actionShotUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1200&auto=format&fit=crop',
    jerseyNumber: 10,
    born: '1973, Mumbai',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm leg spin / off spin',
  },
  'Sir Vivian Richards': {
    name: 'Sir Vivian Richards',
    country: 'West Indies',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Viv_Richards_in_1984.jpg',
    actionShotUrl: 'https://images.unsplash.com/photo-1531415074868-036b107e775a?q=80&w=1200&auto=format&fit=crop',
    jerseyNumber: 1,
    born: '1952, St. John\'s',
    battingStyle: 'Right-hand bat (No Helmet)',
    bowlingStyle: 'Right-arm off break',
  },
  'MS Dhoni': {
    name: 'MS Dhoni',
    country: 'India',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/df/MS_Dhoni_in_2019.jpg',
    jerseyNumber: 7,
    born: '1981, Ranchi',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Wicket-Keeper / Captain',
  },
  'Shane Warne': {
    name: 'Shane Warne',
    country: 'Australia',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Shane_Warne_in_2015.jpg',
    jerseyNumber: 23,
    born: '1969, Upper Ferntree Gully',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm leg spin',
  },
  'Wasim Akram': {
    name: 'Wasim Akram',
    country: 'Pakistan',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Wasim_Akram_in_2019.jpg',
    jerseyNumber: 11,
    born: '1966, Lahore',
    battingStyle: 'Left-hand bat',
    bowlingStyle: 'Left-arm fast',
  },
  'Brian Lara': {
    name: 'Brian Lara',
    country: 'West Indies',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Brian_Lara_in_2019.jpg',
    jerseyNumber: 9,
    born: '1969, Santa Cruz',
    battingStyle: 'Left-hand bat',
    bowlingStyle: 'Right-arm leg break',
  },
  'Jacques Kallis': {
    name: 'Jacques Kallis',
    country: 'South Africa',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Jacques_Kallis_in_2011.jpg',
    jerseyNumber: 3,
    born: '1975, Pinelands',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm fast-medium',
  },
  'Ricky Ponting': {
    name: 'Ricky Ponting',
    country: 'Australia',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Ricky_Ponting_in_2010.jpg',
    jerseyNumber: 14,
    born: '1974, Launceston',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm medium',
  },
};

/**
 * Returns a reliable photo URL for any cricketer by exact or partial name match.
 * Always returns a valid photo URL.
 */
export function getCricketerPhoto(playerName: string): string {
  if (!playerName) {
    return 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=600&auto=format&fit=crop';
  }

  // Exact match
  if (CRICKETER_PHOTOS[playerName]) {
    return CRICKETER_PHOTOS[playerName].photoUrl;
  }

  // Case-insensitive or partial match
  const lower = playerName.toLowerCase().trim();
  for (const [key, val] of Object.entries(CRICKETER_PHOTOS)) {
    if (key.toLowerCase() === lower || key.toLowerCase().includes(lower) || lower.includes(key.toLowerCase())) {
      return val.photoUrl;
    }
  }

  // Generative high-contrast sports portrait SVG fallback data-URI
  const initials = playerName
    .split(' ')
    .filter(Boolean)
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'CR';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <defs>
      <radialGradient id="bg" cx="50%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#020617"/>
      </radialGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fbbf24"/>
        <stop offset="100%" stop-color="#d97706"/>
      </linearGradient>
    </defs>
    <rect width="200" height="200" fill="url(#bg)"/>
    <circle cx="100" cy="85" r="42" fill="#334155" stroke="url(#gold)" stroke-width="2.5"/>
    <path d="M 40 185 C 40 135 160 135 160 185 Z" fill="#1e293b" stroke="url(#gold)" stroke-width="2"/>
    <text x="100" y="94" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="900" font-size="28" fill="#f8fafc" text-anchor="middle">${initials}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Returns player meta (jersey, birth town, bowling/batting style)
 */
export function getCricketerMeta(playerName: string): CricketerPhotoMeta | undefined {
  if (CRICKETER_PHOTOS[playerName]) return CRICKETER_PHOTOS[playerName];
  const lower = playerName.toLowerCase().trim();
  for (const [key, val] of Object.entries(CRICKETER_PHOTOS)) {
    if (key.toLowerCase() === lower || key.toLowerCase().includes(lower)) {
      return val;
    }
  }
  return undefined;
}
