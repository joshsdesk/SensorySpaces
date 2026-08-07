const sampleEvents = [
  {
    _id: "evt_1",
    metadata: {
      title: "Children's Museum of Denver - Low Sensory Mornings",
      description: "A special time for children with disabilities and their families to experience the Museum in a less crowded, quiet environment.",
      date: new Date(Date.now() + 86400000 * 3).toISOString(),
      location: {
        address: "2121 Children's Museum Dr, Denver, CO 80211",
        geo: { type: 'Point', coordinates: [-105.0192, 39.7594] }
      },
      organizer: "Children's Museum of Denver",
      source: 'seed'
    },
    sensoryProfile: {
      noiseLevel: { value: 'Low', status: 'verified', source: 'human', confidence: 1.0 },
      lighting: { value: 'Natural', status: 'verified', source: 'human', confidence: 1.0 },
      crowdDensity: { value: 'Low', status: 'verified', source: 'human', confidence: 1.0 },
      details: [
        { value: 'Quiet Room', source: 'human' },
        { value: 'Wheelchair Accessible', source: 'human' },
        { value: 'Sensory Hours', source: 'human' }
      ]
    },
    createdAt: new Date().toISOString()
  },
  {
    _id: "evt_2",
    metadata: {
      title: "Denver Zoo - Sensory Friendly Nights",
      description: "Experience the Zoo with lower attendance, quiet zones, and sensory kits available upon request.",
      date: new Date(Date.now() + 86400000 * 7).toISOString(),
      location: {
        address: "2300 Steele St, Denver, CO 80205",
        geo: { type: 'Point', coordinates: [-104.9489, 39.7501] }
      },
      organizer: "Denver Zoo",
      source: 'seed'
    },
    sensoryProfile: {
      noiseLevel: { value: 'Low', status: 'verified', source: 'human', confidence: 1.0 },
      lighting: { value: 'Dimmed', status: 'verified', source: 'human', confidence: 1.0 },
      crowdDensity: { value: 'Low', status: 'verified', source: 'human', confidence: 1.0 },
      details: [
        { value: 'Sensory Kits', source: 'human' },
        { value: 'Outdoor', source: 'human' },
        { value: 'Quiet Zones', source: 'human' }
      ]
    },
    createdAt: new Date().toISOString()
  },
  {
    _id: "evt_3",
    metadata: {
      title: "Denver Public Library - Quiet Storytime & Sensory Play",
      description: "Low-stimulation storytime with soft dim lights, noise-reducing headphone stations, and calm interactive play bins.",
      date: new Date(Date.now() + 86400000 * 2).toISOString(),
      location: {
        address: "10 W 14th Ave Pkwy, Denver, CO 80204",
        geo: { type: 'Point', coordinates: [-104.9882, 39.7368] }
      },
      organizer: "Denver Public Library",
      source: 'seed'
    },
    sensoryProfile: {
      noiseLevel: { value: 'Low', status: 'verified', source: 'human', confidence: 1.0 },
      lighting: { value: 'Dimmed', status: 'verified', source: 'human', confidence: 1.0 },
      crowdDensity: { value: 'Low', status: 'verified', source: 'human', confidence: 1.0 },
      details: [
        { value: 'Quiet Room', source: 'human' },
        { value: 'ASD Friendly', source: 'human' },
        { value: 'Sensory Kits', source: 'human' }
      ]
    },
    createdAt: new Date().toISOString()
  },
  {
    _id: "evt_4",
    metadata: {
      title: "Denver Botanic Gardens - Calm Morning Walk",
      description: "Peaceful early admission to the greenhouse and tropical gardens with minimal crowds and soothing natural audio environments.",
      date: new Date(Date.now() + 86400000 * 5).toISOString(),
      location: {
        address: "1007 York St, Denver, CO 80206",
        geo: { type: 'Point', coordinates: [-104.9602, 39.7323] }
      },
      organizer: "Denver Botanic Gardens",
      source: 'seed'
    },
    sensoryProfile: {
      noiseLevel: { value: 'Low', status: 'verified', source: 'human', confidence: 0.9 },
      lighting: { value: 'Natural', status: 'verified', source: 'human', confidence: 0.9 },
      crowdDensity: { value: 'Low', status: 'verified', source: 'human', confidence: 0.9 },
      details: [
        { value: 'Outdoor', source: 'human' },
        { value: 'Wheelchair Accessible', source: 'human' },
        { value: 'Low Crowds', source: 'human' }
      ]
    },
    createdAt: new Date().toISOString()
  },
  {
    _id: "evt_5",
    metadata: {
      title: "Red Rocks Amphitheatre - Sensory Break Room Access",
      description: "Dedicated indoor quiet sanctuary with weighted blankets, dim lighting, and fidget gear available during public daytime hours.",
      date: new Date(Date.now() + 86400000 * 1).toISOString(),
      location: {
        address: "18300 W Alameda Pkwy, Morrison, CO 80465",
        geo: { type: 'Point', coordinates: [-105.2057, 39.6654] }
      },
      organizer: "Red Rocks",
      source: 'user_submission'
    },
    sensoryProfile: {
      noiseLevel: { value: 'High', status: 'inferred', source: 'baseline', confidence: 0.6 },
      lighting: { value: 'Bright', status: 'inferred', source: 'baseline', confidence: 0.6 },
      crowdDensity: { value: 'High', status: 'inferred', source: 'baseline', confidence: 0.6 },
      details: [
        { value: 'Quiet Room', source: 'human' },
        { value: 'Sensory Kits', source: 'human' }
      ]
    },
    createdAt: new Date().toISOString()
  }
];

