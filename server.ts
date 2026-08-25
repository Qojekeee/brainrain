import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// Generate custom questions by topic & difficulty
app.post("/api/gemini/generate-questions", async (req, res) => {
  try {
    const { topic, difficulty = "Scholar", count = 5, category = "General Intellect" } = req.body;

    const ai = getAI();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY not configured. Falling back to built-in questions.",
      });
    }

    const prompt = `Generate exactly ${count} highly stimulating, intellectually rigorous, intriguing multiple-choice questions on the topic: "${topic}".
Category: ${category}
Difficulty level: ${difficulty} (Options: Novice, Scholar, Master, Polymath).

Guidelines:
- Each question must be factually accurate, thought-provoking, and free of trivial pop-culture fluff unless high cultural significance.
- Include 4 distinct plausible options where exactly one is correct.
- Provide a clear, educational, fascinating explanation that illuminates the underlying principle, history, or logic.
- Provide a clever hint that nudges without directly spoiling.
- Provide a "didYouKnow" intriguing companion fact.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You are the Grand Master of Brain Rain, an elite intellectual trivia and cognitive arena. You craft deep, delightful, authentic questions that test real understanding, analytical thought, scientific concepts, historical turning points, and lateral insight.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array of 4 options",
              },
              correctAnswerIndex: {
                type: Type.INTEGER,
                description: "0-indexed index of correct answer in options array",
              },
              explanation: { type: Type.STRING },
              hint: { type: Type.STRING },
              didYouKnow: { type: Type.STRING },
              category: { type: Type.STRING },
              difficulty: { type: Type.STRING },
            },
            required: [
              "question",
              "options",
              "correctAnswerIndex",
              "explanation",
              "hint",
            ],
          },
        },
      },
    });

    const responseText = response.text || "[]";
    const questions = JSON.parse(responseText);

    const formattedQuestions = questions.map((q: any, idx: number) => ({
      id: q.id || `ai-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
      question: q.question,
      options: q.options,
      correctAnswerIndex: Math.max(0, Math.min(3, q.correctAnswerIndex ?? 0)),
      explanation: q.explanation || "No explanation provided.",
      hint: q.hint || "Ponder the core axioms and eliminate contradictions.",
      didYouKnow: q.didYouKnow || "",
      category: q.category || category || "AI Generator",
      difficulty: q.difficulty || difficulty || "Scholar",
      source: "Gemini AI",
    }));

    res.json({ questions: formattedQuestions });
  } catch (error: any) {
    console.error("Error generating questions:", error);
    res.status(500).json({ error: error.message || "Failed to generate questions" });
  }
});

// Explain question or answer deeper logic
app.post("/api/gemini/explain", async (req, res) => {
  try {
    const { question, options, selectedAnswer, correctAnswer, userQuery } = req.body;

    const ai = getAI();
    if (!ai) {
      return res.status(503).json({ error: "AI explanation requires GEMINI_API_KEY." });
    }

    const prompt = `Question: "${question}"
Options: ${JSON.stringify(options)}
Correct Answer: "${correctAnswer}"
Player selected: "${selectedAnswer || "Not answered"}"
Player curiosity question: "${userQuery || "Please provide an in-depth, fascinating breakdown of the reasoning, historical context or scientific law behind this."}"

Explain clearly, concisely, and with intellectual flair. Highlight why common misconceptions fail and give a memorable mental model.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You are a world-class academic tutor and intellectual game master. Explain concepts with clarity, depth, elegant analogies, and enthusiasm for knowledge.",
      },
    });

    res.json({ explanation: response.text || "Unable to generate explanation." });
  } catch (error: any) {
    console.error("Error generating explanation:", error);
    res.status(500).json({ error: error.message || "Failed to get explanation" });
  }
});

// Serve frontend with Vite in dev, static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Brain Rain server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
