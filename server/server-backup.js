import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json({
  limit: "10mb"
}));

const PORT = 3001;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


app.get("/", (req, res) => {
  res.json({
    message: "SAHAY AI backend is running"
  });
});


app.post("/api/analyze", async (req, res) => {

  try {

    const { image, profile } = req.body;

    if (!image) {
      return res.status(400).json({
        error: "No image provided"
      });
    }

    const prompt = `
You are SAHAY AI, an accessibility intelligence assistant.

Your job is NOT simply to describe an image.

You must understand the physical environment
according to the user's accessibility needs.

USER ACCESSIBILITY PROFILE:
${profile}

Analyze this environment carefully.

Look for:

- stairs
- ramps
- elevators
- doors
- corridors
- entrances
- obstacles
- blocked paths
- signs
- hazards
- accessible facilities
- handrails
- changes in floor level
- narrow passages

Then determine what this environment means
for THIS particular user.

Return ONLY valid JSON.

Use exactly this structure:

{
  "environment": "short description",
  "objects": [],
  "barriers": [],
  "accessible_features": [],
  "hazards": [],
  "recommended_action": "clear recommendation",
  "short_instruction": "one short instruction",
  "accessibility_score": 0
}

Accessibility score:
0 = extremely difficult
100 = highly accessible

Be practical and conservative.
Do not invent objects that cannot reasonably be seen.
`;

    const response = await ai.models.generateContent({

      model: "gemini-3.8-flash",

      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: image
          }
        },
        {
          text: prompt
        }
      ],

      config: {
        responseMimeType: "application/json"
      }

    });

    const result = JSON.parse(response.text);

    res.json(result);

  } catch (error) {

    console.error("SAHAY AI ERROR:", error);

    res.status(500).json({
      error: "AI analysis failed",
      details: error.message
    });

  }

});


app.listen(PORT, () => {

  console.log(
    `SAHAY AI backend running at http://localhost:${PORT}`
  );

});