const sampleVenues = [
  {
    _id: "ven_1",
    name: "Denver Central Library - Sensory Nook",
    type: "Library",
    location: {
      address: "10 W 14th Ave Pkwy, Denver, CO 80204",
      geo: { type: "Point", coordinates: [-104.9882, 39.7368] }
    },
    sensoryProfile: {
      noiseLevel: "Low",
      lighting: "Dimmed",
      crowdDensity: "Low",
      amenities: ["Quiet Room", "Noise-Canceling Headphones", "Tactile Toys"]
    }
  },
  {
    _id: "ven_2",
    name: "Denver Art Museum - Calm Zone",
    type: "Museum",
    location: {
      address: "100 W 14th Ave Pkwy, Denver, CO 80204",
      geo: { type: "Point", coordinates: [-104.9893, 39.7371] }
    },
    sensoryProfile: {
      noiseLevel: "Low",
      lighting: "Natural",
      crowdDensity: "Low",
      amenities: ["Wheelchair Accessible", "Quiet Space", "Sensory Backpacks"]
    }
  }
];

let eventsStore = [...sampleEvents];
let venuesStore = [...sampleVenues];

let usersStore = [
  {
    _id: "usr_default",
    email: "parent@example.com",
    isActive: true,
    preferences: {
      defaultLocation: "Denver, CO",
      defaultRadius: 25,
      notifications: true
    }
  }
];

