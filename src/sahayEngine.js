const scenarios = {
  stairs: {
    title: "Staircase detected",
    environment: "Indoor staircase connecting two levels.",
    objects: ["Staircase", "Handrail", "Corridor"],
  },

  ramp: {
    title: "Accessible ramp detected",
    environment: "A step-free route connecting two areas.",
    objects: ["Ramp", "Handrail", "Entrance"],
  },

  blocked: {
    title: "Blocked pathway",
    environment: "An obstruction is affecting the normal walking route.",
    objects: ["Corridor", "Obstruction", "Entrance"],
  },

  entrance: {
    title: "Complex entrance",
    environment: "Multiple entrance choices and visible signage.",
    objects: ["Door", "Entrance", "Signage", "Corridor"],
  },

  clear: {
    title: "Clear pathway",
    environment: "A clear indoor pathway with no major visible obstruction.",
    objects: ["Corridor", "Pathway", "Entrance"],
  },
};

const profiles = {
  Vision: {
    stairs: {
      score: 62,
      action: "Staircase detected 3 metres ahead.",
      instruction: "Move slowly and keep near the handrail.",
      barriers: ["Change in floor level"],
      features: ["Handrail"],
      hazards: ["Stair edges"],
    },

    ramp: {
      score: 91,
      action: "Accessible ramp detected ahead.",
      instruction: "Follow the ramp toward the entrance.",
      barriers: [],
      features: ["Step-free route", "Handrail"],
      hazards: [],
    },

    blocked: {
      score: 48,
      action: "Obstacle detected in your path.",
      instruction: "Move toward the clear side of the corridor.",
      barriers: ["Obstruction"],
      features: ["Alternative pathway"],
      hazards: ["Object in walking path"],
    },

    entrance: {
      score: 74,
      action: "Entrance and directional signage detected.",
      instruction: "Follow the visible sign toward the entrance.",
      barriers: ["Multiple navigation choices"],
      features: ["Visible signage"],
      hazards: [],
    },

    clear: {
      score: 93,
      action: "The path ahead is clear.",
      instruction: "Continue straight.",
      barriers: [],
      features: ["Clear pathway"],
      hazards: [],
    },
  },

  Mobility: {
    stairs: {
      score: 42,
      action: "Stairs are not recommended for your profile.",
      instruction: "Look for an elevator or accessible ramp.",
      barriers: ["Level change", "Stairs"],
      features: ["Handrail"],
      hazards: ["Stairs"],
    },

    ramp: {
      score: 96,
      action: "Accessible step-free route detected.",
      instruction: "Continue along the ramp.",
      barriers: [],
      features: ["Step-free pathway", "Handrail"],
      hazards: [],
    },

    blocked: {
      score: 38,
      action: "The preferred route is blocked.",
      instruction: "Use the alternative accessible pathway.",
      barriers: ["Blocked walking path"],
      features: ["Alternative route"],
      hazards: ["Obstruction"],
    },

    entrance: {
      score: 82,
      action: "Accessible entrance detected.",
      instruction: "Choose the entrance without steps.",
      barriers: [],
      features: ["Accessible entrance"],
      hazards: [],
    },

    clear: {
      score: 95,
      action: "Clear accessible pathway detected.",
      instruction: "Continue straight.",
      barriers: [],
      features: ["Wide clear pathway"],
      hazards: [],
    },
  },

  Hearing: {
    stairs: {
      score: 72,
      action: "Use visual signs and landmarks.",
      instruction: "Follow the marked route instead of relying on announcements.",
      barriers: [],
      features: ["Visible signage", "Handrail"],
      hazards: [],
    },

    ramp: {
      score: 91,
      action: "Accessible route detected.",
      instruction: "Follow the visual signs toward the entrance.",
      barriers: [],
      features: ["Visible route"],
      hazards: [],
    },

    blocked: {
      score: 65,
      action: "Your normal route is blocked.",
      instruction: "Follow the visible alternative-route sign.",
      barriers: ["Blocked route"],
      features: ["Alternative pathway"],
      hazards: ["Unexpected obstruction"],
    },

    entrance: {
      score: 84,
      action: "Visual entrance indicators detected.",
      instruction: "Follow the marked entrance.",
      barriers: [],
      features: ["Visible signage"],
      hazards: [],
    },

    clear: {
      score: 92,
      action: "Clear route detected.",
      instruction: "Continue using visible landmarks.",
      barriers: [],
      features: ["Visible landmarks"],
      hazards: [],
    },
  },

  Cognitive: {
    stairs: {
      score: 58,
      action: "The staircase adds a complex transition.",
      instruction: "Look for the elevator sign and follow one route.",
      barriers: ["Level change"],
      features: ["Handrail"],
      hazards: ["Complex transition"],
    },

    ramp: {
      score: 89,
      action: "Simple continuous route detected.",
      instruction: "Stay on the ramp until the entrance.",
      barriers: [],
      features: ["Continuous pathway"],
      hazards: [],
    },

    blocked: {
      score: 52,
      action: "The normal route is blocked.",
      instruction: "Turn toward the marked alternative route.",
      barriers: ["Route disruption"],
      features: ["Alternative route"],
      hazards: ["Obstruction"],
    },

    entrance: {
      score: 63,
      action: "Multiple choices detected.",
      instruction: "Follow the main entrance sign.",
      barriers: ["Multiple choices"],
      features: ["Signage"],
      hazards: [],
    },

    clear: {
      score: 90,
      action: "Simple clear route detected.",
      instruction: "Continue straight.",
      barriers: [],
      features: ["Clear pathway"],
      hazards: [],
    },
  },
};

export function analyzeScenario(profile, scenario) {
  const environment = scenarios[scenario];
  const result = profiles[profile]?.[scenario];

  if (!environment || !result) {
    return null;
  }

  return {
    environment: environment.environment,
    objects: environment.objects,
    accessibility_score: result.score,
    recommended_action: result.action,
    short_instruction: result.instruction,
    barriers: result.barriers,
    accessible_features: result.features,
    hazards: result.hazards,
    reasoning:
      `SAHAY adapted the guidance for the ${profile.toLowerCase()} accessibility profile.`,
  };
}