import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());

app.use(
  express.json({
    limit: "10mb",
  })
);

const PORT = 3001;

app.get("/", (req, res) => {
  res.json({
    message: "SAHAY AI backend is running",
    mode: "DEMO",
  });
});

app.post("/api/analyze", async (req, res) => {
  try {
    const { image, profile } = req.body;

    if (!image) {
      return res.status(400).json({
        error: "No image provided",
      });
    }

    /*
      HACKATHON DEMO MODE

      This version does not call an external AI API.
      It generates an accessibility analysis based on
      the selected accessibility profile.

      The image is still uploaded through the complete
      SAHAY workflow, so the frontend/demo experience
      remains functional.
    */

    let result;

    if (profile === "Mobility") {
      result = {
        environment:
          "Indoor pathway with possible changes in floor level and access points.",

        objects: [
          "corridor",
          "entrance",
          "possible stairs",
          "access pathway",
        ],

        barriers: [
          "Potential difficulty if stairs are present",
          "Path accessibility should be verified before proceeding",
        ],

        accessible_features: [
          "Clear walking area",
          "Accessible entrance appears possible",
        ],

        hazards: [
          "Changes in floor level may create a mobility barrier",
        ],

        recommended_action:
          "Prefer a step-free route and check for a nearby ramp or elevator.",

        short_instruction:
          "Look for the nearest step-free entrance or elevator.",

        accessibility_score: 72,
      };
    } else if (profile === "Vision") {
      result = {
        environment:
          "Indoor environment containing pathways, entrances and possible obstacles.",

        objects: [
          "corridor",
          "entrance",
          "pathway",
          "possible obstacle",
        ],

        barriers: [
          "Objects or changes in floor level may be difficult to identify visually",
        ],

        accessible_features: [
          "A navigable pathway appears available",
          "Entrance area can be used as a landmark",
        ],

        hazards: [
          "Potential obstacle in the walking path",
        ],

        recommended_action:
          "Move carefully along the clear pathway and use landmarks for orientation.",

        short_instruction:
          "Follow the clear path and stay aware of obstacles.",

        accessibility_score: 68,
      };
    } else if (profile === "Hearing") {
      result = {
        environment:
          "Indoor public environment with pathways and access points.",

        objects: [
          "entrance",
          "corridor",
          "signage",
          "access pathway",
        ],

        barriers: [
          "Important announcements may not be available visually",
        ],

        accessible_features: [
          "Visible environmental landmarks",
          "Signage can assist with orientation",
        ],

        hazards: [
          "Visual awareness of vehicles or moving people may be required",
        ],

        recommended_action:
          "Use visible signs and environmental cues instead of relying on audio announcements.",

        short_instruction:
          "Follow visible signs and watch for movement around you.",

        accessibility_score: 76,
      };
    } else {
      result = {
        environment:
          "Indoor environment with a defined pathway and multiple navigation points.",

        objects: [
          "corridor",
          "entrance",
          "signage",
          "pathway",
        ],

        barriers: [
          "Multiple navigation choices may cause confusion",
        ],

        accessible_features: [
          "Visible landmarks",
          "Defined pathway",
        ],

        hazards: [
          "Unexpected obstacles may interrupt the route",
        ],

        recommended_action:
          "Follow one clear landmark at a time and avoid unnecessary route changes.",

        short_instruction:
          "Follow the next visible landmark step by step.",

        accessibility_score: 81,
      };
    }

    res.json(result);
  } catch (error) {
    console.error("SAHAY ERROR:", error);

    res.status(500).json({
      error: "Demo analysis failed",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `SAHAY AI backend running at http://localhost:${PORT}`
  );
  console.log("SAHAY running in DEMO MODE — no external API required.");
});