let profilesStore = [
  {
    _id: "prof_1",
    userId: "usr_default",
    name: "Leo",
    preferences: {
      noiseLevel: ["Low"],
      lighting: ["Dimmed", "Natural"],
      crowdDensity: ["Low"],
      interests: ["Animals", "Art", "Science"],
      avoidances: ["Loud Speakers", "Flashing Lights"],
      desiredFeatures: ["Quiet Room", "Wheelchair Accessible"],
      preferredTimeOfDay: ["Morning"],
      venueType: ["Both"],
      weatherImportance: "Important"
    },
    onboardingResponses: {
      noiseSensitivity: "Sensitive to loud noises",
      lightingPreference: "Prefers soft or natural light",
      crowdTolerance: "Thrives in small groups"
    },
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

module.exports = {
  getEvents: (filter = {}) => {
    let result = [...eventsStore];
    if (filter.q) {
      const q = filter.q.toLowerCase();
      result = result.filter(e => 
        e.metadata.title.toLowerCase().includes(q) ||
        e.metadata.description.toLowerCase().includes(q) ||
        e.metadata.organizer.toLowerCase().includes(q) ||
        e.metadata.location.address.toLowerCase().includes(q)
      );
    }
    if (filter.noise) {
      result = result.filter(e => e.sensoryProfile?.noiseLevel?.value === filter.noise);
    }
    if (filter.lights) {
      result = result.filter(e => e.sensoryProfile?.lighting?.value === filter.lights);
    }
    if (filter.crowds) {
      result = result.filter(e => e.sensoryProfile?.crowdDensity?.value === filter.crowds);
    }
    return result;
  },

  getUnverifiedEvents: () => {
    return eventsStore.filter(e => 
      e.metadata.source === 'user_submission' || 
      e.sensoryProfile?.noiseLevel?.status === 'inferred'
    );
  },

  addEvent: (eventData) => {
    const newEvt = {
      _id: `evt_${Date.now()}`,
      metadata: {
        title: eventData.title || 'Untitled Sensory Event',
        description: eventData.description || '',
        date: eventData.date || new Date().toISOString(),
        location: {
          address: eventData.location?.address || eventData.location || 'Denver, CO',
          geo: {
            type: 'Point',
            coordinates: eventData.location?.coordinates || [-104.9903, 39.7392]
          }
        },
        organizer: eventData.organizer || 'Community Member',
        source: 'user_submission'
      },
      sensoryProfile: eventData.sensoryProfile || {
        noiseLevel: { value: eventData.noiseLevel || 'Low', status: 'verified', source: 'human', confidence: 1.0 },
        lighting: { value: eventData.lighting || 'Natural', status: 'verified', source: 'human', confidence: 1.0 },
        crowdDensity: { value: eventData.crowdDensity || 'Low', status: 'verified', source: 'human', confidence: 1.0 },
        details: (eventData.details || ['Quiet Room']).map(d => ({ value: typeof d === 'string' ? d : d.value, source: 'human' }))
      },
      createdAt: new Date().toISOString()
    };
    eventsStore.unshift(newEvt);
    return newEvt;
  },

  verifyEvent: (id) => {
    const evt = eventsStore.find(e => e._id === id);
    if (evt) {
      if (evt.sensoryProfile.noiseLevel) evt.sensoryProfile.noiseLevel.status = 'verified';
      if (evt.sensoryProfile.lighting) evt.sensoryProfile.lighting.status = 'verified';
      if (evt.sensoryProfile.crowdDensity) evt.sensoryProfile.crowdDensity.status = 'verified';
      evt.metadata.source = 'verified_community';
    }
    return evt;
  },

  getVenues: (query = {}) => {
    let result = [...venuesStore];
    if (query.q) {
      const q = query.q.toLowerCase();
      result = result.filter(v => 
        v.name.toLowerCase().includes(q) || 
        v.type.toLowerCase().includes(q) ||
        (v.location && v.location.address && v.location.address.toLowerCase().includes(q))
      );
    }
    return result;
  },

  addVenue: (venueData) => {
    const existing = venuesStore.find(v => v.name === venueData.name);
    if (existing) return existing;
    const newVen = {
      _id: `ven_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: venueData.name || 'Sensory Venue',
      type: venueData.type || 'Community Place',
      location: venueData.location || {
        address: 'Denver, CO',
        geo: { type: 'Point', coordinates: [-104.9903, 39.7392] }
      },
      sensoryProfile: venueData.sensoryProfile || {
        noiseLevel: 'Low',
        lighting: 'Natural',
        crowdDensity: 'Low',
        amenities: ['Quiet Room', 'Wheelchair Accessible']
      }
    };
    venuesStore.push(newVen);
    return newVen;
  },

  getProfiles: (userId = "usr_default") => {
    return profilesStore.filter(p => p.userId === userId && p.isActive);
  },

  addProfile: (userId, profileData) => {
    const newProf = {
      _id: `prof_${Date.now()}`,
      userId: userId || "usr_default",
      name: profileData.name || "Child Profile",
      preferences: {
        noiseLevel: profileData.noiseLevel || ["Low"],
        lighting: profileData.lighting || ["Natural"],
        crowdDensity: profileData.crowdDensity || ["Low"],
        interests: profileData.interests || [],
        avoidances: profileData.avoidances || [],
        desiredFeatures: profileData.desiredFeatures || [],
        preferredTimeOfDay: profileData.preferredTimeOfDay || ["Morning"],
        venueType: profileData.venueType || ["Both"],
        weatherImportance: profileData.weatherImportance || "Important"
      },
      onboardingResponses: profileData.onboardingResponses || {},
      isActive: true,
      createdAt: new Date().toISOString()
    };
    profilesStore.unshift(newProf);
    return newProf;
  },

  updateProfile: (id, updates) => {
    const prof = profilesStore.find(p => p._id === id);
    if (prof) {
      if (updates.name) prof.name = updates.name;
      if (updates.preferences) prof.preferences = { ...prof.preferences, ...updates.preferences };
      if (updates.onboardingResponses) prof.onboardingResponses = { ...prof.onboardingResponses, ...updates.onboardingResponses };
    }
    return prof;
  }
};
